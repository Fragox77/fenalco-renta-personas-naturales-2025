import crypto from 'crypto';

function getHeader(req, name) {
  return req.headers?.[name] || req.headers?.[name.toLowerCase()] || '';
}

function getBodyString(req) {
  if (typeof req.body === 'string') {
    return req.body;
  }
  if (req.body && typeof req.body === 'object') {
    return JSON.stringify(req.body);
  }
  return '';
}

function toUrlSafeBase64(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeSignature(value) {
  return String(value || '').trim();
}

function safeEqual(a, b) {
  const sa = Buffer.from(String(a));
  const sb = Buffer.from(String(b));
  if (sa.length !== sb.length) return false;
  return crypto.timingSafeEqual(sa, sb);
}

function verifyRapydWebhookSignature({ webhookUrl, salt, timestamp, accessKey, secretKey, bodyString, signature }) {
  const toSign = `${webhookUrl}${salt}${timestamp}${accessKey}${secretKey}${bodyString}`;

  const hmac = crypto.createHmac('sha256', secretKey).update(toSign).digest();
  const digestHex = hmac.toString('hex');

  // Rapyd docs/code samples often represent HASH as hex, then BASE64 of that hex string.
  const base64Hex = Buffer.from(digestHex, 'utf8').toString('base64');
  const base64HexUrlSafe = toUrlSafeBase64(base64Hex);

  // Some integrations validate against raw digest Base64.
  const base64Raw = hmac.toString('base64');
  const base64RawUrlSafe = toUrlSafeBase64(base64Raw);

  const incoming = normalizeSignature(signature);
  return [base64Hex, base64HexUrlSafe, base64Raw, base64RawUrlSafe].some((candidate) => safeEqual(incoming, candidate));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const secretKey = String(process.env.RAPYD_SECRET_KEY || '').trim();
  const expectedAccessKey = String(process.env.RAPYD_ACCESS_KEY || '').trim();
  const configuredWebhookUrl = String(process.env.RAPYD_WEBHOOK_URL || '').trim();
  const logBodyEnabled = String(process.env.RAPYD_LOG_WEBHOOK_BODY || '1').trim() === '1';

  if (!secretKey || !expectedAccessKey) {
    return res.status(500).json({
      message: 'Faltan variables RAPYD_SECRET_KEY o RAPYD_ACCESS_KEY en el servidor.',
    });
  }

  const salt = String(getHeader(req, 'salt') || '').trim();
  const timestamp = String(getHeader(req, 'timestamp') || '').trim();
  const accessKey = String(getHeader(req, 'access_key') || '').trim();
  const signature = String(getHeader(req, 'signature') || '').trim();

  if (!salt || !timestamp || !accessKey || !signature) {
    return res.status(400).json({
      message: 'Faltan headers de autenticacion Rapyd: salt, timestamp, access_key o signature.',
    });
  }

  if (!safeEqual(accessKey, expectedAccessKey)) {
    return res.status(401).json({ message: 'access_key invalido.' });
  }

  const host = String(getHeader(req, 'x-forwarded-host') || getHeader(req, 'host') || '').trim();
  const protocol = String(getHeader(req, 'x-forwarded-proto') || 'https').trim();
  const actualWebhookUrl = host ? `${protocol}://${host}${req.url}` : req.url;
  const webhookUrl = configuredWebhookUrl || actualWebhookUrl;

  const bodyString = getBodyString(req);
  const isValid = verifyRapydWebhookSignature({
    webhookUrl,
    salt,
    timestamp,
    accessKey,
    secretKey,
    bodyString,
    signature,
  });

  if (!isValid) {
    return res.status(401).json({ message: 'Firma webhook Rapyd invalida.' });
  }

  let parsedBody = {};
  if (typeof req.body === 'string') {
    try {
      parsedBody = req.body ? JSON.parse(req.body) : {};
    } catch {
      parsedBody = { raw: req.body };
    }
  } else if (req.body && typeof req.body === 'object') {
    parsedBody = req.body;
  }

  const eventType = parsedBody?.type || parsedBody?.data?.type || 'unknown';
  const eventId = parsedBody?.id || parsedBody?.data?.id || 'unknown';
  const status = parsedBody?.data?.status || parsedBody?.status || 'unknown';

  console.log('[rapyd-webhook] Evento recibido', {
    eventType,
    eventId,
    status,
    webhookUrl,
    timestamp,
  });

  if (logBodyEnabled) {
    console.log('[rapyd-webhook] Payload', bodyString);
  }

  // TODO: Persistir estado de pago/inscripcion en DB segun eventType y status.
  return res.status(200).json({ received: true });
}