import { NextFunction, Request, Response } from "express";
import * as bookingService from "./booking.service";


export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const booking = await bookingService.createBooking({
      studentId: req.user!.id,
      tutorId: req.body.tutorId,
      categoryId: req.body.categoryId,
      sessionAt: new Date(req.body.sessionAt),
      duration: req.body.duration,
      price: req.body.price,
    });

    res.json({ success: true, data: booking });
    } catch (error) {
        next(error)
    }
}


export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await bookingService.getBookingsByUser(req.user!.id);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};