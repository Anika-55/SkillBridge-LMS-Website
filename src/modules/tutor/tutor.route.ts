import { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import * as tutorController from "./tutor.controller";
import { updateTutorProfileValidation, updateAvailabilityValidation } from "./tutor.validation";
import { authorizeRoles } from "../../middlewares/role.middleware";

const router = Router();

router.put(
  "/profile",
  auth(),
  authorizeRoles(UserRole.TUTOR),
  updateTutorProfileValidation,
  tutorController.updateTutorProfile
);

router.put(
  "/availability",
  auth(UserRole.TUTOR),
  updateAvailabilityValidation,
  tutorController.updateTutorAvailability
);

router.get("/", tutorController.getAllTutors)  // /api/tutors
router.get("/:id",tutorController.getTutorById) // /api/tutors/:id

export default router;
