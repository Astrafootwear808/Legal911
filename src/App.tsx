/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import PracticeAreaList from './components/PracticeAreaList';
import BarExamSection from './components/BarExamSection';
import BottomNav from './components/BottomNav';
import CategoryDetail from './components/CategoryDetail';
import SavedLawyers from './components/SavedLawyers';

import { Language, translations } from './translations';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferredLang') as Language) || 'EN';
    }
    return 'EN';
  });
  const [view, setView] = useState<'home' | 'saved'>('home');
  const [isMapZoomed, setIsMapZoomed] = useState(false);

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    setActiveSearch(null);
    setView('home');
  };

  const handleSearch = (query: string, type: 'lawyer' | 'firm') => {
    setActiveSearch(`${type}: ${query}`);
    setSelectedCategory('search-results');
    setView('home');
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setActiveSearch(null);
    setView('home');
  };

  const handleNavigateSaved = () => {
    setView('saved');
    setSelectedCategory(null);
    setActiveSearch(null);
  };

  const t = translations[lang];

  useEffect(() => {
    // Instant scroll to top on navigation to avoid feeling like you 'landed' at the bottom
    window.scrollTo(0, 0);
  }, [view, selectedCategory, activeSearch]);

  useEffect(() => {
    localStorage.setItem('preferredLang', lang);
  }, [lang]);

  return (
    <div className="min-h-screen pb-48 md:pb-56 lg:pb-16 bg-transparent overflow-x-hidden selection:bg-primary/10 relative">
      {/* Language Toggle Slider - Fixed for persistence */}
      <AnimatePresence>
        {!isMapZoomed && (
          <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative flex items-center bg-white/90 backdrop-blur-xl border border-outline-variant/40 rounded-2xl p-1 shadow-lg shadow-black/10 h-10 w-24 md:h-12 md:w-32 group select-none transition-all hover:shadow-xl"
              aria-label="Language selector"
              role="group"
            >
              {/* Slider Background */}
              <motion.div
                layout
                className="absolute inset-y-1 w-[46%] bg-primary rounded-xl shadow-md z-0 pointer-events-none"
                initial={false}
                animate={{ 
                  left: lang === 'EN' ? '4px' : '52%',
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
              
              {/* EN Label */}
              <button 
                onClick={() => setLang('EN')}
                aria-pressed={lang === 'EN'}
                className={`cursor-pointer border-none bg-transparent m-0 p-0 relative z-10 flex-1 flex items-center justify-center gap-1 transition-colors duration-300 ${lang === 'EN' ? 'text-white' : 'text-outline/80 group-hover:text-on-surface'}`}
              >
                <span className="text-sm md:text-base leading-none">🇺🇸</span>
                <span className="text-[10px] md:text-xs font-extrabold tracking-wider">EN</span>
              </button>
              
              {/* ES Label */}
              <button 
                onClick={() => setLang('ES')}
                aria-pressed={lang === 'ES'}
                className={`cursor-pointer border-none bg-transparent m-0 p-0 relative z-10 flex-1 flex items-center justify-center gap-1 transition-colors duration-300 ${lang === 'ES' ? 'text-white' : 'text-outline/80 group-hover:text-on-surface'}`}
              >
                <span className="text-sm md:text-base leading-none">🇪🇸</span>
                <span className="text-[10px] md:text-xs font-extrabold tracking-wider">ES</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-5xl mx-auto px-4 md:px-0">
        {view === 'saved' ? (
          <SavedLawyers onBack={handleBack} lang={lang} />
        ) : !selectedCategory ? (
          <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
            <Hero onSearch={handleSearch} lang={lang} />
            <PracticeAreaList onSelectCategory={handleSelectCategory} lang={lang} />
            <BarExamSection lang={lang} onZoomChange={setIsMapZoomed} />
          </div>
        ) : (
          <CategoryDetail 
            categoryId={selectedCategory} 
            searchQuery={activeSearch}
            onBack={handleBack} 
            lang={lang}
          />
        )}
      </main>
      <BottomNav onHomeClick={handleBack} onSavedClick={handleNavigateSaved} lang={lang} />
    </div>
  );
}

