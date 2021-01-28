import * as actionTypes from '../constants/actionTypes';
import { AccessToken } from '../types';
import { KeycloakInstance } from 'keycloak-js';

/**
 * Interface for signed login action type
 */
export interface SignedLoginAction {
  type: actionTypes.SIGNED_LOGIN;
  accessToken: AccessToken;
  keycloak: KeycloakInstance;
}

/**
 * Interface for signed logout action type
 */
export interface SignedLogoutAction {
  type: actionTypes.SIGNED_LOGOUT;
}

/**
 * Interface for anonymous login action type
 */
export interface AnonymousLoginAction {
  type: actionTypes.ANONYMOUS_LOGIN;
  accessToken: AccessToken;
}

/**
 * Store update method for signed access token
 *
 * @param keycloak keycloak instance
 */
export function signedLogin(keycloak: KeycloakInstance, accessToken: AccessToken): SignedLoginAction {
  return {
    type: actionTypes.SIGNED_LOGIN,
    accessToken: accessToken,
    keycloak: keycloak
  };
}

/**
 * Store logout method
 */
export function signedLogout(): SignedLogoutAction {
  return {
    type: actionTypes.SIGNED_LOGOUT
  };
}

/**
 * Store update method for access token
 *
 * @param keycloak keycloak instance
 */
export function anonymousLogin(accessToken: AccessToken): AnonymousLoginAction {
  return {
    type: actionTypes.ANONYMOUS_LOGIN,
    accessToken: accessToken
  };
}

export type AuthAction = SignedLoginAction | SignedLogoutAction | AnonymousLoginAction;