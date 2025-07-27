import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">{t('home_title')}</h1>
      <p>{t('home_desc')}</p>
    </section>
  );
}
