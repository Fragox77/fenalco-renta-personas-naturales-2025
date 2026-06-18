import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { id: 'learning', label: 'Programa' },
  { id: 'benefits', label: 'Beneficios' },
  { id: 'speaker', label: 'Docente' },
  { id: 'pricing', label: 'Inversión' },
];

export default function Nav() {
  const [isCompact, setIsCompact] = useState(false);
  const [activeSection, setActiveSection] = useState('learning');
  const [isIndicatorMoving, setIsIndicatorMoving] = useState(false);
  const [trailDirection, setTrailDirection] = useState('trail-right');
  const navRef = useRef(null);
  const linkRefs = useRef({});
  const previousLeftRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateActiveSection = () => {
      const marker = window.scrollY + window.innerHeight * 0.3;
      let current = NAV_LINKS[0].id;

      NAV_LINKS.forEach(({ id }) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) current = id;
      });

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      const nav = navRef.current;
      const activeLink = linkRefs.current[activeSection];
      if (!nav || !activeLink) return;

      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const nextLeft = linkRect.left - navRect.left;

      if (previousLeftRef.current !== null && Math.abs(nextLeft - previousLeftRef.current) > 1) {
        setTrailDirection(nextLeft > previousLeftRef.current ? 'trail-right' : 'trail-left');
      }
      previousLeftRef.current = nextLeft;

      setIndicatorStyle({
        left: nextLeft,
        width: linkRect.width,
        opacity: 1,
      });
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeSection, isCompact]);

  useEffect(() => {
    setIsIndicatorMoving(true);
    const timer = setTimeout(() => setIsIndicatorMoving(false), 320);
    return () => clearTimeout(timer);
  }, [activeSection]);

  return (
    <header className={`nav-shell sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${isCompact ? 'nav-shell-compact' : ''}`}>
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-300 ${isCompact ? 'h-[64px] md:h-[72px]' : 'h-[76px] md:h-[84px]'}`}>
        <a href="#top" className="flex items-center">
          <img
            src="/logos/fenalco-santander-horizontal-cb.svg"
            alt="Fenalco Santander"
            className={`w-auto transition-all duration-300 ${isCompact ? 'h-9 md:h-10' : 'h-10 md:h-12'}`}
          />
        </a>
        <nav ref={navRef} className="hidden md:flex items-center gap-8 text-[13px] text-white/70 relative">
          <span
            className={`nav-indicator ${trailDirection} ${isIndicatorMoving ? 'is-moving' : ''}`}
            aria-hidden
            style={{
              width: `${indicatorStyle.width}px`,
              transform: `translateX(${indicatorStyle.left}px)`,
              opacity: indicatorStyle.opacity,
            }}
          />
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`nav-link ${activeSection === link.id ? 'is-active' : ''}`}
              aria-current={activeSection === link.id ? 'location' : undefined}
              ref={(el) => {
                if (el) linkRefs.current[link.id] = el;
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="deadline hidden sm:inline-flex">
            <span className="pulse" />CIERRA 30 MAY
          </span>
          <a href="#/inscripcion" className="btn-cta !py-2.5 !px-4 !text-sm">
            Comprar
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
