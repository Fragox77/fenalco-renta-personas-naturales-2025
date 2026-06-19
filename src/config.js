// Configuración central del evento, tarifas y pasarela de pago.
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

// Tarifas en COP. La lógica es declarativa (toggle "soy afiliado").
export const TARIFAS = {
  full:        500000,   // precio de referencia (tachado)
  afiliado:    380000,   // tarifa afiliado
  particular:  400000,   // tarifa particular
  corporativo: 332500,   // por persona, afiliado 3+
};

export const CORPORATIVO_MIN = 3;

export function calcularTarifa({ esAfiliado, participantes }) {
  if (esAfiliado && participantes >= CORPORATIVO_MIN) return TARIFAS.corporativo;
  return TARIFAS.full;
}

export function fmtCOP(n) {
  return '$ ' + n.toLocaleString('es-CO');
}

