import { Request } from "express";

import path from "path";

import { CBMulterType } from "../types/types";

import multer from "multer";

const FILE_PATH = path.resolve(__dirname, "../../tmp/");

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: CBMulterType) => {
    cb(null, FILE_PATH);
  },
  filename: (req: Request, file: any, cb: CBMulterType) => {
    const { id } = req.session;
    const { measure_type } = req.body;
    const date = new Date().toString();

    const uniqueFileName = `${id}-${measure_type}-${date}`;

    cb(null, uniqueFileName);
  },
});

export const upload = multer({ storage });
