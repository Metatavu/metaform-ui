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
 * Concept code or price attribute. For concept codes an attribute with name "Abbreviation" is mandatory in POST and PUT requests.
 * @export
 * @interface Attribute
 */
export interface Attribute {
    /**
     * Name of attribute.
     * @type {string}
     * @memberof Attribute
     */
    attributeName?: string;
    /**
     * Attribute value(s).
     * @type {Array<string>}
     * @memberof Attribute
     */
    attributeValue?: Array<string>;
}

export function AttributeFromJSON(json: any): Attribute {
    return AttributeFromJSONTyped(json, false);
}

export function AttributeFromJSONTyped(json: any, ignoreDiscriminator: boolean): Attribute {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'attributeName': !exists(json, 'attributeName') ? undefined : json['attributeName'],
        'attributeValue': !exists(json, 'attributeValue') ? undefined : json['attributeValue'],
    };
}

export function AttributeToJSON(value?: Attribute | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'attributeName': value.attributeName,
        'attributeValue': value.attributeValue,
    };
}

