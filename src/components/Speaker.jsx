import cesarPhoto from '../assets/cesar-anzola.png';

export default function Speaker() {
  return (
    <section id="speaker" className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="glass-hi rounded-[28px] p-6 lg:p-10 grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12 items-center relative overflow-hidden premium-card">
          <div className="absolute pointer-events-none rounded-full blur-3xl"
               style={{ left: '-10%', top: '30%', width: 400, height: 400,
                        background: 'radial-gradient(closest-side, rgba(0,206,124,0.18), transparent 70%)' }} />

          {/* Portrait */}
          <div className="relative w-full lg:w-[320px] h-[380px] lg:h-[420px] rounded-3xl overflow-hidden speaker-portrait-shell"
               style={{ background: 'linear-gradient(180deg, #11304F, #07172B)' }}>
            <img src={cesarPhoto} alt="Cesar Ánzola Aguilar" className="absolute inset-0 w-full h-full object-cover object-top speaker-portrait-img" />
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(5,11,22,0.6))' }} />
          </div>

          {/* Bio */}
          <div className="relative">
            <span className="badge green"><span className="dot" />Experto Fenalco</span>

            <h2 className="h-display text-white mt-4 leading-none"
                style={{ fontSize: 'clamp(40px, 6vw, 64px)' }}>
              <span className="card-copy">Cesar Ánzola</span><br /><span className="card-copy">Aguilar</span>
            </h2>

            <p className="text-white/72 mt-5 leading-relaxed max-w-2xl card-copy">
              Magíster en Dirección y Gestión Tributaria. Contador Público. Especialista
              en Derecho Tributario, Aduanero y NIIF. Docente de la Pontificia
              Universidad Javeriana y la Universidad Sergio Arboleda. Consultor del
              sector real y conferencista nacional en temas tributarios y NIIF.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              <span className="badge teal">+12 años de cátedra</span>
              <span className="badge">NIIF</span>
              <span className="badge">Derecho Aduanero</span>
              <span className="badge">Consultor sector real</span>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 mt-7 pt-6 border-t border-white/[0.08]">
              {[
                ['Javeriana', 'Pregrado · Posgrado'],
                ['Sergio Arboleda', 'Posgrado tributario'],
                ['Nacional', 'Conferencista'],
              ].map(([t, s]) => (
                <div key={t}>
                  <div className="font-display font-bold text-white text-base">{t}</div>
                  <div className="text-xs text-white/55 mt-0.5">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
