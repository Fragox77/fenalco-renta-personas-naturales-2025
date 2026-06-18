const PLANS = [
  { tag: 'Preventa',   label: 'Afiliado',         price: '380.000', desc: 'Hasta 29 de mayo',   highlight: true },
  { tag: 'Preventa',   label: 'Particular',       price: '400.000', desc: 'Hasta 29 de mayo' },
  { tag: 'Corporativo',label: 'Afiliado 3+',      price: '332.500', desc: 'Por persona' },
  { tag: 'Tarifa full',label: 'Desde 30 mayo',    price: '500.000', desc: 'Cupo regular', muted: true },
];

const INCLUDES = [
  'Taller práctico aplicado',
  'Análisis de casos reales',
  'Plantillas en Excel',
  'Material digital',
  'Networking empresarial',
  'Certificado Fenalco',
  'Coffee break',
  'Espacio Q&A ampliado',
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-28">
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ left: '50%', top: '40%', transform: 'translateX(-50%)', width: 900, height: 700,
                    background: 'radial-gradient(closest-side, rgba(40,0,113,0.4), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center gap-2.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-fen-teal shadow-[0_0_12px_#20D5C4]" />
            <span className="eyebrow">Modalidad & inversión</span>
          </div>
          <h2 className="h-display text-4xl lg:text-[52px] text-white mt-4">
            Preventa abierta hasta el<br /><span className="grad-text">30 de mayo.</span>
          </h2>
          <p className="text-white/70 mt-5 leading-relaxed">
            Formación exenta de IVA y 100% deducible del impuesto de renta. Cupos limitados.
          </p>
        </div>

        {/* Modality cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="glass-hi p-6 flex gap-5 premium-card">
            <div className="w-12 h-12 rounded-2xl grid place-items-center shrink-0"
                 style={{ background: 'rgba(0,206,124,0.10)', border: '1px solid rgba(0,206,124,0.30)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 17l7-13 7 13H3z" stroke="#00CE7C" strokeWidth="1.6" fill="none" strokeLinejoin="round" /><circle cx="10" cy="12" r="1.5" fill="#00CE7C" /></svg>
            </div>
            <div className="flex-1">
              <div className="font-mono text-[11px] text-fen-green tracking-[0.14em] card-copy">PRESENCIAL</div>
              <div className="font-display font-bold text-xl text-white mt-1 card-copy">Bucaramanga · sede Fenalco</div>
              <div className="text-sm text-white/65 mt-1 card-copy">Cra. 20 #36-49 · Coffee break + networking</div>
              <div className="font-mono text-[12px] text-white/45 tracking-[0.08em] mt-2 card-copy">02 JUL · 08:00 — 17:00</div>
            </div>
          </div>
          <div className="glass-hi p-6 flex gap-5 premium-card">
            <div className="w-12 h-12 rounded-2xl grid place-items-center shrink-0"
                 style={{ background: 'rgba(32,213,196,0.10)', border: '1px solid rgba(32,213,196,0.30)' }}>
              <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2.5" y="4" width="15" height="10" rx="1.5" stroke="#20D5C4" strokeWidth="1.6" fill="none" /><path d="M7 17h6M10 14v3" stroke="#20D5C4" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </div>
            <div className="flex-1">
              <div className="font-mono text-[11px] text-fen-teal tracking-[0.14em] card-copy">ONLINE EN VIVO</div>
              <div className="font-display font-bold text-xl text-white mt-1 card-copy">Desde cualquier ciudad</div>
              <div className="text-sm text-white/65 mt-1 card-copy">Espacio Q&amp;A ampliado · grabación disponible</div>
              <div className="font-mono text-[12px] text-white/45 tracking-[0.08em] mt-2 card-copy">02 JUL · 08:00 — 17:00</div>
            </div>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => (
            <div key={p.label} className="p-6 rounded-3xl flex flex-col gap-2.5 premium-card"
                 style={{
                   background: p.highlight
                     ? 'linear-gradient(180deg, rgba(0,206,124,0.18), rgba(0,206,124,0.06))'
                     : 'rgba(255,255,255,0.04)',
                   border: p.highlight
                     ? '1px solid rgba(0,206,124,0.45)'
                     : '1px solid rgba(255,255,255,0.10)',
                   opacity: p.muted ? 0.55 : 1,
                   boxShadow: p.highlight ? '0 30px 60px -20px rgba(0,206,124,0.35)' : 'none',
                 }}>
              <div className="flex justify-between items-center">
                <span className={`font-mono text-[11px] tracking-[0.14em] ${p.highlight ? 'text-fen-green' : 'text-white/55'}`}>{p.tag}</span>
                {p.highlight && <span className="badge green">Recomendado</span>}
              </div>
              <div className="font-display font-semibold text-white text-[17px] card-copy">{p.label}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-white/55 text-base">$</span>
                <span className={`font-display font-extrabold tracking-tightest leading-none card-copy ${p.highlight ? 'text-fen-green' : 'text-white'}`}
                      style={{ fontSize: 44 }}>{p.price}</span>
              </div>
              <div className="text-xs text-white/60 card-copy">{p.desc}</div>
              <div className="flex-1" />
              {!p.muted && (
                <a href="#/inscripcion"
                   className={p.highlight ? 'btn-cta !text-sm !py-3' : 'btn-ghost !text-sm !py-3'}>
                  {p.highlight ? 'Comprar ahora' : 'Comprar'}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>

        {/* What's included */}
        <div className="glass mt-8 p-6 lg:p-8 premium-card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
            <div>
              <span className="badge green"><span className="dot" />Incluye</span>
              <div className="font-display font-bold text-xl text-white mt-3 card-copy">Todo lo que necesitas para aplicar de inmediato.</div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="badge teal">100% deducible</span>
              <span className="badge">Sin IVA</span>
              <span className="badge">Factura corporativa</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {INCLUDES.map(t => (
              <div key={t} className="flex items-center gap-2.5 text-[13.5px] text-white/85">
                <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
                  <circle cx="8" cy="8" r="7.5" fill="rgba(0,206,124,0.15)" stroke="#00CE7C" />
                  <path d="M5 8l2 2 4-4" stroke="#00CE7C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
