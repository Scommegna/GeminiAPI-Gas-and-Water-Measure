import { Request, Response } from "express";
import UploadModel from "../models/upload";

export const createUpload = async (req: Request, res: Response) => {
  const upload = await UploadModel.create({
    image: req.body.image,
    customer_code: req.body.customer_code,
    measure_datetime: req.body.measure_datetime,
    measure_type: req.body.measure_type,
  });

  return res.status(200).json(upload);
};
