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
import { userCredentialsAi } from "../services/auth.services";

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
export const uploadFilesFromStorageController = async (
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
