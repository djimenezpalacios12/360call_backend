import { Request, Response } from "express";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

import { endpointResponse } from "../utils/endpointResponse.utils";
import { EndpointResponse } from "../interfaces/response.interface";
import { logger } from "../config/loggersApp.config";
import { retrieveUser } from "../services/auth.services";

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
