# Integración de pagos PayU + correo de confirmación

El frontend (formulario de inscripción) ya está listo. Para completar el flujo de
**pago real + correo de confirmación** se necesita un backend mínimo, porque dos
cosas **no pueden** vivir en el navegador por seguridad:

1. **La firma (`signature`) de PayU** — se calcula con la `ApiKey` SECRETA. Si la
   pones en el frontend, cualquiera puede ver tu key y falsificar transacciones.
2. **El envío del correo** — requiere credenciales SMTP / API de correo.

Este documento describe los **3 endpoints** que tu desarrollador debe implementar.
Stack de ejemplo: **Node.js + Express**, pero la lógica aplica a cualquier lenguaje.

---

## Variables de entorno

```bash
PAYU_MERCHANT_ID=508029          # público
PAYU_ACCOUNT_ID=512321           # público (Colombia COP)
PAYU_API_KEY=4Vj8eK4rloUd272L48hsrarnUA   # ⚠️ SECRETA (sandbox de ejemplo)
PAYU_API_LOGIN=pRRXKOl8ikMmt9u   # ⚠️ SECRETA (sandbox de ejemplo)
PAYU_TEST=1                      # 1 sandbox · 0 producción

SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
MAIL_FROM="Fenalco Santander <educacioncontinua@fenalcosantander.com.co>"
```

> Las credenciales `508029 / 512321 / 4Vj8eK...` son las **públicas de sandbox**
> de la documentación oficial de PayU LATAM. Reemplázalas por las tuyas en producción.

---

## 1) `POST /api/payu/sign` — generar firma

El frontend llama aquí antes de redirigir. Devuelve `referenceCode` + `signature`.

**Firma WebCheckout (MD5):**
`MD5("ApiKey~merchantId~referenceCode~amount~currency")`

```js
import express from 'express';
import crypto from 'crypto';
const router = express.Router();

router.post('/api/payu/sign', (req, res) => {
  const { amount, description, buyerEmail, buyerFullName, metadata } = req.body;

  // referencia única
  const referenceCode = 'RPN25-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);

  // (opcional) persiste la inscripción como PENDIENTE antes de redirigir
  // await db.inscripciones.insert({ referenceCode, ...metadata, estado: 'PENDING' });

  const { PAYU_API_KEY, PAYU_MERCHANT_ID } = process.env;
  const currency = 'COP';
  const amountStr = Number(amount).toFixed(2); // PayU exige 2 decimales en la firma
  const signature = crypto
    .createHash('md5')
    .update(`${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${amountStr}~${currency}`)
    .digest('hex');

  res.json({ referenceCode, signature, amount: amountStr });
});
export default router;
```

---

## 2) `POST /api/payu/confirmation` — webhook de PayU (server-to-server)

PayU **notifica aquí** el resultado real del pago (campo `confirmationUrl`).
Es la **única fuente confiable** del estado — NO confíes en la `responseUrl`
(página de retorno), que el usuario puede manipular.

```js
router.post('/api/payu/confirmation', async (req, res) => {
  const {
    merchant_id, reference_sale, value, currency,
    state_pol, sign, email_buyer,
  } = req.body;

  // Verificar la firma de confirmación (MD5):
  // MD5("ApiKey~merchantId~referenceCode~newValue~currency~state_pol")
  // OJO: newValue redondea a 1 decimal si el segundo es 0 (regla PayU)
  const newValue = formatPayUValue(value); // ver doc PayU
  const expected = crypto.createHash('md5')
    .update(`${process.env.PAYU_API_KEY}~${merchant_id}~${reference_sale}~${newValue}~${currency}~${state_pol}`)
    .digest('hex');

  if (expected !== sign) return res.status(401).send('invalid signature');

  // state_pol: 4 = aprobada · 6 = rechazada · 7 = pendiente
  if (state_pol === '4') {
    // await db.inscripciones.update({ referenceCode: reference_sale }, { estado: 'APPROVED' });
    await enviarCorreoConfirmacion(reference_sale); // ⬅ dispara el correo
  } else if (state_pol === '7') {
    // await db.inscripciones.update(... estado: 'PENDING');
  } else {
    // await db.inscripciones.update(... estado: 'REJECTED');
  }

  res.status(200).send('OK'); // PayU reintenta si no recibe 200
});

function formatPayUValue(value) {
  // PayU: si el decimal es .00, usar .0 (ej. 380000.00 -> 380000.0)
  const n = parseFloat(value);
  const dec = Math.round((n - Math.floor(n)) * 100);
  return dec === 0 ? n.toFixed(1) : n.toFixed(2);
}
```

---

## 3) Envío del correo de confirmación

Usa la plantilla `email-templates/confirmacion.html` (estilos inline, lista para
clientes de correo). Reemplaza los `{{tokens}}` con los datos de la inscripción.

```js
import nodemailer from 'nodemailer';
import fs from 'fs';

async function enviarCorreoConfirmacion(referenceCode) {
  // const insc = await db.inscripciones.findOne({ referenceCode });
  const insc = {/* nombre, email, valor, modalidad, ... */};

  let html = fs.readFileSync('./email-templates/confirmacion.html', 'utf8');
  const tokens = {
    nombre: insc.nombre,
    referencia: referenceCode,
    estado: 'APROBADO',
    valor: '$ ' + Number(insc.valor).toLocaleString('es-CO'),
    modalidad: insc.modalidad === 'online' ? 'Online en vivo' : 'Presencial · Bucaramanga',
    fecha: '02 de julio de 2025',
    horario: '08:00 — 17:00 (8 horas)',
    sede: 'Sede Fenalco Santander · Cra. 20 #36-49',
    docente: 'Cesar Ánzola Aguilar',
    enlaceOnline: insc.modalidad === 'online' ? 'https://meet.google.com/xxx' : '',
  };
  for (const [k, v] of Object.entries(tokens)) {
    html = html.replaceAll(`{{${k}}}`, v ?? '');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: 587,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: insc.email,
    bcc: 'educacioncontinua@fenalcosantander.com.co', // copia interna
    subject: '✅ Inscripción confirmada — Renta Personas Naturales 2025',
    html,
  });
}
```

---

## Flujo completo

```
[Frontend]  Usuario completa form  →  POST /api/payu/sign
                                         ↓ { referenceCode, signature }
[Frontend]  <form> POST → checkout.payulatam.com   (redirige a PayU)
                                         ↓ usuario paga
[PayU]      → POST /api/payu/confirmation  (server-to-server, estado real)
                                         ↓ si aprobado
[Backend]   enviarCorreoConfirmacion()  →  correo al participante
[PayU]      → redirige a responseUrl (#/resultado)  →  página de gracias
```

## Checklist de producción

- [ ] Reemplazar credenciales sandbox por las de producción en `.env`
- [ ] `PAYU_TEST=0` y `actionUrl` → `https://checkout.payulatam.com/ppp-web-gateway-payu/`
      (editar en `src/config.js`)
- [ ] `confirmationUrl` y `responseUrl` apuntando al dominio real (HTTPS)
- [ ] Persistir inscripciones en base de datos (PENDING → APPROVED/REJECTED)
- [ ] Validar SIEMPRE la firma de confirmación antes de marcar como pagado
- [ ] Configurar SPF/DKIM en el dominio de correo para evitar spam
- [ ] Página `responseUrl` solo informativa; la verdad la da el webhook

---

Referencia oficial: [PayU LATAM — WebCheckout](https://developers.payulatam.com/latam/es/docs/integrations/webcheckout-integration.html)
