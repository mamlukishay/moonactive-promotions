import { app } from './server/express';
import { logger } from './server/logger';
import { config } from './config';

const { port } = config;

if (!port) {
  throw new Error(`Port is not defined. Can't start server.`);
}

app.listen(port, () => logger.info(`*** Server is listening on port ${port} ***`));
