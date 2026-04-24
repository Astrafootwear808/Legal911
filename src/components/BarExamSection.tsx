import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { Language, translations } from '../translations';
import { GraduationCap, RotateCcw, ExternalLink } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const BAR_EXAM_URLS: Record<string, string> = {
  AL: 'https://admissions.alabar.org/',
  AK: 'https://alaskabar.org/admissions/bar-exam/',
  AZ: 'https://www.azbaradmissions.org/',
  AR: 'https://www.arcourts.gov/administration/professional-programs/bar-admissions',
  CA: 'https://www.calbar.ca.gov/Admissions',
  CO: 'https://www.coloradosupremecourt.com/Future%20Lawyers/BarExamination.asp',
  CT: 'https://www.jud.ct.gov/cbec/',
  DE: 'https://courts.delaware.gov/bbe/',
  FL: 'https://www.floridabarexam.org/',
  GA: 'https://www.gabaradmissions.org/',
  HI: 'https://www.courts.state.hi.us/legal_references/bar_admissions',
  ID: 'https://isb.idaho.gov/admissions/',
  IL: 'https://www.ilbaradmissions.org/',
  IN: 'https://www.in.gov/courts/ace/',
  IA: 'https://www.iowacourts.gov/for-the-legal-profession/bar-admissions/',
  KS: 'https://www.kscourts.org/Legal-Profession/Bar-Admission',
  KY: 'https://www.kyoba.org/',
  LA: 'https://www.lascba.org/',
  ME: 'https://mainebarexaminers.org/',
  MD: 'https://www.mdcourts.gov/ble',
  MA: 'https://www.mass.gov/orgs/board-of-bar-examiners',
  MI: 'https://www.courts.michigan.gov/courts/supreme-court/ble/',
  MN: 'https://www.ble.mn.gov/',
  MS: 'https://courts.ms.gov/baradmissions/baradmissions.php',
  MO: 'https://www.mobjce.org/',
  MT: 'https://www.montanabar.org/',
  NE: 'https://supremecourt.nebraska.gov/legal-community/bar-admissions',
  NV: 'https://nvbar.org/admissions/',
  NH: 'https://www.courts.nh.gov/our-courts/supreme-court/committees/office-bar-admissions',
  NJ: 'https://www.njbarexams.org/',
  NM: 'https://nmexam.org/',
  NY: 'https://www.nybarexam.org/',
  NC: 'https://www.ncbarexam.org/',
  ND: 'https://www.ndcourts.gov/legal-resources/bar-admissions',
  OH: 'https://www.supremecourt.ohio.gov/AttySvcs/admissions/',
  OK: 'https://www.okbbe.com/',
  OR: 'https://www.osbar.org/admissions',
  PA: 'https://www.pabarexam.org/',
  RI: 'https://www.courts.ri.gov/Courts/SupremeCourt/BarAdmissions/Pages/default.aspx',
  SC: 'https://judicial.sc.gov/bar/',
  SD: 'https://ujs.sd.gov/Supreme_Court/Bar_Exam.aspx',
  TN: 'https://www.tnble.org/',
  TX: 'https://ble.texas.gov/',
  UT: 'https://admissions.utahbar.org/',
  VT: 'https://www.vermontjudiciary.org/attorneys/admission-vermont-bar',
  VA: 'https://barexam.virginia.gov/',
  WA: 'https://www.wsba.org/for-legal-professionals/join-the-legal-profession-in-wa/admissions',
  WV: 'http://www.courtswv.gov/legal-community/board-of-law-examiners.html',
  WI: 'https://www.wicourts.gov/services/attorney/bar.htm',
  WY: 'https://www.wyomingbar.org/for-lawyers/admissions/',
};

const FIPS_TO_ABBR: Record<string, string> = {
  "01": "AL", "02": "AK", "04": "AZ", "05": "AR", "06": "CA", "08": "CO", "09": "CT", "10": "DE", "12": "FL", "13": "GA",
  "15": "HI", "16": "ID", "17": "IL", "18": "IN", "19": "IA", "20": "KS", "21": "KY", "22": "LA", "23": "ME", "24": "MD",
  "25": "MA", "26": "MI", "27": "MN", "28": "MS", "29": "MO", "30": "MT", "31": "NE", "32": "NV", "33": "NH", "34": "NJ",
  "35": "NM", "36": "NY", "37": "NC", "38": "ND", "39": "OH", "40": "OK", "41": "OR", "42": "PA", "44": "RI", "45": "SC",
  "46": "SD", "47": "TN", "48": "TX", "49": "UT", "50": "VT", "51": "VA", "53": "WA", "54": "WV", "55": "WI", "56": "WY"
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
};

const MapFeatures = React.memo(({ hoveredState, zoomedState, setHoveredState, handleStateClick }: any) => {
  return (
    <>
      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const abbr = FIPS_TO_ABBR[geo.id];
            const isHovered = hoveredState === abbr;
            const isZoomed = zoomedState === abbr;

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onMouseEnter={() => setHoveredState(abbr)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleStateClick(geo);
                }}
                style={{
                  default: { 
                    fill: isZoomed ? "#3b82f6" : "#1e293b", 
                    stroke: "#FFFFFF", 
                    strokeWidth: 0.5, 
                    outline: "none",
                    transition: "all 250ms ease"
                  },
                  hover: { 
                    fill: "#2563eb", 
                    stroke: "#FFFFFF", 
                    strokeWidth: 1, 
                    outline: "none",
                    cursor: "pointer"
                  },
                  pressed: { 
                    fill: "#1d4ed8", 
                    outline: "none" 
                  },
                }}
              />
            );
          })
        }
      </Geographies>

      <Geographies geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const abbr = FIPS_TO_ABBR[geo.id];
            if (!abbr) return null;
            const centroid = geoCentroid(geo);
            const isFocused = hoveredState === abbr || zoomedState === abbr;
            
            const isSmallState = ['RI', 'DE', 'CT', 'MD', 'MA', 'NJ', 'NH', 'VT'].includes(abbr);
            const baseFontSize = isSmallState ? "8px" : "12px";
            const focusedFontSize = isSmallState ? "10px" : "15px";
            
            return (
              <Marker key={`label-${geo.rsmKey}`} coordinates={centroid as [number, number]}>
                <motion.text
                  textAnchor="middle"
                  dominantBaseline="central"
                  initial={false}
                  animate={{
                    fontSize: isFocused ? focusedFontSize : baseFontSize,
                    opacity: isFocused ? 1 : 0.8,
                    scale: isFocused ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="pointer-events-none fill-white select-none"
                  style={{ 
                    textShadow: "0 2px 5px rgba(0,0,0,1)",
                    fontWeight: 900,
                    fontFamily: "Inter, sans-serif"
                  }}
                >
                  {abbr}
                </motion.text>
              </Marker>
            );
          })
        }
      </Geographies>
    </>
  );
});

export default function BarExamSection({ lang, onZoomChange }: { lang: Language, onZoomChange?: (isZoomed: boolean) => void }) {
  const t = translations[lang];
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [zoomedState, setZoomedState] = useState<string | null>(null);
  const [position, setPosition] = useState({ coordinates: [-96, 37] as [number, number], zoom: 1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = React.useRef<any>(null);

  // Smoothly animate the map position
  const updateMapPosition = (newCoords: [number, number], newZoom: number) => {
    if (!newCoords || !Array.isArray(newCoords)) return;
    
    // Cancel previous animation if any
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const startCoords = position.coordinates || [-96, 37];
    const startZoom = position.zoom || 1;

    setIsAnimating(true);
    setHoveredState(null); // Clear tooltip to avoid rendering overhead

    animationRef.current = animate(0, 1, {
      duration: 0.8, // Slightly faster, 800ms
      ease: [0.32, 0.72, 0, 1], // Smooth custom cubic-bezier
      onUpdate: (latest) => {
        setPosition({
          coordinates: [
            startCoords[0] + (newCoords[0] - startCoords[0]) * latest,
            startCoords[1] + (newCoords[1] - startCoords[1]) * latest
          ] as [number, number],
          zoom: startZoom + (newZoom - startZoom) * latest
        });
      },
      onComplete: () => {
        animationRef.current = null;
        setIsAnimating(false);
      }
    });
  };

  const handleStateClick = (geo: any) => {
    const abbr = geo.id ? FIPS_TO_ABBR[geo.id] : null;
    if (!abbr) return;

    if (zoomedState === abbr) {
      const url = BAR_EXAM_URLS[abbr];
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } else {
      let centroid = geoCentroid(geo);
      if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
        // Fallback or skip if centroid is invalid
        return;
      }
      
      // Fine-tune centering for Alaska and Hawaii in geoAlbersUsa projection
      if (abbr === 'AK') centroid = [-120, 25];
      if (abbr === 'HI') centroid = [-107, 21];
      
      setZoomedState(abbr);
      updateMapPosition(centroid as [number, number], 4);
      onZoomChange?.(true);
    }
  };

  const handleResetZoom = () => {
    setZoomedState(null);
    updateMapPosition([-96, 37], 1);
    onZoomChange?.(false);
  };

  const handleManualSelect = (abbr: string) => {
    const url = BAR_EXAM_URLS[abbr];
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="px-6 py-16 md:py-24 space-y-12 bg-surface/10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" />
          {lang === 'EN' ? 'Career Resources' : 'Recursos de Carrera'}
        </div>
        <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface leading-tight">
          {t.barTitle}
        </h2>
        <p className="text-on-surface-variant text-lg font-medium">
          {t.barSubtitle}
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Mobile State Selector Fallback */}
        <div className="md:hidden space-y-2">
          <label htmlFor="state-select" className="text-sm font-semibold text-on-surface-variant ml-1">
            {lang === 'EN' ? 'Or select your state here:' : 'O selecciona tu estado aquí:'}
          </label>
          <select 
            id="state-select"
            className="w-full p-4 rounded-2xl bg-surface border border-outline-variant text-on-surface font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
            onChange={(e) => handleManualSelect(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>{lang === 'EN' ? 'Select a state...' : 'Seleccione un estado...'}</option>
            {Object.entries(BAR_EXAM_URLS)
              .sort((a, b) => (STATE_NAMES[a[0]] || '').localeCompare(STATE_NAMES[b[0]] || ''))
              .map(([abbr]) => (
                <option key={abbr} value={abbr}>{STATE_NAMES[abbr] || abbr}</option>
              ))}
          </select>
        </div>

        <div className="relative bg-white/40 backdrop-blur-md border border-outline-variant/30 rounded-[3rem] p-4 md:p-8 overflow-hidden group shadow-2xl shadow-black/[0.03]">
          {/* Zoom Controls Overlay */}
          <AnimatePresence>
            {(zoomedState || position.zoom > 1) && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-16 md:top-20 right-8 z-50 flex items-center"
              >
                <button
                  onClick={handleResetZoom}
                  className="group px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2 border border-white/10 active:scale-95"
                >
                  <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
                  {lang === 'EN' ? 'Back to Map' : 'Volver al Mapa'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Abstract Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />
          
          <div 
            className="relative w-full h-[300px] md:h-[600px] cursor-crosshair"
            onClick={handleResetZoom}
          >
            <ComposableMap 
              projection="geoAlbersUsa"
              className={`w-full h-full outline-none transition-opacity duration-300 ${isAnimating ? 'pointer-events-none' : ''}`}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={(pos) => {
                  // Only update if not currently animating to avoid loops
                  if (!animationRef.current) {
                    setPosition(pos);
                  }
                }}
              >
                <MapFeatures 
                  hoveredState={hoveredState}
                  zoomedState={zoomedState}
                  setHoveredState={setHoveredState}
                  handleStateClick={handleStateClick}
                />
              </ZoomableGroup>
            </ComposableMap>
            
            {/* Tooltip Overlay */}
            <AnimatePresence>
              {hoveredState && !zoomedState && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-xs py-2 px-4 rounded-full border border-white/20 shadow-2xl font-bold tracking-tight z-10 pointer-events-none"
                >
                  {STATE_NAMES[hoveredState]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zoom Action Card */}
            <AnimatePresence>
              {zoomedState && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/50 flex flex-col items-center min-w-[280px] md:min-w-[320px] max-w-[90%]"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface mb-1">{STATE_NAMES[zoomedState]}</h3>
                  <p className="text-sm md:text-base text-on-surface-variant font-medium mb-6 text-center">
                    {lang === 'EN' ? 'Official Bar Exam Directory' : 'Directorio Oficial del Examen de Abogacía'}
                  </p>
                  <button 
                    onClick={() => handleManualSelect(zoomedState)}
                    className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-sm md:text-base hover:bg-primary-container shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {lang === 'EN' ? 'Visit Official Website' : 'Visitar Sitio Oficial'}
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-12 pb-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-slate-900 border border-white/20" />
               <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                 {lang === 'EN' ? 'States' : 'Estados'}
               </span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]" />
               <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                 {lang === 'EN' ? 'Focus / Zoomed' : 'Foco / Zoom'}
               </span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-4 border-l-2 border-dashed border-primary/40 mr-1" />
               <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider italic">
                 {lang === 'EN' ? 'Click state to view directory' : 'Haz click en el estado para ver directorio'}
               </span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
