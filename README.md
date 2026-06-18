# Renta Personas Naturales 2025 — Landing

Landing page del **Seminario-Taller Renta Personas Naturales 2025** de Fenalco Santander.
Stack: **React 18 + Vite + TailwindCSS**. Lista para desplegar en Vercel, Netlify o Render.

---

## 🚀 Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build de producción en /dist
npm run preview      # preview del build
```

## 📂 Estructura

```
landing-project/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json           # config de deploy en Vercel
├── netlify.toml          # config de deploy en Netlify
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── globals.css
    ├── assets/
    │   └── cesar-anzola.png
    └── components/
        ├── Nav.jsx
        ├── Hero.jsx
        ├── Learning.jsx
        ├── Benefits.jsx
        ├── Speaker.jsx
        ├── Pricing.jsx
        ├── CTA.jsx
        └── Footer.jsx
```

## 🎨 Sistema visual

| Token       | Valor       | Uso                                  |
|-------------|-------------|--------------------------------------|
| Verde       | `#00CE7C`   | CTA · highlights · badges            |
| Púrpura     | `#280071`   | Fondos premium · headers             |
| Azul fin.   | `#0C2340`   | Dashboards · tablas · data viz       |
| Turquesa    | `#20D5C4`   | Glow · eyebrows · acentos            |
| Gris ejec.  | `#4B4F54`   | Texto secundario                     |

Tipografía: **Sora** (display), **Inter** (body), **JetBrains Mono** (data / eyebrows).
Cargadas vía Google Fonts en `index.html`.

## 🛠 Personalización rápida

- **Copy**: cada sección está en su propio componente bajo `src/components/`.
- **Precio / fechas**: editar `Pricing.jsx` (constantes `PLANS`) y `Hero.jsx`.
- **Módulos del temario**: editar `Learning.jsx` (constante `TOPICS`).
- **Beneficios**: editar `Benefits.jsx` (constante `BENEFITS`).
- **Foto del docente**: reemplazar `src/assets/cesar-anzola.png`.
- **Tokens de color**: `tailwind.config.js` y `src/styles/globals.css`.
- **CTA WhatsApp**: número y mensaje en `Hero.jsx` y `CTA.jsx` (`wa.me/...`).
- **CTA inscripción**: URL en `Pricing.jsx` y `CTA.jsx`.

## ☁️ Deploy

### Vercel
1. `npm i -g vercel` y luego `vercel` en este directorio. O conecta el repo en
   [vercel.com/new](https://vercel.com/new) — usa el preset **Vite**.
2. Build command: `npm run build` · Output dir: `dist` (incluidos en `vercel.json`).

### Netlify
1. Conecta el repo en [app.netlify.com](https://app.netlify.com) — la config está en `netlify.toml`.
2. Build command: `npm run build` · Publish dir: `dist`.

### Render
1. New → Static Site. Build command: `npm install && npm run build`. Publish dir: `dist`.

## CRM bridge (preinscripciones)

Se implemento un endpoint serverless para guardar preinscripciones en CRM antes del pago:

- `POST /api/crm/preinscripcion` (archivo `api/crm/preinscripcion.js`)
- Reenvia al CRM: `POST /api/public-forms/:slug/inscripciones`

Variables que debes crear en Vercel (Project Settings > Environment Variables):

- `CRM_BASE_URL` (ej: `https://fenalco-crm.onrender.com`)
- `CRM_API_KEY` (SATELITE_API_KEY del CRM)
- `CRM_EVENT_SLUG` (slug del evento en CRM)

Sin estas variables, el formulario no avanzara al pago y mostrara el error correspondiente.

---

© Fenalco Santander · Educación Continua
