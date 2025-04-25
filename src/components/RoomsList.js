import React, { useState, useEffect, useCallback  } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";
import { ROOMS_PER_GAME } from "../helpers/init";

import {
  updateCr,
  updateDummyRoom,
  //removeUpdatedDummyRoomListener,
  removeUpdatedRoomDataListener,
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
  width: ${(props) => `calc(${100 / props.roomsPerGame}% - 20px)`}; // subtracting margin for spacing
  height: 20vw;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: 5px;
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
  const [currentRoom, setCr] = useState({});
  const [dummyRoom, setDummyRoom] = useState(roomsInitialData?.[0] || {});
  const [roomsData, setRoomsData] = useState(roomsInitialData);
  const [changedRoom, setChangedRoom] = useState({});
  const navigate = useNavigate();
  

  console.log("IN start of RoomsList -- roomsInitialData", roomsInitialData);
  console.log("IN start of RoomsList -- dummyRoom", dummyRoom);

  useEffect(() => {
    // This effect runs only once when userName changes.
    updateCr(setCr);
    updateDummyRoom(setDummyRoom);
  
    return () => {
      removeUpdatedRoomDataListener(); // ✅ Clean up listener here
    };
  }, [userName]);
  

  useEffect(() => {
    const getDummyRoom = async () => {
      if (!isEmpty(dummyRoom) && !isEmpty(userName)) {
        console.log("IN getDummyRoom -- dummyRoom: ", dummyRoom);

        await emitConnectedAndGetDummyRoom({
          dummyRoom: dummyRoom,
          playerName: userName,
        });
      }
    };
  
    getDummyRoom();
  }, [dummyRoom, userName] ); // ✅ This will only run when dummyRoom changes
  

 // When the room changes, navigate to the new room
useEffect(() => {
  if (!isEmpty(currentRoom)) {
    console.log("IN NEVIGATE -- currentRoom:", currentRoom);
    navigate(`/game/${currentRoom.id}`, {
      state: { userName, currentRoom },
    });
  }
}, [currentRoom, navigate, userName]);

const handleJoinRoom = async (room) => {
  if (!isEmpty(room) && !isEmpty(userName)) {
    const fullRoom = roomsInitialData.find((r) => r.id === room.id) || room;
    await emitAddMemberToRoom({
      chosenRoom: fullRoom,
      playerName: userName,
    });
  }
};

// ✅ CHANGED: Wrapped the function in useCallback to fix redeclaration and lint issue
const handleOtherPlayerJoinedRealRoom = useCallback((data) => {
  const updatedRoom = roomsData.find((room) => room.id === data.joinedRoomId);
  if (updatedRoom) {
    const updatedRoomData = {
      ...updatedRoom,
      currentPlayers: [
        ...updatedRoom.currentPlayers,
        { name: data.joinedPlayerName },
      ],
    };
    const updatedRooms = roomsData.map((room) =>
      room.id === updatedRoom.id ? updatedRoomData : room
    );
    setRoomsData(updatedRooms);
  }
}, [roomsData, setRoomsData]);

useEffect(() => {
  otherPlayerJoinedRoom(setChangedRoom);
  return () => {
    removeUpdatedChangedRoomListener();
  };
}, [userName]);

useEffect(() => {
  if (!isEmpty(changedRoom)) {
    console.log("Triggered handleOtherPlayerJoinedRealRoom due to changedRoom", changedRoom);
    handleOtherPlayerJoinedRealRoom(changedRoom);
  }
}, [changedRoom, handleOtherPlayerJoinedRealRoom]); // ✅ SAFE: No more warning, no infinite loop



  return (
    <GameContainer>
      <GameHeading titleColor={roomsData[0].frameColor}>
        {roomsData[0].name}
      </GameHeading>

      <RoomList>
        {roomsData.map((room, i) => {
          if (room.id[2] !== '0') {
            console.log(`Rendering index:${i} room-id:${room.id} room-id-2:${room.id[2]}  ${room.id[2]==='0'}`);
          }

          if (room.id[2] === '0') {
            console.log(`Skipping index:${i} room-id:${room.id} room-id-2:${room.id[2]}  ${room.id[2]==='0'}`);
            return null;
          }

          return (
            <RoomItemWrapper key={room.id} frameColor={room.frameColor} roomsPerGame={ROOMS_PER_GAME + 1}>
              <RoomImageWrapper backgroundImage={room.backgroundImage} />
              <PlayersSection>
                <PlayersTitle>Current Players:</PlayersTitle>
                <PlayersList>
                  Room ID: {room.id} <br />
                  {room.currentPlayers && room.currentPlayers.length > 0
                    ? room.currentPlayers.map((player) => player.name).join(", ")
                    : "No players yet"}
                </PlayersList>
              </PlayersSection>
              <JoinButton
                btnColor={room.frameColor}
                onClick={() => handleJoinRoom(room)}
              >
                Join
              </JoinButton>
            </RoomItemWrapper>
          );
        })}
      </RoomList>
    </GameContainer>
  );
};

export default RoomsList;
