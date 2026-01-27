import { body } from "express-validator";

export const updateTutorProfileValidation = [
  body("bio").isLength({ min: 20 }).withMessage("Bio must be at least 20 characters"),
  body("hourlyRate").isFloat({ gt: 0 }).withMessage("Hourly rate must be greater than 0"),
  body("experience").isInt({ min: 0 }).withMessage("Experience must be a positive number"),
  body("languages").isArray({ min: 1 }).withMessage("At least one language is required"),
  body("categories").isArray({ min: 1 }).withMessage("Select at least one category"),
];

export const updateAvailabilityValidation = [
  body("availability").isArray({ min: 1 }).withMessage("Availability is required"),
];
