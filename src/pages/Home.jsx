import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();
  return (
    <section className="max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold">{t('home_title')}</h1>
      <p className="text-neutral-500 dark:text-neutral-400">{t('home_role')}</p>
      <p className="leading-relaxed">{t('home_desc')}</p>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          to="/portfolio"
          className="px-4 py-2 rounded-md text-sm bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
        >
          {t('home_cta_projects')}
        </Link>
        <Link
          to="/about"
          className="px-4 py-2 rounded-md text-sm border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {t('home_cta_about')}
        </Link>
      </div>
    </section>
  );
}
