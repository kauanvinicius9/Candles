const fs = require('fs');

const envConfigFile = `export const environment = {
  production: true,
  mercadoPagoAccessToken: '${process.env.MERCADO_PAGO_ACCESS_TOKEN || ''}'
};
`;

fs.writeFileSync('./src/environments/environment.prod.ts', envConfigFile);