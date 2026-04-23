import { Menu, Search } from 'lucide-react';

export default function TopBar({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-center">
      <div className="flex justify-between items-center w-full max-w-5xl px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="text-primary hover:bg-primary/5 transition-all rounded-full p-2 -ml-2 block md:hidden" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
          <button 
            onClick={onLogoClick}
            className="flex items-center h-8 bg-transparent border-none cursor-pointer p-0 group"
          >
            <img 
              src="/logo.png" 
              alt="Legal911" 
              className="h-full w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as any).style.display = 'none';
                const textEl = document.getElementById('topbar-logo-text');
                if (textEl) textEl.style.display = 'block';
              }}
            />
            <span 
              id="topbar-logo-text" 
              className="hidden font-headline font-extrabold tracking-tighter text-2xl text-primary"
            >
              Legal911
            </span>
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Discover', 'Specialties', 'Saved', 'Profile'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-on-surface-variant hover:text-primary font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button 
            className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-95"
            onClick={() => alert('Sign in coming soon!')}
          >
            Sign In
          </button>
          <button className="text-primary hover:bg-primary/5 transition-all rounded-full p-2 -mr-2" aria-label="Search">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
