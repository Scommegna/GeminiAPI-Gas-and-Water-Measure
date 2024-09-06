import express from "express";

import { createUpload, patchValueById } from "../controllers/controllers";

const router = express.Router();

router.post("/upload", createUpload);
router.patch("/confirm", patchValueById);

export { router };
