import { Router } from "express";

import searchUser from "../middleware/searchUser.middlware";
import passwordVerify from "../middleware/passwordVerify.middleware";
import jwtAuth from "../middleware/jwt.middleware";
import { chatAssistant } from "../controllers/ia.controller";

const router: Router = Router();

router.post("/chat", jwtAuth, searchUser, passwordVerify, chatAssistant);

export default router;
