import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  createPost,
  getfeedPosts,
  deletePost,
  getPostById,
  createComment,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getfeedPosts);
router.get("/create", protectedRoute, createPost);
router.get("/delete/:id", protectedRoute, deletePost);
router.get("/:id", protectedRoute, getPostById);
router.get("/:id/comment", protectedRoute, createComment);
router.get("/:id/like", protectedRoute, likePost);

export default router;
