import { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import { logger } from "../config/loggersApp.config";
import {
  verifyToken,
  decodedToken,
  splitTokenParts,
} from "../utils/token.utils";

const jwtAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Retrieve token
    const Authorization =
      req.get("Authorization") || req.query.token || req.body.token;

    // 2. Validate signature
    const tokenparts = splitTokenParts(Authorization);
    if (!Authorization || !/^Bearer$/i.test(tokenparts[0])) {
      return next(createError(401, "Invalid header authorization"));
    }

    // 3. Verify token
    verifyToken(Authorization);

    // 4. Get decoded token
    const token = decodedToken(Authorization);
    if (token === null) {
      return next(createError(404, { message: "Token null" }));
    }

    // 5. Dar el paso
    next();
  } catch (err: any) {
    logger.error({ err });
    return next(createError(500, { message: err.message }));
  }
};

export default jwtAuth;
