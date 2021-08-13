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
}

/**
 * Interface describing dictionary type
 */
export interface Dictionary<T> {
  [Key: string]: T;
}

/**
 * Interface describing anonymous login configuration
 */
export interface AnonymousLoginConfig {
  url: string
  realm: string
  clientId: string
  username: string
  password: string
}

/**
 * Interface describing admin login configuration
 */
export interface AdminLoginConfig {
  url: string
  realm: string
  clientId: string
}

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
}

/**
 * Type for field file
 */
export type FileFieldValue = {
  files: FileFieldValueItem[]
}

/**
 * Type for single table cell value
 */
 export type TableFieldCellValue = string | number | null;

 /**
  * Interface for values in single row
  */
 export interface TableFieldRowValue { 
   [key: string]: TableFieldCellValue
 }
 
 /**
  * Type for table field value
  */
 export type TableFieldValue = TableFieldRowValue[];

 /**
 * Type for icon name
 */
export type IconName = "dot-circle-o" | "circle-o" | "check-square-o" | "square-o" | "add";