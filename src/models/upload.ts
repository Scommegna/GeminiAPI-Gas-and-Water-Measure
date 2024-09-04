import mongoose, { Document, Schema } from "mongoose";

type Base64Image = `data:image/${
  | "png"
  | "jpeg"
  | "gif"
  | string};base64,${string}`;

type MeasureType = "Water" | "Gas";

export interface Upload extends Document {
  image: Base64Image;
  customer_code: string;
  measure_datetime: Date;
  measure_type: MeasureType;
  value: number;
  uri: string;
}

const UploadSchema = new Schema<Upload>({
  image: { type: String, required: true },
  customer_code: { type: String, required: true, unique: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  value: { type: Number, required: true },
  uri: { type: String, required: true },
});

const UploadModel = mongoose.model<Upload>("Upload", UploadSchema);

export default UploadModel;
