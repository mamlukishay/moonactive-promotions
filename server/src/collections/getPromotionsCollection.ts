import { Promotion } from '../app/promotions/types';
import { config } from '../config';
import { connectedClient } from '../services/mongo';

export default async function getPromotionsCollection() {
  const db = (await connectedClient()).db();
  return db.collection<Promotion>(config.collections.promotions);
}
