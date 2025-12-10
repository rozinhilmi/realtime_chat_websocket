module.exports = (io, socket, roomChats) => {
  socket.on("room_chat", ({ roomId, username }) => {
    // Jika room belum ada, maka suruh client untuk redirect
    if (!roomChats[roomId]) {
      return io.to(roomId).emit("navigate_list_room_chat");
    }

    socket.join(roomId);
    // Kirim semua chat di room itu ke user yang baru join
    io.to(roomId).emit("get_all_chat", roomChats[roomId]);

    console.log(`${username} joined room: ${roomChats[roomId].name}`);
  });

  socket.on("send_message", ({ roomId, username, message, status }) => {
    console.log(socke);
    if (!roomId || !username || !message) {
      return socket.emit("error", { message: "Data tidak lengkap!" });
    }

    const room = roomChats[roomId];
    if (!room) return;

    const messageData = {
      id: !room.chats.length ? 1 : Number(room.chats[room.chats.length - 1].id) + 1,
      socketId: socket.id,
      username,
      message,
      status,
    };

    room.chats.push(messageData);
    // Hanya broadcast ke room tersebut
    io.to(roomId).emit("receive_message", messageData);
  });

  socket.on("delete_all_chat", ({ roomId }) => {
    roomChats[roomId].chats = [];
    io.to(roomId).emit("get_all_chat", roomChats[roomId]);
  });

  socket.on("delete_spesific_chat", ({ roomId, id }) => {
    roomChats[roomId].chats = roomChats[roomId].chats.filter((c) => c.id != id);
    io.to(roomId).emit("remove_chat", { id });
  });

  socket.on("clientTyping", ({ roomId, username, message, status }) => {
    const room = roomChats[roomId];
    if (!room) return;

    const alreadyTyping = room.chats.some((c) => c.username === username && c.status === "typing");

    if (!alreadyTyping) {
      const messageData = {
        id: !room.chats.length ? 1 : Number(room.chats[room.chats.length - 1].id) + 1,
        socketId: socket.id,
        username,
        message,
        status,
      };
      room.chats.push(messageData);
      io.to(roomId).emit("receive_message", messageData);
    }
  });

  socket.on("clientStopType", ({ roomId, username }) => {
    roomChats[roomId].chats = roomChats[roomId].chats.filter((c) => !(c.username === username && c.status === "typing"));
    io.to(roomId).emit("clientReceiveStopType", { username });
  });
};
