const socketIo = (io) => {
  // Store connected users with their room information using socket.io as their key
  const connectedUsers = new Map();
  //   Handle new user connection
  io.on("connection", (socket) => {
    // get user from authentication
    const user = socket.handshake.auth.user;

    // join room handler
    socket.on("join room", (groupId) => {
      socket.join(groupId);

      //   store user and room information in connectedUsers map
      connectedUsers.set(socket.id, { user, room: groupId });

      //   get list of users in room
      const usersInRoom = Array.from(connectedUsers.values())
        .filter((user) => user.room === groupId)
        .map((user) => user.user);

      // Emit updated users list to all users in the room
      io.in(groupId).emit("users in room", usersInRoom);

      //   Broadcast join notification to all other users in the room
      socket.to(groupId).emit("notification", {
        type: "USER_JOINed",
        message: `${user?.username} has joined the group`,
        user,
      });
    });
  });
};

module.exports = socketIo;
