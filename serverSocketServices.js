
const isEmpty = require("./helpers/isEmpty");
let activeRooms = [];

function getActiveRooms() {
  return activeRooms;
};

function setActiveRooms(newData) {
  activeRooms = newData;
  return activeRooms;
}

const emitMsgToRoomConnectedBeforeJoin = (io, msgType, updatedRoom) => {
  updatedRoom.currentPlayers.forEach((player) => {
    console.log("EMITTING TO PLAYER", player.name, "msgType:", msgType);
    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};

const notifyConnectedBeforeJoin = (io, playerName, joinedRoom) => {
  const dummyRoomId = joinedRoom.id.slice(0, -1) + "0";
  const dummyRoom = getRoomFromActiveRoomsById(dummyRoomId);

  if (dummyRoom === -1) return;
  
  console.log("IN notifyConnectedBeforeJoin -- dummyRoom: ",dummyRoom )
  console.log("IN activeRooms -- dummyRoom: ",activeRooms )

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
	}
    let currentPlayersNewCopy = [...availableRoom.currentPlayers]
    currentPlayersNewCopy.push(newPlayer)

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

	
socket.on("CREATE_ROOM_AND_ADD_PLAYER", ({ chosenRoom, playerName }) => {
  let updatedRoom = { ...setAvailableRoomInActiveRooms(chosenRoom) };

  if (updatedRoom === -1) {
    return;
  }

  updatedRoom = {
    ...addPlayerToRoom(updatedRoom, playerName, socket.id),
  };

  console.log("CREATE_ROOM_AND_ADD_PLAYER -- chosenRoom-id-2", chosenRoom.id[2]);

  if (chosenRoom.id[2] === '0') {
    emitMsgToRoomConnectedBeforeJoin(io, "UPDATED_DUMY_ROOM", updatedRoom);
  } else {
    emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);

    // 👇 Notify dummy room users about the new player in a real room
    notifyConnectedBeforeJoin(io, playerName, chosenRoom);
  }
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
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom)
    }) // END REMOVE_PLAYER_FROM_ROOM


    socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
      removeRoomFromActiveRooms(roomId);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
	  updateActiveRoomsWithUpdatedRoom(updatedRoom);
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

module.exports = {getActiveRooms, setActiveRooms,activeRooms, serverSocketServices};
