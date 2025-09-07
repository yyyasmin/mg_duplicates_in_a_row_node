// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./components/LoginForm";
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
  const [userEmail, setUserEmail] = useState(""); // ✅ only email needed
  const [roomsInitialData, setRoomsInitialData] = useState(null);
  const [dataIsSet, setDataIsSet] = useState(false);

  // Refresh rooms manually
  const refreshRooms = useCallback(async () => {
    try {
      const initRoomsObj = await initRoomsFunc();
      setRoomsInitialData(initRoomsObj);
    } catch (error) {
      console.error("❌ App.js: refreshRooms - Error refreshing rooms:", error);
    }
  }, []);

  // Load rooms when user logs in with email
  useEffect(() => {
    if (userEmail) {
      const init = async () => {
        try {
          const initRoomsObj = await initRoomsFunc();
          setRoomsInitialData(initRoomsObj);
        } catch (error) {
          console.error("❌ App.js: Error initializing the app:", error);
        }
      };
      init();
    }
  }, [userEmail]);

  // Mark data as ready
  useEffect(() => {
    if (roomsInitialData) {
      setDataIsSet(true);
    }
  }, [roomsInitialData]);

  // Navigation logic
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading) {
      const isOnAllowedPage =
        location.pathname === "/rooms" ||
        location.pathname === "/login" ||
        /^\/game\/[^/]+$/.test(location.pathname) ||
        location.pathname === "/";

      // ✅ force login if no email yet
      if (!userEmail && !["/login", "/"].includes(location.pathname)) {
        navigate("/login");
      }
      // ✅ redirect logged-in users with rooms data to /rooms
      else if (userEmail && dataIsSet && ["/", "/login"].includes(location.pathname)) {
        navigate("/rooms");
      }
      // Prevent "No routes matched" error by not pushing `/rooms` early
      else if (!isOnAllowedPage) {
        navigate("/login");
      }
    }
  }, [dataIsSet, location, navigate, isLoading, userEmail]);

  // End loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <AppContainer>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Loading...</h2>
        </div>
      ) : (
        <Routes>
          {dataIsSet && (
            <Route
              path="/rooms"
              element={
                <RoomsContainer
                  userEmail={userEmail}
                  roomsInitialData={roomsInitialData}
                  refreshRooms={refreshRooms}
                />
              }
            />
          )}
          <Route path="/login" element={<LoginForm setUserEmail={setUserEmail} />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="/" element={<LoginForm setUserEmail={setUserEmail} />} />
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
