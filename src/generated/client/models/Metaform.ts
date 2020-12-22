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
    MetaformFilter,
    MetaformFilterFromJSON,
    MetaformFilterFromJSONTyped,
    MetaformFilterToJSON,
    MetaformScripts,
    MetaformScriptsFromJSON,
    MetaformScriptsFromJSONTyped,
    MetaformScriptsToJSON,
    MetaformSection,
    MetaformSectionFromJSON,
    MetaformSectionFromJSONTyped,
    MetaformSectionToJSON,
} from './';

/**
 * 
 * @export
 * @interface Metaform
 */
export interface Metaform {
    /**
     * 
     * @type {string}
     * @memberof Metaform
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof Metaform
     */
    replyStrategy?: MetaformReplyStrategyEnum;
    /**
     * 
     * @type {string}
     * @memberof Metaform
     */
    exportThemeId?: string;
    /**
     * Are anonymous replies allowed or not
     * @type {boolean}
     * @memberof Metaform
     */
    allowAnonymous?: boolean;
    /**
     * Are drafts allowed or not
     * @type {boolean}
     * @memberof Metaform
     */
    allowDrafts?: boolean;
    /**
     * Generate reply owner keys to replies.
     * @type {boolean}
     * @memberof Metaform
     */
    allowReplyOwnerKeys?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Metaform
     */
    title?: string;
    /**
     * 
     * @type {Array<MetaformSection>}
     * @memberof Metaform
     */
    sections?: Array<MetaformSection>;
    /**
     * 
     * @type {Array<MetaformFilter>}
     * @memberof Metaform
     */
    filters?: Array<MetaformFilter>;
    /**
     * 
     * @type {MetaformScripts}
     * @memberof Metaform
     */
    scripts?: MetaformScripts;
}

export function MetaformFromJSON(json: any): Metaform {
    return MetaformFromJSONTyped(json, false);
}

export function MetaformFromJSONTyped(json: any, ignoreDiscriminator: boolean): Metaform {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'replyStrategy': !exists(json, 'replyStrategy') ? undefined : json['replyStrategy'],
        'exportThemeId': !exists(json, 'exportThemeId') ? undefined : json['exportThemeId'],
        'allowAnonymous': !exists(json, 'allowAnonymous') ? undefined : json['allowAnonymous'],
        'allowDrafts': !exists(json, 'allowDrafts') ? undefined : json['allowDrafts'],
        'allowReplyOwnerKeys': !exists(json, 'allowReplyOwnerKeys') ? undefined : json['allowReplyOwnerKeys'],
        'title': !exists(json, 'title') ? undefined : json['title'],
        'sections': !exists(json, 'sections') ? undefined : ((json['sections'] as Array<any>).map(MetaformSectionFromJSON)),
        'filters': !exists(json, 'filters') ? undefined : ((json['filters'] as Array<any>).map(MetaformFilterFromJSON)),
        'scripts': !exists(json, 'scripts') ? undefined : MetaformScriptsFromJSON(json['scripts']),
    };
}

export function MetaformToJSON(value?: Metaform | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'replyStrategy': value.replyStrategy,
        'exportThemeId': value.exportThemeId,
        'allowAnonymous': value.allowAnonymous,
        'allowDrafts': value.allowDrafts,
        'allowReplyOwnerKeys': value.allowReplyOwnerKeys,
        'title': value.title,
        'sections': value.sections === undefined ? undefined : ((value.sections as Array<any>).map(MetaformSectionToJSON)),
        'filters': value.filters === undefined ? undefined : ((value.filters as Array<any>).map(MetaformFilterToJSON)),
        'scripts': MetaformScriptsToJSON(value.scripts),
    };
}

/**
* @export
* @enum {string}
*/
export enum MetaformReplyStrategyEnum {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE'
}


