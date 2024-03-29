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
    Price,
    PriceFromJSON,
    PriceFromJSONTyped,
    PriceToJSON,
} from './';

/**
 * 
 * @export
 * @interface Prices
 */
export interface Prices {
    /**
     * Array of prices.
     * @type {Array<Price>}
     * @memberof Prices
     */
    prices?: Array<Price>;
    /**
     * Maximum number of prices in one page. If the value is same as the value of totalPages then further pages are not available.
     * @type {number}
     * @memberof Prices
     */
    readonly pageSize?: number;
    /**
     * Current page number
     * @type {number}
     * @memberof Prices
     */
    readonly page?: number;
    /**
     * Total number of pricess.
     * @type {number}
     * @memberof Prices
     */
    readonly totalItems?: number;
    /**
     * Total number of pages.
     * @type {number}
     * @memberof Prices
     */
    readonly totalPages?: number;
}

export function PricesFromJSON(json: any): Prices {
    return PricesFromJSONTyped(json, false);
}

export function PricesFromJSONTyped(json: any, ignoreDiscriminator: boolean): Prices {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'prices': !exists(json, 'prices') ? undefined : ((json['prices'] as Array<any>).map(PriceFromJSON)),
        'pageSize': !exists(json, 'pageSize') ? undefined : json['pageSize'],
        'page': !exists(json, 'page') ? undefined : json['page'],
        'totalItems': !exists(json, 'totalItems') ? undefined : json['totalItems'],
        'totalPages': !exists(json, 'totalPages') ? undefined : json['totalPages'],
    };
}

export function PricesToJSON(value?: Prices | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'prices': value.prices === undefined ? undefined : ((value.prices as Array<any>).map(PriceToJSON)),
    };
}


