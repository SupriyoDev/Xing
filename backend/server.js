import express from "express";
import dotenv from "dotenv";
// import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
//maximum request payload
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

//add routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

//token-checker

// app.get("/getCookie", (req, res) => {
//   // Extract the 'token' cookie
//   const token = req.cookies["token"];

//   // Handle the token
//   if (token) {
//     res.send(`Your token is: ${token}`);
//   } else {
//     res.status(401).send("Token not found");
//   }
// });

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}/`);
});
