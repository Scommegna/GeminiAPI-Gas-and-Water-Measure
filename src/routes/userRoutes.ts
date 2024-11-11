import express from "express";

import { createUser, login, logout } from "../controllers/userControllers";

import { isAuthenticated } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/createAccount", createUser);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);

export { router };
