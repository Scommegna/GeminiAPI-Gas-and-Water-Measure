import express from "express";

import { isAuthenticated } from "../middlewares/authMiddlewares";

import { upload } from "../middlewares/multerMiddleware";

import {
  createUpload,
  getListOfMeasures,
  patchValueById,
} from "../controllers/uploadControllers";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.single("file"), createUpload);

//Arrumar o patch
router.patch("/confirm", patchValueById);
router.get("/:customerCode/list", isAuthenticated, getListOfMeasures);

export { router };
