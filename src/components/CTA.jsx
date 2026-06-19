export default function CTA() {
  return (
    <section id="cta" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] p-8 lg:p-14 premium-card"
             style={{ background: 'linear-gradient(120deg, #280071 0%, #1A0049 60%, #0C2340 100%)',
                      border: '1px solid rgba(255,255,255,0.10)' }}>
          <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
          <div className="absolute pointer-events-none rounded-full blur-3xl"
               style={{ right: 0, bottom: 0, width: 500, height: 500,
                        background: 'radial-gradient(closest-side, rgba(0,206,124,0.5), transparent 70%)' }} />
          <div className="absolute pointer-events-none rounded-full blur-3xl"
               style={{ left: 0, top: 0, width: 300, height: 300,
                        background: 'radial-gradient(closest-side, rgba(32,213,196,0.3), transparent 70%)' }} />

          <div className="relative grid lg:grid-cols-[1.4fr_auto] gap-10 items-center">
            <div>
              <span className="deadline"><span className="pulse" />ÚLTIMOS CUPOS DISPONIBLES</span>
              <h2 className="h-display text-white mt-5"
                  style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
                Actualízate antes<br />del <span className="grad-text">vencimiento.</span>
              </h2>
              <p className="text-white/72 mt-5 max-w-xl leading-relaxed text-lg">
                02 de julio · 8 horas de inteligencia tributaria aplicada con
                Cesar Ánzola Aguilar. Modalidad presencial + online en Bucaramanga.
              </p>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <a href="#/inscripcion"
                 className="btn-cta !text-base !py-4 !px-7">
                Comprar ahora
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#/informacion" className="btn-ghost">
                Quiero más información
              </a>
              <div className="font-mono text-[11px] text-white/50 tracking-[0.1em] mt-1.5 lg:text-right">
                LILIBETH QUINTANILLA · +57 310 235 5262
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
