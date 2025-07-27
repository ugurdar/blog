import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import matter from 'gray-matter';
import { Buffer } from 'buffer';
if (!window.Buffer) window.Buffer = Buffer;

const files = import.meta.glob('/posts/*/*.md', {
  eager: true,
  query: '?raw',
});

function parse(raw) {
  const str = typeof raw === 'string' ? raw : raw.default;
  const { data, content } = matter(str);
  const excerpt =
    data.excerpt ||
    content
      .replace(/[#>*`\-\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 140) + '…';
  return { data: { ...data, excerpt }, content };
}


export function usePosts() {
  const { lang } = useContext(LanguageContext);

  const collect = (l) =>
    Object.entries(files)
      .filter(([p]) => p.includes(`/posts/${l}/`))
      .map(([p, raw]) => {
        const { data, content } = parse(raw);
        const slug = p.split('/').pop().replace('.md', '');
        return { slug, ...data, body: content };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

  const list = collect(lang);
  return list.length ? list : collect(lang === 'tr' ? 'en' : 'tr');
}


export function getPostBySlug(slug, lang) {
  const direct = `/posts/${lang}/${slug}.md`;
  if (files[direct]) {
    const { data, content } = parse(files[direct]);
    return { ...data, body: content };
  }

  for (const [path, rawMod] of Object.entries(files)) {
    if (!path.includes(`/posts/${lang}/`)) continue;
    const { data, content } = parse(rawMod);
    const fmSlug = (data.slug || '').trim();
    const fileSlug = path.split('/').pop().replace('.md', '');
    if (fmSlug === slug || fileSlug === slug) {
      return { ...data, body: content };
    }
  }

  const fallback = lang === 'tr' ? 'en' : 'tr';
  for (const [path, rawMod] of Object.entries(files)) {
    if (!path.includes(`/posts/${fallback}/`)) continue;
    const { data, content } = parse(rawMod);
    const fmSlug = (data.slug || '').trim();
    const fileSlug = path.split('/').pop().replace('.md', '');
    if (fmSlug === slug || fileSlug === slug) {
      return { ...data, body: content };
    }
  }

  return null;
}
