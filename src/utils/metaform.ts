import { Metaform, MetaformField, MetaformFieldType, MetaformSection } from "../generated/client";

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
   * Create a default field with field Type
   * 
   * @param fieldType metaform field type
   * @returns created field type
   */
  public static metaformDefaultField = (fieldType: MetaformFieldType): MetaformField => {
    // TODO radio, select
    return {
      title: fieldType.toString(),
      type: fieldType
    } 
  }

  /**
   * Convert a default section
   * 
   * @returns created section 
   */
  public static metaformDefaultSection = (): MetaformSection => {
    // TODO radio, select
    return {
      title: "Section",
      fields: []
    } 
  }
}