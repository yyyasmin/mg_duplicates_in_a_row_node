// NameForm.js

import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { CHOSEN_FLASK_URL } from "../helpers/ServerRoutes";
import SignupForm from "./SignupForm"; // ✅ Import SignupForm component
import {
  FormGroup,
  NameInput,
  SubmitButtonWrapper,
  SubmitButton,
} from "./FormStyles";

const NameFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2vw;
  font-weight: 700;
`;

const ToggleModeButton = styled.button`
  margin-top: 1vw;
  font-size: 1.2vw;
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #004a99;
  }
`;

function NameForm({ setUserName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        const flaskSignupUrl = `${CHOSEN_FLASK_URL}/auth/signup`;
        const signupRes = await fetch(flaskSignupUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: email.split("@")[0],
            password,
            super_user_code: "wearethechampions",
          }),
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) {
          alert(signupData.error || "Signup failed");
          return;
        }
        setUserName(email.split("@")[0]);
      } else {
        const flaskLoginUrl = `${CHOSEN_FLASK_URL}/auth/login`;
        const loginRes = await fetch(flaskLoginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
          alert(loginData.error || "Login failed");
          setMode("signup");
          return;
        }
        setUserName(loginData.name || email.split("@")[0]);
      }

      navigate("/name");
    } catch (error) {
      console.error("Auth error:", error);
      alert("Something went wrong");
      setMode("signup");
    }
  };

  return (
    <NameFormContainer>
      <h2>{mode === "login" ? "Login" : "Sign Up"}</h2>

      {/* ✅ Render SignupForm component if mode is "signup" */}
      {mode === "signup" ? (
        <SignupForm setUserName={setUserName} />
      ) : (
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <NameInput
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <NameInput
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>

          <SubmitButtonWrapper>
            <SubmitButton type="submit">
              {mode === "login" ? "Login" : "Sign Up"}
            </SubmitButton>
          </SubmitButtonWrapper>
        </form>
      )}

      <ToggleModeButton onClick={() => setMode(mode === "login" ? "signup" : "login")}>
        {mode === "login"
          ? "Don't have an account? Sign up here"
          : "Already have an account? Log in"}
      </ToggleModeButton>
    </NameFormContainer>
  );
}

export default NameForm;
