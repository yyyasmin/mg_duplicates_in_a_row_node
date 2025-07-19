import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";
import { ROOMS_PER_GAME } from "../helpers/init";
import { onUpdatedCurrentRoom, removeUpdatedRoomDataListener } from "../clientSocketServices";

import {
  updateDummyRoom,
  removeUpdatedDummyRoomListener,
  removeUpdatedChangedRoomListener,
  emitConnectedAndGetDummyRoom,
  emitAddMemberToRoom,
  otherPlayerJoinedRoom,
  
} from "../clientSocketServices";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  font-family: Lobster, Georgia, serif;
  color: #545454;
  padding: 2vw;
`;

const GameHeading = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  margin: 0 0 0.8em;
  color: ${(props) => props.titleColor || "#545454"};
`;

const RoomList = styled.ul`
  list-style: none;
  padding: 0 10px;
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: flex-start;
  box-sizing: border-box;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 10px;
  scroll-snap-align: start;
`;

const RoomItemWrapper = styled.li`
  margin: 10px;
  flex: 0 0 auto;
  min-width: calc(100% / ${(props) => props.roomsPerGame} - 20px);
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  border: 6px solid ${(props) => props.frameColor};
  border-radius: 5px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    min-width: 50%;
  }

  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const RoomImageWrapper = styled.div`
  width: 100%;
  width: 100%;
  height: 20vw;
  background-size: cover;
  background-position: center;
  border-radius: 5px;
  background-image: ${(props) => `url(${props.imagePath})`};
`;

const JoinButton = styled.button`
  background-color: ${(props) => props.btnColor};
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5vw;
`;

const PlayersSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 5px;
`;

const PlayersTitle = styled.h4`
  margin: 0;
  font-size: 1.4vw;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px;
  border-radius: 5px;
  text-align: center;
`;

const PlayersList = styled.div`
  color: #fff;
  font-size: 1.2vw;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
  width: 90%;
  text-align: center;
`;


const RoomsList = ({ userName, roomsInitialData }) => {
  const roomsInitialDataRef = useRef(roomsInitialData);
  const [currentRoom, setCr] = useState({});
  const [dummyRoom, setDummyRoom] = useState(roomsInitialData?.[0] || {});
  const [roomsData, setRoomsData] = useState(roomsInitialData);
  const [changedRoom, setChangedRoom] = useState({});
  const navigate = useNavigate();
  const [hasSentDummyRoom, setHasSentDummyRoom] = useState(false);
  const [otherPlayerJoined, setOtherPlayerJoined] = useState(false);

  //////console.log("IN start of RoomsList -- roomsInitialData", roomsInitialData);
  //////console.log("IN start of RoomsList -- dummyRoom", dummyRoom);

  useEffect(() => {
    roomsInitialDataRef.current = roomsInitialData;
  }, [roomsInitialData]);

  useEffect(() => {
    function handleUpdatedCurrentRoom(serverUpdatedCurentRoom) {
      if (
        Array.isArray(roomsInitialDataRef.current) &&
        roomsInitialDataRef.current.some(room => room.id === serverUpdatedCurentRoom.id)
      ) {
        console.log("28-28-28 -- RoomsList.js -- handleUpdatedCurrentRoom -- serverUpdatedCurentRoom (FOUND):", serverUpdatedCurentRoom);
        setCr(serverUpdatedCurentRoom);
      } else {
        console.warn("31-31-31 -- RoomsList.js -- handleUpdatedCurrentRoom -- NOT_FOUND: serverUpdatedCurentRoom.id:", serverUpdatedCurentRoom.id);
      }
    }
    onUpdatedCurrentRoom(handleUpdatedCurrentRoom);
    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  useEffect(() => {
    console.log("18-18-18 -- RoomsList.js -- useEffect -- roomsInitialData:", roomsInitialData);
    updateDummyRoom(setDummyRoom); // 👈 Run only once!
    return () => {
      removeUpdatedRoomDataListener();
      removeUpdatedDummyRoomListener();
    };
  }, [roomsInitialData]);
	
	useEffect(() => {
		////console.log("555 -- IN RoomsList.js -- useEffect -- dummyRoom: ", dummyRoom)
		////console.log("666 -- IN RoomsList.js -- useEffect -- userName: ", userName)
    ////console.log("777 -- IN RoomsList.js -- useEffect -- hasSentDummyRoom: ", hasSentDummyRoom)

		if (!hasSentDummyRoom && !isEmpty(dummyRoom) && !isEmpty(userName)) {
			emitConnectedAndGetDummyRoom({
				dummyRoom,
				playerName: userName,
			});
			setHasSentDummyRoom(true);
		}
	}, [dummyRoom, userName, hasSentDummyRoom]);

  useEffect(() => {
    //console.log("25-25-25 -- RoomsList.js -- useEffect -- dummyRoom id:", dummyRoom && dummyRoom.id);
  }, [dummyRoom]);

  useEffect(() => {
    //console.log("26-26-26 -- RoomsList.js -- useEffect -- currentRoom id:", currentRoom && currentRoom.id);
  }, [currentRoom]);

// OTHER PLAYER JOINED ANY ROOM
// Wrap the handler in useCallback so it's safe to use in dependencies
const handleOtherPlayerJoinedRealRoom = useCallback((data) => {
  const updatedRoom = roomsInitialDataRef.current.find((room) => room.id === data.joinedRoomId);
  if (updatedRoom) {
    const updatedRoomData = {
      ...updatedRoom,
      currentPlayers: [
        ...updatedRoom.currentPlayers,
        { name: data.joinedPlayerName },
      ],
    };
    const updatedRooms = roomsInitialDataRef.current.map((room) =>
      room.id === updatedRoom.id ? updatedRoomData : room
    );
    setRoomsData(updatedRooms);
  }
}, []);


// Set up the listener for when another player joins a room
useEffect(() => {
  otherPlayerJoinedRoom(setChangedRoom);
  return () => {
    removeUpdatedChangedRoomListener();
  };
}, [userName]);

// When changedRoom is updated with a new join, trigger the flag
useEffect(() => {
  if (!isEmpty(changedRoom)) {
    //////console.log("Triggered handleOtherPlayerJoinedRealRoom due to changedRoom", changedRoom);
    setOtherPlayerJoined(true);
  }
}, [changedRoom]);

// Respond to the flag and reset it after handling
useEffect(() => {
  if (otherPlayerJoined) {
    handleOtherPlayerJoinedRealRoom(changedRoom);
    setOtherPlayerJoined(false);
  }
}, [otherPlayerJoined, changedRoom, handleOtherPlayerJoinedRealRoom]);


// CLICKING A ROOM AND SETTING CURRENT-ROOM
  useEffect(() => {
    if (!isEmpty(currentRoom)) {
      // Remove UPDATED_CURRENT_ROOM listener before navigating
      removeUpdatedRoomDataListener();
      const gamePath = `/game/${currentRoom.id}`;
      console.log("27-27-28 -- RoomsList.js -- useEffect[navigate] -- gamePath:", gamePath);
      console.log("27-27-27 -- RoomsList.js -- useEffect[navigate] -- currentRoom:", currentRoom);
      navigate(gamePath, {
        state: { userName, currentRoom },
      });
    }
  }, [currentRoom, navigate, userName]);
  

  const handleJoinRoom = async (room) => {
//console.log("111 -- in RoomsList -- room: ", room)
//console.log("222 -- in RoomsList -- userName: ", userName)

	if (!isEmpty(room) && !isEmpty(userName)) {
      const fullRoom = roomsInitialData.find((r) => r.id === room.id) || room;
      await emitAddMemberToRoom({
        chosenRoom: fullRoom,
        playerName: userName,
      });
    }
  };
////////console.log("222 -- in RoomsList -- handleJoinRoom: ", handleJoinRoom)

  
  // Flatten roomsData if it's an array of arrays
  const flatRooms = Array.isArray(roomsData[0]) ? roomsData.flat() : roomsData;

  // --- Group rooms by gameName before rendering ---
  const groupedGames = flatRooms.reduce((groups, room) => {
    if (room.id && room.id.split('-')[1] !== '0') {
      const gameName = room.gameName;
      if (!groups[gameName]) {
        groups[gameName] = [];
      }
      groups[gameName].push(room);
    }
    return groups;
  }, {});

  return (
    <GameContainer>
      {/* Removed CreateGameButton and CreateGameForm from here */}

      {Object.values(groupedGames).map((gameGroup, index) => {
        if (gameGroup.length === 0) {
          return null; // Don't render empty groups
        }
        
        // Use the first room for the title and color
        const titleRoom = gameGroup[0];

        return (
          <div key={index}>
            <GameHeading titleColor={titleRoom.frameColor}>
              {titleRoom.name}
            </GameHeading>
            <RoomList>
              {gameGroup.map((room, i) => (
                <RoomItemWrapper key={room.id} frameColor={room.frameColor} roomsPerGame={ROOMS_PER_GAME}>
                  <RoomImageWrapper imagePath={room.imagePath} />
                  <PlayersSection>
                    <PlayersTitle>Current Players:</PlayersTitle>
                    <PlayersList>
                      Room ID: {room.id} <br />
                      {room.currentPlayers && room.currentPlayers.length > 0
                        ? room.currentPlayers.map((player) => player.name).join(", ")
                        : "No players yet"}
                    </PlayersList>
                  </PlayersSection>
                  <JoinButton btnColor={room.frameColor} onClick={() => handleJoinRoom(room)}>
                    Join
                  </JoinButton>
                </RoomItemWrapper>
              ))}
            </RoomList>
          </div>
        );
      })}
    </GameContainer>
  );
};

export default RoomsList;
