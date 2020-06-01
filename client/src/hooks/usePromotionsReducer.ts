import { Action, PromotionTableItem, Promotion } from '../types';
import { without, sortedIndexBy, orderBy } from 'lodash-es';
import React from 'react';

export interface PromotionsState {
  fetching: boolean;
  fetchError?: Error | null;
  cache: PromotionTableItem[];
  recordsCount: number;
  backendHasMorePromotions: boolean;
  canFetchMore: boolean;
  recordToEdit: Promotion | null;
}

export enum PromotionsActionTypes {
  FETCHING = 'FETCHING',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  ERROR = 'ERROR',
  SET_INITIAL_RECORDS = 'SET_INITIAL_RECORDS',
  CACHE_RECORDS = 'CACHE_RECORDS',
  ADD_VISIBLE_RECORD = 'ADD_VISIBLE_RECORD',
  ADVANCE_RECORDS = 'ADVANCE_RECORDS',
  DELETE_RECORD = 'DELETE_RECORD',
  EDIT_RECORD = 'EDIT_RECORD',
  CLOSE_EDIT_PANE = 'CLOSE_EDIT_PANE',
  UPDATE_RECORD = 'UPDATE_RECORD',
}

function promotionsReducer(bulkSize: number) {
  return function (state: PromotionsState, action: Action): PromotionsState {
    switch (action.type) {
      case PromotionsActionTypes.FETCHING:
        return {
          ...state,
          fetching: true,
          fetchError: null,
        };
      case PromotionsActionTypes.FETCH_SUCCESS:
        return {
          ...state,
          fetching: false,
          fetchError: null,
        };
      case PromotionsActionTypes.ERROR: {
        const error = action.payload as Error;
        return {
          ...state,
          fetching: false,
          fetchError: error,
        };
      }
      case PromotionsActionTypes.SET_INITIAL_RECORDS: {
        const records = action.payload as PromotionTableItem[];
        return {
          ...state,
          fetching: false,
          fetchError: null,
          cache: [...records],
          recordsCount: records.length,
          backendHasMorePromotions: records.length >= bulkSize,
        };
      }
      case PromotionsActionTypes.CACHE_RECORDS: {
        const records = action.payload as PromotionTableItem[];
        return {
          ...state,
          fetching: false,
          fetchError: null,
          cache: [...state.cache, ...records],
          backendHasMorePromotions: records.length >= bulkSize,
        };
      }
      case PromotionsActionTypes.ADVANCE_RECORDS:
        return {
          ...state,
          recordsCount: state.cache.length,
        };
      case PromotionsActionTypes.DELETE_RECORD: {
        const recordToDelete = action.payload as PromotionTableItem;
        return {
          ...state,
          cache: without(state.cache, recordToDelete),
        };
      }
      case PromotionsActionTypes.ADD_VISIBLE_RECORD: {
        const recordToAdd = action.payload as PromotionTableItem;
        // Binary search to quickly find the right index while maintaining sort order
        const targetIndex = sortedIndexBy(
          state.cache,
          recordToAdd,
          rec => -Date.parse(rec['Start Date']),
        );

        const recordsBefore = state.cache.slice(0, targetIndex);
        const recordsAfter = state.cache.slice(targetIndex);

        return {
          ...state,
          cache: [...recordsBefore, recordToAdd, ...recordsAfter],
          recordsCount: state.recordsCount + 1,
        };
      }
      case PromotionsActionTypes.EDIT_RECORD: {
        const recordToEdit = action.payload as Promotion;
        return {
          ...state,
          recordToEdit,
        };
      }
      case PromotionsActionTypes.CLOSE_EDIT_PANE:
        return {
          ...state,
          recordToEdit: null,
        };
      case PromotionsActionTypes.UPDATE_RECORD: {
        const updatedRecord = action.payload as PromotionTableItem;
        const recordIndex = state.cache.findIndex(record => record._id === updatedRecord._id);

        const recordsBefore = recordIndex === 0 ? [] : state.cache.slice(0, recordIndex);

        return {
          ...state,
          cache: orderBy(
            [...recordsBefore, updatedRecord, ...state.cache.slice(recordIndex + 1)],
            ['Start Date'],
            ['desc'],
          ),
        };
      }
      default:
        return state;
    }
  };
}

export default function usePromotionsReducer(bulkSize: number) {
  return React.useReducer(promotionsReducer(bulkSize), {
    fetching: false,
    fetchError: null,
    cache: [],
    recordsCount: 0,
    backendHasMorePromotions: true,
    canFetchMore: true,
    recordToEdit: null,
  });
}
