import { Router } from "express";

import passwordVerify from "../middleware/passwordVerify.middleware";
import jwtAuth from "../middleware/jwt.middleware";
import { chatAssistant, downloadFileIA } from "../controllers/ia.controller";

const router: Router = Router();

router.post("/chat", jwtAuth, chatAssistant);
router.post("/download/file/:idFile", jwtAuth, downloadFileIA);

export default router;
