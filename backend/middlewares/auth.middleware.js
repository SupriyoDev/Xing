import jwt from "jsonwebtoken";

import { prisma } from "../prisma/prisma.js";
import { userFieldSend } from "../lib/types.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies["token"];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        ...userFieldSend,
      },
    });

    if (!user) {
      return res.status(401).json({ message: " User not found!" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("error in protectedroute middleware", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
