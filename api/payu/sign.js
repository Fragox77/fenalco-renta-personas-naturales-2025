import crypto from 'crypto';
import { MongoClient } from 'mongodb';

// Reusa la conexión entre invocaciones de la función serverless
let cachedClient = null;

async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGO_URI);
    await cachedClient.connect();
  }
  return cachedClient.db('fenalco_crm');
}

/**
 * POST /api/payu/sign
 *
 * Recibe los datos del formulario, genera referenceCode + firma MD5 de PayU,
 * y persiste la inscripción en MongoDB como PENDING antes de redirigir.
 *
 * Body esperado (JSON):
 *   { amount, description, buyerEmail, buyerFullName, metadata: { ...datosForm } }
 *
 * Respuesta:
 *   { referenceCode, signature, amount }
 */
export default async function handler(req, res) {
  // CORS — permite llamadas desde la propia landing en Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { PAYU_API_KEY, PAYU_MERCHANT_ID } = process.env;
  if (!PAYU_API_KEY || !PAYU_MERCHANT_ID) {
    console.error('Faltan variables de entorno PAYU_API_KEY / PAYU_MERCHANT_ID');
    return res.status(500).json({ error: 'Configuración de pago incompleta' });
  }

  const { amount, description, buyerEmail, buyerFullName, metadata } = req.body || {};

  if (!amount || !buyerEmail) {
    return res.status(400).json({ error: 'amount y buyerEmail son obligatorios' });
  }

  // Referencia única por transacción
  const referenceCode =
    'RPN25-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();

  // PayU exige amount con exactamente 2 decimales en la firma
  const amountStr = Number(amount).toFixed(2);
  const currency = 'COP';

  // Firma: MD5("ApiKey~merchantId~referenceCode~amount~currency")
  const signature = crypto
    .createHash('md5')
    .update(`${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${amountStr}~${currency}`)
    .digest('hex');

  // Persistir inscripción como PENDING antes de redirigir a PayU
  try {
    const db = await getDb();
    await db.collection('inscripciones_renta').insertOne({
      referenceCode,
      estado: 'PENDING',
      amount: Number(amount),
      description: description || '',
      buyerEmail: buyerEmail.toLowerCase().trim(),
      buyerFullName: buyerFullName || '',
      // Datos del formulario: nombre, doc, tel, ciudad, empresa, cargo,
      // esAfiliado, participantes, modalidad, necesitaFactura, razonSocial, nit, ...
      ...(metadata || {}),
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    });
  } catch (e) {
    // No bloqueamos el pago si falla MongoDB — lo logueamos y seguimos
    console.error('[sign] MongoDB error:', e.message);
  }

  return res.status(200).json({ referenceCode, signature, amount: amountStr });
}
