export default function CTA() {
  return (
    <section id="cta" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[28px] p-8 lg:p-14"
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
              <span className="deadline"><span className="pulse" />ÚLTIMOS DÍAS DE PREVENTA</span>
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
                Inscribirme ahora
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="https://wa.me/573102355262?text=Hola,%20me%20interesa%20el%20seminario%20Renta%20Personas%20Naturales%202025"
                 target="_blank" rel="noreferrer" className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.7.1.2 1.9 2.9 4.6 4.1 1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4zm-5.4 7.3c-1.7 0-3.4-.5-4.9-1.4l-.4-.2-3.6.9.9-3.5-.2-.4c-1-1.5-1.5-3.3-1.5-5.1 0-5.4 4.4-9.8 9.7-9.8 2.6 0 5 1 6.8 2.9 1.8 1.9 2.8 4.3 2.8 6.9 0 5.4-4.3 9.7-9.6 9.7zm8.3-18C18.2 1.6 15.2.3 12.1.3 5.5.3.1 5.7.1 12.3c0 2.1.6 4.2 1.6 6L0 24l5.8-1.5c1.7.9 3.7 1.4 5.7 1.4h0c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.4-8.5z" />
                </svg>
                Hablar por WhatsApp
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
