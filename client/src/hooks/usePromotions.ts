import without from 'lodash-es/without';
import React from 'react';
import promotionsApi, { GetPromotionsQuery } from '../services/promotionsApi';
import { Promotion, PromotionTableItem } from '../types';
import usePromotionsReducer, { PromotionsActionTypes } from './usePromotionsReducer';

export default function usePromotions(bulkSize: number) {
  const [state, dispatch] = usePromotionsReducer(bulkSize);

  const fetchPromotions = React.useCallback(async (query: GetPromotionsQuery) => {
    return promotionsApi.fetchPromotions(query);
  }, []);

  const fetchBulk = React.useCallback(
    (fromStartDateTS?: number) =>
      fetchPromotions({
        count: bulkSize,
        fromStartDateTS,
      }),
    [bulkSize, fetchPromotions],
  );

  const loadInitialData = React.useCallback(async () => {
    try {
      dispatch({ type: PromotionsActionTypes.FETCHING });
      const { records, count } = await fetchPromotions({ count: bulkSize });
      dispatch({ type: PromotionsActionTypes.SET_INITIAL_RECORDS, payload: records });

      const earliestRecord = records[count - 1];
      const { records: moreRecords } = await fetchBulk(
        Date.parse(earliestRecord['Start Date']) - 1,
      );
      dispatch({ type: PromotionsActionTypes.CACHE_RECORDS, payload: moreRecords });
      dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
    } catch (error) {
      dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
    }
  }, [bulkSize, fetchBulk, fetchPromotions, dispatch]);

  const loadMore = React.useCallback(
    async callback => {
      const cache = state.cache;

      try {
        dispatch({ type: PromotionsActionTypes.FETCHING });
        dispatch({ type: PromotionsActionTypes.ADVANCE_RECORDS });
        const earliestTimestamp = Date.parse(cache[cache.length - 1]['Start Date']);
        const { records } = await fetchBulk(earliestTimestamp - 1);
        dispatch({ type: PromotionsActionTypes.CACHE_RECORDS, payload: records });
        await callback();
        dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
      } catch (error) {
        dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
      }
    },
    [fetchBulk, state, dispatch],
  );

  const deletePromotion = React.useCallback(promotionsApi.deletePromotion, []);

  const deleteRecord = React.useCallback(
    async (recordToDelete: Promotion) => {
      try {
        dispatch({ type: PromotionsActionTypes.FETCHING });
        await deletePromotion(recordToDelete._id);
        dispatch({ type: PromotionsActionTypes.DELETE_RECORD, payload: recordToDelete });
        dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
      } catch (error) {
        dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
      }
    },
    [deletePromotion, dispatch],
  );

  const updatePromotion = React.useCallback(recordToUpdate => {
    return promotionsApi.updatePromotion(recordToUpdate);
  }, []);

  const updateRecord = React.useCallback(
    async (recordToUpdate: Partial<Promotion>) => {
      try {
        dispatch({ type: PromotionsActionTypes.FETCHING });
        await updatePromotion(recordToUpdate);
        dispatch({ type: PromotionsActionTypes.UPDATE_RECORD, payload: recordToUpdate });
        dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
      } catch (error) {
        dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
      }
    },
    [updatePromotion, dispatch],
  );

  const duplicatePromotion = React.useCallback(async recordIdToDuplicate => {
    const { createdRecord } = await promotionsApi.duplicatePromotion(recordIdToDuplicate);
    return createdRecord;
  }, []);

  const duplicateRecord = React.useCallback(
    async (recordIdToDuplicate: string) => {
      try {
        dispatch({ type: PromotionsActionTypes.FETCHING });
        const newRecord = await duplicatePromotion(recordIdToDuplicate);
        dispatch({ type: PromotionsActionTypes.ADD_VISIBLE_RECORD, payload: newRecord });
        dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
      } catch (error) {
        dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
      }
    },
    [duplicatePromotion, dispatch],
  );

  const toggleEditPane = React.useCallback(
    (record: Promotion) => dispatch({ type: PromotionsActionTypes.EDIT_RECORD, payload: record }),
    [dispatch],
  );

  const closeEditPane = React.useCallback(
    () => dispatch({ type: PromotionsActionTypes.CLOSE_EDIT_PANE }),
    [dispatch],
  );

  const toggleRecordSelected = React.useCallback(
    (record: PromotionTableItem) => {
      dispatch({
        type: PromotionsActionTypes.UPDATE_RECORD,
        payload: Object.assign(record, { selected: !record.selected }),
      });
    },
    [dispatch],
  );

  const resetPromotionsData = React.useCallback(promotionsApi.resetPromotionsData, []);

  const initialize = React.useCallback(async () => {
    try {
      dispatch({ type: PromotionsActionTypes.FETCHING });
      await resetPromotionsData();
      dispatch({ type: PromotionsActionTypes.FETCH_SUCCESS });
      loadInitialData();
    } catch (error) {
      dispatch({ type: PromotionsActionTypes.ERROR, payload: error });
    }
  }, [loadInitialData, resetPromotionsData, dispatch]);

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const {
    cache,
    fetching,
    fetchError,
    recordsCount,
    canFetchMore,
    backendHasMorePromotions,
    recordToEdit,
  } = state;

  return {
    displayableKeys: without(Object.keys(cache[0] || {}), '_id', 'selected'),
    fetchingRecords: fetching,
    fetchError,
    canFetchMore,
    recordToEdit,
    get records() {
      return cache.slice(0, recordsCount);
    },
    get hasMore() {
      const hasCacheReserve = cache.length > recordsCount;
      return hasCacheReserve || backendHasMorePromotions;
    },
    initialize,
    loadMore,
    deleteRecord,
    updateRecord,
    duplicateRecord,
    toggleEditPane,
    closeEditPane,
    toggleRecordSelected,
  };
}
