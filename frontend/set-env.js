const fs = require('fs');

const envConfigFile = `export const environment = {
  production: true,
  mercadoPagoPublicKey: '${process.env.MERCADO_PAGO_PUBLIC_KEY|| ''}'
};
`;

fs.writeFileSync('./src/environments/environment.prod.ts', envConfigFile);