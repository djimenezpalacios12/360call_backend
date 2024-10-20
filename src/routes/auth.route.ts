import { Router } from "express";

import { signIn } from "../controllers/auth.controller";
import searchUser from "../middleware/searchUser.middlware";
import passwordVerify from "../middleware/passwordVerify.middleware";

const router: Router = Router();

router.post("/", searchUser, passwordVerify, signIn);

export default router;
