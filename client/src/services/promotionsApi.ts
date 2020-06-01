import axios from 'axios';
import { omit } from 'lodash-es';
import config from '../config';
import { Promotion } from '../types';

interface GetPromotionsResponseBody {
  count: number;
  records: Promotion[];
}

interface DupPromotionResponseBody {
  count: number;
  createdRecord: Promotion;
}

interface UpdatePromotionResponseBody {
  count: number;
  updatedRecord: Promotion;
}

interface DeletePromotionResponseBody {
  count: number;
}

export interface GetPromotionsQuery {
  fromStartDateTS?: number;
  count: number;
}

const promotionsBaseUrl = `${config.backend.serverUrl}/promotions`;

async function fetchPromotions(query: GetPromotionsQuery) {
  const { data } = await axios.get<GetPromotionsResponseBody>(promotionsBaseUrl, {
    params: query,
  });
  return data;
}

async function deletePromotion(recordIdToDelete: string) {
  const { data } = await axios.delete<DeletePromotionResponseBody>(
    `${promotionsBaseUrl}/${recordIdToDelete}`,
  );
  return data;
}

async function updatePromotion(recordToUpdate: Promotion) {
  const recordId = recordToUpdate._id;
  const payload = omit(recordToUpdate, ['_id']);
  const { data } = await axios.patch<UpdatePromotionResponseBody>(
    `${promotionsBaseUrl}/${recordId}`,
    payload,
  );
  return data;
}

async function duplicatePromotion(recordIdToDuplicate: string) {
  const { data } = await axios.post<DupPromotionResponseBody>(
    `${promotionsBaseUrl}/${recordIdToDuplicate}/duplicate`,
  );
  return data;
}

async function resetPromotionsData() {
  const { data } = await axios.post(`${promotionsBaseUrl}/init`);
  return data;
}

export default {
  resetPromotionsData,
  duplicatePromotion,
  updatePromotion,
  deletePromotion,
  fetchPromotions,
};
