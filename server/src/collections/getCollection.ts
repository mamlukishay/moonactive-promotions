import { connectedClient } from '../services/mongo';

export default async function getCollection<C>(name: string) {
  const db = (await connectedClient()).db();
  return db.createCollection<C>(name);
}
