import express from 'express';
import { deletePromotion } from './deletePromotion';
import { duplicatePromotion } from './duplicatePromotion';
import { editPromotion } from './editPromotion';
import { getPromotions } from './getPromotions';
import { populateInitialData } from './populateInitialData';

const router = express.Router();
router.get('/', getPromotions);
router.delete('/:id', deletePromotion);
router.post('/:id/duplicate', duplicatePromotion);
router.patch('/:id', editPromotion);
router.post('/init', populateInitialData);

export { router };
