import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import { ObjectID } from 'mongodb';
import getPromotionsCollection from '../../../collections/getPromotionsCollection';
import { schema } from './schema';

async function deletePromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      error: validationError,
      value: { id },
    } = schema.validate(req.params);

    if (validationError) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        error: validationError.message,
      });
    }

    const itemIdToDelete = new ObjectID(id);
    const promotionsCollection = await getPromotionsCollection();
    const result = await promotionsCollection.deleteOne({ _id: itemIdToDelete });

    res.json({ count: result.deletedCount }).status(httpStatusCodes.OK);
  } catch (error) {
    next(error);
  }
}

export { deletePromotion };
