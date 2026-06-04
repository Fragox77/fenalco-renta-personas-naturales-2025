const EXPECTED_URLS = {
  sandbox: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
  production: 'https://checkout.payulatam.com/ppp-web-gateway-payu/',
};

const SANDBOX_MERCHANT_ID = '508029';
const SANDBOX_ACCOUNT_ID = '512321';

const requiredVars = [
  'PAYU_MERCHANT_ID',
  'PAYU_ACCOUNT_ID',
  'PAYU_API_KEY',
  'PAYU_API_LOGIN',
  'PAYU_TEST',
];

const missing = requiredVars.filter((name) => !String(process.env[name] || '').trim());

const errors = [];
const warnings = [];

if (missing.length > 0) {
  errors.push(`Faltan variables requeridas: ${missing.join(', ')}`);
}

const isSandbox = String(process.env.PAYU_TEST || '1').trim() === '1';
const envName = isSandbox ? 'sandbox' : 'production';

const merchantId = String(process.env.PAYU_MERCHANT_ID || '').trim();
const accountId = String(process.env.PAYU_ACCOUNT_ID || '').trim();
const actionUrl = String(process.env.PAYU_ACTION_URL || '').trim();
const responseUrl = String(process.env.PAYU_RESPONSE_URL || '').trim();
const confirmationUrl = String(process.env.PAYU_CONFIRMATION_URL || '').trim();

if (actionUrl) {
  const expected = EXPECTED_URLS[envName];
  if (actionUrl !== expected) {
    errors.push(
      `PAYU_ACTION_URL no coincide con ${envName}. Esperado: ${expected} | Recibido: ${actionUrl}`,
    );
  }
} else {
  warnings.push(
    `PAYU_ACTION_URL no esta definido. Se recomienda fijarlo explicitamente para ${envName}: ${EXPECTED_URLS[envName]}`,
  );
}

if (!isSandbox) {
  if (merchantId === SANDBOX_MERCHANT_ID || accountId === SANDBOX_ACCOUNT_ID) {
    errors.push('PAYU_TEST=0 pero PAYU_MERCHANT_ID/PAYU_ACCOUNT_ID parecen credenciales de sandbox.');
  }

  if (responseUrl && !responseUrl.startsWith('https://')) {
    errors.push('PAYU_RESPONSE_URL debe usar HTTPS en produccion.');
  }
  if (confirmationUrl && !confirmationUrl.startsWith('https://')) {
    errors.push('PAYU_CONFIRMATION_URL debe usar HTTPS en produccion.');
  }

  if (!responseUrl) {
    warnings.push('Falta PAYU_RESPONSE_URL para validar retorno del checkout en produccion.');
  }
  if (!confirmationUrl) {
    warnings.push('Falta PAYU_CONFIRMATION_URL para validar webhook en produccion.');
  }
}

console.log(`\nValidacion PayU (${envName})`);
console.log('----------------------------------------');
console.log(`PAYU_TEST=${isSandbox ? '1 (sandbox)' : '0 (production)'}`);
console.log(`PAYU_MERCHANT_ID=${merchantId || '(vacio)'}`);
console.log(`PAYU_ACCOUNT_ID=${accountId || '(vacio)'}`);

if (warnings.length > 0) {
  console.log('\nAdvertencias:');
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('\nErrores:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('\nOK: configuracion PayU consistente para el entorno actual.');