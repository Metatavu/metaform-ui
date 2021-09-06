import * as actionTypes from '../constants/actionTypes';
import { Metaform } from '../generated/client/models';

/**
 * Interface for load metaform action type
 */
export interface LoadingMetaformAction {
  type: actionTypes.LOAD_METAFORM;
}

/**
 * Interface for set metaform action type
 */
export interface SetMetaformAction {
  type: actionTypes.SET_METAFORM;
  metaform: Metaform;
}

/**
 * Store update method for loading metaform
 */
export function loadMetaform(): LoadingMetaformAction {
  return {
    type: actionTypes.LOAD_METAFORM
  };
}

/**
 * Store update method for setting metaform
 *
 * @param metaform metaform
 */
export function setMetaform(metaform: Metaform): SetMetaformAction {
  return {
    type: actionTypes.SET_METAFORM,
    metaform: metaform
  };
}

export type MetaformAction = LoadingMetaformAction | SetMetaformAction;