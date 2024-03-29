/* tslint:disable */
/* eslint-disable */
/**
 * CodeServer REST API
 * CodeServer REST API v3.0
 *
 * The version of the OpenAPI document: 3.0
 * Contact: codeserver-support@elisa.fi
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Authentication information ie. username and password.
 * @export
 * @interface AuthenticationRequest
 */
export interface AuthenticationRequest {
    /**
     * name of authenticating user
     * @type {string}
     * @memberof AuthenticationRequest
     */
    username: string;
    /**
     * password for authenticating user
     * @type {string}
     * @memberof AuthenticationRequest
     */
    password: string;
}

export function AuthenticationRequestFromJSON(json: any): AuthenticationRequest {
    return AuthenticationRequestFromJSONTyped(json, false);
}

export function AuthenticationRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): AuthenticationRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'username': json['username'],
        'password': json['password'],
    };
}

export function AuthenticationRequestToJSON(value?: AuthenticationRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'username': value.username,
        'password': value.password,
    };
}


