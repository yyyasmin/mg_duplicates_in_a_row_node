import io from "socket.io-client";
import { CHOSEN_PROXY_URL } from "./helpers/ServerRoutes.js";
import isEmpty from "./helpers/isEmpty.js";

export const socket = io(CHOSEN_PROXY_URL);

export const emitAddMemberToRoom = ( {chosenRoom, playerName} ) => {
  console.log("IN emitAddMemberToRoom -- input OBJ --chosenRoom: ", chosenRoom)
  console.log("IN emitAddMemberToRoom -- input OBJ --playerName: ", playerName)

  if ( !isEmpty(chosenRoom) && !isEmpty(playerName) ) {
    
	console.log("IN emitAddMemberToRoom chosenRoom.roomURL", chosenRoom.roomURL)
    console.log("IN emitAddMemberToRoom playerName", playerName)
    
	socket.emit( 'CREATE_ROOM_AND_ADD_PLAYER', { chosenRoom, playerName } );
  }
  else {
    console.log("tyryig to emit EMPTY OBJ-- chosenRoom:", chosenRoom, " PLAYER:", playerName) 
  }
};

export const emitRemoveMemberFromRoom = ({ chosenRoom, playerName }) => {
  console.log("IN emitRemoveMemberFromRoom -- chosenRoom:", chosenRoom)
  socket.emit('REMOVE_PLAYER_FROM_ROOM', { chosenRoom, playerName });
};

export const emitRemoveRoomFromActiveRooms = (roomId) => {
  socket.emit('REMOVE_ROOM_FROM_ACTIVE_ROOMS', roomId);
};

export const emitCurentRoomChanged = (curentRoom) => {
  console.log("IN emitCurentRoomChanged -- curentRoom:", curentRoom)
  socket.emit("CURENT_ROOM_CHANGED", curentRoom);
};

// export const emitCurentMatchedCards = (cr, matchedCards) => {
//   socket.emit("MATCHED_CARDS_CHANGED", cr, matchedCards);
// };

export const emitCurentIsMatched = (cr, isMatched, last2FlippedCards, have_has_word_idx) => {
  console.log("IN emitCurentIsMatched -- cr:", cr)
  console.log("IN emitCurentIsMatched -- last2FlippedCards:", last2FlippedCards)
  console.log("IN emitCurentIsMatched -- isMatched:", isMatched)

  socket.emit("IS_MATCHED_CHANGED", cr, isMatched, last2FlippedCards, have_has_word_idx );
};

// export const emitCurentCardSize = (cr, cardSize) => {
//   socket.emit("CARD_SIZE_CHANGED", cr, cardSize );
// };

export const emitHeartBeat = (playerName) => {
  socket.emit("HEART_BEAT", playerName);
};

export const updateCr = (setCr) => {
  socket.on("UPDATED_CURRENT_ROOM", (serverUpdatedCurentRoom) => {
    console.log("clientSocketServices -- updateCr -- ON UPDATED_CURRENT_ROOM -- serverUpdatedCurentRoom: ", serverUpdatedCurentRoom)           
    setCr(serverUpdatedCurentRoom);
  });
};

export const updatePlayerLeft = (setPlayerLeft) => {
  socket.on("PLAYER_LEFT_ROOM", (playerName) => {
    console.log("clientSocketServices -- updatePlayerLeft -- ON-PLAYER_LEFT_ROOM -- playerName: ", playerName)
    setPlayerLeft(playerName);
  });
};

export const updateMatchedCards = (setMatchedCards) => {
  socket.on("UPDATED_MATCHED_CARDS", (matchedCards) => {
    setMatchedCards(matchedCards);
  });
};

export const updateIsMatched = (setIsMatched, setLast2FlippedCards) => {
   
    console.log("IN updateIsMatched -- ON-UPDATED_IS_MATCHED -- setIsMatched: ", setIsMatched)
    console.log("")

  socket.on("UPDATED_IS_MATCHED", (isMatched, last2FlippedCards, have_has_word_idx) => {
    console.log("IN updateIsMatched -- ON-UPDATED_IS_MATCHED -- isMatched: ", isMatched)

    setIsMatched(isMatched);
    setLast2FlippedCards(last2FlippedCards);
  });
};

export const updateCardSize = (setCardSize) => {
  socket.on("UPDATED_CARD_SIZE", (cardSize) => {
    ////console.log("IN updateCardSize -- ON-UPDATED_CARD_SIZE -- cardSize: ", cardSize)
    setCardSize(cardSize);
  });
};

export const removeUpdatedRoomDataListener = () => {
  ////console.log("removeUpdatedRoomDataListener -- REMOVING SOCKER from UPDATED_CURRENT_ROOM")
  socket.off("UPDATED_CURRENT_ROOM");
};

export const removeUpdatedMatchedCards = () => {
  socket.off("UPDATED_MATCHED_CARDS");
};

export const removeUpdatedIsMatched = () => {
  socket.off("UPDATED_IS_MATCHED");
};
