import { body } from "express-validator";

export const createReviewValidator = [
  body("bookingId").notEmpty().withMessage("Booking ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters"),
];
