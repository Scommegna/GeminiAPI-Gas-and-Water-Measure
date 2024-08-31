import { Request, Response } from "express";
import UploadModel from "../models/upload";

export const createUpload = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const upload = await UploadModel.create({
    image,
    customer_code,
    measure_datetime,
    measure_type,
  });

  return res.status(200).json(upload);
};
