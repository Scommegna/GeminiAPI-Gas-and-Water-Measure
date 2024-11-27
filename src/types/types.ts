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
  userData: UserData;
  measure_datetime: Date;
  measure_type: MeasureType;
  measured_value: number;
}

export interface PatchReqBody {
  uuid: string;
  value: number;
}

export interface MeasureReturn {
  value: number;
}

export interface User extends Document {
  name: string;
  cpf: string;
  address: string;
  email: string;
  password: string;
  type: UserType;
}

declare module "express-session" {
  interface SessionData {
    userData?: UserData;
  }
}

export type CBMulterType = (error: Error | null, value: string) => void;
