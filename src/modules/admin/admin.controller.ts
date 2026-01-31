import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";

// GET /api/admin/users
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/users/:id
export const changeUserStatus = async (req: Request <{id:string}>, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body; // ACTIVE or BANNED
    const updatedUser = await adminService.updateUserStatus(req.params.id, status);
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/bookings
export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await adminService.getAllBookings();
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/categories
export const addCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await adminService.createCategory(req.body.name);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/categories/:id
export const removeCategory = async (req: Request <{id:string}>, res: Response, next: NextFunction) => {
  try {
    await adminService.deleteCategory(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    next(err);
  }
};
