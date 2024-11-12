import mongoose, { Schema } from "mongoose";

import { User } from "../types/types";

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
});

const UserModel = mongoose.model<User>("User", UserSchema);

export default UserModel;
