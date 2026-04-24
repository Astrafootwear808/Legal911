import { Handshake, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Language, translations } from '../translations';

export default function HandshakeLink({ lang }: { lang: Language }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = translations[lang];

  return (
    <div className="fixed bottom-24 right-6 z-[90] hidden lg:block">
      <motion.a
        href="https://paymylawyer.cc"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="flex items-center bg-white border border-outline-variant/30 rounded-full shadow-lg shadow-primary/10 overflow-hidden group"
        initial={{ width: '48px' }}
        animate={{ 
          width: isExpanded ? 'auto' : '48px',
          paddingRight: isExpanded ? '24px' : '0px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="w-12 h-12 flex items-center justify-center bg-primary text-white shrink-0">
          <Handshake size={24} />
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pl-4 flex items-center gap-3 whitespace-nowrap"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-outline/60 leading-none mb-1">
                  {t.foundLawyer}
                </span>
                <span className="text-sm font-bold text-on-surface">
                  {t.sealTheDeal}
                </span>
              </div>
              <ArrowRight size={18} className="text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.a>
    </div>
  );
}
