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


import * as runtime from '../runtime';
import {
    Price,
    PriceFromJSON,
    PriceToJSON,
    PriceQfield,
    PriceQfieldFromJSON,
    PriceQfieldToJSON,
    PriceSortBy,
    PriceSortByFromJSON,
    PriceSortByToJSON,
    PriceStatus,
    PriceStatusFromJSON,
    PriceStatusToJSON,
    Prices,
    PricesFromJSON,
    PricesToJSON,
} from '../models';

export interface GetPriceFromPriceListRequest {
    classificationId: string;
    pricelistId: string;
    priceId: string;
}

export interface GetPricesFromPriceListRequest {
    classificationId: string;
    pricelistId: string;
    status?: Array<PriceStatus>;
    validOn?: Date;
    qvalue?: string;
    qfield?: Array<PriceQfield>;
    modifiedAfter?: Date;
    sortBy?: PriceSortBy;
    pageSize?: number;
    page?: number;
}

/**
 * 
 */
export class PriceApi extends runtime.BaseAPI {

    /**
     * Get all data of single active price of specified classification and specified pricelist.
     * Get price by classification id, price list id and price id.
     */
    async getPriceFromPriceListRaw(requestParameters: GetPriceFromPriceListRequest): Promise<runtime.ApiResponse<Price>> {
        if (requestParameters.classificationId === null || requestParameters.classificationId === undefined) {
            throw new runtime.RequiredError('classificationId','Required parameter requestParameters.classificationId was null or undefined when calling getPriceFromPriceList.');
        }

        if (requestParameters.pricelistId === null || requestParameters.pricelistId === undefined) {
            throw new runtime.RequiredError('pricelistId','Required parameter requestParameters.pricelistId was null or undefined when calling getPriceFromPriceList.');
        }

        if (requestParameters.priceId === null || requestParameters.priceId === undefined) {
            throw new runtime.RequiredError('priceId','Required parameter requestParameters.priceId was null or undefined when calling getPriceFromPriceList.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("BearerAuthScheme", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v3/classifications/{classificationId}/pricelists/{pricelistId}/prices/{priceId}`.replace(`{${"classificationId"}}`, encodeURIComponent(String(requestParameters.classificationId))).replace(`{${"pricelistId"}}`, encodeURIComponent(String(requestParameters.pricelistId))).replace(`{${"priceId"}}`, encodeURIComponent(String(requestParameters.priceId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PriceFromJSON(jsonValue));
    }

    /**
     * Get all data of single active price of specified classification and specified pricelist.
     * Get price by classification id, price list id and price id.
     */
    async getPriceFromPriceList(requestParameters: GetPriceFromPriceListRequest): Promise<Price> {
        const response = await this.getPriceFromPriceListRaw(requestParameters);
        return await response.value();
    }

    /**
     * Get collection of prices of specified classification and price list
     * Get prices from price list.
     */
    async getPricesFromPriceListRaw(requestParameters: GetPricesFromPriceListRequest): Promise<runtime.ApiResponse<Prices>> {
        if (requestParameters.classificationId === null || requestParameters.classificationId === undefined) {
            throw new runtime.RequiredError('classificationId','Required parameter requestParameters.classificationId was null or undefined when calling getPricesFromPriceList.');
        }

        if (requestParameters.pricelistId === null || requestParameters.pricelistId === undefined) {
            throw new runtime.RequiredError('pricelistId','Required parameter requestParameters.pricelistId was null or undefined when calling getPricesFromPriceList.');
        }

        const queryParameters: any = {};

        if (requestParameters.status) {
            queryParameters['status'] = requestParameters.status;
        }

        if (requestParameters.validOn !== undefined) {
            queryParameters['validOn'] = (requestParameters.validOn as any).toISOString().substr(0,10);
        }

        if (requestParameters.qvalue !== undefined) {
            queryParameters['qvalue'] = requestParameters.qvalue;
        }

        if (requestParameters.qfield) {
            queryParameters['qfield'] = requestParameters.qfield;
        }

        if (requestParameters.modifiedAfter !== undefined) {
            queryParameters['modifiedAfter'] = (requestParameters.modifiedAfter as any).toISOString().substr(0,10);
        }

        if (requestParameters.sortBy !== undefined) {
            queryParameters['sortBy'] = requestParameters.sortBy;
        }

        if (requestParameters.pageSize !== undefined) {
            queryParameters['pageSize'] = requestParameters.pageSize;
        }

        if (requestParameters.page !== undefined) {
            queryParameters['page'] = requestParameters.page;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("BearerAuthScheme", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v3/classifications/{classificationId}/pricelists/{pricelistId}/prices`.replace(`{${"classificationId"}}`, encodeURIComponent(String(requestParameters.classificationId))).replace(`{${"pricelistId"}}`, encodeURIComponent(String(requestParameters.pricelistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => PricesFromJSON(jsonValue));
    }

    /**
     * Get collection of prices of specified classification and price list
     * Get prices from price list.
     */
    async getPricesFromPriceList(requestParameters: GetPricesFromPriceListRequest): Promise<Prices> {
        const response = await this.getPricesFromPriceListRaw(requestParameters);
        return await response.value();
    }

}