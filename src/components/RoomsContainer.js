import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RoomsList from "./RoomsList"; // Import the existing RoomsList component
//import { CHOSEN_NODE_URL } from "../helpers/ServerRoutes";
import { onGAME_CREATION_RES, removeGAME_CREATION_RESListener, emitCreateGame } from "../clientSocketServices";

// Define a styled component for the greeting message
const Greeting = styled.h1`
  text-align: center;
  font-size: 2rem;
  color: blue;
  margin-bottom: 20px;

  /* Mobile responsive */
  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;

const CreateGameForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
`;

const CreateGameButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-bottom: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

const CenteredRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const RoomsContainer = ({ userName, roomsInitialData, refreshRooms }) => {
  // State for create game form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [age, setAge] = useState("5");
  const [subject, setSubject] = useState("animals");
  const [customSubject, setCustomSubject] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
////console.log("IN RoomsContainer.js -- useEffect, refreshRooms:", refreshRooms)
    const handler = (data) => {
////console.log("IN RoomsContainer.js -- useEffect, data:", data)
////console.log("IN RoomsContainer.js -- handler called with data:", data)

      if (data.success) {
        ////console.log("IN RoomsContainer.js -- data.success is true, calling refreshRooms");
        if (typeof refreshRooms === "function") {
          ////console.log("IN RoomsContainer.js -- refreshRooms is a function, calling it");
          // Add a small delay to ensure files are fully written
          setTimeout(() => {
            ////console.log("IN RoomsContainer.js -- Executing refreshRooms after delay");
            refreshRooms();
          }, 1000); // 1 second delay
        } else {
          ////console.log("IN RoomsContainer.js -- refreshRooms is NOT a function:", typeof refreshRooms);
        }
        alert("Game created successfully!");
      } else {
        ////console.log("IN RoomsContainer.js -- data.success is false:", data.error);
        alert("Game creation failed: " + data.error);
      }
    };
    onGAME_CREATION_RES(handler);
    return () => {
      removeGAME_CREATION_RESListener();
    };
  }, []); // Removed refreshRooms dependency to prevent re-rendering

  const handleCreateGame = async () => {
    const gameSubject = subject === "other" ? customSubject : subject;
    
    if (!gameSubject) {
      alert("Please enter a subject.");
      return;
    }

    try {
      setIsProcessing(true);
      emitCreateGame(age, gameSubject);
    } catch (error) {
      setIsProcessing(false);
      console.error("RoomsContainer.js -- handleCreateGame ERROR:", error);
      alert("An error occurred while creating the game.");
    }
  };

  return (
    <div>
      {userName && <Greeting>Hello, {userName}!</Greeting>}
      {isProcessing && (
        <div style={{ textAlign: 'center', color: 'orange', fontWeight: 'bold', margin: '20px' }}>
          Processing new game ...
        </div>
      )}
      <CenteredRow>
        <CreateGameButton onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Create Your Own Game"}
        </CreateGameButton>
        {showCreateForm && (
          <CreateGameForm>
            <select value={age} onChange={(e) => setAge(e.target.value)}>
              {Array.from({ length: 14 }, (_, i) => i + 5).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="animals">Animals</option>
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="other">Other</option>
            </select>
            {subject === "other" && (
              <input
                type="text"
                placeholder="Enter custom subject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
              />
            )}
            <button onClick={handleCreateGame} disabled={isProcessing}>Generate Game</button>
          </CreateGameForm>
        )}
      </CenteredRow>
      {Array.isArray(roomsInitialData) &&
        (Array.isArray(roomsInitialData[0])
          ? roomsInitialData
          : [roomsInitialData]
        ).map((roomSet, index) => (
          <div key={`room-set-${index}`} className="room-set-row">
            <RoomsList userName={userName} roomsInitialData={roomSet} refreshRooms={refreshRooms} />
          </div>
        ))}
    </div>
  );
};

export default RoomsContainer;