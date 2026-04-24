import { ArrowLeft, Camera, Edit3, Star, Scale, Clock, MapPin, Phone, Mail, Shield, ChevronRight, BookOpen, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Language } from '../translations';

interface ProfileSectionProps {
  onBack: () => void;
  lang: Language;
}

const mockAppointments = [
  {
    id: '1',
    lawyerName: 'Sarah Jenkins',
    area: 'Family Law',
    date: 'May 5, 2026',
    time: '10:00 AM',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    lawyerName: 'Michael Chen',
    area: 'Corporate Law',
    date: 'Apr 14, 2026',
    time: '2:30 PM',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  },
];

const getStats = (isEN: boolean) => [
  { label: isEN ? 'Consultations' : 'Consultas', value: '4', icon: BookOpen },
  { label: isEN ? 'Saved Lawyers' : 'Abogados Guardados', value: '2', icon: Scale },
];

export default function ProfileSection({ onBack, lang }: ProfileSectionProps) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.rivera@email.com');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [location, setLocation] = useState('New York, NY');

  const isEN = lang === 'EN';
  const stats = getStats(isEN);

  return (
    <div className="py-6 md:py-12 space-y-8 min-h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-primary/5 rounded-full text-primary transition-all active:scale-90"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="font-headline text-2xl md:text-3xl font-bold text-on-surface">
          {isEN ? 'My Profile' : 'Mi Perfil'}
        </h2>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-primary/90 to-primary rounded-3xl p-6 md:p-8 text-white overflow-hidden shadow-xl shadow-primary/25"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative flex items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg select-none">
              AR
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-headline text-xl md:text-2xl font-bold leading-tight">{name}</h3>
                <div className="flex items-center gap-1.5 mt-1 opacity-80">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-xl px-3 py-1.5 text-xs font-bold transition-all active:scale-95 flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEN ? 'Edit' : 'Editar'}
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-2 opacity-80">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{isEN ? 'Verified Account' : 'Cuenta Verificada'}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative flex items-center gap-0 mt-6 pt-5 border-t border-white/20">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex-1 flex flex-col items-center ${i < stats.length - 1 ? 'border-r border-white/20' : ''}`}>
              <stat.icon className="w-4 h-4 mb-1 opacity-70" />
              <span className="text-base md:text-lg font-bold leading-none">{stat.value}</span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-wider opacity-60 mt-1 text-center leading-tight px-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Edit Form */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border border-outline-variant/40 rounded-2xl p-5 space-y-4 shadow-sm"
        >
          <h4 className="font-headline font-bold text-on-surface">{isEN ? 'Edit Information' : 'Editar Información'}</h4>
          {[
            { label: isEN ? 'Full Name' : 'Nombre Completo', value: name, setter: setName, icon: Edit3 },
            { label: 'Email', value: email, setter: setEmail, icon: Mail },
            { label: isEN ? 'Phone' : 'Teléfono', value: phone, setter: setPhone, icon: Phone },
            { label: isEN ? 'Location' : 'Ubicación', value: location, setter: setLocation, icon: MapPin },
          ].map((field) => (
            <div key={field.label} className="relative">
              <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline/50" />
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.label}
                className="w-full pl-10 pr-4 py-3 bg-surface-container/40 border border-outline-variant/40 rounded-xl text-sm font-medium text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          ))}
          <button
            onClick={() => setEditMode(false)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 transition-all active:scale-95"
          >
            {isEN ? 'Save Changes' : 'Guardar Cambios'}
          </button>
        </motion.div>
      )}

      {/* Upcoming Appointments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold text-on-surface">{isEN ? 'My Appointments' : 'Mis Citas'}</h3>
          <button className="text-xs font-bold text-primary hover:underline">
            {isEN ? 'View All' : 'Ver Todas'}
          </button>
        </div>
        <div className="space-y-3">
          {mockAppointments.map((appt, index) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-outline-variant/40 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all group"
            >
              <img
                src={appt.image}
                alt={appt.lawyerName}
                className="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-headline font-bold text-on-surface text-sm truncate">{appt.lawyerName}</h4>
                  <span className={`flex-shrink-0 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    appt.status === 'upcoming'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-outline'
                  }`}>
                    {appt.status === 'upcoming' ? (isEN ? 'Upcoming' : 'Próxima') : (isEN ? 'Done' : 'Terminada')}
                  </span>
                </div>
                <p className="text-xs text-primary font-semibold mt-0.5">{appt.area}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{appt.time}</span>
                  <span className="font-medium">{appt.date}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline/40 flex-shrink-0 group-hover:text-primary transition-colors" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Account Settings */}
      <section className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-on-surface">{isEN ? 'Account' : 'Cuenta'}</h3>
        {[
          { icon: Shield, label: isEN ? 'Privacy & Security' : 'Privacidad y Seguridad', sub: isEN ? 'Manage your data' : 'Gestiona tus datos' },
          { icon: Bell, label: isEN ? 'Notifications' : 'Notificaciones', sub: isEN ? 'Manage alerts' : 'Gestionar alertas' },
        ].map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 bg-white border border-outline-variant/40 rounded-2xl p-4 hover:shadow-md text-left transition-all group"
          >
            <div className="w-10 h-10 bg-primary/[0.08] rounded-xl flex items-center justify-center text-primary">
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-on-surface">{item.label}</p>
              <p className="text-xs text-on-surface-variant">{item.sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-outline/40 group-hover:text-primary transition-colors" />
          </button>
        ))}

        <button className="w-full flex items-center gap-4 bg-red-50 border border-red-100 rounded-2xl p-4 hover:bg-red-100 text-left transition-all group">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500">
            <LogOut className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-red-600">{isEN ? 'Sign Out' : 'Cerrar Sesión'}</p>
          </div>
        </button>
      </section>
    </div>
  );
}

function Bell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
