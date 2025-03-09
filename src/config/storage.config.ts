import { BlobServiceClient } from "@azure/storage-blob";
import dotenv from "dotenv";

import { logger } from "./loggersApp.config";

dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Faltan variables de entorno para Azure Storage");
}

const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

/**
 * Gets the files from a given container
 */
export const getFilesFromStorage = async (containerName: string) => {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  let blobs: string[] = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push(blob.name);
  }
  return blobs;
};

/**
 * Upload a file to Azure Blob Storage.
 */
export const uploadFileToAzure = async (
  file: Express.Multer.File,
  containerName: string,
  folderPath: string = ""
) => {
  try {
    // Obtener el cliente del contenedor
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Verificar si el contenedor existe, si no, crearlo
    const exists = await containerClient.exists();
    if (!exists) {
      await containerClient.create();
      console.log(`Contenedor '${containerName}' creado.`);
    }

    // Construir la ruta del archivo dentro del contenedor
    const blobName = folderPath
      ? `${folderPath}/${file.originalname}`
      : file.originalname;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Subir el archivo a Azure
    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    console.log(`Archivo '${blobName}' subido correctamente.`);
    return blockBlobClient.url;
  } catch (error) {
    console.error("Error al subir archivo a Azure Blob Storage:", error);
    throw new Error("No se pudo subir el archivo.");
  }
};
