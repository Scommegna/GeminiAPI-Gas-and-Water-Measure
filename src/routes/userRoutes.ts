import express from "express";

import { createUser, login } from "../controllers/userControllers";

const router = express.Router();

router.post("/createAccount", createUser);
router.post("/login", login);

export { router };
