import { 
  ArrowRight, Users, Scale, Home, Briefcase, 
  Gavel, Globe, ShieldCheck, Lightbulb, Banknote, 
  Leaf, UserCheck, HeartPulse 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Language, translations } from '../translations';

export const practiceAreas = [
  {
    id: 'family',
    title: { EN: 'Family Law', ES: 'Derecho de Familia' },
    description: { EN: 'Divorce, Custody, Adoption', ES: 'Divorcio, Custodia, Adopción' },
    example: { EN: 'Navigating a child custody dispute.', ES: 'Navegando una disputa de custodia de hijos.' },
    icon: Users,
    colorClass: 'bg-[#dbe1ff] text-[#00174b]',
  },
  {
    id: 'injury',
    title: { EN: 'Personal Injury', ES: 'Lesiones Personales' },
    description: { EN: 'Accidents, Medical Malpractice', ES: 'Accidentes, Negligencia Médica' },
    example: { EN: 'Getting compensation after a car accident.', ES: 'Obteniendo compensación después de un accidente de auto.' },
    icon: Scale,
    colorClass: 'bg-[#ffdad6] text-[#ba1a1a]',
  },
  {
    id: 'estate',
    title: { EN: 'Real Estate', ES: 'Bienes Raíces' },
    description: { EN: 'Property, Leases, Zoning', ES: 'Propiedad, Arrendamientos, Zonificación' },
    example: { EN: 'Buying a home or negotiating a lease.', ES: 'Comprando una casa o negociando un contrato de arrendamiento.' },
    icon: Home,
    colorClass: 'bg-[#6cf8bb] text-[#002113]',
  },
  {
    id: 'corporate',
    title: { EN: 'Corporate', ES: 'Corporativo' },
    description: { EN: 'Business Formation, Contracts', ES: 'Formación de Empresas, Contratos' },
    example: { EN: 'Founding a startup or reviewing business contracts.', ES: 'Fundando una startup o revisando contratos comerciales.' },
    icon: Briefcase,
    colorClass: 'bg-[#dbe4ea] text-[#141d21]',
  },
  {
    id: 'criminal',
    title: { EN: 'Criminal Defense', ES: 'Defensa Criminal' },
    description: { EN: 'DUI, Felonies, Misdemeanors', ES: 'DUI, Delitos Graves, Faltas' },
    example: { EN: 'Representation for a traffic violation or DUI.', ES: 'Representación por una violación de tráfico o DUI.' },
    icon: Gavel,
    colorClass: 'bg-slate-200 text-slate-800',
  },
  {
    id: 'immigration',
    title: { EN: 'Immigration', ES: 'Inmigración' },
    description: { EN: 'Visas, Citizenship, Asylum', ES: 'Visas, Ciudadanía, Asilo' },
    example: { EN: 'Applying for a green card or work visa.', ES: 'Aplicando por una tarjeta verde o visa de trabajo.' },
    icon: Globe,
    colorClass: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'employment',
    title: { EN: 'Employment Law', ES: 'Derecho Laboral' },
    description: { EN: 'Discrimination, Wage, Workers Comp', ES: 'Discriminación, Salarios' },
    example: { EN: 'Filing a claim for unfair dismissal or harassment.', ES: 'Presentando una reclamación por despido injustificado o acoso.' },
    icon: ShieldCheck,
    colorClass: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'ip',
    title: { EN: 'Intellectual Property', ES: 'Propiedad Intelectual' },
    description: { EN: 'Patents, Trademarks, Copyright', ES: 'Patentes, Marcas, Derechos de Autor' },
    example: { EN: 'Protecting your brand with a trademark.', ES: 'Protegiendo su marca con una marca registrada.' },
    icon: Lightbulb,
    colorClass: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'tax',
    title: { EN: 'Tax Law', ES: 'Derecho Fiscal' },
    description: { EN: 'Audit Defense, Tax Planning', ES: 'Defensa de Auditoría, Planificación Fiscal' },
    example: { EN: 'Resolving issues with the IRS or tax planning.', ES: 'Resolviendo problemas con el IRS o planificación fiscal.' },
    icon: Banknote,
    colorClass: 'bg-green-100 text-green-700',
  },
  {
    id: 'civil',
    title: { EN: 'Civil Rights', ES: 'Derechos Civiles' },
    description: { EN: 'Discrimination, Equal Protection', ES: 'Discriminación, Protección Igualitaria' },
    example: { EN: 'Challenging a policy that restricts voting rights.', ES: 'Desafiando una política que restringe los derechos de voto.' },
    icon: UserCheck,
    colorClass: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'health',
    title: { EN: 'Healthcare Law', ES: 'Derecho de la Salud' },
    description: { EN: 'Compliance, HIPAA, Med Mal', ES: 'Cumplimiento, HIPAA, Negligencia Médica' },
    example: { EN: 'Ensuring your clinic follows patient privacy laws.', ES: 'Asegurando que su clínica siga las leyes de privacidad del paciente.' },
    icon: HeartPulse,
    colorClass: 'bg-red-50 text-red-600',
  },
  {
    id: 'env',
    title: { EN: 'Environmental Law', ES: 'Derecho Ambiental' },
    description: { EN: 'Regulation, Compliance, Litigation', ES: 'Regulación, Cumplimiento, Litigio' },
    example: { EN: 'Navigating land use permits for sustainable energy.', ES: 'Navegando permisos de uso de suelo para energía sostenible.' },
    icon: Leaf,
    colorClass: 'bg-teal-50 text-teal-700',
  }
];

export default function PracticeAreaList({ onSelectCategory, lang }: { onSelectCategory: (id: string) => void, lang: Language }) {
  const [showAll, setShowAll] = useState(false);
  const featuredAreas = practiceAreas.slice(0, 4);
  const visibleAreas = showAll ? practiceAreas : featuredAreas;
  const t = translations[lang];

  return (
    <section className="px-6 py-16 md:py-24 space-y-12">
      <div className="flex justify-between items-end">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface">
          {t.browseTitle} <span className="text-secondary">{t.browseTitleAccent}</span>
        </h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-primary font-semibold hover:underline bg-transparent border-none cursor-pointer"
        >
          {showAll ? t.showLess : t.viewAll} →
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
        <AnimatePresence mode="popLayout">
          {visibleAreas.map((area, index) => (
            <motion.a
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                delay: showAll ? (index * 0.05) : (index * 0.1) 
              }}
              href={`#${area.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(area.id);
              }}
              className="group flex items-center justify-between py-6 border-b border-outline-variant hover:bg-white/50 md:hover:px-4 md:-mx-4 rounded-xl transition-all active:scale-[0.99]"
            >
              <div className="flex items-center space-x-5">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${area.colorClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <area.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface">{area.title[lang]}</h3>
                  <p className="text-sm md:text-base text-on-surface-variant font-medium mt-1">{area.description[lang]}</p>
                  {(area as any).example && (
                    <p className="text-xs md:text-sm text-primary/70 italic mt-1 font-medium">
                      {(area as any).example[lang]}
                    </p>
                  )}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all shrink-0">
                <ArrowRight className="w-5 h-5 text-outline group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
