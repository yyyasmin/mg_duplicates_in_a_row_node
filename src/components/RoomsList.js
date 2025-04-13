import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";
import {
  updateCr,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,
  //emitCurentRoomChanged,
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
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  justify-content: flex-start;
`;

const RoomItemWrapper = styled.li`
  margin: 10px;
  width: 15vw;
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
`;

const RoomImageWrapper = styled.div`
  width: 100%;
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
  const navigate = useNavigate();
  
  console.log("IN RoomsList -- roomsInitialData", roomsInitialData)

  useEffect(() => {
    const handleUpdateCr = (room) => setCr(room);
    updateCr(handleUpdateCr);

    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  useEffect(() => {
    console.log("After handleJoinRoom -- currentRoom:", currentRoom && currentRoom.currentPlayers, currentRoom.id);
    if (!isEmpty(currentRoom)) {
      navigate(`/game/${currentRoom.id}`, {
        state: { userName, currentRoom },
      });
    }
  }, [currentRoom, navigate, userName]);

  const handleJoinRoom = async (room) => {
    console.log("IN handleJoinRoom -- room: ", room);
    console.log("IN handleJoinRoom -- userName: ", userName);
    console.log("!isEmpty(room)", !isEmpty(room));
    console.log("!isEmpty(userName)", !isEmpty(userName));

    if (!isEmpty(room) && !isEmpty(userName)) {
      const fullRoom = roomsInitialData.find(r => r.id === room.id) || room;
      await emitAddMemberToRoom({
        chosenRoom: fullRoom,
        playerName: userName,
      });
    }
  };

roomsInitialData.map((room, i) => {
	console.log("IN roomsInitialData-loop: i:", i, "ROOM:", room, room.currentPlayers
)
})

  return (
    <GameContainer>
      <GameHeading titleColor={roomsInitialData[0].frameColor}>
        {roomsInitialData[0].name}
      </GameHeading>
	  
      <RoomList>
        {roomsInitialData.map((room, i) => {
          console.log(`Rendering room #${i} (${room.name}--${room.id}) - Players:`, room, room.currentPlayers);
          return (
            <RoomItemWrapper key={room.id} frameColor={room.frameColor}>
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
