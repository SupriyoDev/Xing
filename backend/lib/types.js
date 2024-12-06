import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(),
  email: z.string().email(),
  username: z.string().min(),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 chracters" })
    .max(12),
});

export const userFieldSend = {
  about: true,
  name: true,
  email: true,
  bannerImg: true,
  headline: true,
  id: true,
  profilePicture: true,
  location: true,
  username: true,
  createdAt: true,
  educations: true,
  experiences: true,
  skills: true,
};
