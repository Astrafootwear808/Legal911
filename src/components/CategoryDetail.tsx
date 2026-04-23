import { ChevronDown, SlidersHorizontal, ArrowLeft, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Language, translations } from '../translations';
import { practiceAreas } from './PracticeAreaList';

interface CategoryDetailProps {
  categoryId: string;
  searchQuery?: string | null;
  onBack: () => void;
  lang: Language;
}

export default function CategoryDetail({ categoryId, searchQuery, onBack, lang }: CategoryDetailProps) {
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const t = translations[lang];
  const currentArea = practiceAreas.find(a => a.id === categoryId);

  const filterOptions = [
    { id: 'practice', label: t.practiceArea, options: ['Family', 'Corporate', 'Criminal', 'Injury'] },
    { id: 'experience', label: t.experience, options: ['1-5 years', '5-10 years', '10+ years'] },
    { id: 'price', label: t.priceRange, options: ['$100-200', '$200-500', '$500+'] },
  ];

  const handleFilterClick = (id: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [id]: prev[id] === value ? '' : value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [categoryId, searchQuery]);

  return (
    <div className="py-6 md:py-12 space-y-8 md:space-y-12 min-h-[60vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-white border border-outline-variant/30 rounded-xl text-primary shadow-sm hover:shadow-md transition-all active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="space-y-0.5">
            <h2 className="font-headline text-xl md:text-3xl font-bold text-on-surface capitalize leading-tight">
              {searchQuery ? `${t.resultsFor} "${searchQuery}"` : (categoryId === 'all' ? t.allProfessionals : currentArea?.title[lang] || categoryId.replace('-', ' '))}
            </h2>
            {currentArea?.example && (
              <p className="text-sm md:text-lg text-primary font-medium">
                <span className="opacity-50 italic mr-1">{lang === 'EN' ? 'Example:' : 'Ejemplo:'}</span>
                {currentArea.example[lang]}
              </p>
            )}
            <div className="flex items-center gap-2 text-on-surface-variant/70 text-xs md:text-sm font-medium">
               <span>{loading ? '...' : '0'} {lang === 'EN' ? 'professionals found' : 'profesionales encontrados'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
           <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-outline-variant/50 rounded-2xl text-sm font-bold text-on-surface-variant hover:bg-slate-50 transition-all shadow-sm">
            <Info className="w-4 h-4 text-primary" />
            {t.guidance}
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-sm font-extrabold hover:bg-primary-container transition-all shadow-lg active:scale-95">
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters}
          </button>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-wrap gap-2 md:gap-3 p-1 bg-surface-container/30 rounded-2xl">
        {filterOptions.map((filter) => (
          <div key={filter.id} className="relative">
            <select 
              value={activeFilters[filter.id] || ''}
              onChange={(e) => handleFilterClick(filter.id, e.target.value)}
              className={`appearance-none flex items-center gap-2 pl-4 pr-10 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border outline-none cursor-pointer ${
                activeFilters[filter.id] 
                ? 'bg-primary/10 border-primary/20 text-primary' 
                : 'bg-white border-outline-variant/50 text-on-surface-variant hover:border-primary/30'
              }`}
            >
              <option value="">{filter.label}</option>
              {filter.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-outline/50" />
          </div>
        ))}
        {Object.values(activeFilters).some(v => v) && (
          <button 
            onClick={clearFilters}
            className="px-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            {t.clearFilters}
          </button>
        )}
      </div>

      {/* Results Area */}
      <div className="relative pt-4 md:pt-12 text-center space-y-8">
        {loading ? (
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-primary"
               />
            </div>
            <p className="text-on-surface-variant font-bold text-sm tracking-wide animate-pulse uppercase">{t.searchingMatch}</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8 py-16 md:py-32"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
                <SearchIcon size={48} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-primary/5 rounded-full scale-150 -z-10"
              />
            </div>
            <div className="space-y-3 max-w-sm">
              <h3 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">{t.noExperts}</h3>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                {t.noMatchesDesc}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-container transition-all active:scale-95"
              >
                {t.clearFilters}
              </button>
              <button 
                onClick={onBack}
                className="px-8 py-3 border border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-container transition-all"
              >
                {lang === 'EN' ? 'Go Back' : 'Regresar'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SearchIcon({ size = 24 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
