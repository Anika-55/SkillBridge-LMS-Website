import express from "express";

import { createBooking, getBookings, getBookingById } from "./booking.controller";
import { createBookingValidator, bookingIdValidator } from "./booking.validation";
import auth from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validate-request.middleware";



const router = express.Router();

// Student must be logged in to book
router.post("/", auth(), createBookingValidator, validateRequest, createBooking);

// Get current user's bookings
router.get("/", auth(), getBookings);

// Get booking by ID
router.get("/:id", auth(), bookingIdValidator, validateRequest, getBookingById);

export default router;
