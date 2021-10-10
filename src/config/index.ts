import { cleanEnv, str, url } from "envalid";
import { KeycloakConfig, KeycloakLoginOptions } from "keycloak-js";
import { AnonymousLoginConfig, LoginMode } from "../types";

/**
 * Validates that environment variables are in place and have correct form
 */
 const env = cleanEnv(process.env, {
  REACT_APP_KEYCLOAK_REALM: str(),
  REACT_APP_FORM_ID: str(),
  REACT_APP_REPLY_MODE: str({ default: "CUMULATIVE", choices: ["UPDATE", "REVISION", "CUMULATIVE"]}),
  REACT_APP_KEYCLOAK_CLIENT_ID: str(),
  REACT_APP_KEYCLOAK_URL: url(),
  REACT_APP_KEYCLOAK_ANONYMOUS_USER: str({ default: "" }),
  REACT_APP_KEYCLOAK_ANONYMOUS_PASS: str({ default: "" }),
  REACT_APP_KEYCLOAK_USER_IDPHINT: str({ default: undefined }),
  REACT_APP_KEYCLOAK_ADMIN_IDPHINT: str({ default: undefined }),
  REACT_APP_CORS_PROXY: str()
});

// REACT_APP_API_BASE_PATH=https://essote-api.metaform.fi/v1

/**
 * Helper class for handling configurations
 */
export default class Config {

  /**
   * Returns used realm
   * 
   * @returns used realm
   */
  public static getRealm = () => {
    return env.REACT_APP_KEYCLOAK_REALM;
  }

  /**
   * Returns used metaform id
   * 
   * @returns metaform id
   */
  public static getMetaformId = () => {
    return env.REACT_APP_FORM_ID;    
  }

  /**
   * Returns used reply mode
   * 
   * @returns used reply mode
   */
  public static getReplyMode = () => {
    return env.REACT_APP_REPLY_MODE;
  }

  /**
   * Returns anonymous login config
   * 
   * @returns anonymous login config
   */
  public static getAnonymousLoginConfig = (): AnonymousLoginConfig => {
    return {
      clientId: env.REACT_APP_KEYCLOAK_CLIENT_ID,
      url: env.REACT_APP_KEYCLOAK_URL,
      username: env.REACT_APP_KEYCLOAK_ANONYMOUS_USER,
      password: env.REACT_APP_KEYCLOAK_ANONYMOUS_PASS,
      realm: env.REACT_APP_KEYCLOAK_REALM
    }
  }

  /**
   * Returns signed Keycloak config
   * 
   * @returns signed Keycloak config
   */
  public static getSignedKeycloakConfig = (): KeycloakConfig => {
    return {    
      url: env.REACT_APP_KEYCLOAK_URL,
      realm: env.REACT_APP_KEYCLOAK_REALM,
      clientId: env.REACT_APP_KEYCLOAK_CLIENT_ID
    }
  }

  /**
   * Returns signed Keycloak login options
   * 
   * @param loginMode login config
   * @returns signed Keycloak login options
   */
  public static getSignedKeycloakLoginOptions(loginMode: LoginMode): KeycloakLoginOptions {
    const idpHint = loginMode == "ADMIN" ? env.REACT_APP_KEYCLOAK_ADMIN_IDPHINT : env.REACT_APP_KEYCLOAK_USER_IDPHINT;

    return {
      idpHint: idpHint
    };
  }

  /**
   * Returns address for CORS proxy service
   * 
   * @returns address for CORS proxy service
   */
  public static getCorsProxy(): String {
    return env.REACT_APP_CORS_PROXY;
  }

}