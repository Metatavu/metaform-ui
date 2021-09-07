import { MetaformAction } from '../actions/metaform';
import { LOAD_METAFORM, SET_METAFORM, SET_METAFORM_JSON } from '../constants/actionTypes';
import { Metaform } from '../generated/client';

/**
 * Redux metaform state
 */
export interface MetaformState {
  isLoading: boolean;
  metaform?: Metaform;
  metaformJson: string; 
}

/**
 * Initial metaform state
 */
const initialState: MetaformState = {
  isLoading: false,
  metaform: undefined,
  metaformJson: ""
}

/**
 * Redux reducer for metaform
 * 
 * @param metaformState metaform state 
 * @param metaformAction metaform action
 * @returns changed metaform state
 */
export function metaformReducer(metaformState: MetaformState = initialState, action: MetaformAction): MetaformState {
  switch (action.type) {
    case LOAD_METAFORM:
      return { ...metaformState, isLoading: true };
    case SET_METAFORM:
      const { metaform } = action;

      const convertedMetaformJson = metaform ? JSON.stringify(metaform, null, 2) : "";

      return { 
        ...metaformState, 
        metaform,
        metaformJson: convertedMetaformJson,
        isLoading: false
      };
    case SET_METAFORM_JSON:
      const { metaformJson } = action;

      // TODO set the metaform
      // const convertedMetaform

      return { 
        ...metaformState, 
        metaformJson,
        // metaform: convertedMetaform,
        isLoading: false
      };
    default:
      return metaformState;
  }
}