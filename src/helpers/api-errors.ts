export function BadRequestError() {
  return { statusCode: 400, errorCode: "INVALID_DATA" };
}

export function DoubleReportError() {
  return { statusCode: 409, errorCode: "DOUBLE_REPORT" };
}

export function NotFoundError(itemNotFound: string) {
  const upperCaseItem = itemNotFound.toUpperCase();

  return { statusCode: 404, errorCode: `${upperCaseItem}_NOT_FOUND` };
}
