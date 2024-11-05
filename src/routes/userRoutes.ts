import express from "express";

import { createUser } from "../controllers/userControllers";

const router = express.Router();

router.post("/createAccount", createUser);

export { router };
