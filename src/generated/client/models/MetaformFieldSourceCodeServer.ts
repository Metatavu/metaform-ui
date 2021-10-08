/* tslint:disable */
/* eslint-disable */
/**
 * Metaform REST API
 * REST API for Metaform
 *
 * The version of the OpenAPI document: 2.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface MetaformFieldSourceCodeServer
 */
export interface MetaformFieldSourceCodeServer {
    /**
     * Attribute name
     * @type {string}
     * @memberof MetaformFieldSourceCodeServer
     */
    attributeName: string;
}

export function MetaformFieldSourceCodeServerFromJSON(json: any): MetaformFieldSourceCodeServer {
    return MetaformFieldSourceCodeServerFromJSONTyped(json, false);
}

export function MetaformFieldSourceCodeServerFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetaformFieldSourceCodeServer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'attributeName': json['attributeName'],
    };
}

export function MetaformFieldSourceCodeServerToJSON(value?: MetaformFieldSourceCodeServer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'attributeName': value.attributeName,
    };
}


