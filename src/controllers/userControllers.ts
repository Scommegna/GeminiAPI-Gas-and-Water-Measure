import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  const { name, cpf, address, email, password } = req.body;
};
