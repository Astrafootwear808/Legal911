import { X, Star, MapPin, Scale, Clock, Award, Phone, Mail, Globe, CheckCircle, MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Language } from '../translations';

interface LawyerProfileModalProps {
  lawyer: {
    id: string;
    name: string;
    area: string;
    image?: string;
    description?: string;
    practiceAreas?: string[];
    location?: string;
    experience?: string;
    languages?: string[];
    priceRange?: string;
  };
  onClose: () => void;
  onBookNow: () => void;
  lang: Language;
}

const badges = [
  { icon: CheckCircle, label: 'Bar Verified', color: 'text-green-600 bg-green-50' },
  { icon: MessageSquare, label: 'Fast Responder', color: 'text-blue-600 bg-blue-50' },
];

export default function LawyerProfileModal({ lawyer, onClose, onBookNow, lang }: LawyerProfileModalProps) {
  const t = translations[lang];

  const initials = lawyer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const areas = lawyer.practiceAreas?.length ? lawyer.practiceAreas : [lawyer.area];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Hero header */}
          <div className="relative bg-gradient-to-br from-primary/90 to-primary flex-shrink-0 overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.08] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/[0.08] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            <div className="relative px-6 pt-8 pb-6 flex items-end gap-5">
              {/* Avatar */}
              {lawyer.image ? (
                <img
                  src={lawyer.image}
                  alt={lawyer.name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-lg border-2 border-white/30 flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0 select-none">
                  {initials}
                </div>
              )}

              <div className="flex-1 min-w-0 text-white pb-1">
                <h2 className="font-headline text-xl md:text-2xl font-bold leading-tight">{lawyer.name}</h2>
                <div className="flex items-center gap-1.5 mt-1 opacity-90">
                  <Scale className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-sm font-semibold truncate">{areas[0]}</span>
                </div>
                <div className="flex items-center gap-3 mt-2 opacity-80 text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{lawyer.location || 'New York, NY'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{lawyer.experience || '12 yrs exp.'}</span>
                </div>
              </div>
            </div>

            {/* Stats bar */}
            <div className="relative flex border-t border-white/20 text-white">
              {[
                { label: t.experience, value: lawyer.experience?.split(' ')[0] || '12' },
                { label: t.practiceArea, value: areas[0].split(' ')[0] },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  className={`flex-1 flex flex-col items-center py-3 ${i < arr.length - 1 ? 'border-r border-white/20' : ''}`}
                >
                  <span className="text-base md:text-lg font-bold leading-none">{stat.value}</span>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-60 mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
                {/* Profile Header Info */}
                <div className="space-y-1">
                  <h3 className="font-headline font-bold text-lg text-on-surface">{lawyer.name}</h3>
                  <p className="text-sm font-semibold text-primary">{lawyer.area || areas[0]}</p>
                  <p className="text-sm text-on-surface-variant"><span className="font-bold">{t.languages}:</span> {lawyer.languages?.join(', ') || 'English, Spanish'}</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider opacity-60">{t.about}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {lawyer.description || (lang === 'EN' 
                      ? `${lawyer.name} is a dedicated attorney helping individuals, families, and businesses navigate complex legal challenges with clarity and confidence. Focusing on client-centered representation, ${lawyer.name} delivers efficient, results-driven solutions in ${lawyer.area || areas[0]} and related fields.`
                      : `${lawyer.name} es un abogado dedicado que ayuda a individuos, familias y empresas a navegar desafíos legales complejos con claridad y confianza. Con un enfoque en la representación centrada en el cliente, ${lawyer.name} ofrece soluciones eficientes y orientadas a resultados en ${lawyer.area || areas[0]} y campos relacionados.`)}
                  </p>
                </div>

                {/* Practice Areas */}
                <div className="space-y-2">
                  <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider opacity-60">{t.practiceAreas}</h3>
                  <div className="flex flex-wrap gap-2">
                    {areas.map(area => (
                      <span key={area} className="px-3 py-1.5 bg-primary/[0.08] text-primary rounded-lg text-xs font-bold">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="space-y-3 p-5 bg-surface-container/30 rounded-2xl border border-outline-variant/30">
                  <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider opacity-60">{t.consultationDetails}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-on-surface-variant"><span className="font-bold">{t.consultationType}:</span></p>
                    <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {lawyer.priceRange ? `${t.priceRange}: ${lawyer.priceRange}` : t.rateFree}
                    </div>
                    <p className="text-[10px] text-on-surface-variant italic mt-2 italic">* {lang === 'EN' ? 'Please read consultation guidelines before booking' : 'Por favor lea las pautas de consulta antes de reservar'}</p>
                  </div>
                </div>

                {/* Consultation Guidelines */}
                <div className="space-y-3">
                  <h3 className="font-headline font-bold text-on-surface text-sm uppercase tracking-wider opacity-60">{t.consultationGuidelines}</h3>
                  <ul className="space-y-2">
                    {[
                      t.guideline1,
                      t.guideline2,
                      t.guideline3,
                      t.guideline4
                    ].map((guideline, i) => (
                      <li key={i} className="flex gap-3 text-sm text-on-surface-variant">
                        <div className="w-1.5 h-1.5 bg-primary/30 rounded-full mt-2 flex-shrink-0" />
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
          </div>

          {/* Footer CTA */}
          <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-outline-variant rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-all active:scale-95 text-sm"
            >
              {t.close}
            </button>
            <button
              onClick={() => { onBookNow(); }}
              className="flex-[2] py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95 text-sm"
            >
              {t.bookConsultation}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
