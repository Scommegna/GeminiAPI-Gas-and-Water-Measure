import { Request, Response } from "express";

import { BadRequestError, DoubleReportError } from "../helpers/api-errors";

import UserModel from "../models/user";

import { hashPassword } from "../utils/utils";

export const createUser = async (req: Request, res: Response) => {
  const { name, cpf, address, email, password } = req.body;

  if (!name || !cpf || !address || !email || !password) {
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

  const hashedPassword = await hashPassword(password);

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
