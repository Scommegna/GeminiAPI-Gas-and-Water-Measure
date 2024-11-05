import express from "express";

import {
  createUpload,
  getListOfMeasures,
  patchValueById,
} from "../controllers/uploadControllers";

const router = express.Router();

router.post("/upload", createUpload);
router.patch("/confirm", patchValueById);
router.get("/:customerCode/list", getListOfMeasures);

export { router };
