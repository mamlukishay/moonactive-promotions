import faker from 'faker';
import { UnsavedPromotion } from '../types';

export function generateInitialPromotions(recordsCount: number): UnsavedPromotion[] {
  const items: UnsavedPromotion[] = [];

  for (let i = 0; i < recordsCount; i++) {
    items.push({
      Name: faker.lorem.sentence(),
      Type: faker.random.arrayElement(['Basic', 'Common', 'Epic']),
      'Start Date': faker.date.past(),
      'End Date': faker.date.future().toISOString(),
      'User Group': faker.random.arrayElement(['Group1', 'Group2', 'Group3', 'Group4']),
    });
  }

  return items;
}
