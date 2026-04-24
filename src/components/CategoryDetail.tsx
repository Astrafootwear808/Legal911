import { ChevronDown, SlidersHorizontal, ArrowLeft, Info, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Language, translations } from '../translations';
import { practiceAreas } from './PracticeAreaList';
import BookNowModal from './BookNowModal';
import LawyerProfileModal from './LawyerProfileModal';

interface CategoryDetailProps {
  categoryId: string;
  searchQuery?: string | null;
  onBack: () => void;
  lang: Language;
  savedLawyers: any[];
  onToggleSave: (lawyer: any) => void;
}

export default function CategoryDetail({ categoryId, searchQuery, onBack, lang, savedLawyers, onToggleSave }: CategoryDetailProps) {
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);
  const [profileLawyer, setProfileLawyer] = useState<any | null>(null);
  const t = translations[lang];
  const currentArea = practiceAreas.find(a => a.id === categoryId);

  const filterOptions = [
    { id: 'practice', label: t.practiceArea, options: practiceAreas.map(a => a.title[lang]) },
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

  const [lawyers, setLawyers] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: searchQuery, categoryId: categoryId, filters: activeFilters })
    })
      .then(res => res.json())
      .then(data => {
        setLawyers(data.lawyers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch lawyers:", err);
        setLawyers([]);
        setLoading(false);
      });
  }, [categoryId, searchQuery, activeFilters]);

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
                <span className="opacity-50 italic mr-1">{t.example}:</span>
                {currentArea.example[lang]}
              </p>
            )}
            <div className="flex items-center gap-2 text-on-surface-variant/70 text-xs md:text-sm font-medium">
               <span>{loading ? '...' : lawyers.length} {t.professionalsFound}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-sm font-extrabold transition-all shadow-sm active:scale-95 ${showFilters ? 'bg-primary-container text-primary' : 'bg-primary text-white hover:bg-primary/90'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {t.filters}
          </button>
        </div>
      </div>

      {/* Filters Strip */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 md:gap-3 p-4 bg-surface-container/40 rounded-2xl border border-outline-variant/30">
              {filterOptions.map((filter) => (
                <div key={filter.id} className="relative flex-1 min-w-[140px] md:flex-none">
                  <select 
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterClick(filter.id, e.target.value)}
                    className={`appearance-none w-full flex items-center gap-2 pl-4 pr-10 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border outline-none cursor-pointer shadow-sm ${
                      activeFilters[filter.id] 
                      ? 'bg-primary/10 border-primary/30 text-primary ring-2 ring-primary/20' 
                      : 'bg-white border-outline-variant/50 text-on-surface-variant hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }`}
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${activeFilters[filter.id] ? 'text-primary' : 'text-outline/50'}`} />
                </div>
              ))}
              {Object.values(activeFilters).some(v => v) && (
                <button 
                  onClick={clearFilters}
                  className="px-5 py-2.5 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all ml-auto md:ml-0"
                >
                  {t.clearFilters}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        ) : lawyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[...lawyers].sort((a, b) => a.name.localeCompare(b.name)).map((lawyer, index) => {
              const isSaved = savedLawyers.some(l => l.id === lawyer.id);
              return (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-outline-variant rounded-2xl p-5 flex gap-4 hover:shadow-xl transition-all group relative"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random&color=fff&size=150`}
                    alt={lawyer.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500 flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start pr-8">
                      <div>
                        <h3 className="font-headline font-bold text-lg text-on-surface">{lawyer.name}</h3>
                        <div className="flex items-center gap-1.5 text-primary">
                          <span className="text-xs font-bold uppercase tracking-wider">{lawyer.practiceAreas?.[0] || 'Law'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(lawyer);
                      }}
                      className="absolute top-4 right-4 p-2 bg-surface-container/50 hover:bg-surface-container rounded-full transition-colors z-10"
                    >
                      <Heart className={`w-5 h-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-outline hover:text-red-400'}`} />
                    </button>
                    

                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => setProfileLawyer({ ...lawyer, area: lawyer.practiceAreas?.[0] || 'Law' })}
                        className="flex-1 py-2 bg-surface-container text-primary rounded-lg text-xs font-bold hover:bg-primary/10 transition-all active:scale-95"
                      >
                        {t.profile}
                      </button>
                      <button 
                        onClick={() => setBookingLawyer({ ...lawyer, area: lawyer.practiceAreas?.[0] || 'Law' })}
                        className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container shadow-sm transition-all active:scale-95"
                      >
                        {t.bookNow}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8 py-8 md:py-16"
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
                {t.goBack}
              </button>
            </div>

            {/* Example Template Layout */}
            <div className="w-full max-w-2xl mt-12 pt-12 border-t border-outline-variant/40 text-left">
              <h4 className="text-xs md:text-sm font-bold text-outline uppercase tracking-widest mb-6 text-center">
                {t.exampleProfileLayout}
              </h4>
              <div className="bg-white border border-outline-variant rounded-2xl p-5 flex gap-4 opacity-60 grayscale-[30%] pointer-events-none relative shadow-sm">
                 <img 
                  src={`https://ui-avatars.com/api/?name=Jane+Doe&background=random&color=fff&size=150`}
                  alt="Template Lawyer"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <h3 className="font-headline font-bold text-lg text-on-surface">Jane Doe ({t.example})</h3>
                      <div className="flex items-center gap-1.5 text-primary">
                        <span className="text-xs font-bold uppercase tracking-wider">{currentArea?.title[lang] || 'Lawyer'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 p-2 bg-surface-container/50 rounded-full z-10">
                    <Heart className="w-5 h-5 text-outline" />
                  </div>
                  

                  
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 py-2 bg-surface-container text-primary rounded-lg text-xs font-bold text-center">
                      {t.profile}
                    </div>
                    <div className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold text-center shadow-sm">
                      {t.bookNow}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {profileLawyer && (
        <LawyerProfileModal
          lawyer={profileLawyer}
          onClose={() => setProfileLawyer(null)}
          onBookNow={() => { setProfileLawyer(null); setBookingLawyer(profileLawyer); }}
          lang={lang}
        />
      )}
      {bookingLawyer && (
        <BookNowModal
          lawyer={bookingLawyer}
          onClose={() => setBookingLawyer(null)}
          lang={lang}
        />
      )}
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
