import { Request, Response } from "express";

import { ObjectId } from "mongodb";

import {
  BadRequestError,
  DoubleReportError,
  NotFoundError,
} from "../helpers/api-errors";

import UserModel from "../models/user";

import {
  hashPassword,
  isValidEmail,
  isValidCPF,
  compareHashedPassword,
} from "../utils/utils";

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
    type: "CLIENT",
  });

  return res
    .status(200)
    .json({ statusCode: 200, message: "User created with success." });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Email or password were not given.",
    });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    const { statusCode, errorCode } = NotFoundError("user");

    return res.status(statusCode).json({
      errorCode,
      error_description: "User not found.",
    });
  }

  const isPasswordCorrect = await compareHashedPassword(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "Password incorrect.",
    });
  }

  req.session.userData = {
    id: String(user._id),
    email: user.email,
    typeOfClient: user.type,
    cpf: user.cpf,
    name: user.name,
    address: user.address,
  };

  return res.status(200).json({ message: "Login Successful" });
};

export const logout = async (req: Request, res: Response) => {
  if (!req.session.userData) {
    const { statusCode, errorCode } = BadRequestError();

    return res.status(statusCode).json({
      errorCode,
      error_description: "User is not logged in.",
    });
  }

  req.session.userData = undefined;

  return res.status(200).json({ message: "Logout Successful" });
};

export const editData = async (req: Request, res: Response) => {
  const paramsToBeEdited = req.body;
  const userId = req.session.userData?.id;

  const updateUser = await UserModel.updateOne(
    { _id: new ObjectId(userId) },
    { $set: paramsToBeEdited }
  );

  if (updateUser.matchedCount === 0) {
    const { statusCode, errorCode } = NotFoundError("user");

    return res.status(statusCode).json({
      errorCode,
      error_description: "User not found.",
    });
  }

  res.status(200).json({
    message: "User updated successfully",
    updatedCount: updateUser.modifiedCount,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  const deletedUser = await UserModel.deleteOne({ _id: new ObjectId(userId) });

  if (deletedUser.deletedCount === 0) {
    const { statusCode, errorCode } = NotFoundError("user");

    return res.status(statusCode).json({
      errorCode,
      error_description: "User not found.",
    });
  }

  res.status(200).json({
    message: "User deleted successfully",
    updatedCount: deletedUser.deletedCount,
  });
};
