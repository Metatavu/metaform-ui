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
import {
    MetaformFieldSourceOptions,
    MetaformFieldSourceOptionsFromJSON,
    MetaformFieldSourceOptionsFromJSONTyped,
    MetaformFieldSourceOptionsToJSON,
    MetaformFieldSourceType,
    MetaformFieldSourceTypeFromJSON,
    MetaformFieldSourceTypeFromJSONTyped,
    MetaformFieldSourceTypeToJSON,
} from './';

/**
 * Field value source. Defaults to using user's reply.
 * @export
 * @interface MetaformFieldSource
 */
export interface MetaformFieldSource {
    /**
     * 
     * @type {MetaformFieldSourceType}
     * @memberof MetaformFieldSource
     */
    type: MetaformFieldSourceType;
    /**
     * 
     * @type {MetaformFieldSourceOptions}
     * @memberof MetaformFieldSource
     */
    options?: MetaformFieldSourceOptions;
}

export function MetaformFieldSourceFromJSON(json: any): MetaformFieldSource {
    return MetaformFieldSourceFromJSONTyped(json, false);
}

export function MetaformFieldSourceFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetaformFieldSource {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'type': MetaformFieldSourceTypeFromJSON(json['type']),
        'options': !exists(json, 'options') ? undefined : MetaformFieldSourceOptionsFromJSON(json['options']),
    };
}

export function MetaformFieldSourceToJSON(value?: MetaformFieldSource | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'type': MetaformFieldSourceTypeToJSON(value.type),
        'options': MetaformFieldSourceOptionsToJSON(value.options),
    };
}


