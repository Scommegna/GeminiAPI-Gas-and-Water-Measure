import { Document } from "mongoose";

import "express-session";

type Base64Image = `data:image/${
  | "png"
  | "jpeg"
  | "gif"
  | string};base64,${string}`;

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
  image: Base64Image;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasureType;
  value: number;
  uri: string;
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
