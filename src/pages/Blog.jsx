// src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePosts } from '../utils/posts';
import { useTranslation } from 'react-i18next';

export default function Blog() {
  const posts = usePosts();

  const [query, setQuery] = useState('');

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );
  
  const { t } = useTranslation();

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Blog</h1>

      {/* Arama kutusu */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('find_title')}
        className="mb-6 w-full md:w-1/2 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm focus:outline-none"
      />

      {/* Sonuç yoksa mesaj */}
      {!filtered.length && (
        <p className="text-neutral-500">{t('no_results')}</p>
      )}

      {/* Yazı listesi */}
      <ul className="space-y-6">
        {filtered.map((p) => (
          <li
            key={p.slug}
            className="border-b border-neutral-800 pb-4"
          >
            <Link
              to={`/blog/${p.slug}`}
              className="text-lg hover:underline"
            >
              {p.title}
            </Link>
            <p className="text-xs text-neutral-500">{p.date}</p>
            <p className="text-sm text-neutral-400 line-clamp-2">
              {p.excerpt}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
