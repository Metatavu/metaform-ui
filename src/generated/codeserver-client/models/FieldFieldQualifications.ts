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
 * Field qualifications
 * @export
 * @interface FieldFieldQualifications
 */
export interface FieldFieldQualifications {
    /**
     * Minimum length for field value
     * @type {number}
     * @memberof FieldFieldQualifications
     */
    minLength?: number;
    /**
     * Maximum length for field value
     * @type {number}
     * @memberof FieldFieldQualifications
     */
    maxLength?: number;
    /**
     * Is value mandatory
     * @type {boolean}
     * @memberof FieldFieldQualifications
     */
    mandatory?: boolean;
    /**
     * Condition for being mandatory
     * @type {string}
     * @memberof FieldFieldQualifications
     */
    mandatoryCondition?: string | null;
    /**
     * Value is allowed if this condition is fullfilled
     * @type {string}
     * @memberof FieldFieldQualifications
     */
    valueCondition?: string | null;
    /**
     * Should value be unique
     * @type {boolean}
     * @memberof FieldFieldQualifications
     */
    unique?: boolean;
    /**
     * Minimum value for numeric attribute value
     * @type {number}
     * @memberof FieldFieldQualifications
     */
    valueRangeMin?: number | null;
    /**
     * Maximum value for numeric attribute value
     * @type {number}
     * @memberof FieldFieldQualifications
     */
    valueRangeMax?: number | null;
    /**
     * Regular expression for value format
     * @type {string}
     * @memberof FieldFieldQualifications
     */
    format?: string | null;
    /**
     * Condition for regular expression
     * @type {string}
     * @memberof FieldFieldQualifications
     */
    formatCondition?: string | null;
    /**
     * Description for regular expression
     * @type {string}
     * @memberof FieldFieldQualifications
     */
    formatDescription?: string | null;
    /**
     * Allowed values for value set attributes
     * @type {Array<string>}
     * @memberof FieldFieldQualifications
     */
    valueSetValues?: Array<string>;
}

export function FieldFieldQualificationsFromJSON(json: any): FieldFieldQualifications {
    return FieldFieldQualificationsFromJSONTyped(json, false);
}

export function FieldFieldQualificationsFromJSONTyped(json: any, ignoreDiscriminator: boolean): FieldFieldQualifications {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'minLength': !exists(json, 'minLength') ? undefined : json['minLength'],
        'maxLength': !exists(json, 'maxLength') ? undefined : json['maxLength'],
        'mandatory': !exists(json, 'mandatory') ? undefined : json['mandatory'],
        'mandatoryCondition': !exists(json, 'mandatoryCondition') ? undefined : json['mandatoryCondition'],
        'valueCondition': !exists(json, 'valueCondition') ? undefined : json['valueCondition'],
        'unique': !exists(json, 'unique') ? undefined : json['unique'],
        'valueRangeMin': !exists(json, 'valueRangeMin') ? undefined : json['valueRangeMin'],
        'valueRangeMax': !exists(json, 'valueRangeMax') ? undefined : json['valueRangeMax'],
        'format': !exists(json, 'format') ? undefined : json['format'],
        'formatCondition': !exists(json, 'formatCondition') ? undefined : json['formatCondition'],
        'formatDescription': !exists(json, 'formatDescription') ? undefined : json['formatDescription'],
        'valueSetValues': !exists(json, 'valueSetValues') ? undefined : json['valueSetValues'],
    };
}

export function FieldFieldQualificationsToJSON(value?: FieldFieldQualifications | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'minLength': value.minLength,
        'maxLength': value.maxLength,
        'mandatory': value.mandatory,
        'mandatoryCondition': value.mandatoryCondition,
        'valueCondition': value.valueCondition,
        'unique': value.unique,
        'valueRangeMin': value.valueRangeMin,
        'valueRangeMax': value.valueRangeMax,
        'format': value.format,
        'formatCondition': value.formatCondition,
        'formatDescription': value.formatDescription,
        'valueSetValues': value.valueSetValues,
    };
}


