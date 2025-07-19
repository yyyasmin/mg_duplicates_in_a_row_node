const isEmpty = require("./helpers/isEmpty");
const path = require("path");
const { exec } = require("child_process");
const fs = require('fs');
const ROOMS_PER_GAME = 7;
const { CHOSEN_NODE_URL } = require("./helpers/ServerRoutes");
let activeRooms = [];

console.log("999 -- IN serverSocketServices.js -- GLOBAL -- activeRooms: ", activeRooms)

function getActiveRooms() {
  return activeRooms;
};

function setActiveRooms(newData) {
  activeRooms = newData;
  console.log("999 -- IN serverSocketServices.js -- setActiveRooms -- activeRooms: ", activeRooms)
  return activeRooms;
}

const emitMsgToRoomConnectedBeforeJoin = (io, msgType, updatedRoom) => {
  updatedRoom.currentPlayers.forEach((player) => {
    //console.log("EMITTING TO PLAYER", player.name, "msgType:", msgType);
	//console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDD")
	//console.log("DUMMYROOM: ", updatedRoom)
	//console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDD")

    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};

const notifyConnectedBeforeJoin = (io, playerName, joinedRoom) => {
  const dummyRoomId = joinedRoom.id.slice(0, -1) + "0";
  const dummyRoom = getRoomFromActiveRoomsById(dummyRoomId);

  if (dummyRoom === -1) return;
  
  //console.log("IN notifyConnectedBeforeJoin -- dummyRoom: ",dummyRoom )
  //console.log("IN activeRooms -- dummyRoom: ",activeRooms )

  dummyRoom.currentPlayers.forEach((player) => {
    const socketId = player.socketId;

    const isInRealRoom = activeRooms.some((room) => 
      !room.id.endsWith("0") && // Check if it's a real room
      room.currentPlayers.some((p) => p.socketId === socketId) // Check if the player is in that room
    );

    if (!isInRealRoom) {
      io.to(socketId).emit("NEW_PLAYER_JOINED_REAL_ROOM", {
        joinedRoomId: joinedRoom.id,
        joinedPlayerName: playerName,
      });
    }
  });
};


const emitMsgToRoomPlayers = (io, msgType, updatedRoom) => {
  updatedRoom.currentPlayers.forEach((player) => {
  console.log("888 -- emitMsgToRoomPlayers -- player:", player)
    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};

const emitMsgToRoomPlayers2 = (io, msgType, updatedRoom, updatedObj2) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedRoom, updatedObj2);
  });
};

const emitMsgToRoomPlayers3 = (io, msgType, updatedRoom, updatedObj2, updatedObj3) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedObj2, updatedObj3);
  });
};

const getRoomFromActiveRoomsById = (roomId) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === roomId);
  if (existingRoomIndex !== -1) {
	  return activeRooms[existingRoomIndex]
  } else {
	return -1
  }
}

const getRoomFromActiveRoomsByRoomURL = (roomRoomURL) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.roomURL === roomRoomURL);
  if (existingRoomIndex !== -1) {
	  return activeRooms[existingRoomIndex]
  } else {
	return -1
  }
}

const getRoomIdxFromActiveRoomsByRoomURL = (roomURL) => {
  return activeRooms.findIndex((room) => room.roomURL === roomURL);
}

const getRoomIdxFromActiveRoomsByID = (roomID) => {
  return activeRooms.findIndex((room) => room.id === roomID);
}

const updateActiveRoomsWithUpdatedRoom = (roomWithNewData) => {
  if (isEmpty(roomWithNewData)) {
    return -1
  }
  const roomURL = roomWithNewData.roomURL
  const roomID = roomWithNewData.id
  const updatingIdx = getRoomIdxFromActiveRoomsByID(roomID)
  if (updatingIdx === -1)  {
    return -1
  }  
  let roomToUpdate = activeRooms[updatingIdx]
  activeRooms[updatingIdx] = {...roomWithNewData};
  return activeRooms[updatingIdx]
}


const setAvailableRoomInActiveRooms = (requesedRoom) => {
  let newRoom = {}
  if ( isEmpty(requesedRoom) )  {
    return -1
  }
  const setRoomIndex = activeRooms.findIndex((r) => r.id == requesedRoom.id);
    if (setRoomIndex !== -1) {
      newRoom = {... activeRooms[setRoomIndex]}
    }

    else {
	  return -1;
	}
	if (isEmpty(newRoom.cardsData)) {
		newRoom = {...requesedRoom}
		activeRooms[setRoomIndex] = newRoom
		return newRoom;
	}
	else {
	  updatedRoomNewCopy = {...activeRooms[setRoomIndex]}
      updatedRoomNewCopy.cardsData.map((card, index) => {
       card.faceType = "back";
      });
      activeRooms[setRoomIndex] = {...updatedRoomNewCopy};
      return updatedRoomNewCopy
	}
}


const movePlayerToEnd = (currentPlayers, playerName) => {
  const playerIndex = currentPlayers.findIndex((player) => player.name === playerName);
  if (playerIndex !== -1) {
    const playerToMove = currentPlayers.splice(playerIndex, 1)[0];
    currentPlayers.push(playerToMove);
    currentPlayers.forEach((player) => {
      player.isActive = false;
    });
    currentPlayers[0].isActive = true; // The first player to join goes first
  }
  return currentPlayers;
}


const addPlayerToRoom = (roomToAddPlayer, playerName, socketId) => {
    let updatedPlayers;
    let roomToAddPlayerNewCopy;

    newPlayer = {
      socketId: socketId,
      name: playerName,
      email: "",
      isWinner: false,
      isActive: false,
      flippCount: 0,
    };
    let availableRoomIdx = getRoomIdxFromActiveRoomsByRoomURL(roomToAddPlayer.roomURL)
    let availableRoom = activeRooms[availableRoomIdx]
	if (isEmpty(availableRoom))  {
        //console.error("Room not found in activeRooms:", roomToAddPlayer.roomURL);
        return -1;
	}
    let currentPlayersNewCopy = [...availableRoom.currentPlayers]
    // Only add if not already present
    if (!currentPlayersNewCopy.some(p => p.socketId === newPlayer.socketId)) {
      currentPlayersNewCopy.push(newPlayer)
    }

    roomToAddPlayerNewCopy = { ...availableRoom, currentPlayers:currentPlayersNewCopy };
    if (roomToAddPlayerNewCopy.currentPlayers.length === roomToAddPlayerNewCopy.maxMembers) {
      roomToAddPlayerNewCopy.currentPlayers.forEach((player) => {
        player.isActive = false;
      });
      roomToAddPlayerNewCopy.currentPlayers[0].isActive = true;
      roomToAddPlayerNewCopy.startGame = true;
    }
    return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
 }


const removeRoomFromActiveRooms = (roomId) => {
  const roomIndex = activeRooms.findIndex((r) => r.id === roomId);
  if (roomIndex !== -1) {
    activeRooms.splice(roomIndex, 1);
  }
  else {
	  return -1
  }
};

const addNewGameToActiveRooms = (roomsData) => {
  try {
    const newRooms = roomsData.flatMap(room => 
      Array.from({length: ROOMS_PER_GAME}, (_, i) => ({
        ...room, 
        id: `${room.id}-${i}`, 
        roomURL: `${CHOSEN_NODE_URL}/room/${room.id}-${i}`, 
        currentPlayers: [], 
        startGame: false, 
        endGame: false, 
        cardsData: []
      }))
    );
    
    newRooms.forEach(room => {
      if (!activeRooms.find(r => r.id === room.id)) {
        activeRooms.push(room);
        //console.log("✅ Added new room to activeRooms:", room.id);
      }
    });
  } catch (error) {
    //console.error("❌ Error updating activeRooms after game generation:", error);
  }
};

// SOCKET SERVICES
const HEART_BEAT_INTERVAL = 60000; // 1 minute
const INACTIVE_TIMEOUT = 3600000; // 1 hour
const playerLastActive = {};

// Function to handle HEART_BEAT signal from client
function handleHeartBeat(playerName) {
  playerLastActive[playerName] = Date.now();
}

// Function to check for inactive players and remove them
function checkInactivePlayers(io) {
  const currentTime = Date.now();
  for (const playerName in playerLastActive) {
    if (currentTime - playerLastActive[playerName] > INACTIVE_TIMEOUT) {
      delete playerLastActive[playerName];
      io.emit("PLAYER_LEFT_ROOM", playerName);
    }
  }
}

setInterval(() => {
  checkInactivePlayers();
}, HEART_BEAT_INTERVAL);

const serverSocketServices = (io) => {
	
  io.on("connection", (socket) => {
	  
    socket.on("HEART_BEAT", (playerName) => {
      handleHeartBeat(playerName);
    });

    socket.on("CREATE_GAME", ({ age, subject }) => {
		
//console.log("🔍 serverSocketServices: CREATE_GAME received - age:", age, "subject:", subject)

      const pythonScriptPath = path.join(__dirname, "public", "file_creation_helpers", "game_generator.py");
      const command = `python "${pythonScriptPath}" "${age}" "${subject}"`;
//console.log("🔍 serverSocketServices: Executing command:", command)

      exec(command, (error, stdout, stderr) => {
        //console.log("🔍 serverSocketServices: Python script completed");
        //console.log("🔍 serverSocketServices: stdout:", stdout);
        //console.log("🔍 serverSocketServices: stderr:", stderr);
        
        if (error) {
          //console.error("❌ serverSocketServices: Python script error:", error);
          //console.error("❌ serverSocketServices: Error code:", error.code);
          //console.error("❌ serverSocketServices: Error signal:", error.signal);
          io.emit("GAME_CREATION_RES", { success: false, error: stderr || error.message });
          return;
        }
        
        //console.log("✅ serverSocketServices: Python script completed successfully");
        //console.log("✅ serverSocketServices: Output:", stdout);

        // Add new rooms to activeRooms after game generation
        try {
          const roomsData = JSON.parse(fs.readFileSync(path.join(__dirname, "public", "rooms.json"), 'utf8'));
          addNewGameToActiveRooms(roomsData);
        } catch (error) {
          //console.error("❌ Error updating activeRooms after game generation:", error);
        }

        io.emit("GAME_CREATION_RES", { success: true, message: "Game generated successfully!", output: stdout });
      });

    });

	
 socket.on("ASIGN_DUMMY_ROOM", ({ dummyRoom, playerName }) => {
	 let updatedRoom = setAvailableRoomInActiveRooms(dummyRoom);

	 if (updatedRoom === -1) {
      return;
	 }

	 updatedRoom = {
      ...addPlayerToRoom(updatedRoom, playerName, socket.id),
	 };

//console.log("ASIGN_DUMMY_ROOM -- dummyRoom:", dummyRoom);

	 //emitMsgToRoomConnectedBeforeJoin(io, "ASIGN_DUMMY_ROOM", updatedRoom);
	 emitMsgToRoomConnectedBeforeJoin(io, "UPDATED_DUMMY_ROOM", updatedRoom);

 });
 
 socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ chosenRoom, playerName }) => {
  console.log("444 -- onCREATE_ROOM_AND_ADD_PLAYER -- chosenRoom:", chosenRoom)
  console.log("555 -- onCREATE_ROOM_AND_ADD_PLAYER -- playerName:", playerName)

   let updatedRoom = { ...setAvailableRoomInActiveRooms(chosenRoom) };
   if (updatedRoom === -1) {
    return;
   }
   updatedRoom = {
    ...addPlayerToRoom(updatedRoom, playerName, socket.id),
   };
   console.log("666 -- onCREATE_ROOM_AND_ADD_PLAYER -- updatedRoom.currentPlayers:", updatedRoom.currentPlayers)

   console.log("20-20-20 -- serverSocketServices.js -- CREATE_ROOM_AND_ADD_PLAYER -- emitting UPDATED_CURRENT_ROOM to room:", updatedRoom.id, "currentPlayers:", updatedRoom.currentPlayers);
   emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
   // 👇 Notify dummy room users about the new player in a real room
   notifyConnectedBeforeJoin(io, playerName, updatedRoom);
 });
 


    socket.on("REMOVE_PLAYER_FROM_ROOM", ( {requestedRoom, playerName} ) => {
      if ( isEmpty(requestedRoom) )  {
        return -1
      }
      let existingRoom, updatedRoom;
      let existingPlayer = {};
      existingRoom = getRoomFromActiveRoomsById(requestedRoom);
      
      if (existingRoom === -1) {
        return { playerName, requestedRoom };
      } else {
        updatedRoom = existingRoom;
      }
        
      requestedPlayer = !isEmpty(updatedRoom.currentPlayers) && 
                updatedRoom.currentPlayers.find((player) => player.name === playerName);

      if (existingPlayer) {
        let PlayersToSendMsg =
        [...updatedRoom.currentPlayers.filter((player) => player.name !== playerName)];
        if (PlayersToSendMsg.length === 1) {
          updatedPlayers[0].isActive = true;
        }
        updatedRoom = {
          ...updatedRoom,
          currentPlayers: PlayersToSendMsg,
        };
        if (PlayersToSendMsg.length == 0) {
          updatedRoom = {
            ...updatedRoom,
            currentPlayers: PlayersToSendMsg,
            startGame: false,
            endGame: false,
          };
        }
      }
      emitMsgToRoomPlayers(io, "PLAYER_LEFT_ROOM", updatedRoom)
      console.log("21-21-21 -- serverSocketServices.js -- REMOVE_PLAYER_FROM_ROOM -- emitting UPDATED_CURRENT_ROOM to room:", updatedRoom.id, "currentPlayers:", updatedRoom.currentPlayers);
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom)
    }) // END REMOVE_PLAYER_FROM_ROOM


    socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
      removeRoomFromActiveRooms(roomId);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
	  updateActiveRoomsWithUpdatedRoom(updatedRoom);
      console.log("22-22-22 -- serverSocketServices.js -- CURENT_ROOM_CHANGED -- emitting UPDATED_CURRENT_ROOM to room:", updatedRoom.id, "currentPlayers:", updatedRoom.currentPlayers);
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
    });

    socket.on("IS_MATCHED_CHANGED", (cr, isMatched, last2FlippedCards, have_has_word_idx) => {
      emitMsgToRoomPlayers3(io, "UPDATED_IS_MATCHED", cr, isMatched, last2FlippedCards);
    });
    socket.on("START_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_START_GAME", cr);
    });

    socket.on("END_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_END_GAME", cr);
    });
	
  });
	
};

// Function to check if rooms.json was updated
const checkRoomsJsonUpdate = (gameName) => {
  try {
    const roomsPath = path.join(__dirname, "public", "rooms.json");
    //console.log("🔍 checkRoomsJsonUpdate: Checking rooms.json at:", roomsPath);
    
    if (!fs.existsSync(roomsPath)) {
      //console.error("❌ checkRoomsJsonUpdate: rooms.json does not exist!");
      return false;
    }
    
    const roomsData = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));
    //console.log("🔍 checkRoomsJsonUpdate: Current rooms.json has", roomsData.length, "games");
    
    const gameExists = roomsData.some(room => room.gameName === gameName);
    //console.log("🔍 checkRoomsJsonUpdate: Game", gameName, "exists in rooms.json:", gameExists);
    
    if (gameExists) {
      const gameRoom = roomsData.find(room => room.gameName === gameName);
      //console.log("✅ checkRoomsJsonUpdate: Found game in rooms.json:", gameRoom);
    }
    
    return gameExists;
  } catch (error) {
    //console.error("❌ checkRoomsJsonUpdate: Error checking rooms.json:", error);
    return false;
  }
};

module.exports = {getActiveRooms, setActiveRooms,activeRooms, serverSocketServices};
