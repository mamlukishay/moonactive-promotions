import { NextFunction, Request, Response } from 'express';
import getPromotionsCollection from '../../../collections/getPromotionsCollection';
import { UnsavedPromotion } from '../types';
import { generateInitialPromotions } from './generateInitialPromotions';

async function initPromotionsCollection(items: UnsavedPromotion[]) {
  const promotionsCollection = await getPromotionsCollection();
  await promotionsCollection.drop();
  const insertResult = await promotionsCollection.insertMany(items);
  promotionsCollection.createIndex({ 'Start Date': -1 });
  return insertResult;
}

async function populateInitialData(req: Request, res: Response, next: NextFunction) {
  const PROMOTIONS_COUNT = 10_000;

  try {
    const items = generateInitialPromotions(PROMOTIONS_COUNT);
    const insertResult = await initPromotionsCollection(items);

    res.json({ count: insertResult.insertedCount }).status(201);
  } catch (error) {
    next(error);
  }
}

export { populateInitialData };
