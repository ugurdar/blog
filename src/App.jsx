// src/App.jsx
import { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as CookieConsent from 'vanilla-cookieconsent';

import { LanguageContext } from './contexts/LanguageContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import About from './pages/About';

export default function App() {
  /* ------------------------------------------------------------------
   *  Cookie banner + GA4 entegrasyonu
   * ------------------------------------------------------------------ */
  const { lang } = useContext(LanguageContext);

  // 1) İlk mount-ta banner’ı çalıştır
  useEffect(() => {
    CookieConsent.run({
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {}
      },
      language: {
        default: 'tr',
        autoDetect: 'browser',
        translations: {
          tr: {
            consentModal: {
              title: 'Çerezler',
              description:
                'Siteyi geliştirmek için analitik çerezleri kullanıyorum.',
              acceptAllBtn: 'Hepsine izin ver',
              acceptNecessaryBtn: 'Sadece gerekli',
              showPreferencesBtn: 'Tercihleri yönet'
            },
            preferencesModal: {
              title: 'Çerez Tercihleri',
              savePreferencesBtn: 'Kaydet',
              closeIconLabel: 'Kapat',
              sections: [
                { title: 'Zorunlu Çerezler', linkedCategory: 'necessary' },
                { title: 'Analitik Çerezler', linkedCategory: 'analytics' }
              ]
            }
          },
          en: {
            consentModal: {
              title: 'Cookies',
              description: 'I use analytics cookies to improve my site.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Only necessary',
              showPreferencesBtn: 'Manage preferences'
            },
            preferencesModal: {
              title: 'Cookie preferences',
              savePreferencesBtn: 'Save',
              closeIconLabel: 'Close',
              sections: [
                { title: 'Necessary', linkedCategory: 'necessary' },
                { title: 'Analytics', linkedCategory: 'analytics' }
              ]
            }
          }
        }
      }
    });
  }, []);

  // 2) Dil değiştiğinde banner dilini güncelle
  useEffect(() => {
    if (CookieConsent?.setLanguage) {
      CookieConsent.setLanguage(lang); // 'tr' ←→ 'en'
    }
  }, [lang]);
  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<p>404 – Sayfa bulunamadı</p>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
