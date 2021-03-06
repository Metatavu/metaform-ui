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
 * @interface Attachment
 */
export interface Attachment {
    /**
     * Entity identifier
     * @type {string}
     * @memberof Attachment
     */
    id?: string;
    /**
     * Attachment's name
     * @type {string}
     * @memberof Attachment
     */
    name?: string;
    /**
     * Attachment's content type (e.g. application/pdf)
     * @type {string}
     * @memberof Attachment
     */
    contentType?: string;
}

export function AttachmentFromJSON(json: any): Attachment {
    return AttachmentFromJSONTyped(json, false);
}

export function AttachmentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Attachment {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'contentType': !exists(json, 'contentType') ? undefined : json['contentType'],
    };
}

export function AttachmentToJSON(value?: Attachment | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'contentType': value.contentType,
    };
}


