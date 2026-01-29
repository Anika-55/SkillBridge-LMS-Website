import express from "express";
import { createReview } from "./review.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { createReviewValidator } from "./review.validation";
import { validateRequest } from "../../middlewares/validate-request.middleware";


const router = express.Router();

router.post(
  "/",
  auth(),
  authorizeRoles(UserRole.STUDENT),
  createReviewValidator,
  validateRequest,
  createReview
);

export default router;
