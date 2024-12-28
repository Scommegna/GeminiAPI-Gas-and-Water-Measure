import { Request, Response } from "express";
import UploadModel from "../models/upload";

import fs from "fs";

import path from "path";

import { ObjectId } from "mongodb";

import {
  isTodayDayOfPayment,
  checkMeasureType,
  extractDate,
} from "../utils/utils";

import { createPDF } from "../utils/pdfUtils";

import { getMeasure, getProofOfPayment } from "../GeminiAPI/gemini";
import { BadRequestError, NotFoundError } from "../helpers/api-errors";

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
    const filePath = path.resolve(__dirname, `../../tmp/${file.filename}`);

    fs.unlink(filePath, (err) => {
      if (err) console.log(err);
    });

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
      status: "NOT_PAID",
    });

    await createPDF(res, userData, valueAsNumber, isDayOfPayment, measure_type);

    return;
  }
};

export const getListOfMeasures = async (req: Request, res: Response) => {
  let data;

  if (req.session?.userData) {
    data = req.session.userData;
  }

  if (data) {
    const userBillings = await UploadModel.find({ userId: data.id });

    if (!userBillings) {
      const { statusCode, errorCode } = NotFoundError("BILLINGS");

      return res.status(statusCode).json({
        errorCode,
        error_description: "User billings were not found.",
      });
    }

    return res.status(200).json({ userBillings });
  }

  return res.status(200).send();
};

export const sendProofOfPayment = async (req: Request, res: Response) => {
  const { file } = req;
  let userData;

  if (req.session && req.session.userData) {
    userData = req.session.userData;
  }

  if (!file) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "File was not provided.",
    });
  }

  const response = await getProofOfPayment(file);

  if (!response) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Proof of payment is incorrect.",
    });
  }

  const billing = await UploadModel.findOne({
    _id: new ObjectId(response.billing),
  });

  if (!billing) {
    const { statusCode, errorCode } = NotFoundError("BILLING");

    return res.status(statusCode).json({
      errorCode,
      error_description: "Billing not found.",
    });
  }

  if (
    billing.measured_value > Number(response.paidValue) ||
    billing.status === "PAID"
  ) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description:
        "The paid value of the proof of payment is less than the one of the billing.",
    });
  }

  const billingToChangeStatus = await UploadModel.updateOne(
    {
      _id: new ObjectId(response.billing),
    },
    { status: "PAID" }
  );

  if (
    !billingToChangeStatus ||
    (billingToChangeStatus &&
      (billingToChangeStatus.matchedCount === 0 ||
        billingToChangeStatus.modifiedCount === 0))
  ) {
    const { statusCode, errorCode } = NotFoundError("BILLING");

    return res.status(statusCode).json({
      errorCode,
      error_description: "Billing not found.",
    });
  }

  return res.status(200).send("Billing status updated.");
};
