import { useState, useEffect } from 'react';
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
  pending: {
    color: '#FFB347', tone: 'rgba(255,179,71',
    icon: (
      <g stroke="#FFB347" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </g>
    ),
    eyebrow: 'VERIFICANDO PAGO',
    title: 'Estamos verificando tu pago…',
    msg: 'Consultando el estado de tu transacción con la pasarela de pago. Esto toma unos segundos.',
  },
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

async function verifyCheckout(checkoutId) {
  const res = await fetch(`/api/rapyd/status?id=${encodeURIComponent(checkoutId)}`);
  if (!res.ok) return null;
  return res.json();
}

export default function PaymentResult() {
  const { status: urlStatus, ref: urlRef } = parseParams();
  const [resolvedStatus, setResolvedStatus] = useState(null);
  const [refCode, setRefCode] = useState(urlRef || '');
  const [retries, setRetries] = useState(0);

  const checkoutId = sessionStorage.getItem('rapyd_checkout_id') || '';
  const savedRef = sessionStorage.getItem('rapyd_ref') || '';

  useEffect(() => {
    if (!refCode && savedRef) setRefCode(savedRef);
  }, [savedRef]);

  useEffect(() => {
    if (urlStatus === 'error') {
      setResolvedStatus('rejected');
      return;
    }

    if (!checkoutId) {
      setResolvedStatus(urlStatus === 'success' ? 'approved' : 'rejected');
      return;
    }

    let cancelled = false;

    async function check() {
      const data = await verifyCheckout(checkoutId);

      if (cancelled) return;

      if (!data) {
        setResolvedStatus('pending');
        return;
      }

      if (data.merchantReferenceId && !refCode) {
        setRefCode(data.merchantReferenceId);
      }

      if (data.status === 'approved') {
        setResolvedStatus('approved');
        sessionStorage.removeItem('rapyd_checkout_id');
        sessionStorage.removeItem('rapyd_ref');
      } else if (data.status === 'rejected') {
        setResolvedStatus('rejected');
        sessionStorage.removeItem('rapyd_checkout_id');
        sessionStorage.removeItem('rapyd_ref');
      } else if (retries < 5) {
        setTimeout(() => {
          if (!cancelled) setRetries(r => r + 1);
        }, 4000);
      } else {
        setResolvedStatus('pending');
      }
    }

    check();
    return () => { cancelled = true; };
  }, [retries, urlStatus, checkoutId]);

  const key = resolvedStatus || 'pending';
  const v = VARIANTS[key];
  const showSpinner = !resolvedStatus && key === 'pending';

  return (
    <div className="bg-deep min-h-screen text-white grid place-items-center px-6 py-16">
      <div className="absolute pointer-events-none rounded-full blur-3xl"
           style={{ top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 500,
                    background: `radial-gradient(closest-side, ${v.tone},0.35), transparent 70%)` }} />

      <div className="relative glass-hi p-8 lg:p-12 max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full grid place-items-center mx-auto mb-6"
             style={{ background: `${v.tone},0.12)`, border: `1px solid ${v.tone},0.4)` }}>
          {showSpinner ? (
            <svg className="animate-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FFB347" strokeWidth="2.2"
                      strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="40" height="40" viewBox="0 0 24 24">{v.icon}</svg>
          )}
        </div>

        <div className="eyebrow" style={{ color: v.color }}>{v.eyebrow}</div>
        <h1 className="h-display text-3xl lg:text-[40px] text-white mt-3">{v.title}</h1>
        <p className="text-white/65 mt-4 leading-relaxed">{v.msg}</p>

        {refCode && (
          <div className="glass mt-6 p-4 text-left text-[13px]">
            <div className="flex justify-between">
              <span className="text-white/50">Referencia de pago</span>
              <span className="font-mono text-white/90">{refCode}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          {key === 'rejected' ? (
            <a href="#/inscripcion" className="btn-cta justify-center">Intentar de nuevo</a>
          ) : key === 'approved' ? (
            <a href="#/" className="btn-cta justify-center">Volver al inicio</a>
          ) : null}
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
