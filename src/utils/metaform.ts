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
  public static createEmptyField = (fieldType: MetaformFieldType): MetaformField => {
    if (fieldType === MetaformFieldType.Select || fieldType === MetaformFieldType.Radio) {
      return {
        title: fieldType.toString(),
        type: fieldType,
        options: [
          {
            name: "option",
            text: "option",
          },
        ]
      } 
    }

    return {
      name: fieldType.toString(),
      title: fieldType.toString(),
      type: fieldType
    } 
  }

  /**
   * Convert a empty section
   * 
   * @returns created section 
   */
  public static metaformDefaultSection = (): MetaformSection => {
    return {
      title: "Section",
      fields: []
    } 
  }
}