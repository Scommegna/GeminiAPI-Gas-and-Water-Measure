import { response } from "express";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly error_code: string
  ) {
    super(message);
    this.error_code = error_code;
    this.statusCode = statusCode;
  }

  returnError() {
    return response
      .status(this.statusCode)
      .json({ error_code: this.error_code, error_description: this.message });
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, 400, "INVALID_DATA");
  }
}

export class DoubleReportError extends ApiError {
  constructor(message: string) {
    super(message, 409, "DOUBLE_REPORT");
  }
}

export class MeasureNotFoundError extends ApiError {
  constructor(message: string) {
    super(message, 404, "MEASURE_NOT_FOUND");
  }
}
