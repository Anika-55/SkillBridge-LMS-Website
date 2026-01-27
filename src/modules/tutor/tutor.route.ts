import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import * as tutorController from "./tutor.controller";
import { updateTutorProfileValidation, updateAvailabilityValidation } from "./tutor.validation";

const router = Router();

router.put(
  "/profile",
  auth(UserRole.TUTOR),
  updateTutorProfileValidation,
  tutorController.updateTutorProfile
);

router.put(
  "/availability",
  auth(UserRole.TUTOR),
  updateAvailabilityValidation,
  tutorController.updateTutorAvailability
);

export default router;
