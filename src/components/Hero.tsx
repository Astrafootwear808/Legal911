import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../translations';

export default function Hero({ onSearch, lang }: { onSearch: (query: string, type: 'lawyer' | 'firm') => void, lang: Language }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'lawyer' | 'firm'>('lawyer');
  const t = translations[lang];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, searchType);
    }
  };

  return (
    <section className="pt-6 md:pt-10 px-6 space-y-8 flex flex-col items-center">
      {/* Brand Identity / Logo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 cursor-pointer group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="relative h-16 md:h-24 transition-transform group-hover:scale-105 duration-500">
          <img 
            src="/logo.png" 
            alt="Legal911 Logo" 
            className="h-full w-auto object-contain drop-shadow-2xl"
            onError={(e) => {
              // Fallback to text if logo.png is missing
              (e.target as any).style.display = 'none';
              const textEl = document.getElementById('logo-text-fallback');
              if (textEl) textEl.style.display = 'block';
            }}
          />
          <div 
            id="logo-text-fallback" 
            className="hidden font-headline font-extrabold tracking-tighter text-2xl md:text-4xl text-primary"
          >
            Legal911
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-headline text-3xl md:text-6xl font-bold text-on-surface text-center leading-[1.2] md:leading-[1.1] tracking-tight"
        >
          {t.heroTitle} <span className="text-primary italic">{t.heroTitleAccent}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-xl text-on-surface-variant text-center max-w-2xl mx-auto leading-relaxed"
        >
          {t.heroSubtitle}
        </motion.p>
      </div>
      
      <div className="w-full max-w-2xl space-y-4">
        {/* Search Bar */}
        <motion.form 
          onSubmit={handleSearch}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl transition-all shadow-xl shadow-primary/5"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-outline" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-4 bg-white border border-outline-variant rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary-container focus:border-primary-container transition-all text-on-surface text-base md:text-lg placeholder:text-outline/70 outline-none"
            placeholder={t.searchPlaceholder}
          />
          <button 
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base font-bold hover:bg-primary-container transition-all active:scale-95 whitespace-nowrap"
          >
            {searchType === 'lawyer' ? t.searchLawyerBtn : t.searchFirmBtn}
          </button>
        </motion.form>

        {/* Search Type Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="inline-flex p-1 bg-surface-container rounded-xl border border-outline-variant/30">
            <button
              onClick={() => setSearchType('lawyer')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                searchType === 'lawyer' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.individualLawyer}
            </button>
            <button
              onClick={() => setSearchType('firm')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                searchType === 'firm' 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.lawFirm}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
