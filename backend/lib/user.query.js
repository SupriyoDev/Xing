//get suggested user (exclude the user and his connections)

import { prisma } from "../prisma/prisma.js";

export async function getSuggestedUsers(currentUserId, limit) {
  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
        notIn: [
          ...(await prisma.connection
            .findMany({
              where: {
                OR: [
                  { senderId: currentUserId },
                  { receiverId: currentUserId },
                ],
              },
              select: { senderId: true, receiverId: true },
            })
            .then((connections) =>
              connections.flatMap((conn) => [conn.senderId, conn.receiverId])
            )),
        ],
      },
    },
    take: limit,
    select: {
      name: true,
      username: true,
      headline: true,
      profilePicture: true,
    },
  });

  return suggestedUsers;
}

//network based suggestions

export async function getNetworkBasedSuggestions(currentUserId, limit) {
  //first degree connections
  const firstDegreeConnections = await prisma.connection.findMany({
    where: {
      OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      status: "ACCEPTED",
    },
    select: {
      senderId: true,
      receiverId: true,
    },
  });

  const connectedUserIds = firstDegreeConnections.flatMap((conn) =>
    conn.senderId === currentUserId ? [conn.receiverId] : [conn.senderId]
  );

  //second degree connections

  const secondDegreeConnections = await prisma.connection.findMany({
    where: {
      OR: connectedUserIds.map((userId) => ({
        senderId: userId,
        receiverId: { not: currentUserId },
      })),
      status: "ACCEPTED",
      NOT: {
        OR: [{ senderId: currentUserId }, { receiverId: currentUserId }],
      },
    },
    select: {
      receiverId: true,
    },
    distinct: ["senderId"],
    take: limit,
  });

  //fetch user details for suggested users
  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        in: secondDegreeConnections.map((conn) => conn.receiverId),
      },
    },
  });

  return suggestedUsers;
}

////

// Comprehensive suggestion query with multiple criteria
async function getComprehensiveSuggestions(
  currentUserId,
  limit,
  location,
  skills
) {
  const suggestedUsers = await prisma.user.findMany({
    where: {
      id: {
        not: currentUserId,
        notIn: [
          // Exclude existing connections
          ...(await prisma.connection
            .findMany({
              where: {
                OR: [
                  { senderId: currentUserId },
                  { receiverId: currentUserId },
                ],
              },
              select: { senderId: true, receiverId: true },
            })
            .then((connections) =>
              connections.flatMap((conn) => [conn.senderId, conn.receiverId])
            )),
        ],
      },
      // Optional location filter
      ...(location ? { location } : {}),
      // Optional skills filter
      ...(skills && skills.length
        ? {
            skills: {
              hasSome: skills,
            },
          }
        : {}),
    },
    take: limit,
    orderBy: {
      createdAt: "desc", // Most recently joined first
    },
  });

  return suggestedUsers;
}
