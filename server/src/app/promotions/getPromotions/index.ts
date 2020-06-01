import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import getPromotionsCollection from '../../../collections/getPromotionsCollection';
import { logger } from '../../../server/logger';
import { schema } from './schema';

async function getPromotions(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      error: validationError,
      value: { fromStartDateTS, count },
    } = schema.validate(req.query);

    if (validationError) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        error: validationError,
      });
    }

    const promotionsCollection = await getPromotionsCollection();
    const query = fromStartDateTS ? { 'Start Date': { $lte: new Date(fromStartDateTS) } } : {};

    const result = await promotionsCollection
      .find(query)
      .limit(count)
      .sort({ 'Start Date': -1 })
      .toArray();

    res.status(httpStatusCodes.OK);
    res.json({ count: result.length, records: result });
  } catch (error) {
    next(error);
  }
}

export { getPromotions };
