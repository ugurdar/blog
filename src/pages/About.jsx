import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github, ExternalLink } from 'lucide-react';

function SectionTitle({ children }) {
  return (
    <h2 className="text-xl font-bold mt-10 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">
      {children}
    </h2>
  );
}

export default function About() {
  const { t } = useTranslation();

  const experience = t('about.experience', { returnObjects: true });
  const education = t('about.education', { returnObjects: true });
  const publications = t('about.publications', { returnObjects: true });
  const achievements = t('about.achievements', { returnObjects: true });
  const skillGroups = t('about.skills_groups', { returnObjects: true });
  const links = t('about.links', { returnObjects: true });

  return (
    <section className="max-w-3xl mx-auto">
      {/* Header */}
      <h1 className="text-3xl font-bold">{t('about.title')}</h1>
      <p className="text-neutral-500 dark:text-neutral-400 mt-1">{t('about.role')}</p>
      <p className="mt-4 leading-relaxed">{t('about.intro')}</p>

      {/* Links */}
      <div className="flex flex-wrap gap-3 mt-5 text-sm">
        <a href={`mailto:${links.email}`} className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Mail size={16} /> Email
        </a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Linkedin size={16} /> LinkedIn
        </a>
        <a href={links.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <Github size={16} /> GitHub
        </a>
        <a href={links.kaggle} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <ExternalLink size={16} /> Kaggle
        </a>
        <a href={links.orcid} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-blue-500 transition-colors">
          <ExternalLink size={16} /> ORCID
        </a>
      </div>

      {/* Experience */}
      <SectionTitle>{t('about.experience_title')}</SectionTitle>
      <div className="space-y-6">
        {experience.map((job) => (
          <div key={job.role + job.date}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-semibold">{job.role}</h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{job.date}</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">{job.org}</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
              {job.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <SectionTitle>{t('about.education_title')}</SectionTitle>
      <div className="space-y-5">
        {education.map((ed) => (
          <div key={ed.degree + ed.date}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-semibold">{ed.degree}</h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{ed.date}</span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">{ed.org}</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-1">{ed.detail}</p>
          </div>
        ))}
      </div>

      {/* Publications */}
      <SectionTitle>{t('about.publications_title')}</SectionTitle>
      <div className="space-y-4">
        {publications.map((pub) => (
          <div key={pub.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-medium text-sm leading-snug">
                {pub.link ? (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {pub.title}
                  </a>
                ) : (
                  pub.title
                )}
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{pub.year}</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{pub.venue}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <SectionTitle>{t('about.achievements_title')}</SectionTitle>
      <div className="space-y-4">
        {achievements.map((a) => (
          <div key={a.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-medium text-sm">
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {a.title}
                  </a>
                ) : (
                  a.title
                )}
              </h3>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{a.date}</span>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-0.5">{a.desc}</p>
          </div>
        ))}
      </div>

      {/* Skills */}
      <SectionTitle>{t('about.skills_title')}</SectionTitle>
      <div className="space-y-4">
        {skillGroups.map((group) => (
          <div key={group.label} className="sm:flex sm:items-start sm:gap-4">
            <span className="block sm:w-32 sm:shrink-0 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-2 sm:mb-0 sm:pt-1.5">
              {group.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {group.items.map((s) => (
                <span
                  key={s}
                  className="text-sm px-3 py-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Beyond work */}
      <SectionTitle>{t('about.hobbies_title')}</SectionTitle>
      <p className="leading-relaxed">
        {t('about.hobbies')}{' '}
        <a
          href={t('about.hobbies_link')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {t('about.hobbies_link_label')}
        </a>
        .
      </p>
    </section>
  );
}
