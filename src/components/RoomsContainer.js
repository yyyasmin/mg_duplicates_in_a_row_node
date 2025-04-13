import React from 'react';
import RoomsList from './RoomsList'; // Import the existing RoomsList component

const RoomsContainer = ({ userName, roomsInitialData }) => {
  // Log the roomsInitialData just for debugging purposes
  console.log("IN RoomsContainer -- roomsInitialData:", roomsInitialData);

  // Assuming that roomsInitialData is an array of roomSets (arrays of rooms)
  return (
    <div>
      {/* If roomsInitialData is an array, iterate through each roomSet */}
      {Array.isArray(roomsInitialData) && roomsInitialData.map((roomSet, index) => {
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
