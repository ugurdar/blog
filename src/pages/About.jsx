import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="prose prose-invert max-w-none">
      <h1>{t('about.title')}</h1>

      <p>{t('about.intro')}</p>

      <h2>{t('about.skills_title')}</h2>

      <ul>
        {t('about.skills', { returnObjects: true }).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </section>
  );
}
