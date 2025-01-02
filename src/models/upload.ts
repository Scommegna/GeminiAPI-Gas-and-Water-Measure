import mongoose, { Schema } from "mongoose";

import { Upload } from "../types/types";

const UploadSchema = new Schema<Upload>({
  userId: { type: String, required: true },
  measure_datetime: { type: Date, required: true },
  measure_type: { type: String, required: true },
  measured_value: { type: Number, required: true },
  status: { type: String, required: true },
  billingValue: { type: Number, required: true },
});

const UploadModel = mongoose.model<Upload>("Upload", UploadSchema);

export default UploadModel;
