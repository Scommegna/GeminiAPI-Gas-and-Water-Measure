export function BadRequestError() {
  return { statusCode: 400, errorCode: "INVALID_DATA" };
}

export function DoubleReportError() {
  return { statusCode: 409, errorCode: "DOUBLE_REPORT" };
}

export function MeasureNotFoundError() {
  return { statusCode: 404, errorCode: "MEASURE_NOT_FOUND" };
}
