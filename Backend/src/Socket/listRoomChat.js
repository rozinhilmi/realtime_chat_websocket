module.exports = (io, socket, roomChats) => {
  socket.on("list_room_chat", ({ username }) => {
    const list_room = Object.keys(roomChats).map((key) => ({
      id: key,
      name: roomChats[key].name,
    }));

    // client join ke room list_room_chat
    socket.join("list_room_chat");

    // Kirim data list room chat ke semua client pada list_room_chat
    io.to("list_room_chat").emit("get_list_room_chat", list_room);
    console.log(`${username} joined room: list room chat`);
  });

  // buat room chat baru
  socket.on("create_room_chat", ({ username, roomName }) => {
    const generateRoomId = new Date().getTime();

    const newCreatedRoomChats = {
      [generateRoomId]: {
        name: roomName,
        chats: [],
      },
    };
    roomChats = {
      ...newCreatedRoomChats,
      ...roomChats,
    };

    // Kirim data room chat baru ke semua client pada list_room_chat
    io.to("list_room_chat").emit("get_new_room_chat", { id: generateRoomId, name: roomName });
    console.log(`${username} created new Room Chat ${roomName}`);
  });

  // delete room chat
  socket.on("delete_room_chat", ({ id }) => {
    const prevRoomName = roomChats[id].name;
    delete roomChats[id];

    io.to("list_room_chat").emit("remove_room_chat", { id: id, name: prevRoomName }); // memberi tahu client yang berada di list_room_chat bahwa room chat tersebut telah dihapus
    io.to(id).emit("navigate_list_room_chat"); // memberi tahu client yang berada di roomchat tersebut bahwa room chat tersebut telah dihapus
  });
};
