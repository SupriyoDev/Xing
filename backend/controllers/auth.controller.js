import { userSchema } from "../lib/types.js";
import { prisma } from "../prisma/prisma.js";
import { comparePassword, generateToken, hashPassword } from "../lib/utils.js";
import { sendWelcomeEmail } from "../lib/brevo.mail.js";

export async function signup(req, res) {
  try {
    const validateData = userSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(401).json({ message: "data validation failed!" });
    }

    const { name, email, password, username } = validateData.data;

    const ExistUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (ExistUser) {
      return res.status(400).json({
        message:
          ExistUser.email === email
            ? "User already exists"
            : "Username already in use",
      });
    }

    const hashedPassword = await hashPassword(password);
    //save to db

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = generateToken(newUser.id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "User registered successfully",
    });

    const profileUrl = process.env.CLIENT_URL + "/profile/" + newUser.username;
    //send welcome email

    try {
      await sendWelcomeEmail(newUser.name, newUser.email, profileUrl);
    } catch (error) {
      console.error("error sending welcome email", error);
    }

    //
  } catch (error) {
    console.error("error is signup", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    //token
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Logged in successfully!",
    });
  } catch (error) {
    console.error("error in login", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

/////////
export async function logout(req, res) {
  res.clearCookie("token");
  res.json({
    message: "Logged out successfully!",
  });
}

export async function getCurrentUser(req, res) {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("error in getcurrentuser", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
