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
 * Response to successful authentication.
 * @export
 * @interface AuthenticationResponse
 */
export interface AuthenticationResponse {
    /**
     * Authentication token to be used in Authorization header.
     * @type {string}
     * @memberof AuthenticationResponse
     */
    authenticationToken: string;
}

export function AuthenticationResponseFromJSON(json: any): AuthenticationResponse {
    return AuthenticationResponseFromJSONTyped(json, false);
}

export function AuthenticationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): AuthenticationResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'authenticationToken': json['authenticationToken'],
    };
}

export function AuthenticationResponseToJSON(value?: AuthenticationResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'authenticationToken': value.authenticationToken,
    };
}


