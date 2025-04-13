"use strict";
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");
const isEmpty = require("./helpers/isEmpty");

const app = express();
const server = http.Server(app);
const { pppRooms, pppRoom } = require("./helpers/ppp.js");

const allowedOrigin = "*";

const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const io = socket(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/database/Cards.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "Cards.json");
  res.sendFile(filePath);
});

app.get("/database/rooms.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "rooms.json");
  res.sendFile(filePath);
});

app.get("/database/GameCards/:filename", (req, res) => {
  const filePath = path.join(__dirname, "database/GameCards", req.params.filename);
  res.sendFile(filePath);
});

const {
  getActiveRooms,
  setActiveRooms,
  activeRooms,
  serverSocketServices,
} = require("./serverSocketServices");

serverSocketServices(io);
app.use(express.json());
app.use("/helpers", express.static(path.join(__dirname, "helpers")));

// POST route
app.post("/api/activeRooms", async (req, res) => {
  try {
    const { rooms } = req.body;

    let updatedRooms = [];
    let activeRooms = getActiveRooms();
console.log("IIIIIIIIIIIIIIIIN init -- activeRooms: ", activeRooms)

    rooms.forEach((room) => {
      const existingRoom = activeRooms.find((activeRoom) => activeRoom.id === room.id);
      if (existingRoom) {
        updatedRooms.push(existingRoom);
      } else {
        const newRoom = {
          id: room.id,
          currentPlayers: [],
        };
        updatedRooms.push(newRoom);
      }
    });

    setActiveRooms(updatedRooms);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(updatedRooms);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});


// SERVER URL
const publicURL = process.env.RAILWAY_PUBLIC_URL || process.env.RAILWAY_STATIC_URL;
server.listen(process.env.PORT || 5000, console.log(`Listening to ${process.env.PORT || 5000}!`));
