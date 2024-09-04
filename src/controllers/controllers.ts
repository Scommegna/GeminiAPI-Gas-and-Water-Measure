import { Request, Response } from "express";
import UploadModel from "../models/upload";

import { getMeasure } from "../GeminiAPI/gemini";
import { BadRequestError, DoubleReportError } from "../helpers/api-errors";

export const createUpload = async (req: Request, res: Response) => {
  const { image, customer_code, measure_datetime, measure_type } = req.body;

  if (!image || !customer_code || !measure_datetime || !measure_type)
    throw new BadRequestError(
      "Not all parameters for the upload request were provided."
    );

  const hasUploadedData = await UploadModel.findOne({
    customer_code,
    measure_datetime,
    measure_type,
  });

  if (hasUploadedData)
    throw new DoubleReportError(
      `There is already a measurement registered for the month ${measure_datetime.toString()} for the user ${customer_code}.`
    );

  const { uri, value } = await getMeasure(
    image,
    measure_type,
    customer_code,
    measure_datetime
  );

  const { _id } = await UploadModel.create({
    image,
    customer_code,
    measure_datetime,
    measure_type,
    value,
    uri,
  });

  return res.status(200).json({ uri, value, _id });
};
