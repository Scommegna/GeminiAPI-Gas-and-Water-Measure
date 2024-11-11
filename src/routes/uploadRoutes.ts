import express from "express";

import { isAuthenticated } from "../middlewares/authMiddlewares";

import {
  createUpload,
  getListOfMeasures,
  patchValueById,
} from "../controllers/uploadControllers";

const router = express.Router();

router.post("/upload", isAuthenticated, createUpload);
router.patch("/confirm", patchValueById);
router.get("/:customerCode/list", isAuthenticated, getListOfMeasures);

export { router };
