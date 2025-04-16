import React from "react";
import styled from "styled-components";
import RoomsList from "./RoomsList"; // Import the existing RoomsList component

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

const RoomsContainer = ({ userName, roomsInitialData }) => {
  // Log the roomsInitialData just for debugging purposes
  console.log("IN RoomsContainer -- roomsInitialData:", roomsInitialData);

  return (
    <div>
      {/* Display the greeting message if userName is available */}
      {userName && <Greeting>Hello, {userName}!</Greeting>}

      {/* If roomsInitialData is an array, iterate through each roomSet */}
      {Array.isArray(roomsInitialData) &&
        roomsInitialData.map((roomSet, index) => {
          console.log("IN RoomsContainer -- roomSet:", roomSet); // Debugging each roomSet

          return (
            <div key={`room-set-${index}`} className="room-set-row">
              {/* Pass each roomSet to RoomsList as a prop */}
              <RoomsList userName={userName} roomsInitialData={roomSet} />
            </div>
          );
        })}
    </div>
  );
};

export default RoomsContainer;
