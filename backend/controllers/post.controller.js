import { getUserFeedPosts, getPosts } from "../lib/post.query.js";
import cloudinary from "../lib/cloudinary.js";
import { prisma } from "../prisma/prisma.js";

export const getfeedPosts = async (req, res) => {
  try {
    const allPosts = await getPosts();

    res.status(200).json(allPosts);
  } catch (error) {
    console.error("error in getfeedpost route", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const { image, content } = req.body;
    let ImageUrl = "";
    if (image) {
      const img = await cloudinary.uploader.upload(image);
      ImageUrl = img.secure_url;
    }

    const newPost = await prisma.post.create({
      data: {
        userId: req.user.id,
        content,
        image: ImageUrl,
        author: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("error in createPost", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

///////////// Delete post

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({
      where: {
        userId,
        id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not author of this post" });
    }

    if (post.image) {
      // delete the image from cloudinary

      const imgUrl = post.image.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(imgUrl);
    }

    await prisma.post.delete({
      where: {
        userId,
        id,
      },
    });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("error in deletePost", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

//https://res.cloudinary.com/dgfqenqkj/image/upload/v1713593219/cld-sample-5.jpg
//https://res.cloudinary.com/dgfqenqkj/image/upload/v1713593217/cld-sample-2.jpg

///get post by Id

export const getPostById = async () => {
  try {
    const id = req.params.id;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            profilePicture: true,
            headline: true,
          },
        },
        comments: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
            user: {
              select: {
                name: true,
                username: true,
                profilePicture: true,
                headline,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(400).json({
        message: "Post is not found",
      });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("error in getPostById controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

///////////////////////// CREATE COMMENT CONTROLLER

export const createComment = async (req, res) => {
  try {
    const PostId = req.params.id;
    const userId = req.user.id;

    const { content } = req.body;

    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: PostId,
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
            headline: true,
            profilePicture: true,
          },
        },
      },
    });

    const post = await prisma.post.update({
      where: {
        id: PostId,
      },
      data: {
        comments: {
          connect: {
            id: newComment.id,
          },
        },
      },
    });

    //create a notification if the commentor is not post author
    if (post.userId !== userId) {
      const newNotification = await prisma.notification.create({
        data: {
          actorId: userId,
          recipient: post.userId,
          type: "Comment",
          postId: post.id,
        },
      });

      await prisma.user.update({
        where: {
          id: post.userId,
        },
        data: {
          receivedNotifications: {
            connect: {
              id: newNotification.id,
            },
          },
        },
      });

      // send a notification email
    }

    res.status(200).json(newComment);
  } catch (error) {
    console.error("error in createComment controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

/////////////////// POST LIKE

export const likePost = async (req, res) => {
  try {
    const PostId = req.params.id;
    const userId = req.user.id;
    //toggle like section
    let existingLike = await prisma.like.findUnique({
      where: {
        postId: PostId,
        userId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      existingLike = await prisma.like.create({
        data: {
          postId: PostId,
          userId,
        },
      });

      const post = await prisma.post.update({
        where: {
          id: PostId,
        },
        data: {
          likes: {
            connect: {
              id: existingLike.id,
            },
          },
        },
      });

      //create like notification
      if (post.userId !== userId) {
        const newNotification = await prisma.notification.create({
          data: {
            actorId: userId,
            userId: post.userId,
            type: "Like",
            postId: post.id,
          },
        });

        const user = await prisma.user.update({
          where: {
            id: post.userId,
          },
          data: {
            receivedNotifications: {
              connect: {
                id: newNotification.id,
              },
            },
          },
        });
      }
      res.status(200).json(post);
    }
  } catch (error) {
    console.error("error in likePost controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};
