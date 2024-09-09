import { Request, Response } from "express";
import UploadModel from "../models/upload";

import { hasOneMonthPassed } from "../utils/utils";

import { PatchReqBody } from "../types/types";

import { checkMeasureType } from "../utils/utils";

import { getMeasure } from "../GeminiAPI/gemini";
import {
  BadRequestError,
  DoubleReportError,
  MeasureNotFoundError,
} from "../helpers/api-errors";

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

  if (hasUploadedData && !hasOneMonthPassed(hasUploadedData?.measure_datetime))
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

export const patchValueById = async (
  req: Request<PatchReqBody>,
  res: Response
) => {
  const { uuid, value } = req.body;

  if (!uuid || !value)
    throw new BadRequestError(
      "Not all parameters for the upload request were provided."
    );

  const hasUploadedData = await UploadModel.findOne({
    _id: uuid,
  });

  if (!hasUploadedData)
    throw new MeasureNotFoundError("No measure found for the given uuid.");

  if (!hasOneMonthPassed(hasUploadedData?.measure_datetime))
    throw new DoubleReportError("The measure was already made this month.");

  await UploadModel.updateOne({ value });

  return res.status(200).json({ success: true });
};

export const getListOfMeasures = async (req: Request, res: Response) => {
  const { customerCode } = req.params;
  const { measureType } = req.query;

  if (
    !customerCode ||
    (measureType &&
      typeof measureType === "string" &&
      !checkMeasureType(measureType))
  ) {
    throw new BadRequestError(
      "Customer code is wrong or measure type is not valid."
    );
  }

  let measuresToBeFound = measureType
    ? await UploadModel.find({
        customer_code: customerCode,
        measure_type: measureType,
      })
    : await UploadModel.find({
        customer_code: customerCode,
      });

  if (
    !measuresToBeFound ||
    (measuresToBeFound && measuresToBeFound.length === 0)
  ) {
    throw new MeasureNotFoundError(
      `Measure not found with the given parameters: customer_code - ${customerCode} and measure_type - ${measureType}.`
    );
  }

  const measures = measuresToBeFound.map(
    ({ _id, measure_datetime, measure_type, uri, value }) => {
      return {
        _id,
        measure_datetime,
        measure_type,
        uri,
        value,
      };
    }
  );

  return res.status(200).json({
    customerCode,
    measures,
  });
};
