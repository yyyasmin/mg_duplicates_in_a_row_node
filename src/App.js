import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import RoomsContainer from "./components/RoomsContainer";
import Game from "./components/Game";
import { initRoomsFunc } from "./helpers/init";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
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
	  if (userName) {
		const init = async () => {
		  try {
			const initRoomsObj = await initRoomsFunc();
			setRoomsInitialData(initRoomsObj);
		  } catch (error) {
			console.error("Error initializing the app:", error);
		  }
		};
		init();
	  }
	}, [userName]);


  useEffect(() => {
    if (roomsInitialData) {
      console.log("IN APP -- roomsInitialData: ", roomsInitialData);
      setDataIsSet(true);
    }
  }, [roomsInitialData]);
  
  useEffect(() => {
	console.log("dataIsSet:", dataIsSet); // Log the value of dataIsSet
  }, [dataIsSet]);

  return (
    <Router>
      <AppContainer>
        <Routes>
          {/* **Change**: Only load the /rooms route after login success */}
          {dataIsSet ? (
            <Route
              path="/rooms"
              element={<RoomsContainer userName={userName} roomsInitialData={roomsInitialData} />}
            />
          ) : null}

          {/* **Change**: Default route set to login */}
          <Route path="/login" element={<LoginForm setUserName={setUserName} />} />
          
          <Route path="/signup" element={<SignupForm setUserName={setUserName} />} />
          
          <Route path="/game/:roomId" element={<Game />} />
          
          <Route path="/" element={<LoginForm setUserName={setUserName} />} />  {/* Default route */}
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
