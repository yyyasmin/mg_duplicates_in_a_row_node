import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
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
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [roomsInitialData, setRoomsInitialData] = useState(null);
  const [dataIsSet, setDataIsSet] = useState(false);

  const refreshRooms = useCallback(async () => {
    ////console.log("🔍 App.js: refreshRooms called");
    ////console.log("🔍 App.js: refreshRooms - current userName:", userName);
    ////console.log("🔍 App.js: refreshRooms - current dataIsSet:", dataIsSet);
    
    try {
      ////console.log("🔍 App.js: refreshRooms - calling initRoomsFunc...");
      const initRoomsObj = await initRoomsFunc();
      ////console.log("✅ App.js: refreshRooms - initRoomsFunc completed successfully:", initRoomsObj);
      setRoomsInitialData(initRoomsObj);
      ////console.log("✅ App.js: refreshRooms - setRoomsInitialData called");
    } catch (error) {
      console.error("❌ App.js: refreshRooms - Error refreshing rooms:", error);
      console.error("❌ App.js: refreshRooms - Full error object:", error);
      // Don't re-throw - just log the error
    }
  }, []);

  useEffect(() => {
    ////console.log("🔍 App.js: userName changed to:", userName);
    if (userName) {
      ////console.log("🔍 App.js: userName is set, starting initRoomsFunc...");
      const init = async () => {
        try {
          const initRoomsObj = await initRoomsFunc();
          ////console.log("✅ App.js: initRoomsFunc completed successfully:", initRoomsObj);
          setRoomsInitialData(initRoomsObj);
        } catch (error) {
          console.error("❌ App.js: Error initializing the app:", error);
        }
      };
      init();
    }
  }, [userName]);

  useEffect(() => {
    ////console.log("🔍 App.js: roomsInitialData changed to:", roomsInitialData);
    if (roomsInitialData) {
      ////console.log("✅ App.js: Setting dataIsSet to true");
      setDataIsSet(true);
    }
  }, [roomsInitialData]);

  useEffect(() => {
    ////console.log("🔍 App.js: dataIsSet changed to:", dataIsSet);
    ////console.log("🔍 App.js: roomsInitialData:", roomsInitialData);
  }, [dataIsSet, roomsInitialData]);

  // Navigation logic for /rooms
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const isOnAllowedPage =
      location.pathname === "/rooms" ||
      location.pathname === "/login" ||
      location.pathname === "/signup" ||
      /^\/game\/[^/]+$/.test(location.pathname);
    console.log("11-11-13 -- App.js -- useEffect[navigation] -- isOnAllowedPage:", isOnAllowedPage, "dataIsSet:", dataIsSet, "userName:", userName, "location.pathname:", location.pathname);
    if (!isLoading) {
      if (!userName && location.pathname !== "/login") {
        alert("No valid logged-in user found. Please log in.");
        navigate("/login");
      } else if (userName && dataIsSet && location.pathname === "/") {
        navigate("/rooms");
      }
    }
  }, [dataIsSet, location, navigate, isLoading, userName]);

  // Set loading to false after initial check
  useEffect(() => {
    setIsLoading(false);
  }, []);

  ////console.log("App rendered");
  window.addEventListener('beforeunload', () => {
    ////console.log('PAGE IS RELOADING OR NAVIGATING AWAY');
  });

  return (
    <AppContainer>
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <Routes>
          {dataIsSet ? (
            <Route
              path="/rooms"
              element={<RoomsContainer userName={userName} roomsInitialData={roomsInitialData} refreshRooms={refreshRooms} />}
            />
          ) : null}
          <Route path="/login" element={<LoginForm setUserName={setUserName} />} />
          <Route path="/signup" element={<SignupForm setUserName={setUserName} />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="/" element={<LoginForm setUserName={setUserName} />} />
        </Routes>
      )}
    </AppContainer>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
