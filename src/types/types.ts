import { Document } from "mongoose";

import "express-session";

export type ImageMimeType = "image/png" | "image/jpeg";

export type MeasureType = "WATER" | "GAS";

type UserType = "CLIENT" | "ADMIN";

export interface UserData {
  id: string;
  email: string;
  typeOfClient?: UserType;
  cpf: string;
  name: string;
  address: string;
}

export interface Upload extends Document {
  userId: String;
  measure_datetime: Date;
  measure_type: MeasureType;
  measured_value: number;
}

export type ImageSrc = Buffer | ArrayBuffer | string;

export interface MeasureReturn {
  value: string;
}

export interface User extends Document {
  name: string;
  cpf: string;
  address: string;
  email: string;
  password: string;
  type: UserType;
}

export interface ProofOfPayment {
  billingId: string;
  value: string;
  userCPF: string;
  dateOfPayment: string;
}

declare module "express-session" {
  interface SessionData {
    userData?: UserData;
  }
}

export type CBMulterType = (error: Error | null, value: string) => void;
