const crypto = require('crypto');

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return null;
    }
  }
  return req.body;
}

function createReferenceCode() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RPN25-${Date.now()}-${random}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const { PAYU_API_KEY, PAYU_MERCHANT_ID } = process.env;
  if (!PAYU_API_KEY || !PAYU_MERCHANT_ID) {
    return res.status(500).json({
      message: 'Faltan variables PAYU_API_KEY o PAYU_MERCHANT_ID en el servidor.',
    });
  }

  const body = parseBody(req);
  if (body === null) {
    return res.status(400).json({ message: 'Body JSON invalido.' });
  }

  const amountNumber = Number(body.amount);
  if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
    return res.status(400).json({ message: 'amount debe ser un numero mayor que 0.' });
  }

  const currency = String(body.currency || 'COP').toUpperCase();
  const amount = amountNumber.toFixed(2);
  const referenceCode = createReferenceCode();
  const signatureRaw = `${PAYU_API_KEY}~${PAYU_MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
  const signature = crypto.createHash('md5').update(signatureRaw).digest('hex');

  return res.status(200).json({
    referenceCode,
    signature,
    amount,
    currency,
  });
};