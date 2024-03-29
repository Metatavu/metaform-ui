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
    FieldReferencedCodeSystemLinks,
    FieldReferencedCodeSystemLinksFromJSON,
    FieldReferencedCodeSystemLinksFromJSONTyped,
    FieldReferencedCodeSystemLinksToJSON,
} from './';

/**
 * Referenced classification and version. Used when fieldType is REFERENCE.
 * @export
 * @interface FieldReferencedCodeSystem
 */
export interface FieldReferencedCodeSystem {
    /**
     * 
     * @type {string}
     * @memberof FieldReferencedCodeSystem
     */
    classificationId?: string;
    /**
     * 
     * @type {string}
     * @memberof FieldReferencedCodeSystem
     */
    versionId?: string;
    /**
     * 
     * @type {Array<FieldReferencedCodeSystemLinks>}
     * @memberof FieldReferencedCodeSystem
     */
    links?: Array<FieldReferencedCodeSystemLinks>;
}

export function FieldReferencedCodeSystemFromJSON(json: any): FieldReferencedCodeSystem {
    return FieldReferencedCodeSystemFromJSONTyped(json, false);
}

export function FieldReferencedCodeSystemFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldReferencedCodeSystem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'classificationId': !exists(json, 'classificationId') ? undefined : json['classificationId'],
        'versionId': !exists(json, 'versionId') ? undefined : json['versionId'],
        'links': !exists(json, 'links') ? undefined : ((json['links'] as Array<any>).map(FieldReferencedCodeSystemLinksFromJSON)),
    };
}

export function FieldReferencedCodeSystemToJSON(value?: FieldReferencedCodeSystem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'classificationId': value.classificationId,
        'versionId': value.versionId,
        'links': value.links === undefined ? undefined : ((value.links as Array<any>).map(FieldReferencedCodeSystemLinksToJSON)),
    };
}


