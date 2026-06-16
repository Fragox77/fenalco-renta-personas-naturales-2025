import { useState } from 'react';
import { CRM_URL, fmtCOP } from '../config.js';

/**
 * Botón de pago que llama al CRM (Rapyd) y redirige al checkout hosted.
 * Reemplaza a PayUForm.jsx.
 *
 * Flujo:
 *  1. POST CRM_URL/api/rapyd/checkout  → { checkoutUrl, referenceId }
 *  2. window.location.href = checkoutUrl  (página de Rapyd)
 *  3. Rapyd redirige a /#/resultado?status=success|error&ref=...
 */
export default function RapydCheckout({ data, total, disabled }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handlePay() {
    setLoading(true);
    setError('');

    try {
      const successUrl = `${window.location.origin}/#/resultado?status=success`;
      const errorUrl   = `${window.location.origin}/#/resultado?status=error`;

      const res = await fetch(`${CRM_URL}/api/rapyd/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Obligatorios
          amount:  total,
          email:   data.email,
          nombre:  data.nombre,
          // Identificador del producto — el CRM lo usa para diferenciar landing pages
          producto: 'renta_2025',
          // Datos del comprador
          apellido:      data.apellido,
          telefono:      data.tel,
          documento:     data.doc,
          tipoDocumento: data.tipoDoc,
          ciudad:        data.ciudad,
          empresa:       data.empresa,
          cargo:         data.cargo,
          // Específicos del seminario
          modalidad:    data.modalidad,
          participantes: data.participantes,
          esAfiliado:   data.esAfiliado,
          // Facturación
          necesitaFactura: data.necesitaFactura,
          razonSocial:     data.razonSocial,
          nit:             data.nit,
          dirFactura:      data.dirFactura,
          respFiscal:      data.respFiscal,
          // URLs de retorno (el CRM añade &ref=... automáticamente)
          successUrl,
          errorUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.checkoutUrl) {
        setError(json.error || 'No se pudo iniciar el pago. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      // Redirige a la página de pago hosted de Rapyd
      window.location.href = json.checkoutUrl;

    } catch {
      setError('Error de conexión. Verifica tu internet e intenta nuevamente.');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handlePay}
        disabled={disabled || loading}
        className="btn-cta w-full justify-center !py-4 !text-base disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
            Conectando con pasarela de pago…
          </span>
        ) : (
          <>
            Pagar {fmtCOP(total)} de forma segura
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor"
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-2xl border border-[#FF6B7A]/30 bg-[#FF6B7A]/[0.06] p-4
                        text-[13px] text-[#FF8E97] leading-relaxed">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-white/45">
        <svg width="13" height="13" viewBox="0 0 14 14">
          <rect x="2.5" y="6" width="9" height="6" rx="1.2" stroke="currentColor" fill="none" />
          <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.1" fill="none" />
        </svg>
        Pago procesado de forma segura · Rapyd
      </div>
    </div>
  );
}
