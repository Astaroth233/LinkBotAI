import { Router } from "express";
import {
  register,
  login,
  logout,
  refresh,
  getMe,
  getProfile,
  updateProfile,
  deleteUser,
} from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router: Router = Router();

// Public auth routes
router.post("/auth/register", validate(registerSchema), register);
router.post("/auth/login", validate(loginSchema), login);
router.get("/auth/refresh", refresh);

// Protected auth routes
router.post("/auth/logout", verifyToken, logout);
router.get("/auth/me", verifyToken, getMe);

// Protected user routes
router.get("/user/profile", verifyToken, getProfile);
router.put("/user/profile", verifyToken, updateProfile);
router.delete("/user", verifyToken, deleteUser);

export default router;
