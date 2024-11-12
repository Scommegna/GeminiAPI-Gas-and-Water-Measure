import { Request, Response, NextFunction } from "express";

import { UnauthorizedError } from "../helpers/api-errors";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.userData) {
    next();
  } else {
    const { statusCode, errorCode } = UnauthorizedError();

    return res
      .status(statusCode)
      .json({ errorCode, error_description: "User not authorized." });
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.userData && req.session.userData.typeOfClient === "ADMIN") {
    next();
  } else {
    const { statusCode, errorCode } = UnauthorizedError();

    return res
      .status(statusCode)
      .json({ errorCode, error_description: "User not authorized." });
  }
}
