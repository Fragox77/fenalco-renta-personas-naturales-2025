import crypto from 'crypto';
import { MongoClient } from 'mongodb';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Reusa la conexión entre invocaciones
let cachedClient = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGO_URI);
    await cachedClient.connect();
  }
  return cachedClient.db('fenalco_crm');
}

/**
 * PayU: si los dos decimales son .00, la firma usa .0 (ej. 380000.00 → 380000.0)
 * Regla oficial: https://developers.payulatam.com/latam/es/docs/integrations/webcheckout-integration/response-page.html
 */
function formatPayUValue(value) {
  const n = parseFloat(value);
  const cents = Math.round((n - Math.floor(n)) * 100);
  return cents === 0 ? n.toFixed(1) : n.toFixed(2);
}

/**
 * POST /api/payu/confirmation  (server-to-server desde PayU)
 *
 * PayU envía application/x-www-form-urlencoded con el resultado real del pago.
 * NUNCA confiar en la responseUrl (página de retorno) para actualizar el estado.
 *
 * state_pol: 4 = Aprobada · 6 = Rechazada · 7 = Pendiente
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  // Vercel parsea form-encoded automáticamente en req.body
  const body = req.body || {};

  const {
    merchant_id,
    reference_sale,
    value,
    currency,
    state_pol,
    sign,
    email_buyer,
    response_message_pol,
  } = body;

  // 1) Validar firma de confirmación
  const newValue = formatPayUValue(value || '0');
  const expected = crypto
    .createHash('md5')
    .update(
      `${process.env.PAYU_API_KEY}~${merchant_id}~${reference_sale}~${newValue}~${currency}~${state_pol}`
    )
    .digest('hex');

  if (expected !== sign) {
    console.error(`[confirmation] Firma inválida. ref=${reference_sale} state=${state_pol}`);
    return res.status(401).send('invalid signature');
  }

  // 2) Mapear estado PayU → estado interno
  const estadoMap = { '4': 'APPROVED', '6': 'REJECTED', '7': 'PENDING' };
  const estado = estadoMap[state_pol] || 'UNKNOWN';

  console.log(`[confirmation] ref=${reference_sale} estado=${estado} valor=${value}`);

  // 3) Actualizar inscripción en MongoDB
  let inscripcion = null;
  try {
    const db = await getDb();
    const result = await db.collection('inscripciones_renta').findOneAndUpdate(
      { referenceCode: reference_sale },
      {
        $set: {
          estado,
          payuStatePol: state_pol,
          payuResponseMsg: response_message_pol || '',
          emailBuyer: email_buyer || '',
          actualizadoEn: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    inscripcion = result; // puede ser null si no se encontró la referencia
  } catch (e) {
    console.error('[confirmation] MongoDB error:', e.message);
  }

  // 4) Enviar correo solo si el pago fue APROBADO
  if (estado === 'APPROVED' && inscripcion) {
    await enviarCorreoConfirmacion(inscripcion).catch((e) =>
      console.error('[confirmation] Email error:', e.message)
    );
  }

  // PayU reintenta si no recibe HTTP 200
  return res.status(200).send('OK');
}

async function enviarCorreoConfirmacion(insc) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[email] SMTP no configurado — correo omitido');
    return;
  }

  const destinatario = insc.email || insc.buyerEmail || '';
  if (!destinatario) {
    console.warn('[email] Sin destinatario para referencia:', insc.referenceCode);
    return;
  }

  // Leer plantilla HTML (está en email-templates/ en la raíz del proyecto)
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tmplPath = path.join(__dirname, '../../email-templates/confirmacion.html');
  let html = fs.readFileSync(tmplPath, 'utf8');

  // Reemplazar tokens {{nombre}}, {{referencia}}, etc.
  const tokens = {
    nombre:      insc.nombre || insc.buyerFullName || 'Participante',
    referencia:  insc.referenceCode || '',
    estado:      'APROBADO',
    valor:       '$ ' + Number(insc.amount || 0).toLocaleString('es-CO'),
    modalidad:   insc.modalidad === 'online' ? 'Online en vivo' : 'Presencial · Bucaramanga',
    fecha:       '02 de julio de 2025',
    horario:     '08:00 — 17:00 (8 horas)',
    sede:        'Sede Fenalco Santander · Cra. 20 #36-49, Bucaramanga',
    docente:     'Cesar Ánzola Aguilar',
    enlaceOnline: '',
  };

  for (const [k, v] of Object.entries(tokens)) {
    html = html.replaceAll(`{{${k}}}`, v ?? '');
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from:    process.env.MAIL_FROM || '"Fenalco Santander" <educacioncontinua@fenalcosantander.com.co>',
    to:      destinatario,
    bcc:     'educacioncontinua@fenalcosantander.com.co',
    subject: '✅ Inscripción confirmada — Renta Personas Naturales 2025',
    html,
  });

  console.log(`[email] Confirmación enviada a ${destinatario} (ref: ${insc.referenceCode})`);
}
