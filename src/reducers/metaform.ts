import { MetaformAction } from "../actions/metaform";
import { SET_METAFORM } from "../constants/actionTypes";
import { Metaform } from "../generated/client";

/**
 * Redux metaform state
 */
export interface MetaformState {
  metaform?: Metaform;
}

/**
 * Initial metaform state
 */
const initialState: MetaformState = {
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

    case SET_METAFORM:
      const { metaform } = action;

      return { 
        ...metaformState, 
        metaform,
      };
    default:
      return metaformState;
  }
}