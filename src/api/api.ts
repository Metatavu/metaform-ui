// eslint-disable-next-line max-len
import { AttachmentsApi, Configuration, DraftsApi, MetaformsApi, RepliesApi } from "../generated/client";
import { AccessToken } from "../types";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {

  /**
   * Gets initialized metaforms api
   *
   * @param token access token
   */
  public static getMetaformsApi(accessToken: AccessToken) {
    return new MetaformsApi(Api.getConfiguration(accessToken));
  }

  /**
   * Gets initialized replies api
   *
   * @param token access token
   */
  public static getRepliesApi(accessToken: AccessToken) {
    return new RepliesApi(Api.getConfiguration(accessToken));
  }

  /**
   * Gets initialized drafts api
   *
   * @param token access token
   */
  public static getDraftsApi(accessToken: AccessToken) {
    return new DraftsApi(Api.getConfiguration(accessToken));
  }

  /**
   * Gets initialized attachments api
   * 
   * @param accessToken access token
   */
  public static getAttachmentsApi(accessToken: AccessToken) {
    return new AttachmentsApi(Api.getConfiguration(accessToken));
  }

  /**
   * Creates default file upload url
   */
  public static createDefaultUploadUrl = (): string => {
    let apiUrl = process.env.REACT_APP_API_BASE_PATH || "";
    const apiVersionSlashIndex = apiUrl.lastIndexOf("/v1");
    if (apiVersionSlashIndex < 0) {
      return "";
    }
    return `${apiUrl.slice(0, apiVersionSlashIndex)}/fileUpload`;
  }

  /**
   * Gets api configuration
   *
   * @param token acess token
   */
  private static getConfiguration(accessToken: AccessToken) {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_PATH,
      apiKey: `Bearer ${accessToken.access_token}`
    });
  }

}
