import { prisma } from "../prisma/prisma.js";

export const getPosts = async (page = 1, pageSize = 10) => {
  const allposts = await prisma.post.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },

    include: {
      author: {
        select: {
          name: true,
          username: true,
          headline: true,
          profilePicture: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        include: {
          user: {
            select: {
              username: true,
            },
          },
        },
      },
      comments: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });

  return allposts;
};

// get user and his connections posts

export const getUserFeedPosts = async (userId, page = 1, pageSize = 10) => {
  //first degree connections

  const Fdconnections = await prisma.connection.findMany({
    where: {
      OR: [
        {
          senderId: userId,
          status: "ACCEPTED",
        },
        {
          receiverId: userId,
          status: "ACCEPTED",
        },
      ],
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  //get all connection
  const connectedIds = [
    ...Fdconnections.map((conn) => conn.senderId),
    ...Fdconnections.map((conn) => conn.receiverId),
    userId,
  ].filter((id) => id !== userId);

  const allLinkedPosts = await prisma.post.findMany({
    where: {
      userId: {
        in: connectedIds,
      },
    },

    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: {
      createdAt: "desc",
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        include: {
          user: {
            select: {
              name: true,
              profilePicture: true,
              username: true,
            },
          },
        },
      },
      comments: {
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          content: true,
        },
        include: {
          user: {
            select: {
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
      },
    },
  });

  return allLinkedPosts;
};
