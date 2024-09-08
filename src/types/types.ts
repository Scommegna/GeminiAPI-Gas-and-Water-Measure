import { Document } from "mongoose";

type Base64Image = `data:image/${
  | "png"
  | "jpeg"
  | "gif"
  | string};base64,${string}`;

export type MeasureType = "WATER" | "GAS";

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
  uri: string;
  value: number;
}
