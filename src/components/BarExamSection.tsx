import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'motion/react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { Language, translations } from '../translations';
import { GraduationCap, RotateCcw, ExternalLink } from 'lucide-react';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const BAR_EXAM_URLS: Record<string, string> = {
  AL: 'https://www.alabar.org/member-search/',
  AK: 'https://alaskabar.org/for-the-public/member-directory/',
  AZ: 'https://www.azbar.org/for-the-public/find-a-lawyer/',
  AR: 'https://portal.arkansasbar.com/Directory/Individual',
  CA: 'https://apps.calbar.ca.gov/members/ls_search.aspx',
  CO: 'https://www.coloradosupremecourt.com/Search/AttSearch.asp',
  CT: 'https://www.jud2.ct.gov/atty_reg/',
  DE: 'https://www.dsba.org/resources/find-a-lawyer/',
  FL: 'https://www.floridabar.org/directories/find-mbr/',
  GA: 'https://www.gabar.org/memberdirectory/index.cfm',
  HI: 'https://www.hsba.org/HSBA/Directory/Member_Directory.aspx',
  ID: 'https://isb.idaho.gov/member-search/',
  IL: 'https://www.iardc.org/LawyerSearch',
  IN: 'https://courtapps.in.gov/roll-of-attorneys',
  IA: 'https://www.iowacourts.gov/for-the-legal-profession/bar-admissions/member-search/',
  KS: 'https://www.kscourts.org/Legal-Profession/Attorney-Search',
  KY: 'https://www.kybar.org/search/custom.asp?id=2947',
  LA: 'https://www.lsba.org/Public/MembershipDirectory.aspx',
  ME: 'https://mainebarexaminers.org/find-a-lawyer/',
  MD: 'https://www.courts.state.md.us/attyreg/attysearch',
  MA: 'https://massbbo.org/search/attorney',
  MI: 'https://zeekbee.com/SBM/MemberSearch',
  MN: 'https://www.mncourts.gov/Find-a-Lawyer.aspx',
  MS: 'https://www.msbar.org/for-the-public/lawyer-directory/',
  MO: 'https://www.mobar.org/ForthePublic/DirectoryofLawyers.aspx',
  MT: 'https://www.montanabar.org/Member-Directory',
  NE: 'https://supremecourt.nebraska.gov/legal-community/lawyer-search',
  NV: 'https://nvbar.org/find-a-lawyer/',
  NH: 'https://www.nhbar.org/find-a-lawyer/',
  NJ: 'https://www.njcourts.gov/attorneys/attorney-search',
  NM: 'https://www.sbnm.org/For-the-Public/Find-a-Lawyer',
  NY: 'https://iapps.courts.state.ny.us/attorneyservices/search',
  NC: 'https://www.ncbar.gov/for-the-public/find-a-lawyer/',
  ND: 'https://www.ndcourts.gov/legal-resources/bar-admissions/member-search',
  OH: 'https://www.supremecourt.ohio.gov/AttySvcs/AttyReg/Public_Search',
  OK: 'https://www.okbar.org/findalawyer/',
  OR: 'https://www.osbar.org/members/membersearch.asp',
  PA: 'https://www.padisciplinaryboard.org/for-the-public/find-attorney',
  RI: 'https://www.courts.ri.gov/Courts/SupremeCourt/BarAdmissions/Pages/Find-A-Lawyer.aspx',
  SC: 'https://www.scbar.org/public/get-legal-help/find-a-lawyer/',
  SD: 'https://www.statebarofsouthdakota.com/find-a-lawyer',
  TN: 'https://www.tbpr.org/for-the-public/find-an-attorney',
  TX: 'https://www.texasbar.com/findalawyer',
  UT: 'https://admissions.utahbar.org/directory',
  VT: 'https://www.vermontjudiciary.org/attorneys/attorney-licensing/attorney-search',
  VA: 'https://www.vsb.org/site/main/member-resources/member-search',
  WA: 'https://www.wsba.org/for-legal-professionals/member-directory',
  WV: 'https://wvbar.org/find-a-lawyer/',
  WI: 'https://www.wicourts.gov/services/attorney/status.htm',
  WY: 'https://www.wyomingbar.org/for-lawyers/admissions/member-search/',
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-[60]"
              >
                <button
                  onClick={handleResetZoom}
                  className="group px-6 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white font-bold text-xs shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2 border border-white/20 active:scale-95 whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 transition-transform group-hover:-rotate-90" />
                  {lang === 'EN' ? 'Back to Full Map' : 'Volver al Mapa Completo'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Abstract Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[120px] pointer-events-none" />
          
          <div 
            className="relative w-full h-[350px] md:h-[600px] cursor-crosshair rounded-[2.5rem] overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleResetZoom();
            }}
          >
            <ComposableMap 
              projection="geoAlbersUsa"
              className={`w-full h-full outline-none transition-opacity duration-300 ${isAnimating ? 'opacity-80 pointer-events-none' : 'opacity-100'}`}
            >
              <ZoomableGroup
                zoom={position.zoom}
                center={position.coordinates}
                onMoveEnd={(pos) => {
                  if (!animationRef.current) setPosition(pos);
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white text-[10px] md:text-xs py-2 px-5 rounded-full border border-white/20 shadow-2xl font-bold tracking-widest z-10 pointer-events-none uppercase"
                >
                  {STATE_NAMES[hoveredState]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zoom Action Card */}
            <AnimatePresence>
              {zoomedState && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/50 flex flex-col items-center min-w-[280px] md:min-w-[340px] max-w-[92%]"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary transform -rotate-6">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="font-headline text-2xl md:text-3xl font-extrabold text-on-surface mb-1 text-center">{STATE_NAMES[zoomedState]}</h3>
                  <p className="text-[11px] md:text-sm text-on-surface-variant font-bold uppercase tracking-widest mb-6 text-center opacity-60">
                    {lang === 'EN' ? 'Official Bar Directory' : 'Directorio del Colegio'}
                  </p>
                  <button 
                    onClick={() => handleManualSelect(zoomedState)}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm md:text-base hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {lang === 'EN' ? 'Visit Directory' : 'Visitar Directorio'}
                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-16 pb-2 border-t border-outline-variant/20 pt-8">
             <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded-lg bg-slate-900 border border-white/20" />
               <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                 {lang === 'EN' ? 'All States' : 'Estados'}
               </span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-4 h-4 rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
               <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                 {lang === 'EN' ? 'Selected' : 'Seleccionado'}
               </span>
             </div>
             <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">
               <span className="text-[9px] md:text-[11px] font-bold text-primary uppercase tracking-tighter italic">
                 {lang === 'EN' ? 'Click state to explore' : 'Click en estado para explorar'}
               </span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
