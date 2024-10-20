import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { logger } from "../config/loggersApp.config";
import { decodedToken } from "../utils/token.utils";

// TODO: Added middleware for isAdmin
const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Retrieve token
    const Authorization = req.get("Authorization") || req.query.token || req.body.token;

    // 2. decoded token
    const token: any = decodedToken(Authorization);

    // 3. Search Rol name with ID Rol in token
    const rol: RolesEntity | null = await searchRol(token?.payload?.rol);
    if (rol?.rol === "usuario") {
      return next(
        createError(401, {
          err: "No tienes los privilegios para consultar esta información",
        })
      );
    }

    // 4. Dar el paso
    next();
  } catch (err: any) {
    logger.error({ err });
    return next(createError(500, { message: err.message }));
  }
};

export default isAdmin;
