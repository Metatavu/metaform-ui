/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  realmRoles: string[];
}

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
}

/**
 * Interface describing anonymous login configuration
 */
export interface AnonymousLoginConfig {
  url: string
  realm: string
  clientId: string
  username: string
  password: string
}

/**
 * Interface describing admin login configuration
 */
export interface AdminLoginConfig {
  url: string
  realm: string
  clientId: string
}