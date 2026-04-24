import { X, Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight, User, Mail, Phone, CreditCard, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Language } from '../translations';

interface BookNowModalProps {
  lawyer: {
    id: string;
    name: string;
    area: string;
    image?: string;
  };
  onClose: () => void;
  lang: Language;
}

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

const consultationTypes = [
  { id: 'initial', labelEN: 'Initial Consult', labelES: 'Consulta Inicial', price: 100 },
  { id: 'legal_advice', labelEN: 'Legal Advice', labelES: 'Asesoría Legal', price: 150 },
  { id: 'case_review', labelEN: 'Case Review', labelES: 'Revisión de Caso', price: 200 },
];

export default function BookNowModal({ lawyer, onClose, lang }: BookNowModalProps) {
  const isEN = lang === 'EN';
  const today = new Date();
  const [step, setStep] = useState(1); // 1=Details, 2=Date/Time, 3=Review
  const [selectedType, setSelectedType] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60 minutes');
  const [booked, setBooked] = useState(false);

  const selectedTypeDef = consultationTypes.find(c => c.id === selectedType);
  const price = selectedTypeDef?.price || 100;

  const handleConfirm = () => {
    setBooked(true);
  };

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
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-primary/5 px-6 pt-6 pb-4 border-b border-outline-variant/30 flex-shrink-0 relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container transition-colors">
              <X className="w-5 h-5 text-outline" />
            </button>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-headline font-bold text-on-surface text-lg">{isEN ? 'Professional Information' : 'Información Profesional'}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm">
                  {isEN 
                    ? `This webpage allows you to schedule an appointment with lawyer ${lawyer.name}. A link has been sent to you to complete the appointment scheduling process.`
                    : `Esta página le permite programar una cita con el abogado ${lawyer.name}. Se le ha enviado un enlace para completar el proceso.`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {lawyer.image ? (
                  <img src={lawyer.image} alt={lawyer.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-white" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-sm">
                    {lawyer.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-on-surface">Lawyer {lawyer.name}</p>
                  <p className="text-xs text-primary font-bold uppercase tracking-wide">Law Office of {lawyer.name} PLLC</p>
                  <p className="text-[10px] text-on-surface-variant mt-1 opacity-70">603 E Saint Charles St. Brownsville, Tx 78520</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {booked ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface">{isEN ? 'Appointment Sent!' : '¡Cita Enviada!'}</h3>
                <p className="text-sm text-on-surface-variant">{isEN ? 'Please check your email to complete the confirmation.' : 'Por favor revise su correo para completar la confirmación.'}</p>
                <button onClick={onClose} className="w-full py-3 bg-primary text-white rounded-xl font-bold mt-6">{isEN ? 'Close' : 'Cerrar'}</button>
              </div>
            ) : (
              <div className="p-6 space-y-8">
                {/* Step 1: Appointment Details */}
                <section className={`space-y-4 transition-opacity ${step === 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
                    <h4 className="font-headline font-bold text-on-surface">{isEN ? 'Appointment Details' : 'Detalles de la Cita'}</h4>
                  </div>
                  
                  {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-outline uppercase tracking-wider">{isEN ? 'Appointment Type *' : 'Tipo de Cita *'}</label>
                        <select 
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full px-4 py-3 bg-surface-container/40 border border-outline-variant/40 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">{isEN ? 'Select an appointment type' : 'Seleccione un tipo de cita'}</option>
                          {consultationTypes.map(t => (
                            <option key={t.id} value={t.id}>{isEN ? t.labelEN : t.labelES}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-outline uppercase tracking-wider">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/50" />
                          <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={isEN ? 'Enter your email' : 'Ingrese su correo'}
                            className="w-full pl-10 pr-4 py-3 bg-surface-container/40 border border-outline-variant/40 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <p className="text-[10px] text-on-surface-variant opacity-60">
                          {isEN ? 'Email with which you were registered' : 'Correo con el que fue registrado'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-outline uppercase tracking-wider">{isEN ? 'Phone' : 'Teléfono'}</label>
                        <div className="flex gap-2">
                          <div className="w-20 px-3 py-3 bg-surface-container/20 border border-outline-variant/40 rounded-xl text-sm flex items-center justify-center gap-1">
                            🇺🇸 +1
                          </div>
                          <input 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={isEN ? 'Enter phone number' : 'Ingrese su teléfono'}
                            className="flex-1 px-4 py-3 bg-surface-container/40 border border-outline-variant/40 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setStep(2)}
                        disabled={!selectedType || !email}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                      >
                        {isEN ? 'Next Step' : 'Siguiente Paso'}
                      </button>
                    </div>
                  )}
                </section>

                {/* Step 2: Select Date and Time */}
                <section className={`space-y-4 transition-opacity ${step === 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">2</div>
                    <h4 className="font-headline font-bold text-on-surface">{isEN ? 'Select Date and Time' : 'Seleccionar Fecha y Hora'}</h4>
                  </div>

                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 bg-surface-container/20 rounded-2xl border border-outline-variant/30">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-bold text-sm uppercase tracking-widest text-primary">APR 2026</h5>
                          <div className="flex gap-1">
                            <button className="p-1.5 rounded-lg hover:bg-white"><ChevronLeft size={16} /></button>
                            <button className="p-1.5 rounded-lg hover:bg-white"><ChevronRight size={16} /></button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-bold text-outline">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {Array.from({length: 30}).map((_, i) => (
                            <button 
                              key={i}
                              onClick={() => setSelectedDay(i + 1)}
                              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all ${selectedDay === i + 1 ? 'bg-primary text-white' : 'hover:bg-white'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-outline uppercase tracking-wider">{isEN ? 'Select Duration' : 'Seleccionar Duración'}</label>
                          <select 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-4 py-3 bg-surface-container/40 border border-outline-variant/40 rounded-xl text-sm outline-none"
                          >
                            <option>30 minutes</option>
                            <option>1 hour</option>
                            <option>1.5 hours</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-outline uppercase tracking-wider">{isEN ? 'Available Hours' : 'Horas Disponibles'}</label>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map(t => (
                              <button 
                                key={t}
                                onClick={() => setSelectedTime(t)}
                                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all ${selectedTime === t ? 'bg-primary border-primary text-white' : 'bg-white border-outline-variant/40 text-on-surface-variant hover:border-primary/40'}`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold">{isEN ? 'Back' : 'Atrás'}</button>
                        <button onClick={() => setStep(3)} disabled={!selectedDay || !selectedTime} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-md disabled:opacity-50">{isEN ? 'Next Step' : 'Siguiente Paso'}</button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Step 3: Review and Confirm */}
                <section className={`space-y-4 pb-4 transition-opacity ${step === 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">3</div>
                    <h4 className="font-headline font-bold text-on-surface">{isEN ? 'Review and Confirm' : 'Revisar y Confirmar'}</h4>
                  </div>

                  {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-outline uppercase tracking-widest">{isEN ? 'Consultation Details' : 'Detalles de la Consulta'}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-on-surface-variant">Type:</span> <span className="font-bold">{selectedTypeDef ? (isEN ? selectedTypeDef.labelEN : selectedTypeDef.labelES) : 'Initial'}</span></div>
                            <div className="flex justify-between"><span className="text-on-surface-variant">Date:</span> <span className="font-bold">Apr {selectedDay}, 2026</span></div>
                            <div className="flex justify-between"><span className="text-on-surface-variant">Time:</span> <span className="font-bold">{selectedTime}</span></div>
                            <div className="flex justify-between"><span className="text-on-surface-variant">Duration:</span> <span className="font-bold">{duration}</span></div>
                          </div>
                        </div>

                        <div className="space-y-3 border-t border-dashed border-outline-variant/40 pt-4">
                          <h5 className="text-xs font-bold text-outline uppercase tracking-widest">{isEN ? 'Billing Details' : 'Detalles de Facturación'}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-on-surface-variant">Balance Due:</span> <span className="font-bold">${price}.00</span></div>
                            <div className="flex justify-between"><span className="text-on-surface-variant">Tax (0%):</span> <span className="font-bold">$0.00</span></div>
                            <div className="flex justify-between text-base pt-2 border-t border-outline-variant/10">
                              <span className="font-headline font-bold">Balance Total:</span> 
                              <span className="font-headline font-bold text-primary">${price}.00</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 italic leading-relaxed">
                          * {isEN ? 'Please read consultation guidelines before booking. Do not call the office regarding consultations.' : 'Por favor lea las pautas antes de reservar. No llame a la oficina con respecto a las consultas.'}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setStep(2)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold">{isEN ? 'Back' : 'Atrás'}</button>
                        <button onClick={handleConfirm} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">{isEN ? 'Confirm' : 'Confirmar'}</button>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

