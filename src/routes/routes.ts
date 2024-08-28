import express from "express";

const router = express.Router();

router.post("/upload");

router.patch("/confirm");

router.get("/:customerCode/list");

export { router };
