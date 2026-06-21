---
title: "XAI'den MLOps'a: PDD ile Açıklanabilir Kavram Kayması Tespiti"
date: "2026-05-30"
excerpt: "Future Generation Computer Systems makalemizin bir özeti — Kısmi Bağımlılık Profilleri ile kavram kaymasını tespit etmek ve nedenini açıklamak."
---

Üretimdeki makine öğrenmesi modelleri nadiren gürültülü bir şekilde çöker. Genellikle *sessizce* bozulurlar — dünya değişir, veri onunla birlikte değişir ve geçen ay isabetli olan bir model yavaşça yanılmaya başlar. Bu olguya **veri kayması (data drift)** denir ve en inatçı türü **kavram kaymasıdır (concept drift)**: girdiler değişmemiş gibi görünse bile, öznitelikler ile hedef değişken arasındaki ilişki değişir.

Makalemizde — **"From XAI to MLOps: Explainable concept drift detection with the partial dependence profiles-based approach"** (*Future Generation Computer Systems*, 2026) — eş yazarım Mustafa Çavuş ile birlikte **Profile Drift Detection (PDD)** adını verdiğimiz bir yöntem sunuyoruz. Bu yöntem aynı anda iki şey yapıyor: kavram kaymasını **tespit ediyor** ve — çoğu mevcut yöntemin aksine — *hangi* değişkenlerin kaymaya yol açtığını ve hedefle ilişkilerinin *nasıl* değiştiğini **açıklıyor**.

📄 [Makaleyi okuyun (DOI)](https://doi.org/10.1016/j.future.2026.108586) · 💻 [Kod & deneyler (GitHub)](https://github.com/ugurdar/xai-mlops) · 📦 [datadriftR — CRAN](https://cran.r-project.org/package=datadriftR)

> ℹ️ Bu yazı, kendi hakemli makalemden uyarladığım sade bir anlatımdır; temel fikirleri daha kolay takip edilebilir kılmak için yazdım. Görseller makaleden alınmıştır. Yöntemin tamamı, türetmeler ve eksiksiz sonuçlar için lütfen [orijinal makaleye](https://doi.org/10.1016/j.future.2026.108586) bakın.

## Model izleme neden bir lüks değil?

Tahmin modelleri, üretimde gördükleri verinin eğitim verisiyle aynı dağılımdan geldiğini varsayar. Pratikte bu varsayım sürekli bozulur — pandemi dönemindeki tüketici davranışları, değişen tedarik zincirleri veya evrilen dolandırıcılık örüntülerini düşünün. İşte bu yüzden **izleme (monitoring)**, ML yaşam döngüsünün sonradan akla gelen bir adımı değil, birinci sınıf bir aşamasıdır.

![Öngörücü modelleme süreci](/blog/pdd/fig1_process.png)

*Öngörücü modelleme süreci: problem tanımı → modelleme → ince ayar → izleme. İzleme, MLOps'un gerçek ve sürekli kayan dünyayla buluştuğu yerdir.*

Kayma üç biçimde gelir:

- **Kovaryat kayması (covariate drift)** — girdilerin dağılımı `P(X)` değişir.
- **Etiket kayması (label drift)** — hedefin dağılımı `P(Y)` değişir.
- **Kavram kayması (concept drift)** — koşullu ilişki `P(Y|X)` değişir; `P(X)` ve `P(Y)` aynı kalsa *bile*.

Kavram kaymasını yakalamak en zorudur. Geleneksel tespit yöntemleri doğruluk veya marjinal dağılım metriklerine dayanır — ama bu metrikler sabit kalırken, özniteliklerinizin *anlamı* modelin altında sessizce dönebilir.

## Fikir: yalnızca doğruluğu değil, modelin davranışını izlemek

PDD, yalnızca doğruluğu izlemek yerine modelin nasıl *davrandığını* izler. Bunu **Kısmi Bağımlılık Profilleri (Partial Dependence Profiles, PDP)** ile yaparız — bir özniteliğin modelin tahmini üzerindeki marjinal etkisini gösteren açıklanabilir yapay zeka aracı.

Sezgi şu: bir öznitelik ile hedef arasındaki ilişki kaymışsa, o özniteliğin **PDP'sinin şekli de kayacaktır**. Bu yüzden eğitim verisi üzerinde hesaplanan PDP'yi, gelen her veri grubunun (batch) PDP'siyle karşılaştırırız; üç tamamlayıcı metrik kullanarak:

- **PDI** (Partial Dependence Index) — *davranışsal* değişimi yakalar: iki profilin aynı noktalarda artıp/azaldığını, yani yön (orientation) değişimlerini değerlendirir.
- **L2** — iki profil arasındaki farkın genel büyüklüğü.
- **L2Der** — profillerin *türevleri* arasındaki fark; eğim ve yerel şekil değişimlerini yakalar.

Üçünü birlikte kullanmak bütünsel bir görünüm sağlar: girdi–çıktı ilişkisinin yalnızca *değişip değişmediğini* değil, *nasıl* değiştiğini de gösterir.

## PDD iş akışı

![Profile Drift Detection iş akışı](/blog/pdd/fig2_pdd.png)

*PDD iş akışı. Modelleme aşamasında train/test PDP'lerinden bir kayma eşiği belirleriz. Akış aşamasında, gelen her batch'in PDP'si referansla karşılaştırılır; farklılık eşiği aştığında bir kayma sinyali tetiklenir ve model biriken veriyle yeniden eğitilir.*

Kısaca:

1. **Modelleme aşaması** — modeli eğit, train ve test setleri üzerinde PDP'leri hesapla ve aralarındaki farklılıktan bir kayma eşiği belirle.
2. **Akış aşaması** — her yeni batch için PDP'yi yeniden hesapla ve referansa göre farklılığını ölç.
3. **Tetikleme** — farklılık eşiği aşarsa kayma sinyali ver, biriken veriyle yeniden eğit ve referans profili güncelle.

Ayrıca tek değişkenli yöntemi **top-k değişken izlemeye** genelliyoruz; en önemli *k* özniteliği eşzamanlı takip ediyoruz. Bu da bir varyant ailesi doğuruyor:

- `PDD_C` — sabit tek değişken, eşikler hiç yeniden hesaplanmaz (orijinal yöntem).
- `PDD_1`, `PDD_2`, `PDD_3` — kademeli olarak daha geniş kapsam; her gerçek kayma sonrası dinamik eşik yeniden ayarı.

## Deneyler ne gösteriyor?

Sentetik ve gerçek dünya veri setleri üzerinde altı deney yaptık — **SEA, Hyperplane, NOAA, Ozone, Elec2 ve Friedman** — PDD'yi yerleşik tespit yöntemleriyle (HDDM-A, HDDM-W, KSWIN, PH, DDM, EDDM) karşılaştırarak. Adil ve tekrar üretilebilir bir karşılaştırma için hepsini `datadriftR` R paketindeki varsayılan ayarlarla çalıştırdık.

Öne çıkanlar:

- **Daha az yanlış alarm.** KSWIN ve EDDM gibi agresif yöntemler çok sık kayma işaretledi (~30'a varan tespit) ve sık sık doğruluğu *iyileştirmeyen* yeniden eğitimleri tetikledi. PDD ise **daha az ama daha tutarlı** kaymalar tespit ederken benzer doğruluğu korudu.
- **Sıfır kayma bir hata değil, bir özellik.** Modelin işlevsel ilişkisi gerçekten değişmediğinde PDD doğru biçimde *kayma yok* dedi — gereksiz ve maliyetli yeniden eğitimden kaçındı.
- **Dinamik eşikler önemli.** Eşiği yeniden ayarlanan top-k varyantları, batch'ler biriktikçe oluşan yanlış pozitifleri tahmin performansından ödün vermeden ortadan kaldırdı.
- **Sınırlar konusunda dürüst.** Tamamen kademeli akışlarda (örn. Hyperplane), batch başına PDP değişimi eşiğin altında kalsa da kümülatif kayma büyük olduğunda PDD az tespit edebiliyor. Orada en iyisi, doğruluk tabanlı bir güvenlik ağıyla birlikte **hibrit** bir strateji içinde kullanmak.

Ve en önemlisi — kayma *gerçekten* olduğunda, onu *görebilirsiniz*:

![SEA veri setinde eski batch ile yeni batch'in PDP'leri](/blog/pdd/fig4_pdp.png)

*Eski batch ile yeni batch'in PDP'leri (Karar Ağacı, SEA). İki profil arasındaki görünür fark, PDD'nin ölçtüğü sinyalin ta kendisidir — başlıktaki satır bu batch için üç metriği gösterir (PDI 0.08, L2Der 0.12, L2 0.16). Yalnızca "bir şey değişti" demekle kalmaz, hangi değişkenin davranışının değiştiğini de söyler.*

## Açıklanabilirliğin bedeli

PDD'nin asıl maliyeti hesaplamadır: PDP üretmek, birkaç skaler istatistiği takip etmekten daha pahalıdır. Baskın maliyet, profilleri `p` ızgara noktası üzerinde değerlendirmek için `O(n · p · T_test)`'dir. Bunu bir **"önce sıkıştır, sonra açıkla"** stratejisiyle hafifletiyoruz — alt örnekleme ve ızgara sıkıştırması, Elec2 üzerinde **4.9× hızlanma** sağladı; doğrulukta ihmal edilebilir (<0.2 puan) kayıpla. Bu da PDD'yi o veri setinde altı temel yöntemin hepsinden hızlı kıldı.

Bu ek maliyet, skaler yöntemlerin veremeyeceği bir şey satın alır: PDD, girdi–çıktı ilişkisinin yalnızca *değişip değişmediğini* değil, *nasıl* değiştiğini ölçer. Yeniden eğitim sonrası davranış değişimini anlamanın hem düzenleyici hem operasyonel bir gereklilik olduğu veri gizliliği ve tahmin kaybı (predictive churn) bağlamlarında, bu açıklama işin tam da özüdür.

## Çıkarımlar

- **Kavram kayması, dağılımlarla değil ilişkilerle ilgilidir.** Yalnızca doğruluğa değil, modelin davranışına (PDP'lere) bakın.
- **Açıklanabilir tespit**, *hangi* değişkenin ve *nasıl* kaydığını söyler — "şimdi yeniden eğit" alarmını eyleme dönük bir teşhise çevirir.
- **Tasarımı gereği temkinli.** PDD, ham duyarlılığı kararlılıkla takas eder; agresif yöntemlerin yanlış pozitif kaynaklı yeniden eğitim fırtınalarından kaçınır.
- **Tekrar üretilebilir.** Her şey [`datadriftR`](https://cran.r-project.org/package=datadriftR) R paketinde ve [proje deposunda](https://github.com/ugurdar/xai-mlops) mevcut.

Modellerin sessizce bozulduğu üretim ML'i üzerinde çalışıyorsanız, PDD'yi kendi akışlarınızda denemenizi çok isterim — ve nerede çöktüğünü bana söyleyin.

---

*Bu yazı, hakemli makalemden uyarlanmıştır: U. Dar & M. Çavuş, "From XAI to MLOps: Explainable concept drift detection with the partial dependence profiles-based approach," Future Generation Computer Systems, 183 (2026), 108586. [https://doi.org/10.1016/j.future.2026.108586](https://doi.org/10.1016/j.future.2026.108586)*
