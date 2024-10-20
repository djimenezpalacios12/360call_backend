import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { logger } from "../config/loggersApp.config";
import { retrieveUser } from "../services/auth.services";
import { comparePassword } from "../utils/bcrypt.utils";

const passwordVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signIn = req.body;

    const retrieveUserMailResponse = await retrieveUser(signIn);

    if (!retrieveUserMailResponse) {
      return next(createError(404, { err: "Usuario no encontrado" }));
    }

    // Compare passwords
    const password = signIn.contraseña;
    const hash = retrieveUserMailResponse.contraseña as string;
    const compareResponse = await comparePassword(password, hash);
    if (!compareResponse) {
      return next(createError(400, { err: "Contraseña incorrecta" }));
    }

    // Dar el paso
    next();
  } catch (err: any) {
    logger.error({ err });
    return next(createError(500, { err: err.message }));
  }
};

export default passwordVerify;
