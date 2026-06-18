export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Metodo no permitido' });
  }

  const baseUrl = process.env.CRM_BASE_URL;
  const apiKey = process.env.CRM_API_KEY;
  const eventSlug = process.env.CRM_EVENT_SLUG;

  if (!baseUrl || !apiKey || !eventSlug) {
    return res.status(500).json({
      message: 'Faltan variables CRM_BASE_URL, CRM_API_KEY o CRM_EVENT_SLUG en Vercel.',
    });
  }

  let body = req.body || {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body || '{}');
    } catch {
      return res.status(400).json({ message: 'Body JSON invalido.' });
    }
  }

  if (!body.nombre || !String(body.nombre).trim()) {
    return res.status(400).json({ message: 'El nombre es obligatorio.' });
  }

  const mensaje = String(body.mensaje || '').trim();
  const ciudad = String(body.ciudad || '').trim();
  const observaciones = [ciudad && `Ciudad: ${ciudad}`, mensaje && `Mensaje: ${mensaje}`].filter(Boolean).join(' | ');

  const payload = {
    nombre: String(body.nombre || '').trim(),
    apellido: '-',
    cedula: '-',
    email: String(body.email || '').trim(),
    telefono: String(body.tel || body.telefono || '').trim(),
    cargo: '-',
    empresa: '-',
    origen: 'lead',
    observaciones,
    consentimiento: { autorizado: true, version: 'rpn-2025-v1' },
  };

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/public-forms/${encodeURIComponent(eventSlug)}/inscripciones`;

  try {
    const crmRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const raw = await crmRes.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { raw };
    }

    if (!crmRes.ok) {
      return res.status(502).json({
        message: data?.message || 'CRM rechazo el lead.',
        crmStatus: crmRes.status,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead guardado en CRM.',
      crmResponse: data,
    });
  } catch (error) {
    return res.status(502).json({
      message: 'No se pudo conectar con el CRM.',
      detail: error?.message || 'Error desconocido',
    });
  }
}
