import express from "express";
import { getCategories } from "./category.controller";

const router = express.Router();

// Public route
router.get("/", getCategories);

export default router;
