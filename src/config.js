// Configuración central del evento, tarifas y PayU.
// Editar AQUÍ cambia precios/fechas en toda la app (landing + inscripción).

export const EVENT = {
  nombre: 'Renta Personas Naturales 2025',
  subtitulo: 'Seminario · Taller — Año fiscal 2025',
  fecha: '02 de julio de 2025',
  horario: '08:00 — 17:00',
  intensidad: '8 horas',
  sede: 'Sede Fenalco Santander · Cra. 20 #36-49, Bucaramanga',
  docente: 'Cesar Ánzola Aguilar',
  contactoNombre: 'Lilibeth Quintanilla',
  contactoTel: '+57 310 235 5262',
  contactoWa: '573102355262',
  email: 'educacioncontinua@fenalcosantander.com.co',
  sitio: 'https://fenalcosantander.com.co/formacion/',
};

// Tarifas en COP. La lógica de preventa es declarativa (toggle "soy afiliado").
export const TARIFAS = {
  full: 500000,           // referencia (tachada)
  afiliado: 380000,       // preventa afiliado
  particular: 400000,     // preventa particular
  corporativo: 332500,    // por persona, afiliado 3+
};

// Umbral para tarifa corporativa
export const CORPORATIVO_MIN = 3;

// Calcula tarifa unitaria según condición + nº participantes
export function calcularTarifa({ esAfiliado, participantes }) {
  if (esAfiliado && participantes >= CORPORATIVO_MIN) return TARIFAS.corporativo;
  if (esAfiliado) return TARIFAS.afiliado;
  return TARIFAS.particular;
}

export function fmtCOP(n) {
  return '$ ' + n.toLocaleString('es-CO');
}

// --- PayU WebCheckout (sandbox por defecto) ---
// ⚠️ apiKey y la firma JAMÁS van en el frontend. Ver BACKEND.md.
// merchantId / accountId son públicos; la firma se solicita al backend.
export const PAYU = {
  // URL de WebCheckout — sandbox vs producción
  actionUrl: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
  // Credenciales públicas de SANDBOX (de la doc oficial PayU LATAM)
  merchantId: '508029',
  accountId: '512321',     // Colombia COP sandbox
  currency: 'COP',
  test: 1,                  // 1 = prueba, 0 = producción
  // Endpoint de TU backend que devuelve { referenceCode, signature, amount }
  signEndpoint: '/api/payu/sign',
  // URLs de respuesta/confirmación (ajusta el dominio en producción)
  responseUrl: window.location.origin + '/#/resultado',
  confirmationUrl: window.location.origin + '/api/payu/confirmation',
};
