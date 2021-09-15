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
 * Concept code creation response
 * @export
 * @interface ConceptCodeCreated
 */
export interface ConceptCodeCreated {
    /**
     * Concept code identifier.
     * @type {string}
     * @memberof ConceptCodeCreated
     */
    conceptCodeId: string;
    /**
     * Creation date and time.
     * @type {Date}
     * @memberof ConceptCodeCreated
     */
    createDate: Date;
}

export function ConceptCodeCreatedFromJSON(json: any): ConceptCodeCreated {
    return ConceptCodeCreatedFromJSONTyped(json, false);
}

export function ConceptCodeCreatedFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConceptCodeCreated {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'conceptCodeId': json['conceptCodeId'],
        'createDate': (new Date(json['createDate'])),
    };
}

export function ConceptCodeCreatedToJSON(value?: ConceptCodeCreated | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'conceptCodeId': value.conceptCodeId,
        'createDate': (value.createDate.toISOString()),
    };
}


