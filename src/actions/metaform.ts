import * as actionTypes from "../constants/actionTypes";
import { Metaform } from "../generated/client/models";

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
  metaform?: Metaform;
}

/**
 * Interface for set metaform json action type
 */
export interface SetMetaformJsonAction {
  type: actionTypes.SET_METAFORM_JSON;
  metaformJson: string;
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
export function setMetaform(metaform?: Metaform): SetMetaformAction {
  return {
    type: actionTypes.SET_METAFORM,
    metaform: metaform
  };
}

/**
 * Store update method for setting metaform json
 *
 * @param metaformJson metaform json
 */
export function setMetaformJson(metaformJson: string): SetMetaformJsonAction {
  return {
    type: actionTypes.SET_METAFORM_JSON,
    metaformJson: metaformJson
  };
}

export type MetaformAction = LoadingMetaformAction | SetMetaformAction | SetMetaformJsonAction;