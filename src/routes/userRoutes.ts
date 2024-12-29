import express from "express";

import {
  createUser,
  editData,
  login,
  logout,
} from "../controllers/userControllers";

import { isAuthenticated } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/createAccount", createUser);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.patch("/editData", isAuthenticated, editData);

export { router };
