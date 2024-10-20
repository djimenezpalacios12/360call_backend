import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { logger } from "../config/loggersApp.config";
import { retrieveUser } from "../services/auth.services";

const searchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signIn = req.body;

    const retrieveUserMailResponse = await retrieveUser(signIn);
    if (!retrieveUserMailResponse) {
      return next(
        createError(400, { err: "Usuario no encontrado o Inactivo" })
      );
    }

    // Dar el paso
    next();
  } catch (err: any) {
    logger.error({ err });
    return next(createError(500, { err: err.message }));
  }
};

export default searchUser;
