import { Request, Response, NextFunction } from "express";
import * as categoryService from "./category.service";

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};
