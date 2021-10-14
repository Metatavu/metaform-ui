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
 * Fixed price field name(s) to be used as search criteria targets
 * @export
 * @enum {string}
 */
export enum PriceQfield {
    PRICEID = 'PRICEID',
    PRODUCTID = 'PRODUCTID',
    PRODUCERID = 'PRODUCERID',
    CUSTOMERID = 'CUSTOMERID'
}

export function PriceQfieldFromJSON(json: any): PriceQfield {
    return PriceQfieldFromJSONTyped(json, false);
}

export function PriceQfieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): PriceQfield {
    return json as PriceQfield;
}

export function PriceQfieldToJSON(value?: PriceQfield | null): any {
    return value as any;
}
