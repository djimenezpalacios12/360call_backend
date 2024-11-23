import { Router } from "express";

import { metadataUser, signIn } from "../controllers/auth.controller";
import searchUser from "../middleware/searchUser.middlware";
import passwordVerify from "../middleware/passwordVerify.middleware";
import jwtAuth from "../middleware/jwt.middleware";

const router: Router = Router();

router.post("/", searchUser, passwordVerify, signIn);
router.post("/metadata", jwtAuth, metadataUser);

export default router;
