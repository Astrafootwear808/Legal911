import { 
  ArrowRight, Users, Scale, Home, Briefcase, 
  Gavel, Globe, ShieldCheck, Lightbulb, Banknote, 
  Leaf, UserCheck, HeartPulse, Film, TrendingDown, Heart, Shield, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Language, translations } from '../translations';

export const practiceAreas = [
  { 
    id: 'entertainment', 
    title: { EN: 'Entertainment Lawyer', ES: 'Abogado de Entretenimiento' }, 
    handles: { EN: 'Contracts, licensing, legal issues for musicians, actors, influencers.', ES: 'Contratos, licencias, problemas legales para músicos, actores, influencers.' }, 
    example: { EN: 'Rachel is a singer offered a record deal. An entertainment lawyer reviews the contract to make sure it’s fair.', ES: 'Rachel es una cantante a la que le ofrecen un contrato discográfico. Un abogado de entretenimiento revisa el contrato para asegurar que sea justo.' },
    icon: Film, colorClass: 'bg-pink-100 text-pink-700' 
  },
  { 
    id: 'civil-rights', 
    title: { EN: 'Civil Rights Lawyer', ES: 'Abogado de Derechos Civiles' }, 
    handles: { EN: 'Discrimination, police misconduct, freedom of speech, equal protection.', ES: 'Discriminación, mala conducta policial, libertad de expresión y protección igualitaria.' }, 
    example: { EN: 'Mark was unfairly fired due to his race. A civil rights lawyer helps him file a lawsuit against his employer.', ES: 'Mark fue despedido injustamente debido a su raza. Un abogado de derechos civiles lo ayuda a presentar una demanda.' },
    icon: UserCheck, colorClass: 'bg-purple-100 text-purple-700' 
  },
  { 
    id: 'bankruptcy', 
    title: { EN: 'Bankruptcy Lawyer', ES: 'Abogado de Quiebras' }, 
    handles: { EN: 'Debt relief, Chapter 7 & 13 filings, foreclosures, creditor negotiations.', ES: 'Alivio de deuda, bancarrota Capítulo 7 y 13, ejecuciones hipotecarias, negociaciones.' }, 
    example: { EN: 'John is overwhelmed by credit card debt and facing foreclosure. A bankruptcy lawyer helps him restructure his debts.', ES: 'John está abrumado por las deudas y enfrenta una ejecución hipotecaria. Un abogado de quiebras lo ayuda a reestructurarlas.' },
    icon: TrendingDown, colorClass: 'bg-red-100 text-red-700' 
  },
  { 
    id: 'elder', 
    title: { EN: 'Elder Law Attorney', ES: 'Abogado de la Tercera Edad' }, 
    handles: { EN: 'Medicare planning, nursing home issues, guardianship, estate planning.', ES: 'Planificación de Medicare, problemas en asilos, tutela, planificación patrimonial.' }, 
    example: { EN: "Maria's aging father needs a nursing home. An elder law attorney helps protect his assets while qualifying for Medicaid.", ES: 'El padre de María necesita mudarse a un asilo. Un abogado de la tercera edad ayuda a proteger sus bienes.' },
    icon: Heart, colorClass: 'bg-orange-100 text-orange-700' 
  },
  { 
    id: 'social-security', 
    title: { EN: 'Social Security & Disability', ES: 'Seguro Social y Discapacidad' }, 
    handles: { EN: 'SSDI/SSI claims, disability benefits appeals, and hearings.', ES: 'Reclamos de SSDI/SSI, apelaciones de beneficios por discapacidad y audiencias.' }, 
    example: { EN: 'David suffered a back injury and his disability claim was denied. A disability lawyer represents him in his appeal.', ES: 'David sufrió una lesión y su reclamo fue denegado. Un abogado lo representa en su apelación.' },
    icon: Shield, colorClass: 'bg-blue-50 text-blue-800' 
  },
  { 
    id: 'ip', 
    title: { EN: 'Intellectual Property Lawyer', ES: 'Abogado de Propiedad Intelectual' }, 
    handles: { EN: 'Patents, trademarks, copyrights, and trade secrets protection.', ES: 'Patentes, marcas comerciales, derechos de autor y protección de secretos.' }, 
    example: { EN: "Sarah invented a new tech gadget. An IP lawyer helps her file a patent so competitors can't steal her idea.", ES: 'Sarah inventó un nuevo dispositivo. Un abogado de propiedad intelectual la ayuda a presentar una patente.' },
    icon: Lightbulb, colorClass: 'bg-yellow-100 text-yellow-700' 
  },
  { 
    id: 'injury', 
    title: { EN: 'Personal Injury Lawyer', ES: 'Abogado de Lesiones Personales' }, 
    handles: { EN: 'Car accidents, medical malpractice, slip and falls, wrongful death claims.', ES: 'Accidentes automovilísticos, negligencia médica, resbalones y caídas.' }, 
    example: { EN: 'Tom was hit by a distracted driver. A personal injury lawyer sues the driver’s insurance for medical costs.', ES: 'Tom fue atropellado por un conductor distraído. Un abogado de lesiones personales demanda al seguro.' },
    icon: Scale, colorClass: 'bg-[#ffdad6] text-[#ba1a1a]' 
  },
  { 
    id: 'business', 
    title: { EN: 'Business Lawyer', ES: 'Abogado de Negocios' }, 
    handles: { EN: 'Company formation, mergers, business contracts, commercial litigation.', ES: 'Formación de empresas, fusiones, contratos comerciales y litigios.' }, 
    example: { EN: 'Emma is starting a new software company. A business lawyer helps her set up an LLC and drafts client agreements.', ES: 'Emma está comenzando una empresa. Un abogado de negocios la ayuda a establecer una LLC.' },
    icon: Briefcase, colorClass: 'bg-[#dbe4ea] text-[#141d21]' 
  },
  { 
    id: 'criminal', 
    title: { EN: 'Criminal Defense Lawyer', ES: 'Abogado de Defensa Criminal' }, 
    handles: { EN: 'DUI, drug charges, assault, white-collar crimes, felonies/misdemeanors.', ES: 'DUI, cargos por drogas, asalto, delitos de cuello blanco y delitos graves/menores.' }, 
    example: { EN: 'Alex is falsely accused of theft. A criminal defense lawyer investigates the case and represents him in court.', ES: 'Alex es acusado falsamente de robo. Un abogado de defensa criminal lo representa en la corte.' },
    icon: Gavel, colorClass: 'bg-slate-200 text-slate-800' 
  },
  { 
    id: 'env', 
    title: { EN: 'Environmental Lawyer', ES: 'Abogado Ambiental' }, 
    handles: { EN: 'Land use, environmental regulations, toxic torts, and compliance.', ES: 'Uso de la tierra, regulaciones ambientales, agravios tóxicos y cumplimiento.' }, 
    example: { EN: 'A factory is polluting a local river. An environmental lawyer represents the community to stop the illegal dumping.', ES: 'Una fábrica contamina un río. Un abogado ambiental representa a la comunidad para detener el vertido.' },
    icon: Leaf, colorClass: 'bg-teal-50 text-teal-700' 
  },
  { 
    id: 'probate', 
    title: { EN: 'Probate & Estate Lawyer', ES: 'Abogado de Sucesiones' }, 
    handles: { EN: 'Wills, trusts, estate administration, and probate litigation.', ES: 'Testamentos, fideicomisos, administración de patrimonio y litigios testamentarios.' }, 
    example: { EN: 'After their grandmother passes away, the family hires a probate lawyer to properly distribute her assets.', ES: 'Después del fallecimiento de su abuela, la familia contrata a un abogado para distribuir sus bienes.' },
    icon: FileText, colorClass: 'bg-amber-100 text-amber-800' 
  },
  { 
    id: 'general', 
    title: { EN: 'General Practice Lawyer', ES: 'Abogado de Práctica General' }, 
    handles: { EN: 'Everyday legal matters, basic contracts, simple divorces, civil disputes.', ES: 'Asuntos legales cotidianos, contratos básicos, divorcios simples, disputas civiles.' }, 
    example: { EN: 'A local business owner hires a general practice lawyer to review a lease and draft a simple will.', ES: 'El dueño de un negocio contrata a un abogado para revisar un contrato y redactar un testamento.' },
    icon: Scale, colorClass: 'bg-gray-100 text-gray-700' 
  },
  { 
    id: 'family', 
    title: { EN: 'Family Lawyer', ES: 'Abogado de Familia' }, 
    handles: { EN: 'Divorce, child custody, alimony, adoption, protective orders.', ES: 'Divorcio, custodia de los hijos, pensión alimenticia, adopción, órdenes de protección.' }, 
    example: { EN: 'Lisa and James are separating. A family lawyer helps them negotiate a fair child custody arrangement.', ES: 'Lisa y James se están separando. Un abogado de familia los ayuda a negociar un acuerdo de custodia.' },
    icon: Users, colorClass: 'bg-[#dbe1ff] text-[#00174b]' 
  },
  { 
    id: 'medical', 
    title: { EN: 'Medical Malpractice Lawyer', ES: 'Abogado de Negligencia Médica' }, 
    handles: { EN: 'Surgical errors, misdiagnoses, birth injuries, pharmacy errors.', ES: 'Errores quirúrgicos, diagnósticos erróneos, lesiones de nacimiento, errores de farmacia.' }, 
    example: { EN: 'A surgeon leaves a sponge inside a patient. A medical malpractice lawyer sues the hospital for negligence.', ES: 'Un cirujano deja una esponja dentro de un paciente. Un abogado demanda al hospital por negligencia.' },
    icon: HeartPulse, colorClass: 'bg-rose-100 text-rose-800' 
  },
  { 
    id: 'employment', 
    title: { EN: 'Employment Lawyer', ES: 'Abogado Laboral' }, 
    handles: { EN: 'Workplace discrimination, wrongful termination, wage disputes, harassment.', ES: 'Discriminación laboral, despido injustificado, disputas salariales, acoso.' }, 
    example: { EN: "Maria hasn't been paid for her overtime hours. An employment lawyer files a claim against her boss.", ES: 'A María no le han pagado sus horas extras. Un abogado laboral presenta un reclamo contra su jefe.' },
    icon: ShieldCheck, colorClass: 'bg-emerald-100 text-emerald-800' 
  },
  { 
    id: 'immigration', 
    title: { EN: 'Immigration Lawyer', ES: 'Abogado de Inmigración' }, 
    handles: { EN: 'Visas, green cards, citizenship applications, deportation defense.', ES: 'Visas, tarjetas verdes, solicitudes de ciudadanía, defensa contra la deportación.' }, 
    example: { EN: 'Carlos wants to bring his spouse to the US. An immigration lawyer helps navigate the complex visa process.', ES: 'Carlos quiere traer a su esposa a los EE. UU. Un abogado lo ayuda a navegar el proceso de la visa.' },
    icon: Globe, colorClass: 'bg-sky-100 text-sky-800' 
  },
  { 
    id: 'estate', 
    title: { EN: 'Real Estate Lawyer', ES: 'Abogado de Bienes Raíces' }, 
    handles: { EN: 'Property sales, lease agreements, zoning laws, landlord-tenant disputes.', ES: 'Ventas de propiedades, contratos de arrendamiento, leyes de zonificación y disputas.' }, 
    example: { EN: 'The Smiths are buying their first home. A real estate lawyer reviews the closing documents for hidden liens.', ES: 'Los Smith están comprando su primera casa. Un abogado de bienes raíces revisa los documentos de cierre.' },
    icon: Home, colorClass: 'bg-[#6cf8bb] text-[#002113]' 
  },
  { 
    id: 'tax', 
    title: { EN: 'Tax Lawyer', ES: 'Abogado Fiscal' }, 
    handles: { EN: 'IRS audits, tax evasion defense, corporate tax planning, resolving back taxes.', ES: 'Auditorías del IRS, defensa contra evasión fiscal, planificación fiscal y resolución de impuestos.' }, 
    example: { EN: "A small business is being audited by the IRS. A tax lawyer ensures they don't overpay in penalties.", ES: 'Una pequeña empresa es auditada por el IRS. Un abogado fiscal asegura que no paguen multas excesivas.' },
    icon: Banknote, colorClass: 'bg-green-100 text-green-700' 
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
        <AnimatePresence>
          {visibleAreas.map((area, index) => (
            <motion.a
              key={area.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ 
                duration: 0.3,
                delay: showAll ? (index * 0.03) : 0
              }}
              href={`#${area.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(area.id);
              }}
              className="group flex items-center justify-between py-6 border-b border-outline-variant hover:bg-white/50 md:hover:px-4 md:-mx-4 rounded-xl transition-all active:scale-[0.99]"
            >
              <div className="flex items-start md:items-center space-x-4 md:space-x-5">
                <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl ${area.colorClass} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <area.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <div className="flex-1">
                  <h3 className="font-headline text-lg md:text-xl font-bold text-on-surface">{area.title[lang]}</h3>
                  
                  <div className="grid transition-all duration-300 ease-in-out grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100">
                    <div className="overflow-hidden">
                      <div className="pt-2 flex flex-col gap-1.5">
                        {(area as any).handles && (
                          <div className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
                            <span className="font-bold text-primary mr-1">{lang === 'EN' ? 'Handles:' : 'Atiende:'}</span>
                            {(area as any).handles[lang]}
                          </div>
                        )}
                        
                        {(area as any).example && (
                          <div className="text-xs md:text-sm text-on-surface-variant italic leading-relaxed">
                            <span className="font-bold text-secondary mr-1">{lang === 'EN' ? 'Example:' : 'Ejemplo:'}</span>
                            {(area as any).example[lang]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
