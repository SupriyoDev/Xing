import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(12);
  const hpass = await bcryptjs.hash(password, salt);
  return hpass;
};

export const generateToken = (id) => {
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

export const comparePassword = async (password, hashPassword) => {
  const isMatch = await bcryptjs.compare(password, hashPassword);
  return isMatch;
};
