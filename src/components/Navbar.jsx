import { NavLink, Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { lang, setLang } = useContext(LanguageContext);

  const base = 'px-3 py-2 rounded-md text-sm transition-colors';
  const active = 'bg-neutral-800 text-white';
  const inactive = 'text-neutral-400 hover:text-white hover:bg-neutral-800';

const { t } = useTranslation();

// Helper for NavLink className
const getCls = ({ isActive }) =>
    `${base} ${isActive ? active : inactive}`;

return (
    <header className="border-b border-neutral-800">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link to="/" className="text-lg font-semibold">ugurdar.dev</Link>

            <div className="flex items-center gap-2">
                <NavLink to="/"          className={getCls}>{t('nav.home')}</NavLink>
                <NavLink to="/blog"      className={getCls}>{t('nav.blog')}</NavLink>
                <NavLink to="/portfolio" className={getCls}>{t('nav.projects')}</NavLink>
                <NavLink to="/about"     className={getCls}>{t('nav.about')}</NavLink>

                <button
                    onClick={toggleTheme}
                    className="ml-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center"
                >
                    {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/> }
                </button>

                <button
                    onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                    className="ml-2 border px-2 py-1 rounded text-xs flex items-center justify-center"
                >
                    {lang === 'tr' ? 'EN' : 'TR'}
                </button>
            </div>
        </nav>
    </header>
);
}
