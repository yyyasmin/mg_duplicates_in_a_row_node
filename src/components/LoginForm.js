// src/components/LoginForm.js
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

function LoginForm({ setUserEmail }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }
    try {
console.log("CHOSEN_FLASK_URL: ", `${CHOSEN_FLASK_URL}/auth/signup`)
      const res = await fetch(`${CHOSEN_FLASK_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserEmail(data.email);
        navigate("/rooms");
      } else {
        setError(data.error || "There was a problem saving your email. Please try again.");
      }
    } catch (error) {
      console.error("Error saving email", error);
      setError("There was an error. Please try again.");
    }
  };

  return (
    <FormContainer>
      <h2>Enter Email</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Button onClick={handleSubmit}>Continue</Button>
    </FormContainer>
  );
}

export default LoginForm;
