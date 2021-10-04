import { Metaform, MetaformField, MetaformFieldType } from "../generated/client";

/**
 * Utility class for metaform
 */
export default class MetaformUtils {

  /**
   * Convert metaform to json format
   * 
   * @param metaform metaform data
   * 
   * @returns metaform in json format
   */
  public static metaformToJson = (metaform: Metaform): string => {
    return metaform ? JSON.stringify(metaform, null, 2) : "";
  }

  /**
   * Convert json to metaform data
   * 
   * @param metaformJson metaform data in json
   * 
   * @returns metaform data
   */
  public static jsonToMetaform = (metaformJson: string): Metaform => {
    return {
      ...JSON.parse(metaformJson)
    } as Metaform;
  }

  /**
   * Convert json to metaform data
   * 
   * @param metaformJson metaform data in json
   * 
   * @returns metaform data
   */
  public static metaformDefaultField = (fieldType: MetaformFieldType): MetaformField => {
    // TODO radio
    return {
      title: fieldType.toString(),
      type: fieldType
    } 
  }
}