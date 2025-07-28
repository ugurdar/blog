// src/components/Navbar.jsx
import { useState, useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { lang, setLang } = useContext(LanguageContext);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);            // hamburger state

  const base = 'block px-4 py-2 md:inline md:px-3 md:py-2 rounded-md text-sm transition-colors';
  const active = 'bg-neutral-800 text-white';
  const inactive = 'text-neutral-400 hover:text-white hover:bg-neutral-800';
  const getCls = ({ isActive }) => `${base} ${isActive ? active : inactive}`;

  return (
    <header className="border-b border-neutral-800">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold">uğur dar</Link>

        {/* Hamburger butonu (md altı görünür) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2"
          aria-label="Menüyü Aç/Kapat"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Link + buton grubu */}
        <div className={`md:flex items-center gap-2 ${open ? 'block' : 'hidden'} md:block`}>
          <NavLink to="/"          className={getCls}>{t('nav.home')}</NavLink>
          <NavLink to="/blog"      className={getCls}>{t('nav.blog')}</NavLink>
          <NavLink to="/portfolio" className={getCls}>{t('nav.projects')}</NavLink>
          <NavLink to="/about"     className={getCls}>{t('nav.about')}</NavLink>

          {/* Tema düğmesi */}
          <button
            onClick={toggleTheme}
            className="mt-2 md:mt-0 md:ml-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center"
            aria-label="Tema Değiştir"
          >
            {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/> }
          </button>

          {/* Dil düğmesi */}
          <button
            onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
            className="mt-2 md:mt-0 md:ml-2 border px-2 py-1 rounded text-xs flex items-center justify-center"
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
        </div>
      </nav>
    </header>
  );
}
