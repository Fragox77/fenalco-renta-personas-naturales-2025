const crypto = require('crypto');
const https = require('https');

function generateSalt(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

function rapydRequest({ method, urlPath, body, accessKey, secretKey }) {
  const salt = generateSalt();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const bodyString = body ? JSON.stringify(body) : '';

  const toSign = method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;
  const signature = crypto.createHmac('sha256', secretKey).update(toSign).digest('hex');
  const signatureBase64 = Buffer.from(signature, 'utf8').toString('base64');

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'sandboxapi.rapyd.net',
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
    if (bodyString) req.write(bodyString);
    req.end();
  });
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch { return null; }
  }
  return req.body;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo no permitido' });
  }

  const accessKey = (process.env.RAPYD_ACCESS_KEY || '').trim();
  const secretKey = (process.env.RAPYD_SECRET_KEY || '').trim();

  if (!accessKey || !secretKey) {
    return res.status(500).json({
      error: 'Faltan variables RAPYD_ACCESS_KEY o RAPYD_SECRET_KEY en el servidor.',
    });
  }

  const body = parseBody(req);
  if (!body) {
    return res.status(400).json({ error: 'Body JSON invalido.' });
  }

  const amount = Number(body.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'amount debe ser un numero mayor que 0.' });
  }

  const currency = String(body.currency || 'COP').toUpperCase();
  const refCode = `RPN25-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const buyerName = [body.nombre, body.apellido].filter(Boolean).join(' ') || '';

  const checkoutBody = {
    amount,
    currency,
    country: 'CO',
    merchant_reference_id: refCode,
    complete_checkout_url: body.successUrl || '',
    cancel_checkout_url: body.errorUrl || '',
    error_checkout_url: body.errorUrl || '',
    language: 'es',
    metadata: {
      producto: body.producto || 'renta_2025',
      buyerEmail: body.email || '',
      buyerName,
      buyerPhone: body.telefono || '',
      documento: body.documento || '',
      ciudad: body.ciudad || '',
      razonSocial: body.razonSocial || '',
      direccion: body.direccion || '',
      cargo: body.cargo || '',
      modalidad: body.modalidad || '',
      participantes: body.participantes || 1,
      esAfiliado: body.esAfiliado || false,
    },
  };

  try {
    const result = await rapydRequest({
      method: 'post',
      urlPath: '/v1/checkout',
      body: checkoutBody,
      accessKey,
      secretKey,
    });

    if (result.status && result.status.status === 'SUCCESS' && result.data) {
      return res.status(200).json({
        checkoutUrl: result.data.redirect_url,
        checkoutId: result.data.id,
        referenceCode: refCode,
      });
    }

    console.error('[rapyd-checkout] Error response', JSON.stringify(result));
    return res.status(502).json({
      error: result.status?.message || 'Error al crear checkout en Rapyd.',
    });
  } catch (err) {
    console.error('[rapyd-checkout] Request failed', err);
    return res.status(502).json({ error: 'No se pudo conectar con Rapyd.' });
  }
};
