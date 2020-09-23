/* tslint:disable */
/* eslint-disable */
/**
 * Metaform REST API
 * REST API for Metaform
 *
 * The version of the OpenAPI document: 2.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * Rule that defines whether specified object is visible
 * @export
 * @interface MetaformVisibleIf
 */
export interface MetaformVisibleIf {
    /**
     * Field where the visible if rule is relative to
     * @type {string}
     * @memberof MetaformVisibleIf
     */
    field?: string;
    /**
     * Value must be equal to this value. If value is specified "true" field must have any value selected
     * @type {string}
     * @memberof MetaformVisibleIf
     */
    equals?: string;
    /**
     * Value must be not equal to this value.
     * @type {string}
     * @memberof MetaformVisibleIf
     */
    notEquals?: string;
    /**
     * 
     * @type {Array<MetaformVisibleIf>}
     * @memberof MetaformVisibleIf
     */
    and?: Array<MetaformVisibleIf>;
    /**
     * 
     * @type {Array<MetaformVisibleIf>}
     * @memberof MetaformVisibleIf
     */
    or?: Array<MetaformVisibleIf>;
}

export function MetaformVisibleIfFromJSON(json: any): MetaformVisibleIf {
    return MetaformVisibleIfFromJSONTyped(json, false);
}

export function MetaformVisibleIfFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetaformVisibleIf {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'field': !exists(json, 'field') ? undefined : json['field'],
        'equals': !exists(json, 'equals') ? undefined : json['equals'],
        'notEquals': !exists(json, 'not-equals') ? undefined : json['not-equals'],
        'and': !exists(json, 'and') ? undefined : ((json['and'] as Array<any>).map(MetaformVisibleIfFromJSON)),
        'or': !exists(json, 'or') ? undefined : ((json['or'] as Array<any>).map(MetaformVisibleIfFromJSON)),
    };
}

export function MetaformVisibleIfToJSON(value?: MetaformVisibleIf | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'field': value.field,
        'equals': value.equals,
        'not-equals': value.notEquals,
        'and': value.and === undefined ? undefined : ((value.and as Array<any>).map(MetaformVisibleIfToJSON)),
        'or': value.or === undefined ? undefined : ((value.or as Array<any>).map(MetaformVisibleIfToJSON)),
    };
}


