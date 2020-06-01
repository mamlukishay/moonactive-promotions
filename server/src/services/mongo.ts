import { MongoClient } from 'mongodb';
import { config } from '../config';
import { logger } from '../server/logger';

let connectPromise: Promise<MongoClient> = null;
const client = new MongoClient(config.db.mongo.url, {
  auth: {
    user: config.db.mongo.user,
    password: config.db.mongo.password,
  },
});

/**
 * This will return a connected client or a Promise for one if not connected yet.
 * A few consumers that come while the connection is being made will all receive the same Promise
 */
async function connectedClient() {
  if (client.isConnected()) {
    return client;
  }

  if (connectPromise) {
    return connectPromise;
  }

  logger.info('Connecting to mongo');
  connectPromise = client
    .connect()
    .then(() => {
      logger.info('*** Mongo connected ***');
      return client;
    })
    .catch(error => {
      logger.error('*** Mongo connection failed ***', error);
      throw error;
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}

export { connectedClient };
