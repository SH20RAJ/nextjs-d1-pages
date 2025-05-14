const path = require('path');
const { PrismaD1HTTP } = require('@prisma/adapter-d1');
require('dotenv/config');

module.exports = {
  earlyAccess: true,
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    async adapter(env) {
      return new PrismaD1HTTP({
        CLOUDFLARE_D1_TOKEN: env.CLOUDFLARE_D1_TOKEN,
        CLOUDFLARE_ACCOUNT_ID: env.CLOUDFLARE_ACCOUNT_ID,
        CLOUDFLARE_DATABASE_ID: env.CLOUDFLARE_DATABASE_ID,
      });
    },
  },
};
