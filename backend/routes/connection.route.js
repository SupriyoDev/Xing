import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnectionRequests,
  getUserConnections,
  removeConnection,
  getConnectionStatus,
} from "../controllers/Connection.controller.js";

const router = express.Router();

router.post("/request/:userId", protectedRoute, sendConnectionRequest); ///send connection request
router.put("/accept/:requestId", protectedRoute, acceptConnectionRequest); //accept connection request
router.put("/reject/:requestId", protectedRoute, rejectConnectionRequest); //reject connection request

//get all connection request for the user
router.get("/requests", protectedRoute, getConnectionRequests); // all sent and received connections

//get all connections for a user
router.get("/", protectedRoute, getUserConnections); ///all connection
router.delete("/:userId", protectedRoute, removeConnection); //remove connection
router.get("/status/:userId", protectedRoute, getConnectionStatus); // get a connection status of the user

export default router;
