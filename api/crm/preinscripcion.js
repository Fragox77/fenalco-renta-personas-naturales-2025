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

  const payload = {
    nombre: String(body.nombre || '').trim(),
    apellido: String(body.apellido || '').trim(),
    cedula: String(body.doc || body.cedula || '').trim(),
    email: String(body.email || '').trim(),
    telefono: String(body.tel || body.telefono || '').trim(),
    cargo: String(body.cargo || '').trim(),
    empresa: String(body.empresa || body.razonSocial || '').trim(),
    tipoAfiliacionDeclarada: body.esAfiliado ? 'afiliado' : 'no_afiliado',
    consentimiento: {
      autorizado: Boolean(body.acepta),
      version: 'rpn-2025-v1',
    },
    respuestas: {
      modalidad: String(body.modalidad || ''),
      participantes: String(body.participantes || 1),
      requiereFactura: body.necesitaFactura ? 'si' : 'no',
      metodoPago: String(body.metodo || ''),
    },
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
        message: data?.message || 'CRM rechazo la preinscripcion.',
        crmStatus: crmRes.status,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Preinscripcion guardada en CRM.',
      crmResponse: data,
    });
  } catch (error) {
    return res.status(502).json({
      message: 'No se pudo conectar con el CRM.',
      detail: error?.message || 'Error desconocido',
    });
  }
}
