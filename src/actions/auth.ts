import * as actionTypes from '../constants/actionTypes';
import { AccessToken } from '../types';
import { KeycloakInstance } from 'keycloak-js';

/**
 * Interface for admin login action type
 */
export interface AdminLoginAction {
  type: actionTypes.ADMIN_LOGIN;
  accessToken: AccessToken;
  keycloak: KeycloakInstance;
}

/**
 * Interface for admin logout action type
 */
export interface AdminLogoutAction {
  type: actionTypes.ADMIN_LOGOUT;
}

/**
 * Interface for anonymous login action type
 */
export interface AnonymousLoginAction {
  type: actionTypes.ANONYMOUS_LOGIN;
  accessToken: AccessToken;
}

/**
 * Store update method for admin access token
 *
 * @param keycloak keycloak instance
 */
export function adminLogin(keycloak: KeycloakInstance, accessToken: AccessToken): AdminLoginAction {
  return {
    type: actionTypes.ADMIN_LOGIN,
    accessToken: accessToken,
    keycloak: keycloak
  };
}

/**
 * Store logout method
 */
export function adminLogout(): AdminLogoutAction {
  return {
    type: actionTypes.ADMIN_LOGOUT
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

export type AuthAction = AdminLoginAction | AdminLogoutAction | AnonymousLoginAction;