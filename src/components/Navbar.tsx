import { Compass, Bookmark, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, translations } from '../translations';

interface NavbarProps {
  onHomeClick: () => void;
  onSavedClick: () => void;
  onProfileClick: () => void;
  lang: Language;
  activeView: string;
}

export default function Navbar({ onHomeClick, onSavedClick, onProfileClick, lang, activeView }: NavbarProps) {
  const t = translations[lang];

  const tabs = [
    { id: 'home', label: t.navDiscover, icon: Compass, action: onHomeClick },
    { id: 'saved', label: t.navSaved, icon: Bookmark, action: onSavedClick },
    { id: 'profile', label: t.navProfile, icon: User, action: onProfileClick },
  ];

  return (
    <nav className="hidden lg:block sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-outline-variant/30 px-6 py-4">
      <div className="max-w-5xl mx-auto flex items-center justify-center">
        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {tabs.map((tab) => {
            const isActive = activeView === tab.id || (tab.id === 'home' && activeView === 'home');
            return (
              <button
                key={tab.id}
                onClick={tab.action}
                className={`relative px-8 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all active:scale-95 ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className="w-5 h-5" />
                <span className="font-headline text-sm font-bold tracking-wide">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
