import { Compass, Gavel, Bookmark, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Language, translations } from '../translations';

const tabs = [
  { id: 'discover', labelKey: 'navDiscover', icon: Compass },
  { id: 'specialties', labelKey: 'navSpecialties', icon: Gavel },
  { id: 'saved', labelKey: 'navSaved', icon: Bookmark },
  { id: 'profile', labelKey: 'navProfile', icon: User },
];

export default function BottomNav({ onHomeClick, onSavedClick, lang }: { onHomeClick?: () => void, onSavedClick?: () => void, lang: Language }) {
  const [activeTab, setActiveTab] = useState('discover');
  const t = translations[lang];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center px-4 py-4 md:py-5 pb-8 md:pb-10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if ((tab.id === 'discover' || tab.id === 'specialties') && onHomeClick) {
                onHomeClick();
              }
              if (tab.id === 'saved' && onSavedClick) {
                onSavedClick();
              }
            }}
            className={`relative flex flex-col items-center justify-center px-4 py-1 transition-all active:scale-90 ${
              isActive ? 'text-primary' : 'text-outline/70'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabMobile"
                className="absolute inset-x-0 -bottom-2 h-1 bg-primary rounded-full px-4"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className={`w-6 h-6 md:w-7 md:h-7 mb-1.5 ${isActive ? 'fill-current scale-110' : ''} transition-all`} />
            <span className="font-headline text-[9px] md:text-[11px] font-extrabold uppercase tracking-widest transition-colors">
              {t[tab.labelKey as keyof typeof t]}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
