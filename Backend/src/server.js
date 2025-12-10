const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const { db } = require("../database");
let { usersData, roomChats } = db;

// Inisialisasi Express dan Socket.IO
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Endpoint untuk pengecekan server
app.get("/", (req, res) => {
  res.send("Server Socket.IO berjalan...");
});

// Endpoint login dengan validasi username
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username diperlukan." });
  }

  const userCheck = usersData.find((user) => user.username === username);

  if (userCheck) {
    return res.json(userCheck);
  } else {
    return res.status(401).json({ message: "Username tidak ditemukan." });
  }
});

// Socket.IO event connection
io.on("connection", (socket) => {
  console.log(`User ${socket.handshake.query.token} connected : ${socket.id} `);

  // list room chat
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
  // end list room chat

  // room chats{
  socket.on("room_chat", ({ roomId, username }) => {
    // Jika room belum ada, maka suruh client untuk redirect back
    if (!roomChats[roomId]) {
      return io.to(roomId).emit("navigate_list_room_chat");
    }

    socket.join(roomId);
    // Kirim semua chat di room itu ke user yang baru join
    io.to(roomId).emit("get_all_chat", roomChats[roomId]);

    console.log(`${username} joined room: ${roomChats[roomId].name}`);
  });

  socket.on("send_message", ({ roomId, username, message, status }) => {
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

  //end room chats

  // Tangani saat user disconnect
  socket.on("disconnect", () => {
    console.log("");
    console.log(`User ${socket.handshake.query.token} disconnected: ${socket.id}`);
    console.log("");
  });
  // }
});

// Menjalankan server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
