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
 * @interface MetaformFilter
 */
export interface MetaformFilter {
    /**
     * 
     * @type {string}
     * @memberof MetaformFilter
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof MetaformFilter
     */
    name: string;
    /**
     * Predefined list replies filter. Format is field:value
     * @type {Array<string>}
     * @memberof MetaformFilter
     */
    fields?: Array<string>;
}

export function MetaformFilterFromJSON(json: any): MetaformFilter {
    return MetaformFilterFromJSONTyped(json, false);
}

export function MetaformFilterFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetaformFilter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'fields': !exists(json, 'fields') ? undefined : json['fields'],
    };
}

export function MetaformFilterToJSON(value?: MetaformFilter | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'fields': value.fields,
    };
}


