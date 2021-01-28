import { AuthAction } from '../actions/auth';
import { SIGNED_LOGIN, SIGNED_LOGOUT, ANONYMOUS_LOGIN } from '../constants/actionTypes';
import { KeycloakInstance } from 'keycloak-js';
import { AccessToken } from '../types';

/**
 * Redux auth state
 */
export interface AuthState {
  signedToken?: AccessToken;
  anonymousToken?: AccessToken;
  keycloak?: KeycloakInstance;
}

/**
 * Initial auth state
 */
const initialState: AuthState = {
  signedToken: undefined,
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
    case SIGNED_LOGIN:
      return { ...authState, keycloak: action.keycloak, signedToken: action.accessToken };
    case SIGNED_LOGOUT:
      return { ...authState, keycloak: undefined, signedToken: undefined };
    case ANONYMOUS_LOGIN:
      return { ...authState, anonymousToken: action.accessToken };
    default:
      return authState;
  }
}