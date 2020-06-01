import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import _ from 'lodash';
import { ObjectID } from 'mongodb';
import getPromotionsCollection from '../../../collections/getPromotionsCollection';
import { paramsSchema } from './schema';

async function editPromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      error: validationError,
      value: { id },
    } = paramsSchema.validate(req.params);

    if (validationError) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        error: validationError.message,
      });
    }

    const itemIdToEdit = new ObjectID(id);
    const promotionsCollection = await getPromotionsCollection();
    const itemToEdit = await promotionsCollection.findOne({
      _id: itemIdToEdit,
    });
    if (!itemToEdit) {
      return res.sendStatus(httpStatusCodes.NOT_FOUND);
    }

    // Make sure only fields that belong to the requested item are given
    const fieldsMismatch = _.difference(_.keys(req.body), _.keys(itemToEdit)).length > 0;
    if (fieldsMismatch) {
      return res
        .json({ error: "Update payload fields don't match record fields}" })
        .status(httpStatusCodes.BAD_REQUEST);
    }

    const updateFields = Object.assign(
      {},
      req.body,
      req.body['Start Date'] ? { 'Start Date': new Date(req.body['Start Date']) } : {},
    );
    const updateResult = await promotionsCollection.updateOne(
      { _id: itemIdToEdit },
      { $set: updateFields },
    );
    const updatedRecord = await promotionsCollection.findOne({ _id: itemIdToEdit });

    return res
      .json({ count: updateResult.modifiedCount, updatedRecord })
      .status(httpStatusCodes.OK);
  } catch (error) {
    next(error);
  }
}

export { editPromotion };
