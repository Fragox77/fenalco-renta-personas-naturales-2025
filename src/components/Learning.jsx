const TOPICS = [
  { tag: 'A', t: 'Tributación PN bajo Ley 2277/22', d: 'Cambios normativos, decretos reglamentarios y condiciones para residentes vs. no residentes.', h: '1.0h' },
  { tag: 'B', t: 'Determinación de la renta',        d: 'Sistema ordinario · régimen cedular general, pensiones, dividendos y participaciones.',     h: '1.5h' },
  { tag: 'C', t: 'Ganancias ocasionales',            d: 'Depuración y tarifas del impuesto complementario en Colombia.',                              h: '0.5h' },
  { tag: 'D', t: 'Renta por comparación patrimonial',d: 'Efectos en el derecho penal y descuentos tributarios aplicables.',                           h: '1.0h' },
  { tag: 'E', t: 'No residentes en Colombia',        d: 'Aspectos prácticos y generalidades para la declaración de no residentes.',                   h: '0.5h' },
  { tag: 'F', t: 'Patrimonio + activos exterior',    d: 'Impuesto al patrimonio 2025 · trazabilidad 2024 · información exógena DIAN.',                h: '1.5h' },
  { tag: 'G', t: 'Taller Formulario 210',            d: 'Plantilla guiada, casilla por casilla. Cierre del programa con caso integral.',              h: '2.0h', highlight: true },
];

export default function Learning() {
  return (
    <section id="learning" className="relative py-20 lg:py-28">
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ left: '20%', top: '40%', width: 700, height: 700,
                    background: 'radial-gradient(closest-side, rgba(40,0,113,0.45), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16">
        {/* Sticky left */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fen-teal shadow-[0_0_12px_#20D5C4]" />
            <span className="eyebrow">Qué aprenderás</span>
          </div>
          <h2 className="h-display text-4xl lg:text-[52px] text-white mt-4">
            7 módulos.<br />8 horas.<br />
            <span className="grad-text">Cero relleno.</span>
          </h2>
          <p className="text-white/70 mt-5 max-w-md leading-relaxed">
            Diseñado con enfoque ejecutivo. Cada bloque cierra con un ejercicio aplicado
            o una plantilla descargable lista para usar.
          </p>

          <div className="glass mt-6 p-5 flex items-center gap-4">
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="19" stroke="rgba(255,255,255,0.10)" strokeWidth="5" fill="none" />
              <circle cx="24" cy="24" r="19" stroke="#00CE7C" strokeWidth="5" fill="none"
                      strokeDasharray={`${0.92 * 2 * Math.PI * 19} ${2 * Math.PI * 19}`}
                      strokeLinecap="round" transform="rotate(-90 24 24)" />
              <text x="24" y="28" textAnchor="middle" className="font-display" fontWeight="700" fontSize="13" fill="#fff">92%</text>
            </svg>
            <div>
              <div className="font-display font-bold text-sm text-white">Aplicable inmediatamente</div>
              <div className="text-xs text-white/60">Encuesta post-taller 2024</div>
            </div>
          </div>
        </div>

        {/* Module list */}
        <div className="flex flex-col gap-3">
          {TOPICS.map(m => (
            <div key={m.tag}
                 className={m.highlight
                   ? 'p-5 lg:p-6 rounded-3xl grid items-center gap-4 lg:gap-6'
                   : 'glass p-5 lg:p-6 grid items-center gap-4 lg:gap-6'}
                 style={{
                   gridTemplateColumns: '48px 1fr auto',
                   ...(m.highlight && {
                     background: 'linear-gradient(120deg, rgba(0,206,124,0.16), rgba(32,213,196,0.06))',
                     border: '1px solid rgba(0,206,124,0.35)',
                   }),
                 }}>
              <div className="w-11 h-11 rounded-xl grid place-items-center font-display font-bold text-lg"
                   style={{
                     background: m.highlight ? '#00CE7C' : 'rgba(255,255,255,0.06)',
                     color: m.highlight ? '#04140B' : '#fff',
                   }}>
                {m.tag}
              </div>
              <div>
                <div className="font-display font-bold text-[17px] lg:text-[19px] text-white tracking-tight">{m.t}</div>
                <div className="text-[13px] text-white/65 mt-1 leading-snug">{m.d}</div>
              </div>
              <div className={`font-mono text-[12px] tracking-wide ${m.highlight ? 'text-fen-green' : 'text-white/50'}`}>{m.h}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
