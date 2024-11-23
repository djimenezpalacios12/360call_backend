import { Request, Response } from "express";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import moment from "moment";

import { endpointResponse } from "../utils/endpointResponse.utils";
import { EndpointResponse } from "../interfaces/response.interface";
import { logger } from "../config/loggersApp.config";
import { retrieveUser } from "../services/auth.services";
import { tokenPayload } from "../interfaces/auth.interface";
import { RolesEntity } from "../entities/roles.entity";
import { searchRol } from "../services/user.services";

// Get metadata
export const metadataUser = async (req: Request, res: Response, next: any): Promise<Response> => {
  try {
    const _id: string = uuid();
    const signinDate = moment().format();

    // 1. Retrieve token
    const Authorization = req.get("Authorization") || req.query.token || req.body.token;
    let tokenParts = Authorization ? Authorization.split(" ") : [];
    const tokenDecode = jwt.decode(tokenParts[1], { complete: true });
    const token = tokenDecode?.payload as tokenPayload;
    const rol: RolesEntity | null = await searchRol(token.rol);

    if (!token) {
      return next(createError(404, { err: "Token Invalido" }));
    }

    const metadata = {
      _id: _id,
      correo: token.correo,
      nombre: token.nombre,
      fecha_ultimo_acceso: signinDate,
      rol: rol?.rol,
    };

    return res.json(endpointResponse(new Date(), "success", 200, metadata));
  } catch (err: any) {
    return next(createError(500, { err: err.message }));
  }
};

export const signIn = async (req: Request, res: Response, next: any): Promise<Response<EndpointResponse>> => {
  try {
    const signIn = req.body;

    const retrieveUserMailResponse = await retrieveUser(signIn);

    // Create Payload Token
    const id: string = uuid();
    const deltaExp = Number(process.env.JWT_EXP);
    const payload = {
      _id: id,
      id_usuario: retrieveUserMailResponse?.id_usuario,
      nombre: retrieveUserMailResponse?.nombre,
      correo: retrieveUserMailResponse?.correo,
      rol: retrieveUserMailResponse?.rol,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: deltaExp, // 24 hrs
    });

    return res.json(endpointResponse(new Date(), "success", 200, { token: token }));
  } catch (err: any) {
    logger.error({ err: err.message });
    return next(createError(500, { err: err.message }));
  }
};
