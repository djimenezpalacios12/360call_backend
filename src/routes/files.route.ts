import { Router } from "express";
import multer from "multer";

import jwtAuth from "../middleware/jwt.middleware";
import {
  getFilesFromStorageController,
  uploadFilesFromStorageController,
} from "../controllers/storage.controller";

const router: Router = Router();
const upload = multer();

router.get("/", jwtAuth, getFilesFromStorageController);
router.post(
  "/",
  jwtAuth,
  upload.array("files", 100),
  uploadFilesFromStorageController
);

export default router;
