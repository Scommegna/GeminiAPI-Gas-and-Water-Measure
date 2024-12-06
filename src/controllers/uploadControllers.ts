import { Request, Response } from "express";
import UploadModel from "../models/upload";

import {
  isTodayDayOfPayment,
  checkMeasureType,
  extractDate,
} from "../utils/utils";

import { createPDF } from "../utils/pdfUtils";

import { PatchReqBody } from "../types/types";

import { getMeasure } from "../GeminiAPI/gemini";
import {
  BadRequestError,
  DoubleReportError,
  NotFoundError,
} from "../helpers/api-errors";

//Arrumar codigo de barras e o unlinkSync do arquivo quando já tiver o valor medido.
export const createUpload = async (req: Request, res: Response) => {
  const { measure_type } = req.body;
  const { file } = req;
  let userData;
  const isDayOfPayment = isTodayDayOfPayment();

  if (req.session && req.session.userData) {
    userData = req.session.userData;
  }

  if (!measure_type || !file) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "All the request arguments were not provided.",
    });
  }

  const dateString = extractDate(file.filename);

  const measure_datetime =
    typeof dateString === "string" ? new Date(dateString) : new Date();

  const hasUploadedData = await UploadModel.findOne({
    userId: userData && userData.id,
    measure_datetime,
    measure_type,
  });

  if (hasUploadedData && userData) {
    await createPDF(
      res,
      userData,
      hasUploadedData.measured_value,
      isDayOfPayment,
      measure_type
    );

    return;
  } else if (!hasUploadedData && userData) {
    const { value } = await getMeasure(file, measure_type);

    if (value === "BAD QUALITY") {
      const { statusCode, errorCode } = BadRequestError();

      return res.status(statusCode).json({
        errorCode,
        error_description: "Image with bad quality.",
      });
    } else if (value === "NOT METER") {
      const { statusCode, errorCode } = BadRequestError();

      return res.status(statusCode).json({
        errorCode,
        error_description: "Given image is not of an Water or Gas meter.",
      });
    }

    const valueAsNumber = Number(value);

    await UploadModel.create({
      userId: userData.id,
      measure_datetime,
      measure_type,
      measured_value: valueAsNumber,
    });

    await createPDF(res, userData, valueAsNumber, isDayOfPayment, measure_type);

    return;
  }
};

export const patchValueById = async (
  req: Request<PatchReqBody>,
  res: Response
) => {
  const { uuid, value } = req.body;

  if (!uuid || !value) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description:
        "Not all parameters for the upload request were provided.",
    });
  }

  const hasUploadedData = await UploadModel.findOne({
    _id: uuid,
  });

  if (!hasUploadedData) {
    const { statusCode, errorCode } = NotFoundError("measure");

    return res.status(statusCode).json({
      errorCode,
      error_description: "No measure found for the given uuid.",
    });
  }

  if (!hasOneMonthPassed(hasUploadedData?.measure_datetime)) {
    const { statusCode, errorCode } = DoubleReportError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "The measure was already made this month.",
    });
  }

  await UploadModel.updateOne({ value });

  return res.status(200).json({ success: true });

  // createPDF(res);

  // return res.status(200).send();
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
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Customer code is wrong or measure type is not valid.",
    });
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
    const { statusCode, errorCode } = NotFoundError("measure");

    return res.status(statusCode).json({
      errorCode,
      error_description: `Measure not found with the given parameters: customer_code - ${customerCode} and measure_type - ${measureType}.`,
    });
  }

  const measures = measuresToBeFound.map(
    ({ _id, measure_datetime, measure_type, value }) => {
      return {
        _id,
        measure_datetime,
        measure_type,
        value,
      };
    }
  );

  return res.status(200).json({
    customerCode,
    measures,
  });
};
