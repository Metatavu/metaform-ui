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
 * Additional details for the error. Mandatory element for status code 4xx responses.
 * @export
 * @interface ErrorDetail
 */
export interface ErrorDetail {
    /**
     * Field in error if in body, else name of the path parameter or query parameter.
     * @type {string}
     * @memberof ErrorDetail
     */
    field?: string;
    /**
     * Value of the field in error.
     * @type {string}
     * @memberof ErrorDetail
     */
    value?: string;
    /**
     * Reason for error.
     * @type {string}
     * @memberof ErrorDetail
     */
    issue?: string;
    /**
     * The location of the field in the error, either query, path, or body. If this field is not present, the default value is body.
     * @type {string}
     * @memberof ErrorDetail
     */
    location?: string;
}

export function ErrorDetailFromJSON(json: any): ErrorDetail {
    return ErrorDetailFromJSONTyped(json, false);
}

export function ErrorDetailFromJSONTyped(json: any, ignoreDiscriminator: boolean): ErrorDetail {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'field': !exists(json, 'field') ? undefined : json['field'],
        'value': !exists(json, 'value') ? undefined : json['value'],
        'issue': !exists(json, 'issue') ? undefined : json['issue'],
        'location': !exists(json, 'location') ? undefined : json['location'],
    };
}

export function ErrorDetailToJSON(value?: ErrorDetail | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'field': value.field,
        'value': value.value,
        'issue': value.issue,
        'location': value.location,
    };
}

