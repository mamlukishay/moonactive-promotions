import { Application } from 'express';
import { router as promotionsRouter } from '../app/promotions/router';

function registerAll(app: Application) {
  app.use('/promotions', promotionsRouter);
}

export { registerAll };
