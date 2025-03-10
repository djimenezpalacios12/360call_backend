import { Request, Response } from "express";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import moment from "moment";

import { endpointResponse } from "../utils/endpointResponse.utils";
import {
  getFilesFromStorage,
  uploadFileToAzure,
} from "../config/storage.config";
import { logger } from "../config/loggersApp.config";
import { decodedToken } from "../utils/token.utils";
import { filterFilesByMimetype } from "../utils/validateMimeType.utils";
import { userCredentialsAi } from "../services/auth.services";
import { processAudio, processDoc } from "../utils/processFiles.utils";

/**
 * Controller to call storage service and get the list of files
 */
export const getFilesFromStorageController = async (
  req: Request,
  res: Response,
  next: any
): Promise<Response> => {
  try {
    // Credentiales User
    const Authorization =
      req.get("Authorization") || req.query.token || req.body.token;
    const infoUser: any = decodedToken(Authorization);
    const id_usuario = infoUser?.payload?.id_usuario;
    const credentials = await userCredentialsAi(id_usuario);

    // Call blob function
    const getFilesFromStorageResponse = await getFilesFromStorage(
      credentials?.id_empresa || ""
    );

    return res.json(
      endpointResponse(new Date(), "success", 200, getFilesFromStorageResponse)
    );
  } catch (err: any) {
    logger.error({ err: err });
    return next(createError(500, { err: err.message }));
  }
};

/**
 * Controller for uploading files to a container
 */
export const uploadFilesInStorageController = async (
  req: Request,
  res: Response,
  next: any
): Promise<Response> => {
  try {
    // Credentiales User
    const Authorization =
      req.get("Authorization") || req.query.token || req.body.token;
    const infoUser: any = decodedToken(Authorization);
    const id_usuario = infoUser?.payload?.id_usuario;
    const credentials = await userCredentialsAi(id_usuario);

    // Azure upload function
    const containerName = credentials?.id_empresa || "";
    const folderPath = credentials?.id_area || "";
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return next(createError(400, { err: "Archivo no encontrados" }));
    }

    const uploadPromises = files.map((file) =>
      uploadFileToAzure(file, containerName, folderPath)
    );
    const fileUrls = await Promise.all(uploadPromises);

    return res.json(
      endpointResponse(new Date(), "success", 200, { files: fileUrls })
    );
  } catch (err: any) {
    logger.error({ err: err });
    return next(createError(500, { err: err.message }));
  }
};

/**
 * Controller for uploading files to storage and Assistant
 */
export const uploadFilesInStorageAssistantController = async (
  req: Request,
  res: Response,
  next: any
): Promise<Response> => {
  try {
    // Credentiales User
    const Authorization =
      req.get("Authorization") || req.query.token || req.body.token;
    const infoUser: any = decodedToken(Authorization);
    const id_usuario = infoUser?.payload?.id_usuario;
    const credentials = await userCredentialsAi(id_usuario);

    // Azure upload function
    const containerName = credentials?.id_empresa || "";
    const folderPath = credentials?.id_area || "";

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return next(createError(400, { err: "Archivo no encontrados" }));
    }

    // Validate mimeTypes
    const { validFiles } = filterFilesByMimetype(files);
    if (validFiles.length === 0) {
      return next(
        createError(500, "Ningún archivo tiene un formato permitido")
      );
    }

    // Process File by Case
    const actions: {
      [key: string]: (file: Express.Multer.File) => Promise<any>;
    } = {
      "application/pdf": processDoc,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        processDoc,
      "audio/mpeg": processAudio,
    };

    // Process every file (save and process)
    const processedFiles = await Promise.all(
      validFiles.map((file) => actions[file.mimetype](file))
    );

    return res.json(
      endpointResponse(new Date(), "success", 200, processedFiles)
    );
  } catch (err: any) {
    logger.error({ err: err });
    return next(createError(500, { err: err.message }));
  }
};
