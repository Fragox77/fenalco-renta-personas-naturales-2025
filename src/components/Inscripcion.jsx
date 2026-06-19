import { useState, useMemo } from 'react';
import { EVENT, TARIFAS, CORPORATIVO_MIN, calcularTarifa, fmtCOP } from '../config.js';
import RapydCheckout from './RapydCheckout.jsx';

/* ---------- primitivos de formulario ---------- */
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

const inputCls =
  'w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 py-3 text-[15px] text-white ' +
  'placeholder:text-white/35 outline-none transition focus:border-fen-green/60 focus:bg-white/[0.06]';

function TextInput(props) {
  return <input {...props} className={inputCls} />;
}
function SelectInput({ children, ...props }) {
  return (
    <select {...props} className={inputCls + ' appearance-none cursor-pointer'}>
      {children}
    </select>
  );
}

/* ---------- stepper ---------- */
function Stepper({ step, steps }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-7 h-7 rounded-full grid place-items-center font-display font-bold text-[12px] shrink-0 transition"
                style={{
                  background: active ? '#00CE7C' : done ? 'rgba(0,206,124,0.18)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#04140B' : done ? '#1FE595' : 'rgba(255,255,255,0.55)',
                  border: active ? 'none' : '1px solid rgba(255,255,255,0.12)',
                }}
              >
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 13 13"><path d="M3 7l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : i + 1}
              </span>
              <span className={`text-[12.5px] font-medium truncate hidden sm:block ${active ? 'text-white' : 'text-white/50'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-white/10 min-w-[12px]" />}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- componente principal ---------- */
const STEPS = ['Datos', 'Modalidad', 'Pago'];

function initialState() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const tarifa = params.get('tarifa');
  const isCorp = tarifa === 'corporativo';
  return {
    nombre: '', apellido: '', razonSocial: '', doc: '', email: '', tel: '',
    direccion: '', ciudad: '', cargo: '',
    esAfiliado: isCorp, participantes: isCorp ? 3 : 1, modalidad: 'presencial',
    metodo: 'PSE', acepta: false,
  };
}

export default function Inscripcion() {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(initialState);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }));

  const tarifaUnit = useMemo(
    () => calcularTarifa({ esAfiliado: d.esAfiliado, participantes: Number(d.participantes) || 1 }),
    [d.esAfiliado, d.participantes]
  );
  const total = tarifaUnit * (Number(d.participantes) || 1);
  const ahorro = (TARIFAS.full - tarifaUnit) * (Number(d.participantes) || 1);

  function validate(s) {
    const e = {};
    if (s === 0) {
      if (!d.nombre.trim()) e.nombre = 'Requerido';
      if (!d.apellido.trim()) e.apellido = 'Requerido';
      if (!d.doc.trim()) e.doc = 'Requerido';
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) e.email = 'Correo inválido';
      if (!d.tel.trim()) e.tel = 'Requerido';
      if (!d.direccion.trim()) e.direccion = 'Requerido';
      if (!d.ciudad.trim()) e.ciudad = 'Requerido';
    }
    if (s === 2 && !d.acepta) e.acepta = 'Debes aceptar para continuar';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const next = () => { if (validate(step)) setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="bg-deep min-h-screen text-white">
      {/* top bar */}
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

      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-14 grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
        {/* ===== FORM COLUMN ===== */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-fen-teal shadow-[0_0_12px_#20D5C4]" />
            <span className="eyebrow">Inscripción</span>
          </div>
          <h1 className="h-display text-3xl lg:text-[44px] text-white mt-3">Asegura tu cupo.</h1>
          <p className="text-white/65 mt-2 text-[15px]">Completa tus datos de facturación y paga de forma segura.</p>

          <div className="glass-hi p-5 lg:p-7 mt-7">
            <Stepper step={step} steps={STEPS} />
            <div className="h-px bg-white/[0.08] my-6" />

            {/* STEP 0 — datos de facturación */}
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nombre" required error={errors.nombre}>
                  <TextInput value={d.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej. María Fernanda" />
                </Field>
                <Field label="Apellido" required error={errors.apellido}>
                  <TextInput value={d.apellido} onChange={e => set('apellido', e.target.value)} placeholder="Ej. Gómez Ruiz" />
                </Field>
                <Field label="Razón social" hint="opcional si es persona natural">
                  <TextInput value={d.razonSocial} onChange={e => set('razonSocial', e.target.value)} placeholder="Nombre de la empresa" />
                </Field>
                <Field label="Cédula / NIT" required error={errors.doc}>
                  <TextInput value={d.doc} onChange={e => set('doc', e.target.value)} placeholder="Sin puntos ni comas" inputMode="numeric" />
                </Field>
                <Field label="Correo electrónico" required error={errors.email} hint="recibirás aquí la confirmación">
                  <TextInput type="email" value={d.email} onChange={e => set('email', e.target.value)} placeholder="nombre@empresa.com" />
                </Field>
                <Field label="Teléfono / WhatsApp" required error={errors.tel}>
                  <TextInput value={d.tel} onChange={e => set('tel', e.target.value)} placeholder="+57 3xx xxx xxxx" inputMode="tel" />
                </Field>
                <Field label="Dirección" required error={errors.direccion}>
                  <TextInput value={d.direccion} onChange={e => set('direccion', e.target.value)} placeholder="Cra. 20 #36-49" />
                </Field>
                <Field label="Ciudad" required error={errors.ciudad}>
                  <TextInput value={d.ciudad} onChange={e => set('ciudad', e.target.value)} placeholder="Bucaramanga" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Cargo" hint="opcional">
                    <TextInput value={d.cargo} onChange={e => set('cargo', e.target.value)} placeholder="Ej. Contador, Gerente financiero" />
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 1 — modalidad y tarifa */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-[13px] font-medium text-white/80 mb-2.5">Modalidad <span className="text-fen-green">*</span></div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { v: 'presencial', t: 'Presencial', s: EVENT.sede, tone: '#00CE7C' },
                      { v: 'online', t: 'Online en vivo', s: 'Desde cualquier ciudad · grabación disponible', tone: '#20D5C4' },
                    ].map(o => {
                      const sel = d.modalidad === o.v;
                      return (
                        <button key={o.v} type="button" onClick={() => set('modalidad', o.v)}
                          className="text-left rounded-2xl p-4 transition"
                          style={{
                            background: sel ? `${o.tone}1A` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${sel ? o.tone + '73' : 'rgba(255,255,255,0.10)'}`,
                          }}>
                          <div className="flex items-center justify-between">
                            <span className="font-display font-bold text-[16px] text-white">{o.t}</span>
                            <span className="w-4 h-4 rounded-full grid place-items-center"
                                  style={{ border: `2px solid ${sel ? o.tone : 'rgba(255,255,255,0.25)'}` }}>
                              {sel && <span className="w-2 h-2 rounded-full" style={{ background: o.tone }} />}
                            </span>
                          </div>
                          <div className="text-[12px] text-white/60 mt-1 leading-snug">{o.s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* afiliado toggle */}
                <button type="button" onClick={() => set('esAfiliado', !d.esAfiliado)}
                  className="flex items-center justify-between rounded-2xl p-4 transition text-left"
                  style={{ background: d.esAfiliado ? 'rgba(0,206,124,0.10)' : 'rgba(255,255,255,0.03)',
                           border: `1px solid ${d.esAfiliado ? 'rgba(0,206,124,0.40)' : 'rgba(255,255,255,0.10)'}` }}>
                  <div>
                    <div className="font-display font-bold text-[15px] text-white">Soy afiliado a Fenalco Santander</div>
                    <div className="text-[12px] text-white/60 mt-0.5">Aplica tarifa preferencial de afiliado</div>
                  </div>
                  <span className="w-11 h-6 rounded-full relative transition shrink-0"
                        style={{ background: d.esAfiliado ? '#00CE7C' : 'rgba(255,255,255,0.15)' }}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                          style={{ left: d.esAfiliado ? '22px' : '2px' }} />
                  </span>
                </button>

                {/* participantes */}
                <Field label="Número de participantes" hint={`desde ${CORPORATIVO_MIN} afiliados aplica tarifa corporativa`}>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => set('participantes', Math.max(d.esAfiliado ? CORPORATIVO_MIN : 1, Number(d.participantes) - 1))}
                            className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xl grid place-items-center hover:bg-white/10">−</button>
                    <span className="font-display font-bold text-2xl text-white w-10 text-center">{d.participantes}</span>
                    <button type="button" onClick={() => set('participantes', Math.min(50, Number(d.participantes) + 1))}
                            className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xl grid place-items-center hover:bg-white/10">+</button>
                    {d.esAfiliado && Number(d.participantes) >= CORPORATIVO_MIN && (
                      <span className="badge green ml-1"><span className="dot" />Tarifa corporativa activa</span>
                    )}
                  </div>
                </Field>
              </div>
            )}

            {/* STEP 2 — pago */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <div>
                  <div className="text-[13px] font-medium text-white/80 mb-2.5">Método de pago <span className="text-fen-green">*</span></div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { v: 'PSE', t: 'PSE', s: 'Débito bancario' },
                      { v: 'CREDIT', t: 'T. Crédito', s: 'Visa · Master · Amex' },
                      { v: 'DEBIT', t: 'T. Débito', s: 'Visa · Master' },
                    ].map(o => {
                      const sel = d.metodo === o.v;
                      return (
                        <button key={o.v} type="button" onClick={() => set('metodo', o.v)}
                          className="rounded-2xl p-4 text-left transition"
                          style={{ background: sel ? 'rgba(0,206,124,0.10)' : 'rgba(255,255,255,0.03)',
                                   border: `1px solid ${sel ? 'rgba(0,206,124,0.45)' : 'rgba(255,255,255,0.10)'}` }}>
                          <div className="font-display font-bold text-[15px] text-white">{o.t}</div>
                          <div className="text-[11px] text-white/55 mt-0.5">{o.s}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={d.acepta} onChange={e => set('acepta', e.target.checked)}
                         className="mt-1 w-4 h-4 accent-fen-green shrink-0" />
                  <span className="text-[13px] text-white/70 leading-relaxed">
                    Acepto el tratamiento de mis datos personales y los{' '}
                    <a href={EVENT.sitio} target="_blank" rel="noreferrer" className="text-fen-green underline underline-offset-2">términos y condiciones</a>{' '}
                    del seminario. Entiendo que el cupo se confirma una vez aprobado el pago.
                  </span>
                </label>
                {errors.acepta && <span className="text-[12px] text-[#FF8E97] -mt-2">{errors.acepta}</span>}

                <RapydCheckout data={d} total={total} disabled={!d.acepta} />

                <div className="flex items-center gap-2 text-[11px] text-white/45">
                  <svg width="13" height="13" viewBox="0 0 14 14"><rect x="2.5" y="6" width="9" height="6" rx="1.2" stroke="currentColor" fill="none" /><path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.1" fill="none" /></svg>
                  Pago procesado de forma segura por Rapyd · PCI-DSS
                </div>
              </div>
            )}

            {/* nav buttons */}
            <div className="flex items-center justify-between mt-7 pt-6 border-t border-white/[0.08]">
              <button type="button" onClick={back} disabled={step === 0}
                      className="btn-ghost !py-3 disabled:opacity-30 disabled:cursor-not-allowed">
                Atrás
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={next} className="btn-cta">
                  Continuar
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              ) : (
                <span className="text-[12px] text-white/45 max-w-[200px] text-right">Serás redirigido a Rapyd para completar el pago.</span>
              )}
            </div>
          </div>
        </div>

        {/* ===== RESUMEN COLUMN ===== */}
        <aside className="lg:sticky lg:top-24">
          <div className="glass-hi p-6">
            <div className="eyebrow !text-[10px]">Resumen de inscripción</div>
            <div className="font-display font-bold text-xl text-white mt-3 leading-tight">{EVENT.nombre}</div>
            <div className="text-[13px] text-white/60 mt-1">{EVENT.subtitulo}</div>

            <div className="flex flex-col gap-2.5 mt-5 text-[13px]">
              {[
                ['Fecha', EVENT.fecha],
                ['Horario', `${EVENT.horario} · ${EVENT.intensidad}`],
                ['Modalidad', d.modalidad === 'presencial' ? 'Presencial · Bucaramanga' : 'Online en vivo'],
                ['Docente', EVENT.docente],
                ['Participantes', String(d.participantes)],
                ['Tarifa', d.esAfiliado && Number(d.participantes) >= CORPORATIVO_MIN ? 'Corporativo afiliado' : 'Tarifa full'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <span className="text-white/50">{k}</span>
                  <span className="text-white/90 text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/[0.08] my-5" />

            <div className="flex justify-between text-[13px] text-white/60">
              <span>Valor unitario</span>
              <span>{fmtCOP(tarifaUnit)}</span>
            </div>
            {Number(d.participantes) > 1 && (
              <div className="flex justify-between text-[13px] text-white/60 mt-1.5">
                <span>× {d.participantes} participantes</span>
                <span>{fmtCOP(tarifaUnit * Number(d.participantes))}</span>
              </div>
            )}
            {ahorro > 0 && (
              <div className="flex justify-between text-[13px] text-fen-green mt-1.5">
                <span>Ahorro vs. tarifa full</span>
                <span>− {fmtCOP(ahorro)}</span>
              </div>
            )}

            <div className="flex items-end justify-between mt-4 pt-4 border-t border-white/[0.08]">
              <span className="text-[13px] text-white/70">Total a pagar</span>
              <span className="font-display font-extrabold text-[34px] text-fen-green tracking-tight leading-none">{fmtCOP(total)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <span className="badge teal">Sin IVA</span>
              <span className="badge">100% deducible</span>
            </div>
          </div>

          <div className="glass p-4 mt-4 flex items-center gap-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#00CE7C"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.5l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.7.1.2 1.9 2.9 4.6 4.1 1.6.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4z" /></svg>
            <div className="text-[12.5px] text-white/70 leading-snug">
              ¿Dudas antes de pagar? Escríbele a {EVENT.contactoNombre}.
              <a href={`https://wa.me/${EVENT.contactoWa}`} target="_blank" rel="noreferrer" className="text-fen-green block">{EVENT.contactoTel}</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
