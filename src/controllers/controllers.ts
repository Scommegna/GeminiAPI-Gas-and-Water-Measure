import { Request, Response } from "express";
import UploadModel from "../models/upload";

import { getMeasure } from "../GeminiAPI/gemini";

export const createUpload = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  const { image_url, measure_value } = await getMeasure(
    image,
    measure_type,
    customer_code,
    measure_datetime
  );

  // const upload = await UploadModel.create({
  //   image,
  //   customer_code,
  //   measure_datetime,
  //   measure_type,
  // });

  // return res.status(200).json(upload);
  return res.status(200).send();
};
