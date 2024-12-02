import { fromBuffer } from "file-type";

import { logger } from "../config/loggersApp.config";
import { getClient } from "../utils/azure.utils";

interface DownloadFile {
  fileBase64: string;
  mimeTypeDetected: string;
}

export const donwloadFileServices = async (
  idFile: string
): Promise<DownloadFile> => {
  const assistantsClient = getClient();
  try {
    const file = await assistantsClient.files.content(idFile);

    // Convert base64
    const fileContent = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileContent).toString("base64");

    const fileBuffer = Buffer.from(fileBase64, "base64");
    const mimeType = await fromBuffer(fileBuffer);
    const mimeTypeDetected = mimeType?.mime || "application/octet-stream";

    return { fileBase64: fileBase64, mimeTypeDetected: mimeTypeDetected };
  } catch (err: any) {
    logger.error({ err: err.message });
    return { fileBase64: "", mimeTypeDetected: "" };
  }
};
