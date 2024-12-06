import { prisma } from "../prisma/prisma.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "You can't send request to yourself",
      });
    }

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          {
            senderId,
            receiverId,
            status: {
              notIn: ["BLOCKED"],
            },
          },
          {
            senderId: receiverId,
            receiverId: senderId,
            status: {
              notIn: ["BLOCKED"],
            },
          },
        ],
      },
    });

    if (existingConnection) {
      return res.status(400).json({
        message: "A connection request already exists",
      });
    }

    const newSentRequest = await prisma.connection.create({
      data: {
        receiverId,
        senderId,
      },
    });

    const user = await prisma.user.update({
      where: {
        id: senderId,
      },
      data: {
        sentConnections: {
          connect: {
            id: newSentRequest.id,
          },
        },
      },
    });

    res.status().json({
      message: "Connection request sent successfully",
    });
  } catch (error) {
    console.error("error in sendConnectionRequest controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const senderId = req.params.requestId;
    const receiverId = req.user.id;

    const acceptedConnection = await prisma.connection.update({
      where: {
        senderId,
        receiverId,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    await prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        receivedConnections: {
          connect: {
            id: acceptedConnection.id,
          },
        },
      },
    });

    const newNotification = await prisma.notification.create({
      data: {
        actorId: receiverId,
        userId: senderId,
        type: "connectionAccepted",
      },
    });

    res.json({
      message: "connection accepted successfully!",
    });

    //todo: send email
  } catch (error) {
    console.error("error in acceptConnectionRequest controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const senderId = req.params.requestId;
    const receiverId = req.user.id;

    const existingConnection = await prisma.connection.findUnique({
      where: {
        senderId,
        receiverId,
        status: "PENDING",
      },
    });
    if (!existingConnection) {
      return res.status(400).json({
        message: "No exists connection",
      });
    }

    await prisma.connection.delete({
      where: {
        senderId,
        receiverId,
      },
    });

    res.json({ message: "connection rejected!" });

    //todo:   send email
  } catch (error) {
    console.error("error in acceptConnectionRequest controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

//////////////////////////// only received connection requests

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const allConnectionRequests = await prisma.connection.findMany({
      where: {
        receiverId: userId,
        status: "PENDING",
      },
      include: {
        sender: {
          select: {
            name: true,
            username: true,
            email: true,
            headline: true,
          },
        },
      },
    });

    res.json(allConnectionRequests);
  } catch (error) {
    console.error("error in getConnectionRequest controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

/////////////////////////// get all accepted connection -- like friendlist

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    const fdc = await prisma.connection.findMany({
      where: {
        OR: [
          { senderId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
      },
    });

    const connectionIds = fdc.flatMap((conn) =>
      conn.receiverId === userId ? [conn.senderId] : [conn.receiverId]
    );

    const allfriends = await prisma.user.findMany({
      where: {
        id: {
          in: [...connectionIds],
        },
      },
    });

    res.status(200).json(allfriends);
  } catch (error) {
    console.error("error in getUserconnection controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

////////////////////////////////////   remove connection-- remove an existing friend

export const removeConnection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const myId = req.user.id;

    const existingConnection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: myId, status: "ACCEPTED" },
          { senderId: myId, receiverId: userId, status: "ACCEPTED" },
        ],
      },
    });

    if (!existingConnection) {
      return res.status(400).json({
        message: "You are not friends",
      });
    }

    await prisma.connection.delete({
      where: {
        senderId: existingConnection.senderId,
        receiverId: existingConnection.receiverId,
      },
    });

    res.json({
      message: " Connection removed successfully!",
    });
  } catch (error) {
    console.error("error in getUserconnection controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};

////////////////////////////// get connection status

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user.id;

    const connection = await prisma.connection.findFirst({
      where: {
        OR: [
          { senderId: targetUserId, receiverId: currentUserId },
          { senderId: currentUserId, receiverId: targetUserId },
        ],
      },
      select: {
        status: true,
        receiverId: true,
        senderId: true,
        id: true,
      },
    });
    let status;
    if (!connection) {
      status = "rejected";
      return res.json({ message: "connection is rejected" });
    } else {
      status = connection.status === "PENDING" ? "pending" : "accepted";
      const requestId = connection.senderId;
      const intiatedByMe = connection.senderId === currentUserId;
      return res.json(status, requestId, intiatedByMe);
    }
  } catch (error) {
    console.error("error in getconnectionstatus controller", error.message);
    res.status(500).json({
      message: " Internal server error",
    });
  }
};
