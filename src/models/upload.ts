import mongoose, { Schema } from "mongoose";

import { Upload } from "../types/types";

const UploadSchema = new Schema<Upload>({
  image: { type: String, required: true },
  customer_code: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  value: { type: Number, required: true },
});

const UploadModel = mongoose.model<Upload>("Upload", UploadSchema);

export default UploadModel;
