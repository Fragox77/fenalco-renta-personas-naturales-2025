import crypto from 'crypto';
import https from 'https';

function generateSalt(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function rapydRequest({ method, urlPath, accessKey, secretKey }) {
  const salt = generateSalt();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyString = '';

  const toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
  const signature = crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
  const signatureBase64 = Buffer.from(signature, 'utf8').toString('base64');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.rapyd.net',
      path: urlPath,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        'access_key': accessKey,
        'salt': salt,
        'timestamp': timestamp,
        'signature': signatureBase64,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Respuesta invalida de Rapyd'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function resolvePaymentStatus(checkout) {
  const paymentStatus = checkout.payment?.status;
  const checkoutStatus = checkout.status;

  if (paymentStatus === 'CLO') return 'approved';
  if (['ACT', 'NEW'].includes(paymentStatus)) return 'pending';
  if (['CAN', 'ERR', 'EXP'].includes(paymentStatus)) return 'rejected';

  if (checkoutStatus === 'DON') return 'approved';
  if (checkoutStatus === 'NEW' || checkoutStatus === 'ACT') return 'pending';
  if (['CAN', 'ERR', 'EXP'].includes(checkoutStatus)) return 'rejected';

  return 'pending';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  const accessKey = (process.env.RAPYD_ACCESS_KEY || '').trim();
  const secretKey = (process.env.RAPYD_SECRET_KEY || '').trim();

  if (!accessKey || !secretKey) {
    return res.status(500).json({ error: 'Faltan variables RAPYD en el servidor.' });
  }

  const checkoutId = String(req.query?.id || '').trim();
  if (!checkoutId) {
    return res.status(400).json({ error: 'Falta el parametro id (checkout_id).' });
  }

  try {
    const result = await rapydRequest({
      method: 'get',
      urlPath: `/v1/checkout/${checkoutId}`,
      accessKey,
      secretKey,
    });

    if (result.status?.status !== 'SUCCESS' || !result.data) {
      return res.status(502).json({
        error: result.status?.message || 'No se pudo consultar el checkout.',
      });
    }

    const checkout = result.data;
    const paymentStatus = resolvePaymentStatus(checkout);

    return res.status(200).json({
      status: paymentStatus,
      checkoutStatus: checkout.status,
      paymentId: checkout.payment?.id || null,
      paymentMethodType: checkout.payment?.payment_method_type_category || null,
      amount: checkout.amount,
      currency: checkout.currency,
      merchantReferenceId: checkout.merchant_reference_id,
    });
  } catch (err) {
    console.error('[rapyd-status] Request failed', err);
    return res.status(502).json({ error: 'No se pudo conectar con Rapyd.' });
  }
}
