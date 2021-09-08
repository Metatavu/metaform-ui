import { MetaformAction } from "../actions/metaform";
import { LOAD_METAFORM, SET_METAFORM } from "../constants/actionTypes";
import { Metaform } from "../generated/client";

/**
 * Redux metaform state
 */
export interface MetaformState {
  isLoading: boolean;
  metaform?: Metaform;
}

/**
 * Initial metaform state
 */
const initialState: MetaformState = {
  isLoading: false,
  metaform: undefined,
}

/**
 * Redux reducer for metaform
 * 
 * @param metaformState metaform state 
 * @param metaformAction metaform action
 * 
 * @returns changed metaform state
 */
export function metaformReducer(metaformState: MetaformState = initialState, action: MetaformAction): MetaformState {
  switch (action.type) {
    case LOAD_METAFORM:
      return { 
        ...metaformState, 
        isLoading: true 
      };
    case SET_METAFORM:
      const { metaform } = action;

      return { 
        ...metaformState, 
        metaform,
        isLoading: false
      };
    default:
      return metaformState;
  }
}