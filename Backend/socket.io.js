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
        type: "USER_JOINED",
        message: `${user?.username} has joined the group`,
        user,
      });
    });

    // Leave room handler
    socket.on("leave room", (groupId) => {
      socket.leave(groupId);
      if (connectedUsers.has(socket.id)) {
        // Remove user from connected users and notify others
        connectedUsers.delete(socket.id);
        socket.to(groupId).emit("user left", user?._id);
      }
    });

    // Send message handler
    socket.on("new message", (message) => {
      // Broadcast message to all other users of group
      const { groupId } = message;
      socket.to(groupId).emit("message received", message);
    });

    // Disconnect handler
    socket.on("disconnect", () => {
      // Remove user from connected users and notify others
      if (connectedUsers.has(socket.id)) {
        // get user's room info before removing
        const { user, room } = connectedUsers.get(socket.id);
        // Notify others in the room about user leaving
        socket.to(room).emit("user left", user?._id);
        // remove user from connected users
        connectedUsers.delete(socket.id);
      }
    });

    // Typing indicator
    socket.on("typing", (groupId, username) => {
      // Broadcast typing indicator to all other users in the room
      socket.to(groupId).emit("user typing", { username });
    });

    // stop Typing indicator
    socket.on("stop typing", (groupId) => {
      // Broadcast stop typing indicator to all other users in the room
      socket.to(groupId).emit("user stop typing", { username: user?.username });
    });
  });
};

module.exports = socketIo;
