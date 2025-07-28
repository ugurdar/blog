import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../contexts/LanguageContext';
import { getPostBySlug } from '../utils/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPost() {
  const { slug } = useParams();
  const { lang } = useContext(LanguageContext);
  const post = getPostBySlug(slug, lang);
  const { t } = useTranslation();

  if (!post) {
    return (
      <article className="prose dark:prose-invert max-w-none">
        <p className="text-red-400">{t('not_found')}</p>
        <Link to="/blog" className="text-sm">
          ← {t('all_posts')}
        </Link>
      </article>
    );
  }

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Link to="/blog" className="text-sm">
        ← {t('all_posts')}
      </Link>
      <h1>{post.title}</h1>
      <p className="text-xs text-neutral-500">{post.date}</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.body}
      </ReactMarkdown>
    </article>
  );
}
