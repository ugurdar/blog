---
title: "From XAI to MLOps: Explainable Concept Drift Detection with PDD"
date: "2026-05-30"
excerpt: "A walkthrough of our Future Generation Computer Systems paper — detecting concept drift with Partial Dependence Profiles, and explaining why it happens."
---

Machine learning models in production rarely fail loudly. They fail *quietly* — the world shifts, the data shifts with it, and a model that was accurate last month slowly stops being right. This phenomenon is called **data drift**, and its most stubborn variant is **concept drift**: the relationship between your features and the target changes, even when the inputs themselves look unchanged.

In our paper, **"From XAI to MLOps: Explainable concept drift detection with the partial dependence profiles-based approach"** (*Future Generation Computer Systems*, 2026), my co-author Mustafa Cavus and I introduce a method called **Profile Drift Detection (PDD)** that does two things at once: it **detects** concept drift, and — unlike most existing methods — it **explains** *which* variables drove the drift and *how* their relationship with the target changed.

📄 [Read the paper (DOI)](https://doi.org/10.1016/j.future.2026.108586) · 💻 [Code & experiments (GitHub)](https://github.com/ugurdar/xai-mlops) · 📦 [datadriftR on CRAN](https://cran.r-project.org/package=datadriftR)

> ℹ️ This post is a plain-language adaptation of my own peer-reviewed paper, written to make the core ideas easier to follow. The figures are taken from the article. For the full methodology, derivations, and complete results, please see the [original paper](https://doi.org/10.1016/j.future.2026.108586).

## Why model monitoring is not optional

Predictive models assume the data they see in production is drawn from the same distribution as their training data. In practice this assumption breaks constantly — think of consumer behavior during a pandemic, shifting supply chains, or evolving fraud patterns. That is why **monitoring** is now a first-class stage of the ML lifecycle, not an afterthought.

![The predictive modeling process](/blog/pdd/fig1_process.png)

*The predictive modeling process: problem formulation → crisp modeling → fine tuning → monitoring. Monitoring is where MLOps meets the real, drifting world.*

Drift comes in three flavors:

- **Covariate drift** — the distribution of the inputs `P(X)` changes.
- **Label drift** — the distribution of the target `P(Y)` changes.
- **Concept drift** — the conditional relationship `P(Y|X)` changes, *even if* `P(X)` and `P(Y)` stay the same.

Concept drift is the hardest to catch. Traditional detectors lean on accuracy or marginal distribution metrics — but these can stay flat while the *meaning* of your features quietly rotates underneath the model.

## The idea: monitor the model's behavior, not just its accuracy

Instead of watching accuracy alone, PDD watches how the model *behaves*. We do this with **Partial Dependence Profiles (PDPs)** — an explainable-AI tool that shows the marginal effect of a feature on the model's prediction.

The intuition: if the relationship between a feature and the target has shifted, the **shape of its PDP will shift too**. So we compare the PDP computed on the training data against the PDP computed on each incoming batch, using three complementary metrics:

- **PDI** (Partial Dependence Index) — captures *behavioral* change: whether the two profiles increase or decrease at the same points, i.e. changes in orientation.
- **L2** — the overall magnitude of difference between two profiles.
- **L2Der** — the difference between the *derivatives* of the profiles, capturing changes in slope and local shape.

Using all three together gives a holistic view: not just *whether* the input–output relationship changed, but *how*.

## The PDD workflow

![The workflow of Profile Drift Detection](/blog/pdd/fig2_pdd.png)

*The PDD workflow. In the modeling phase we fix a drift threshold from the train/test PDPs. In the streaming phase, each incoming batch's PDP is compared against the reference; when the disparity exceeds the threshold, a drift signal fires and the model is retrained on the accumulated data.*

In short:

1. **Modeling phase** — train the model, compute PDPs on train and test sets, and set a drift threshold from their disparity.
2. **Streaming phase** — for each new batch, recompute the PDP and measure its disparity against the reference.
3. **Trigger** — if the disparity crosses the threshold, raise a drift signal, retrain on accumulated data, and refresh the reference profile.

We also generalize the single-variable method to **top-k variable monitoring**, tracking the *k* most important features simultaneously. This gives a family of variants:

- `PDD_C` — fixed single variable, thresholds never recalculated (the original method).
- `PDD_1`, `PDD_2`, `PDD_3` — progressively wider coverage, with dynamic threshold recalibration after each genuine drift.

## What the experiments show

We ran six experiments across synthetic and real-world datasets — **SEA, Hyperplane, NOAA, Ozone, Elec2, and Friedman** — comparing PDD against established detectors (HDDM-A, HDDM-W, KSWIN, PH, DDM, EDDM), all using default settings in the `datadriftR` R package for a fair, reproducible comparison.

A few highlights:

- **Fewer false alarms.** Aggressive detectors like KSWIN and EDDM flagged drift very often (up to ~30 detections), frequently triggering retraining that did *not* improve accuracy. PDD detected **fewer but more consistent** drifts while maintaining comparable accuracy.
- **Zero-drift is a feature, not a bug.** When the model's functional relationship genuinely hadn't changed, PDD correctly reported *no* drift — avoiding unnecessary, costly retraining.
- **Dynamic thresholds matter.** The top-k variants with recalibrated thresholds eliminated false positives that accumulate as batches build up, without sacrificing predictive performance.
- **Honest about limits.** On purely gradual streams (e.g., Hyperplane), where per-batch PDP changes stay below threshold even though cumulative drift is large, PDD can under-detect. There it's best used as part of a **hybrid** strategy alongside an accuracy-based safety net.

And crucially — when drift *does* happen, you can *see* it:

![PDPs of an old batch vs. a new batch on the SEA dataset](/blog/pdd/fig4_pdp.png)

*PDPs for an old batch vs. a new batch (Decision Tree, SEA). The visible gap between the two profiles is exactly the signal PDD quantifies — and the header shows the three metrics on this batch (PDI 0.08, L2Der 0.12, L2 0.16). It tells you which variable's behavior changed, not just that something did.*

## The price of explainability

PDD's main cost is computational: building PDPs is more expensive than maintaining a handful of scalar statistics. The dominant cost is `O(n · p · T_test)` for evaluating profiles over `p` grid points. We mitigate this with a **"compress then explain"** strategy — subsample reduction plus grid compression delivered a **4.9× speedup** on the Elec2 benchmark with negligible (<0.2 pp) accuracy loss, making PDD faster than all six baselines on that dataset.

That overhead buys something the scalar methods can't give you: PDD quantifies *how* the input–output relationship changes, not merely *whether* it changes. For data-privacy and predictive-churn contexts — where understanding post-retraining behavioral changes is a regulatory and operational necessity — that explanation is the whole point.

## Takeaways

- **Concept drift is about relationships, not just distributions.** Watch the model's behavior (PDPs), not only its accuracy.
- **Explainable detection** tells you *which* variable drifted and *how* — turning a "retrain now" alarm into an actionable diagnosis.
- **Conservative by design.** PDD trades raw sensitivity for stability, avoiding the false-positive retraining storms of aggressive detectors.
- **Reproducible.** Everything is available in the [`datadriftR`](https://cran.r-project.org/package=datadriftR) R package and the [project repo](https://github.com/ugurdar/xai-mlops).

If you work on production ML where models silently degrade, I'd love for you to try PDD on your own streams — and tell me where it breaks.

---

*This article is adapted from my peer-reviewed paper, U. Dar & M. Cavus, "From XAI to MLOps: Explainable concept drift detection with the partial dependence profiles-based approach," Future Generation Computer Systems, 183 (2026), 108586. [https://doi.org/10.1016/j.future.2026.108586](https://doi.org/10.1016/j.future.2026.108586)*
