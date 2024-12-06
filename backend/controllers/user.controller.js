import { getSuggestedUsers } from "../lib/user.query.js";
import { prisma } from "../prisma/prisma.js";
import { userFieldSend } from "../lib/types.js";
import cloudinary from "../lib/cloudinary.js";

///////////////////get suggested users
export const getSuggestedConnections = async (req, res) => {
  try {
    const SuggestedConnections = await getSuggestedUsers(req.user.id, 5);
    res.json(SuggestedConnections);
  } catch (error) {
    console.error("error in getsuggestedconnections", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

///////////////////////////// get any username profile
export const getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        ...userFieldSend,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("error in getpublicprofile", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

////////////////// Update a user profile

export const updateProfile = async (req, res) => {
  try {
    /// allowed fields
    const allowedFields = [
      "name",
      "headline",
      "about",
      "location",
      "profilePicture",
      "bannerImg",
      "skills",
      "experience",
      "education",
    ];

    // const updateData = {};

    //if any value is "" it will not be updated

    // for (const field of allowedFields) {
    //   if (req.body.hasOwnProperty(field)) {
    //     updateData[field] = req.body[field];
    //   }
    // }

    //check for profilePic and banner Image

    //filtering --- req.body = updateData

    // const filterData = Object.keys(updateData)
    //   .filter((key) => allowedFields.includes(key))
    //   .reduce((obj, key) => {
    //     obj[key] = updateData[key];
    //     return obj;
    //   }, {});

    // if (Object.keys(filterData).length === 0) {
    //   return res.status(400).json({
    //     message: "No valid fields provided for update.",
    //   });
    // }

    //get the updatedDATA only allowed fields
    const updateData = allowedFields
      .filter((field) => req.body.hasOwnProperty(field))
      .reduce((Obj, key) => {
        Obj[key] = req.body[key];
        return Obj;
      }, {});

    //upload and update profilepic and banner image

    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updateData.profilePicture = result.secure_url;
    }
    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updateData.bannerImg = result.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: updateData,
      select: {
        ...userFieldSend,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("error in updateProfile", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//////////////////////
