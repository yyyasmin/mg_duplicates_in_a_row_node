import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NameForm from "./components/NameForm";
import RoomsContainer from "./components/RoomsContainer"; // Import the RoomsContainer instead of RoomsList
import Game from "./components/Game";
import { initRoomsFunc } from "./helpers/init";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh; /* Changed height to min-height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: snow;
`;

function App() {
  const [userName, setUserName] = useState("");
  const [roomsInitialData, setRoomsInitialData] = useState(null);
  const [dataIsSet, setDataIsSet] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const initRoomsObj = await initRoomsFunc();
        setRoomsInitialData(initRoomsObj);
      } catch (error) {
        console.error("Error initializing the app:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (roomsInitialData) {
	  console.log("IN APP -- roomsInitialData: ", roomsInitialData)
      setDataIsSet(true);
    }
  }, [roomsInitialData]);

  return (
    <Router>
      <AppContainer>
        <Routes>
          {dataIsSet ? (
            <Route
              path="/rooms"
              element={<RoomsContainer userName={userName} roomsInitialData={roomsInitialData} />}
            />
          ) : null}
          <Route path="/name" element={<NameForm setUserName={setUserName} />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="" element={<NameForm setUserName={setUserName} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
