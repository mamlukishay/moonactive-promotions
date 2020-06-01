import { ObjectId } from 'mongodb';

export type UnsavedPromotion = {
  'Start Date': Date;
} & Record<string, unknown>;

export type Promotion = {
  _id: ObjectId;
} & UnsavedPromotion;
