import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  getSuggestedConnections,
  getPublicProfile,
  updateProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/suggestions", protectedRoute, getSuggestedConnections);
router.get("/:username", protectedRoute, getPublicProfile);

router.post("/profile", protectedRoute, updateProfile);

export default router;
