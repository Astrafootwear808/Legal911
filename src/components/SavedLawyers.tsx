import { ArrowLeft, Bookmark, Star, Scale } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Language, translations } from '../translations';
import BookNowModal from './BookNowModal';
import LawyerProfileModal from './LawyerProfileModal';

interface SavedLawyersProps {
  onBack: () => void;
  lang: Language;
  savedLawyers: any[];
  onToggleSave: (lawyer: any) => void;
}

export default function SavedLawyers({ onBack, lang, savedLawyers, onToggleSave }: SavedLawyersProps) {
  const t = translations[lang];
  const [bookingLawyer, setBookingLawyer] = useState<any | null>(null);
  const [profileLawyer, setProfileLawyer] = useState<any | null>(null);

  return (
    <div className="py-8 md:py-12 space-y-10 min-h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-primary/5 rounded-full text-primary transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
          {t.savedTitle}
        </h2>
      </div>

      {savedLawyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...savedLawyers].sort((a, b) => a.name.localeCompare(b.name)).map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-outline-variant rounded-2xl p-5 flex gap-4 hover:shadow-lg transition-all group"
            >
              <img 
                src={lawyer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=random&color=fff&size=150`} 
                alt={lawyer.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">{lawyer.name}</h3>
                    <div className="flex items-center gap-1.5 text-primary">
                      <Scale className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold uppercase tracking-wider">{lawyer.area || lawyer.practiceAreas?.[0]}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onToggleSave(lawyer)}
                    className="text-primary hover:scale-110 transition-transform"
                  >
                    <Bookmark className="w-5 h-5 fill-current" />
                  </button>
                </div>
                

                
                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => setProfileLawyer(lawyer)}
                    className="flex-1 py-2 bg-surface-container text-primary rounded-lg text-xs font-bold hover:bg-primary/10 transition-all active:scale-95"
                  >
                    {t.profile}
                  </button>
                  <button 
                    onClick={() => setBookingLawyer(lawyer)}
                    className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-container shadow-sm transition-all active:scale-95"
                  >
                    {t.bookNow}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center space-y-6"
        >
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline/30">
            <Bookmark size={40} />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="font-headline text-2xl font-bold text-on-surface">{t.noSavedTitle}</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {t.noSavedDesc}
            </p>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary-container transition-all active:scale-95"
          >
            {t.exploreBtn}
          </button>
        </motion.div>
      )}
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
