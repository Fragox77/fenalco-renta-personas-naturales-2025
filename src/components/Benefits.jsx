const BENEFITS = [
  { n: '01', t: 'Actualización clave', d: 'Estado del arte normativo: últimas reformas y decretos reglamentarios DIAN.',
    icon: <path d="M3 11l3-5 3 3 4-6" stroke="#00CE7C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  { n: '02', t: 'Cumplimiento DIAN', d: 'Reducción medida del riesgo de inconsistencias y sanciones tras el taller.',
    icon: <path d="M8 2L3 4v5c0 3.4 2.2 6 5 7 2.8-1 5-3.6 5-7V4l-5-2z" stroke="#00CE7C" strokeWidth="1.4" fill="none" /> },
  { n: '03', t: 'Casos reales', d: 'Plantillas Excel y ejercicios prácticos sobre el formulario 210.',
    icon: <><rect x="3" y="2" width="10" height="12" rx="1.4" stroke="#00CE7C" strokeWidth="1.4" fill="none" /><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="#00CE7C" strokeWidth="1.2" /></> },
  { n: '04', t: 'Régimen cedular', d: 'General, pensiones, dividendos y participaciones: paso a paso.',
    icon: <path d="M2 13l3-3 3 2 5-7" stroke="#00CE7C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
  { n: '05', t: 'Renta presuntiva', d: 'Comparación patrimonial y sus efectos legales sobre el contribuyente.',
    icon: <><path d="M8 2v12M3 13h10M5 6.5L8 4l3 2.5" stroke="#00CE7C" strokeWidth="1.4" fill="none" strokeLinecap="round" /></> },
  { n: '06', t: 'Certificación', d: 'Certificado Fenalco Santander, networking empresarial y material digital.',
    icon: <><circle cx="8" cy="6" r="3.5" stroke="#00CE7C" strokeWidth="1.4" fill="none" /><path d="M5.5 8.5L4 14l4-2 4 2-1.5-5.5" stroke="#00CE7C" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></> },
];

export default function Benefits() {
  return (
    <section id="benefits" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10 lg:mb-14">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fen-teal shadow-[0_0_12px_#20D5C4]" />
              <span className="eyebrow">Beneficios</span>
            </div>
            <h2 className="h-display text-4xl lg:text-[52px] text-white mt-4">
              Lo que te llevas el 02 de julio.
            </h2>
          </div>
          <span className="chip self-start lg:self-end">06 ejes · valor aplicado</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BENEFITS.map(b => (
            <div key={b.n} className="glass-hi p-6 flex flex-col gap-3 premium-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-fen-teal tracking-[0.16em]">{b.n}</span>
                <div className="w-9 h-9 rounded-xl grid place-items-center"
                     style={{ background: 'rgba(0,206,124,0.10)', border: '1px solid rgba(0,206,124,0.25)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16">{b.icon}</svg>
                </div>
              </div>
              <div className="font-display font-bold text-[22px] text-white tracking-tight card-copy">{b.t}</div>
              <p className="text-[13.5px] text-white/70 leading-relaxed m-0 card-copy">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
