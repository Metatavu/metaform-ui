import { combineReducers } from "redux";
import { authReducer } from "../reducers/auth";
import { metaformReducer } from "../reducers/metaform";
import { AuthAction } from "../actions/auth";
import { MetaformAction } from "../actions/metaform";

/**
 * Root reducer that wraps all Redux reducers
 */
export const rootReducer = combineReducers({
    auth: authReducer,
    metaform: metaformReducer
});

export type ReduxState = ReturnType<typeof rootReducer>;

export type ReduxActions = AuthAction | MetaformAction;
