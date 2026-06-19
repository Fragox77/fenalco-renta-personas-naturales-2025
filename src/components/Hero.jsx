import cesarPhoto from '../assets/cesar-anzola.png';

// Tiny inline sparkline for the floating dashboard card
function Sparkline({ width = 280, height = 56, color = '#00CE7C' }) {
  const pts = [4, 12, 9, 18, 14, 22, 19, 28, 24, 36, 30, 42, 38, 49, 46];
  const max = Math.max(...pts);
  const step = width / (pts.length - 1);
  const path = pts.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (v / max) * (height - 6) - 3}`).join(' ');
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  const gid = `gsp-${color.slice(1)}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Donut({ size = 64, value = 87, color = '#20D5C4', label = '87%' }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.10)" strokeWidth="6" fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="6" fill="none"
                strokeDasharray={`${(value / 100) * c} ${c}`} strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display font-bold text-white"
           style={{ fontSize: size * 0.22 }}>{label}</div>
    </div>
  );
}

function Form210Card() {
  const rows = [
    ['33', 'Total ingresos brutos', '$ 142.880.000'],
    ['41', 'Renta líquida cedular general', '$ 86.420.000'],
    ['67', 'Renta presuntiva', '$ 12.300.000'],
    ['98', 'Impuesto a cargo', '$ 14.205.000'],
  ];
  return (
    <div className="rounded-2xl p-4 font-mono text-[10px] text-white/70 premium-card"
         style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  border: '1px solid rgba(255,255,255,0.10)' }}>
      <div className="flex justify-between mb-2.5">
        <span className="text-fen-teal tracking-[0.12em] card-copy">DIAN · FORM. 210</span>
        <span className="card-copy">AÑO 2025</span>
      </div>
      {rows.map(([n, l, v], i) => (
        <div key={n} className="grid gap-2.5 py-2"
             style={{ gridTemplateColumns: '28px 1fr auto',
                      borderTop: i === 0 ? '1px solid rgba(255,255,255,0.10)' : '1px dashed rgba(255,255,255,0.08)' }}>
          <span className="text-white/40">{n}</span>
          <span className="font-body text-white/80 card-copy">{l}</span>
          <span className={`${i === 3 ? 'text-fen-green font-bold' : 'text-white'} card-copy`}>{v}</span>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
      {/* Glows */}
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ right: '-10%', top: '-20%', width: 700, height: 700,
                    background: 'radial-gradient(closest-side, rgba(40,0,113,0.7), transparent 70%)' }} />
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ left: '-15%', bottom: '-30%', width: 500, height: 500,
                    background: 'radial-gradient(closest-side, rgba(0,206,124,0.2), transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* LEFT */}
        <div className="flex flex-col gap-6 lg:gap-7">
          <div className="flex flex-wrap gap-2">
            <span className="badge green"><span className="dot" />Seminario · Año fiscal 2025</span>
            <span className="badge teal"><span className="dot" style={{ background: '#20D5C4', boxShadow: '0 0 12px #20D5C4' }} />Ley 2277 · DIAN</span>
          </div>

          <h1 className="h-display text-5xl sm:text-6xl lg:text-[88px] text-white hero-title">
            <span className="hero-type-line hero-type-line-1" style={{ '--chars': 7, '--duration': '1.05s', '--delay': '0.2s', '--final-width': '6.35ch' }}>La DIAN</span><br />
            <span className="hero-type-line hero-type-line-2" style={{ '--chars': 10, '--duration': '1.3s', '--delay': '1.35s', '--final-width': '9.15ch' }}>no perdona</span><br />
            <span className="grad-text hero-type-line hero-type-line-3" style={{ '--chars': 8, '--duration': '1.05s', '--delay': '2.75s', '--final-width': '6.05ch' }}>errores.</span>
          </h1>

          <p className="text-white/70 text-lg leading-relaxed max-w-xl">
            Actualízate antes de los vencimientos y evita errores en tu declaración de
            renta 2025. Formulario 210, régimen cedular y Ley 2277 — con casos reales,
            plantillas y certificado.
          </p>

          <div className="flex flex-wrap gap-3 mt-1">
            <a href="#/inscripcion" className="btn-cta">
              Comprar ahora
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#/informacion" className="btn-ghost">
              Quiero más información
            </a>
          </div>

          {/* attribute badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {['Actualización DIAN', 'Casos reales', 'Formulario 210', 'Presencial + Online', 'Certificado', '100% deducible']
              .map(b => <span key={b} className="badge">{b}</span>)}
          </div>

          {/* stat strip */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              ['02 · Julio', 'FECHA TALLER'],
              ['8h', 'INTENSIDAD'],
              ['$332K', 'DESDE · CORPORATIVO'],
              ['Cesar Ánzola', 'EXPERTO TRIBUTARISTA'],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display font-bold text-xl sm:text-[22px] text-white">
                  {v.includes('$') ? <>$<span className="text-fen-green">{v.slice(1)}</span></> : v}
                </div>
                <div className="font-mono text-[10px] text-white/50 tracking-[0.12em] mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Dashboard composition */}
        <div className="relative h-[520px] lg:h-[560px] hidden md:block">
          {/* conic glow */}
          <div className="absolute pointer-events-none"
               style={{ top: 40, right: -20, width: 480, height: 480, borderRadius: '50%',
                        background: 'conic-gradient(from 220deg, rgba(0,206,124,0), rgba(0,206,124,0.4), rgba(32,213,196,0.4), rgba(40,0,113,0), rgba(0,206,124,0))',
                        filter: 'blur(40px)', opacity: 0.55 }} />

          {/* portrait */}
          <div className="absolute right-0 top-0 w-[320px] lg:w-[340px] h-[460px] lg:h-[520px] z-10 rounded-3xl overflow-hidden speaker-portrait-shell"
               style={{ background: 'linear-gradient(180deg, #11304F, #07172B)',
                        boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.10)' }}>
            <img src={cesarPhoto} alt="Cesar Ánzola Aguilar" className="absolute inset-0 w-full h-full object-cover object-top speaker-portrait-img" />
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(5,11,22,0.94) 100%)' }} />
            <div className="absolute left-4 right-4 bottom-4 flex flex-col gap-1.5">
              <span className="badge green w-fit"><span className="dot" />Docente · Magíster Tributario</span>
              <div className="font-display font-bold text-[22px] text-white leading-tight">Cesar Ánzola Aguilar</div>
              <div className="text-xs text-white/65">Pontificia Javeriana · Sergio Arboleda</div>
            </div>
          </div>

          {/* dashboard card · top-left (clear of photo) */}
          <div className="glass-hi absolute left-0 top-6 w-[260px] p-4 z-20 hero-card-motion hero-card-motion-a premium-card" style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.6)' }}>
            <div className="flex justify-between mb-2">
              <span className="eyebrow !text-[10px]">Renta líquida cedular</span>
              <span className="chip">2025</span>
            </div>
            <div className="font-display font-bold text-[26px] tracking-tight text-white card-copy">$ 86.420.000</div>
            <div className="font-mono text-[11px] text-fen-green mb-2 card-copy">▲ 12.4% vs. AÑO 2024</div>
            <Sparkline width={228} height={48} />
          </div>

          {/* form 210 · bottom-left (clear of photo, no rotation) */}
          <div className="absolute left-0 top-[220px] w-[280px] z-20 hero-card-motion hero-card-motion-b">
            <Form210Card />
          </div>
        </div>

        {/* MOBILE portrait */}
        <div className="md:hidden relative rounded-3xl overflow-hidden h-[440px] speaker-portrait-shell"
             style={{ background: 'linear-gradient(180deg, #11304F, #07172B)' }}>
          <img src={cesarPhoto} alt="Cesar Ánzola Aguilar" className="absolute inset-0 w-full h-full object-cover object-top speaker-portrait-img" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(5,11,22,0.92))' }} />
          <div className="absolute left-4 bottom-4">
            <span className="badge green w-fit"><span className="dot" />Docente</span>
            <div className="font-display font-bold text-[20px] text-white mt-2">Cesar Ánzola Aguilar</div>
            <div className="text-xs text-white/65">Magíster Tributario · Conferencista nacional</div>
          </div>
        </div>
      </div>
    </section>
  );
}
