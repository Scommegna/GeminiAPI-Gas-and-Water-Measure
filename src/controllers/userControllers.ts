import { Request, Response } from "express";

import { BadRequestError, DoubleReportError } from "../helpers/api-errors";

import UserModel from "../models/user";

import { hashPassword, isValidEmail, isValidCPF } from "../utils/utils";

export const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, cpf, address, email, password } = req.body;

  if (!firstName || !lastName || !cpf || !address || !email || !password) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "All the request arguments were not provided.",
    });
  }

  const hasUser = await UserModel.findOne({ $or: [{ cpf }, { email }] });

  if (hasUser) {
    const { statusCode, errorCode } = DoubleReportError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "User already exists.",
    });
  }

  if (!isValidEmail(email)) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Email format is not valid.",
    });
  }

  if (!isValidCPF(cpf)) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "CPF not valid.",
    });
  }

  const hashedPassword = await hashPassword(password);
  const name = `${firstName} ${lastName}`;

  await UserModel.create({
    name,
    cpf,
    address,
    email,
    password: hashedPassword,
  });

  return res
    .status(200)
    .json({ statusCode: 200, message: "User created with success." });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Username or password were not given.",
    });
  }
};
