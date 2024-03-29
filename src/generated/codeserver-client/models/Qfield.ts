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

/**
 * Fixed field name(s) to be used as search criteria targets
 * @export
 * @enum {string}
 */
export enum Qfield {
    CONCEPTCODEID = 'CONCEPTCODEID',
    ABBREVIATION = 'ABBREVIATION',
    NAME = 'NAME',
    PARENTID = 'PARENTID'
}

export function QfieldFromJSON(json: any): Qfield {
    return QfieldFromJSONTyped(json, false);
}

export function QfieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): Qfield {
    return json as Qfield;
}

export function QfieldToJSON(value?: Qfield | null): any {
    return value as any;
}

