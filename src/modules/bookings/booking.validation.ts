import { body, param } from "express-validator";

export const createBookingValidator = [
  body("tutorId").notEmpty().withMessage("Tutor ID is required"),
  body("categoryId").notEmpty().withMessage("Category ID is required"),
  body("sessionAt").isISO8601().toDate().withMessage("Valid session date is required"),
  body("duration")
    .isInt({ min: 30, max: 180 })
    .withMessage("Duration must be between 30 and 180 minutes"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
];

export const bookingIdValidator = [
  param("id").notEmpty().withMessage("Booking ID is required"),
];
