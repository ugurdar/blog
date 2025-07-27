import { Routes, Route } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Portfolio from './pages/Portfolio';
import About from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}