import { AuthAction } from '../actions/auth';
import { ADMIN_LOGIN, ADMIN_LOGOUT, ANONYMOUS_LOGIN } from '../constants/actionTypes';
import { KeycloakInstance } from 'keycloak-js';
import { AccessToken } from '../types';

/**
 * Redux auth state
 */
export interface AuthState {
  adminToken?: AccessToken;
  anonymousToken?: AccessToken;
  keycloak?: KeycloakInstance;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  adminToken: undefined,
  anonymousToken: undefined,
  keycloak: undefined
}

/**
 * Redux reducer for authorization
 * 
 * @param authState auth state 
 * @param authAction auth action
 * @returns changed auth state
 */
export function authReducer(authState: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case ADMIN_LOGIN:
      return { ...authState, keycloak: action.keycloak, adminToken: action.accessToken };
    case ADMIN_LOGOUT:
      return { ...authState, keycloak: undefined, adminToken: undefined };
    case ANONYMOUS_LOGIN:
      return { ...authState, anonymousToken: action.accessToken };
    default:
      return authState;
  }
}