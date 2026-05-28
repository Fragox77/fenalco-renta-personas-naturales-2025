export default function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-fen-bg0/70 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg grid place-items-center text-white font-display font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #280071 0%, #4316C8 100%)', boxShadow: '0 6px 18px rgba(0,206,124,0.35)' }}>
            R
          </span>
          <span className="font-display font-bold text-[15px] tracking-tight">
            Renta<span className="text-fen-green">·</span>25
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-white/70">
          <a href="#learning" className="hover:text-white transition">Programa</a>
          <a href="#benefits" className="hover:text-white transition">Beneficios</a>
          <a href="#speaker" className="hover:text-white transition">Docente</a>
          <a href="#pricing" className="hover:text-white transition">Inversión</a>
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="deadline hidden sm:inline-flex">
            <span className="pulse" />CIERRA 30 MAY
          </span>
          <a href="#/inscripcion" className="btn-cta !py-2.5 !px-4 !text-sm">
            Inscribirme
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
