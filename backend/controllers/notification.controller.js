import { prisma } from "../prisma/prisma.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { name: true, username: true },
      include: {
        receivedNotifications: {
          take: 10,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
            type: true,
            post: {
              select: {
                image: true,
                content: true,
              },
            },
            actor: {
              select: {
                name: true,
                username: true,
                profilePicture: true,
              },
            },
          },
          where: {
            isRead: false,
          },
        },
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error(`error in getUserNotifications controller`, error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

////////////////////////////////////

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await prisma.notification.update({
      where: { id: notificationId, userId: req.user.id },
      data: {
        isRead: true,
      },
    });

    res.json(notification);
  } catch (error) {
    console.error(`error in markNotificationAsRead controller`, error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await prisma.notification.delete({
      where: {
        id: notificationId,
        userId: req.user.id,
      },
    });
    res.json({
      message: " Notification deleted successfully",
    });
  } catch (error) {
    console.error(`error in deleteNotification controller`, error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
