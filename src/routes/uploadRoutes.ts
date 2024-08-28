import express from "express";

import { createUpload } from "../controllers/controllers";

const router = express.Router();

router.post("/upload", createUpload);

export { router };
