import { Router } from "express";
import multer from "multer";

import jwtAuth from "../middleware/jwt.middleware";
import {
  getFilesFromStorageController,
  uploadFilesInStorageController,
  uploadFilesInStorageAssistantAreaController,
} from "../controllers/storage.controller";

const router: Router = Router();
const upload = multer();

router.get("/", jwtAuth, getFilesFromStorageController);
router.post(
  "/",
  jwtAuth,
  upload.array("files", 100),
  uploadFilesInStorageController
);
router.post(
  "/assistant",
  jwtAuth,
  upload.array("files", 100),
  uploadFilesInStorageAssistantAreaController
);

export default router;
