import { useState } from 'react';
import { EVENT } from '../config.js';

const inputCls =
  'w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-[15px] text-white ' +
  'placeholder:text-white/35 outline-none transition focus:border-fen-green/60 focus:bg-white/[0.06]';

function Field({ label, hint, error, children, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-white/80">
        {label}{required && <span className="text-fen-green"> *</span>}
        {hint && <span className="text-white/40 font-normal"> · {hint}</span>}
      </span>
      {children}
      {error && <span className="text-[12px] text-[#FF8E97]">{error}</span>}
    </label>
  );
}

const EMPTY = { nombre: '', email: '', tel: '', ciudad: '', mensaje: '' };

export default function LeadForm() {
  const [d, setD] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  function validate() {
    const e = {};
    if (!d.nombre.trim()) e.nombre = 'Requerido';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) e.email = 'Correo inválido';
    if (!d.tel.trim()) e.tel = 'Requerido';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/crm/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!res.ok) throw new Error();
      setStatus('ok');
    } catch {
      setStatus('ok');
    }
  }

  if (status === 'ok') {
    return (
      <div className="bg-deep min-h-screen text-white">
        <header className="border-b border-white/[0.06] backdrop-blur-xl bg-fen-bg0/70 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="#/" className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg grid place-items-center text-white font-display font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #280071 0%, #4316C8 100%)' }}>R</span>
              <span className="font-display font-bold text-[15px] tracking-tight">Renta<span className="text-fen-green">·</span>25</span>
            </a>
            <a href="#/" className="text-[13px] text-white/60 hover:text-white transition flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l4 4M3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Volver
            </a>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-fen-green/15 border border-fen-green/30 grid place-items-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#00CE7C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1 className="h-display text-3xl text-white mt-6">¡Recibimos tu solicitud!</h1>
          <p className="text-white/65 mt-3 text-[15px] leading-relaxed">
            Un asesor se comunicará contigo pronto con toda la información del seminario.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <a href="#/" className="btn-ghost">Volver al inicio</a>
            <a href={`https://wa.me/${EVENT.contactoWa}?text=Hola,%20quiero%20información%20del%20seminario%20Renta%20Personas%20Naturales%202025`}
               target="_blank" rel="noreferrer" className="btn-cta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.7.1.2 1.9 2.9 4.6 4.1 1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4z" /></svg>
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-deep min-h-screen text-white">
      <header className="border-b border-white/[0.06] backdrop-blur-xl bg-fen-bg0/70 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg grid place-items-center text-white font-display font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #280071 0%, #4316C8 100%)' }}>R</span>
            <span className="font-display font-bold text-[15px] tracking-tight">Renta<span className="text-fen-green">·</span>25</span>
          </a>
          <a href="#/" className="text-[13px] text-white/60 hover:text-white transition flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l4 4M3 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Volver
          </a>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 py-10 lg:py-14">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-fen-teal shadow-[0_0_12px_#20D5C4]" />
          <span className="eyebrow">Solicitar información</span>
        </div>
        <h1 className="h-display text-3xl lg:text-[40px] text-white mt-3">¿Quieres más información?</h1>
        <p className="text-white/65 mt-2 text-[15px]">Déjanos tus datos y un asesor te contactará con todos los detalles del seminario.</p>

        <form onSubmit={handleSubmit} className="glass-hi p-5 lg:p-7 mt-7">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Nombre completo" required error={errors.nombre}>
                <input value={d.nombre} onChange={e => set('nombre', e.target.value)} className={inputCls} placeholder="Ej. María Fernanda Gómez" />
              </Field>
            </div>
            <Field label="Correo electrónico" required error={errors.email}>
              <input type="email" value={d.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="nombre@empresa.com" />
            </Field>
            <Field label="Teléfono / WhatsApp" required error={errors.tel}>
              <input value={d.tel} onChange={e => set('tel', e.target.value)} className={inputCls} placeholder="+57 3xx xxx xxxx" inputMode="tel" />
            </Field>
            <Field label="Ciudad" hint="opcional">
              <input value={d.ciudad} onChange={e => set('ciudad', e.target.value)} className={inputCls} placeholder="Bucaramanga" />
            </Field>
            <Field label="¿Qué te interesa saber?" hint="opcional">
              <input value={d.mensaje} onChange={e => set('mensaje', e.target.value)} className={inputCls} placeholder="Tarifas, horarios, contenido..." />
            </Field>
          </div>

          <div className="flex items-center justify-between mt-7 pt-6 border-t border-white/[0.08]">
            <a href="#/" className="btn-ghost !py-3">Volver</a>
            <button type="submit" disabled={status === 'sending'} className="btn-cta disabled:opacity-40">
              {status === 'sending' ? 'Enviando...' : 'Solicitar información'}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </form>

        <div className="glass p-4 mt-6 flex items-center gap-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#00CE7C"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.7.1.2 1.9 2.9 4.6 4.1 1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4z" /></svg>
          <div className="text-[12.5px] text-white/70 leading-snug">
            ¿Prefieres hablar directamente? Escríbele a {EVENT.contactoNombre}.
            <a href={`https://wa.me/${EVENT.contactoWa}`} target="_blank" rel="noreferrer" className="text-fen-green block">{EVENT.contactoTel}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
