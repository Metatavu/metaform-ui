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
import {
    ConceptCode,
    ConceptCodeFromJSON,
    ConceptCodeFromJSONTyped,
    ConceptCodeToJSON,
} from './';

/**
 * 
 * @export
 * @interface ConceptCodes
 */
export interface ConceptCodes {
    /**
     * Array of concept codes.
     * @type {Array<ConceptCode>}
     * @memberof ConceptCodes
     */
    conceptCodes?: Array<ConceptCode>;
    /**
     * Maximum number of concept codes in one page. If the value is same as the value of totalPages then further pages are not available.
     * @type {number}
     * @memberof ConceptCodes
     */
    readonly pageSize?: number;
    /**
     * Current page number
     * @type {number}
     * @memberof ConceptCodes
     */
    readonly page?: number;
    /**
     * Total number of concept codes.
     * @type {number}
     * @memberof ConceptCodes
     */
    readonly totalItems?: number;
    /**
     * Total number of pages.
     * @type {number}
     * @memberof ConceptCodes
     */
    readonly totalPages?: number;
}

export function ConceptCodesFromJSON(json: any): ConceptCodes {
    return ConceptCodesFromJSONTyped(json, false);
}

export function ConceptCodesFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConceptCodes {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'conceptCodes': !exists(json, 'conceptCodes') ? undefined : ((json['conceptCodes'] as Array<any>).map(ConceptCodeFromJSON)),
        'pageSize': !exists(json, 'pageSize') ? undefined : json['pageSize'],
        'page': !exists(json, 'page') ? undefined : json['page'],
        'totalItems': !exists(json, 'totalItems') ? undefined : json['totalItems'],
        'totalPages': !exists(json, 'totalPages') ? undefined : json['totalPages'],
    };
}

export function ConceptCodesToJSON(value?: ConceptCodes | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'conceptCodes': value.conceptCodes === undefined ? undefined : ((value.conceptCodes as Array<any>).map(ConceptCodeToJSON)),
    };
}


