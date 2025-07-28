// src/components/Footer.jsx
import { Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="
        border-t border-neutral-300 dark:border-neutral-800
        text-sm text-neutral-600 dark:text-neutral-500
        flex flex-col md:flex-row items-center justify-between
        gap-4 px-4 py-6 max-w-4xl mx-auto
      ">
      {/* © 2025 Uğur Dar */}
      <span>
        © {new Date().getFullYear()} Uğur Dar — {t('footer.rights')}
      </span>

      {/* sosyal ikonlar */}
      <nav className="flex items-center gap-4">
        <a href="https://github.com/ugurdar" target="_blank" rel="noopener noreferrer"
           className="hover:text-neutral-900 dark:hover:text-white transition-colors"
           aria-label="GitHub">
          <Github size={18} />
        </a>
        <a href="https://www.linkedin.com/in/ugurdar" target="_blank" rel="noopener noreferrer"
           className="hover:text-neutral-900 dark:hover:text-white transition-colors"
           aria-label="LinkedIn">
          <Linkedin size={18} />
        </a>
      </nav>
    </footer>
  );
}
