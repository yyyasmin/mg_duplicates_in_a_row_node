import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CHOSEN_FLASK_URL } from "../helpers/ServerRoutes";

const FormContainer = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
`;

function LoginForm({ setUserName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${CHOSEN_FLASK_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token, userName } = await res.json();
	  console.log("IN handleLogin -- server returned -- userName: ", userName)

        localStorage.setItem("token", token);
        setUserName(userName);
		navigate("/rooms")
        
      } else {
        setError("Invalid login credentials, please try again.");
      }
    } catch (error) {
      console.error("Login error", error);
      setError("There was an error logging in. Please try again.");
    }
  };

  return (
    <FormContainer>
      <h2>Login</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Button onClick={handleLogin}>Login</Button>
      <p>Don't have an account? <a href="/signup">Sign up here</a></p>
    </FormContainer>
  );
}

export default LoginForm;
