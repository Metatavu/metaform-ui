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
    FieldRule,
    FieldRuleFromJSON,
    FieldRuleFromJSONTyped,
    FieldRuleToJSON,
    MetaformFieldAutocomplete,
    MetaformFieldAutocompleteFromJSON,
    MetaformFieldAutocompleteFromJSONTyped,
    MetaformFieldAutocompleteToJSON,
    MetaformFieldFlags,
    MetaformFieldFlagsFromJSON,
    MetaformFieldFlagsFromJSONTyped,
    MetaformFieldFlagsToJSON,
    MetaformFieldOption,
    MetaformFieldOptionFromJSON,
    MetaformFieldOptionFromJSONTyped,
    MetaformFieldOptionToJSON,
    MetaformFieldPermissionContexts,
    MetaformFieldPermissionContextsFromJSON,
    MetaformFieldPermissionContextsFromJSONTyped,
    MetaformFieldPermissionContextsToJSON,
    MetaformFieldSource,
    MetaformFieldSourceFromJSON,
    MetaformFieldSourceFromJSONTyped,
    MetaformFieldSourceToJSON,
    MetaformFieldType,
    MetaformFieldTypeFromJSON,
    MetaformFieldTypeFromJSONTyped,
    MetaformFieldTypeToJSON,
    MetaformTableColumn,
    MetaformTableColumnFromJSON,
    MetaformTableColumnFromJSONTyped,
    MetaformTableColumnToJSON,
} from './';

/**
 * 
 * @export
 * @interface MetaformField
 */
export interface MetaformField {
    /**
     * 
     * @type {FieldRule}
     * @memberof MetaformField
     */
    visibleIf?: FieldRule;
    /**
     * 
     * @type {MetaformFieldPermissionContexts}
     * @memberof MetaformField
     */
    permissionContexts?: MetaformFieldPermissionContexts;
    /**
     * Field name
     * @type {string}
     * @memberof MetaformField
     */
    name?: string;
    /**
     * 
     * @type {MetaformFieldType}
     * @memberof MetaformField
     */
    type: MetaformFieldType;
    /**
     * 
     * @type {string}
     * @memberof MetaformField
     */
    title?: string;
    /**
     * 
     * @type {boolean}
     * @memberof MetaformField
     */
    required?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof MetaformField
     */
    contexts?: Array<string>;
    /**
     * 
     * @type {MetaformFieldFlags}
     * @memberof MetaformField
     */
    flags?: MetaformFieldFlags;
    /**
     * 
     * @type {string}
     * @memberof MetaformField
     */
    placeholder?: string;
    /**
     * 
     * @type {string}
     * @memberof MetaformField
     */
    _class?: string;
    /**
     * 
     * @type {boolean}
     * @memberof MetaformField
     */
    readonly?: boolean;
    /**
     * 
     * @type {string}
     * @memberof MetaformField
     */
    help?: string;
    /**
     * a default value for a field
     * @type {string}
     * @memberof MetaformField
     */
    _default?: string;
    /**
     * Minimum value for a field. Only for number fields
     * @type {number}
     * @memberof MetaformField
     */
    min?: number;
    /**
     * Maximum value for a field. Only for number fields
     * @type {number}
     * @memberof MetaformField
     */
    max?: number;
    /**
     * Value step for a field. Only for number fields
     * @type {number}
     * @memberof MetaformField
     */
    step?: number;
    /**
     * Whether checkbox should be checked by default. Only for checkbox fields
     * @type {boolean}
     * @memberof MetaformField
     */
    checked?: boolean;
    /**
     * Defines whether field is printable or not. Only for table fields
     * @type {boolean}
     * @memberof MetaformField
     */
    printable?: boolean;
    /**
     * Options for radio, checklist, select fields
     * @type {Array<MetaformFieldOption>}
     * @memberof MetaformField
     */
    options?: Array<MetaformFieldOption>;
    /**
     * 
     * @type {MetaformFieldAutocomplete}
     * @memberof MetaformField
     */
    autocomplete?: MetaformFieldAutocomplete;
    /**
     * Source url for autocomplete and autocomplete-multiple fields. This field is deprecated, use autocomplete instead.
     * @type {string}
     * @memberof MetaformField
     */
    sourceUrl?: string;
    /**
     * Upload url for files field.
     * @type {string}
     * @memberof MetaformField
     */
    uploadUrl?: string;
    /**
     * Defines whether file fields allow multiple files or just one
     * @type {boolean}
     * @memberof MetaformField
     */
    singleFile?: boolean;
    /**
     * Defines whether file fields allow only images
     * @type {boolean}
     * @memberof MetaformField
     */
    onlyImages?: boolean;
    /**
     * Maximum upload size for image filds
     * @type {number}
     * @memberof MetaformField
     */
    maxFileSize?: number;
    /**
     * Defines whether user can add more table rows.
     * @type {boolean}
     * @memberof MetaformField
     */
    addRows?: boolean;
    /**
     * Defines whether table rows should be draggable.
     * @type {boolean}
     * @memberof MetaformField
     */
    draggable?: boolean;
    /**
     * Columns for table fields
     * @type {Array<MetaformTableColumn>}
     * @memberof MetaformField
     */
    columns?: Array<MetaformTableColumn>;
    /**
     * Url for logo field.
     * @type {string}
     * @memberof MetaformField
     */
    src?: string;
    /**
     * Text for small field.
     * @type {string}
     * @memberof MetaformField
     */
    text?: string;
    /**
     * Html code for html field.
     * @type {string}
     * @memberof MetaformField
     */
    html?: string;
    /**
     * 
     * @type {MetaformFieldSource}
     * @memberof MetaformField
     */
    source?: MetaformFieldSource;
}

export function MetaformFieldFromJSON(json: any): MetaformField {
    return MetaformFieldFromJSONTyped(json, false);
}

export function MetaformFieldFromJSONTyped(json: any, ignoreDiscriminator: boolean): MetaformField {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'visibleIf': !exists(json, 'visible-if') ? undefined : FieldRuleFromJSON(json['visible-if']),
        'permissionContexts': !exists(json, 'permission-contexts') ? undefined : MetaformFieldPermissionContextsFromJSON(json['permission-contexts']),
        'name': !exists(json, 'name') ? undefined : json['name'],
        'type': MetaformFieldTypeFromJSON(json['type']),
        'title': !exists(json, 'title') ? undefined : json['title'],
        'required': !exists(json, 'required') ? undefined : json['required'],
        'contexts': !exists(json, 'contexts') ? undefined : json['contexts'],
        'flags': !exists(json, 'flags') ? undefined : MetaformFieldFlagsFromJSON(json['flags']),
        'placeholder': !exists(json, 'placeholder') ? undefined : json['placeholder'],
        '_class': !exists(json, 'class') ? undefined : json['class'],
        'readonly': !exists(json, 'readonly') ? undefined : json['readonly'],
        'help': !exists(json, 'help') ? undefined : json['help'],
        '_default': !exists(json, 'default') ? undefined : json['default'],
        'min': !exists(json, 'min') ? undefined : json['min'],
        'max': !exists(json, 'max') ? undefined : json['max'],
        'step': !exists(json, 'step') ? undefined : json['step'],
        'checked': !exists(json, 'checked') ? undefined : json['checked'],
        'printable': !exists(json, 'printable') ? undefined : json['printable'],
        'options': !exists(json, 'options') ? undefined : ((json['options'] as Array<any>).map(MetaformFieldOptionFromJSON)),
        'autocomplete': !exists(json, 'autocomplete') ? undefined : MetaformFieldAutocompleteFromJSON(json['autocomplete']),
        'sourceUrl': !exists(json, 'source-url') ? undefined : json['source-url'],
        'uploadUrl': !exists(json, 'upload-url') ? undefined : json['upload-url'],
        'singleFile': !exists(json, 'single-file') ? undefined : json['single-file'],
        'onlyImages': !exists(json, 'only-images') ? undefined : json['only-images'],
        'maxFileSize': !exists(json, 'max-file-size') ? undefined : json['max-file-size'],
        'addRows': !exists(json, 'add-rows') ? undefined : json['add-rows'],
        'draggable': !exists(json, 'draggable') ? undefined : json['draggable'],
        'columns': !exists(json, 'columns') ? undefined : ((json['columns'] as Array<any>).map(MetaformTableColumnFromJSON)),
        'src': !exists(json, 'src') ? undefined : json['src'],
        'text': !exists(json, 'text') ? undefined : json['text'],
        'html': !exists(json, 'html') ? undefined : json['html'],
        'source': !exists(json, 'source') ? undefined : MetaformFieldSourceFromJSON(json['source']),
    };
}

export function MetaformFieldToJSON(value?: MetaformField | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'visible-if': FieldRuleToJSON(value.visibleIf),
        'permission-contexts': MetaformFieldPermissionContextsToJSON(value.permissionContexts),
        'name': value.name,
        'type': MetaformFieldTypeToJSON(value.type),
        'title': value.title,
        'required': value.required,
        'contexts': value.contexts,
        'flags': MetaformFieldFlagsToJSON(value.flags),
        'placeholder': value.placeholder,
        'class': value._class,
        'readonly': value.readonly,
        'help': value.help,
        'default': value._default,
        'min': value.min,
        'max': value.max,
        'step': value.step,
        'checked': value.checked,
        'printable': value.printable,
        'options': value.options === undefined ? undefined : ((value.options as Array<any>).map(MetaformFieldOptionToJSON)),
        'autocomplete': MetaformFieldAutocompleteToJSON(value.autocomplete),
        'source-url': value.sourceUrl,
        'upload-url': value.uploadUrl,
        'single-file': value.singleFile,
        'only-images': value.onlyImages,
        'max-file-size': value.maxFileSize,
        'add-rows': value.addRows,
        'draggable': value.draggable,
        'columns': value.columns === undefined ? undefined : ((value.columns as Array<any>).map(MetaformTableColumnToJSON)),
        'src': value.src,
        'text': value.text,
        'html': value.html,
        'source': MetaformFieldSourceToJSON(value.source),
    };
}


