/**
 * Interface describing an access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  realmRoles: string[];
};

/**
 * Type for signed access token
 */
export type SignedToken = AccessToken | null;

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
};

/**
 * Interface describing anonymous login configuration
 */
export interface AnonymousLoginConfig {
  url: string;
  realm: string;
  clientId: string;
  username: string;
  password: string;
};

/**
 * Type for field value
 */
export type FieldValue = string | string[] | number | TableFieldValue | FileFieldValue | null;

/**
 * Type for field file
 */
export type FileFieldValueItem = {
  url?: string;
  name?: string;
  id: string;
  persisted: boolean;
};

/**
 * Type for field file
 */
export type FileFieldValue = {
  files: FileFieldValueItem[];
};

/**
 * Type for single table cell value
 */
export type TableFieldCellValue = string | number | null;

/**
 * Interface for values in single row
 */
export interface TableFieldRowValue {
  [key: string]: TableFieldCellValue;
};

/**
 * Type for table field value
 */
export type TableFieldValue = TableFieldRowValue[];

/**
 * Enum for all route of the web app
 */
export enum EditorNavigationLinks {
  form,
  preview,
  json
}

/**
 * Type for icon name
 */
export type IconName = "dot-circle-o" | "circle-o" | "check-square-o" | "square-o" | "add";

/**
 * Type for Login mode
 */
export type LoginMode = "USER" | "ADMIN";

/**
 * Autocomplete item
 */
export type AutocompleteItem = { id: string, [key: string]: string };

/**
 * Values for filtering scopes
 */
export enum autocompleteErrorMessages {
  MISSING_OPTIONS = "Code server autocomplete not configured",
  MISSING_CODE_SERVER_BASE_URL = "Code server autocomplete missing codeServerBaseUrl",
  MISSING_CODE_SERVER_CLASSIFICATION_ID = "Code server autocomplete missing codeServerClassificationId",
  MISSING_CODE_SERVER_PARENT_CONCEPT_CODE_ID = "Code server autocomplete missing codeServerParentConceptCodeId",
  MISSING_AUTO_COMPLETE = "Autocomplete not configured"
}