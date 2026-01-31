import express from "express";

import {
  getUsers,
  changeUserStatus,
  getBookings,
  addCategory,
  removeCategory,
} from "./admin.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { authorizeRoles } from "../../middlewares/role.middleware";


const router = express.Router();

// All admin routes protected
router.use(auth(), authorizeRoles(UserRole.ADMIN));

// Users
router.get("/users", getUsers);
router.patch("/users/:id", changeUserStatus);

// Bookings
router.get("/bookings", getBookings);

// Categories
router.post("/categories", addCategory);
router.delete("/categories/:id", removeCategory);

export default router;
