import { useTranslation } from 'react-i18next';

export default function Portfolio() {
  const { t } = useTranslation();
  const projects = t('portfolio.list', { returnObjects: true });

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">{t('portfolio.title')}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <a
            key={p.title}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-neutral-800 rounded-2xl p-6 hover:border-neutral-600 transition-colors"
          >
            <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
            <p className="text-xs text-neutral-400 mb-2">{p.stack}</p>
            <p className="text-sm">{p.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
