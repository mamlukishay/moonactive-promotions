export const config = {
  port: 6006,
  db: {
    mongo: {
      url: process.env.MONGO_URL,
      user: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
    },
  },
  logging: {
    logLevel: 'debug',
  },
  defaults: {
    promotionsLimit: 100,
  },
  collections: {
    promotions: 'promotions',
  },
};
