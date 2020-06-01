import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { ObjectID } from 'mongodb';
import getPromotionsCollection from '../../../collections/getPromotionsCollection';
import { logger } from '../../../server/logger';
import { schema } from './schema';

async function duplicatePromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      error: validationError,
      value: { id: promotionIdToClone },
    } = schema.validate(req.params);

    if (validationError) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        error: validationError.message,
      });
    }

    const promotionsCollection = await getPromotionsCollection();

    const promotionToClone = await promotionsCollection.findOne({
      _id: new ObjectID(promotionIdToClone),
    });

    if (!promotionToClone) {
      return res.sendStatus(httpStatusCodes.NOT_FOUND);
    }

    delete promotionToClone._id;
    const result = await promotionsCollection.insertOne(promotionToClone);
    const createdPromotion = result.ops[0];

    res.status(httpStatusCodes.CREATED);
    res.json({ count: result.insertedCount, createdRecord: createdPromotion });
  } catch (error) {
    next(error);
  }
}

export { duplicatePromotion };
