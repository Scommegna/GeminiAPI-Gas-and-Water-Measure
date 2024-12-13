import express from "express";

import { isAuthenticated } from "../middlewares/authMiddlewares";

import { upload } from "../middlewares/multerMiddleware";

import {
  createUpload,
  getListOfMeasures,
  sendProofOfPayment,
} from "../controllers/uploadControllers";

const router = express.Router();

router.post("/upload", isAuthenticated, upload.single("file"), createUpload);
router.get("/list", isAuthenticated, getListOfMeasures);
router.post(
  "/proof",
  isAuthenticated,
  upload.single("file"),
  sendProofOfPayment
);

export { router };
