export default class Utils {

  /**
   * Sends a blob to user for downloading
   * 
   * @param data data as blob
   * @param filename download file name
   */
  public static downloadBlob = (data: Blob, filename: string) => {
    const downloadLink = document.createElement("a");
    const downloadUrl = window.URL.createObjectURL(data);
    document.body.appendChild(downloadLink);    
    downloadLink.href = downloadUrl;
    downloadLink.download = filename; 
    downloadLink.click();
    window.URL.revokeObjectURL(downloadUrl);
    downloadLink.remove();
  }

  /**
   * Creates owner key protected reply edit link 
   * 
   * @param replyId reply id
   * @param ownerKey owner key
   * @returns owner key protected reply edit link 
   */
  public static createOwnerKeyLink = (replyId: string, ownerKey: string) => {
    const { location } = window;
    return (new URL(`${location.protocol}//${location.hostname}:${location.port}?reply=${replyId}&owner-key=${ownerKey}`)).toString();
  }

}