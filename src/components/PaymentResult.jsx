import { EVENT } from '../config.js';

function parseParams() {
  const q = new URLSearchParams(window.location.search);
  const hashQ = window.location.hash.includes('?')
    ? new URLSearchParams(window.location.hash.split('?')[1])
    : new URLSearchParams();
  const get = k => q.get(k) || hashQ.get(k);
  return {
    status: get('status'),
    ref:    get('ref'),
  };
}

const VARIANTS = {
  approved: {
    color: '#00CE7C', tone: 'rgba(0,206,124',
    icon: <path d="M6 12l4 4 8-9" stroke="#00CE7C" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
    eyebrow: 'PAGO APROBADO',
    title: '¡Tu cupo está confirmado!',
    msg: 'Recibimos tu pago correctamente. En unos minutos llegará a tu correo la confirmación de inscripción con todos los detalles del seminario.',
  },
  rejected: {
    color: '#FF6B7A', tone: 'rgba(255,107,122',
    icon: <><path d="M8 8l8 8M16 8l-8 8" stroke="#FF6B7A" strokeWidth="2.2" strokeLinecap="round" /></>,
    eyebrow: 'PAGO NO COMPLETADO',
    title: 'No pudimos procesar el pago.',
    msg: 'La transacción fue rechazada o cancelada. Puedes intentar de nuevo con otro método de pago. No se realizó ningún cargo.',
  },
};

export default function PaymentResult() {
  const { status, ref } = parseParams();
  const key = status === 'success' ? 'approved' : 'rejected';
  const v = VARIANTS[key];

  return (
    <div className="bg-deep min-h-screen text-white grid place-items-center px-6 py-16">
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 500,
                    background: `radial-gradient(closest-side, ${v.tone},0.35), transparent 70%)` }} />

      <div className="relative glass-hi p-8 lg:p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full grid place-items-center mx-auto mb-6"
             style={{ background: `${v.tone},0.12)`, border: `1px solid ${v.tone},0.4)` }}>
          <svg width="40" height="40" viewBox="0 0 24 24">{v.icon}</svg>
        </div>

        <div className="eyebrow" style={{ color: v.color }}>{v.eyebrow}</div>
        <h1 className="h-display text-3xl lg:text-[40px] text-white mt-3">{v.title}</h1>
        <p className="text-white/65 mt-4 leading-relaxed">{v.msg}</p>

        {ref && (
          <div className="glass mt-6 p-4 text-left text-[13px]">
            <div className="flex justify-between">
              <span className="text-white/50">Referencia de pago</span>
              <span className="font-mono text-white/90">{ref}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          {key === 'rejected' ? (
            <a href="#/inscripcion" className="btn-cta justify-center">Intentar de nuevo</a>
          ) : (
            <a href="#/" className="btn-cta justify-center">Volver al inicio</a>
          )}
          <a href={`https://wa.me/${EVENT.contactoWa}`} target="_blank" rel="noreferrer" className="btn-ghost justify-center">
            Contactar soporte
          </a>
        </div>

        <div className="text-[12px] text-white/40 mt-6">
          {EVENT.nombre} · {EVENT.fecha} · {EVENT.email}
        </div>
      </div>
    </div>
  );
}
