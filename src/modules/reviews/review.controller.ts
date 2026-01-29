import { Request, Response, NextFunction } from "express";
import * as reviewService from "./review.service";

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview(req.user!.id, req.body);
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};
