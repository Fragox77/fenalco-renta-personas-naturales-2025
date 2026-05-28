import { useState } from 'react';
import { PAYU, EVENT, fmtCOP } from '../config.js';

/**
 * PayU WebCheckout scaffold.
 *
 * ⚠️ SEGURIDAD: la firma (signature) se calcula con la ApiKey SECRETA y NUNCA
 * debe vivir en el frontend. Este componente pide al backend (PAYU.signEndpoint)
 * un { referenceCode, signature, amount } y arma el <form> POST a PayU.
 *
 * Mientras no exista backend, el botón corre en "modo demo": muestra el payload
 * exacto que se enviaría, sin redirigir. Ver BACKEND.md.
 */
export default function PayUForm({ data, total, tarifaUnit, disabled }) {
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(null);

  const description = `${EVENT.nombre} — ${data.participantes} participante(s) · ${data.modalidad}`;

  async function handlePay() {
    setLoading(true);
    setDemo(null);
    try {
      // 1) Pedir firma al backend
      const res = await fetch(PAYU.signEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          description,
          buyerEmail: data.email,
          buyerFullName: data.nombre,
          // datos extra que tu backend puede persistir antes de redirigir
          metadata: data,
        }),
      });
      if (!res.ok) throw new Error('sign endpoint not available');
      const { referenceCode, signature, amount } = await res.json();

      // 2) Construir y enviar el form POST a PayU
      submitToPayU({ referenceCode, signature, amount, description, data });
    } catch (err) {
      // Modo demo: no hay backend todavía → mostramos el payload
      const payload = {
        merchantId: PAYU.merchantId,
        accountId: PAYU.accountId,
        description,
        referenceCode: 'DEMO-' + Date.now(),
        amount: total,
        currency: PAYU.currency,
        signature: '«firma generada por el backend con la ApiKey»',
        test: PAYU.test,
        buyerEmail: data.email,
        responseUrl: PAYU.responseUrl,
        confirmationUrl: PAYU.confirmationUrl,
        paymentMethods: data.metodo,
      };
      setDemo(payload);
      setLoading(false);
    }
  }

  function submitToPayU({ referenceCode, signature, amount, description, data }) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = PAYU.actionUrl;
    const fields = {
      merchantId: PAYU.merchantId,
      accountId: PAYU.accountId,
      description,
      referenceCode,
      amount,
      tax: 0,
      taxReturnBase: 0,
      currency: PAYU.currency,
      signature,
      test: PAYU.test,
      buyerEmail: data.email,
      buyerFullName: data.nombre,
      telephone: data.tel,
      responseUrl: PAYU.responseUrl,
      confirmationUrl: PAYU.confirmationUrl,
    };
    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = String(v);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={handlePay} disabled={disabled || loading}
              className="btn-cta w-full justify-center !py-4 !text-base disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? 'Conectando con PayU…' : (
          <>
            Pagar {fmtCOP(total)} con PayU
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </>
        )}
      </button>

      {/* Demo payload (cuando no hay backend) */}
      {demo && (
        <div className="rounded-2xl border border-fen-teal/30 bg-fen-teal/[0.06] p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-fen-teal" />
            <span className="font-display font-bold text-[13px] text-fen-tealHi">Modo demo · sin backend conectado</span>
          </div>
          <p className="text-[12px] text-white/60 leading-relaxed mb-3">
            Este es el payload exacto que se enviaría a PayU. La firma la genera tu
            servidor (<code className="text-fen-teal">{PAYU.signEndpoint}</code>). Ver <b>BACKEND.md</b>.
          </p>
          <pre className="text-[11px] font-mono text-white/70 bg-black/30 rounded-xl p-3 overflow-x-auto leading-relaxed">
{JSON.stringify(demo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
