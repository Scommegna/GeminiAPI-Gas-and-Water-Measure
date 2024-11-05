import mongoose, { Schema } from "mongoose";

import { User } from "../types/types";

const UserSchema = new Schema<User>();
