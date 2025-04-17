import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CHOSEN_FLASK_URL } from "../helpers/ServerRoutes";

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const InputLabel = styled.label`
  display: block;
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const TextInput = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMsg = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const SuccessMsg = styled.p`
  color: green;
  font-size: 14px;
  margin-top: 10px;
`;

function SignupForm() {
  console.log("FORM RENDERED");

  //const [superUserCode, setSuperUserCode] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("IN handleSubmit");

    setError("");
    setSuccess(false);

    // if (!superUserCode.trim()) {
    //   setError("Superuser code is required.");
    //   return;
    // }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`${CHOSEN_FLASK_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //superUserCode,
          email,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Signup failed.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError("Network error.");
    }
  };

  return (
    <FormContainer>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>

        {/* <InputLabel htmlFor="superuser">Superuser Code:</InputLabel>
        <TextInput
          id="superuser"
          type="text"
          value={superUserCode}
          onChange={(e) => setSuperUserCode(e.target.value)}
        /> */}

        <InputLabel htmlFor="email">Email:</InputLabel>
        <TextInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputLabel htmlFor="username">Username:</InputLabel>
        <TextInput
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputLabel htmlFor="password">Password:</InputLabel>
        <TextInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <InputLabel htmlFor="confirmPassword">Confirm Password:</InputLabel>
        <TextInput
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>Signup successful! Redirecting...</SuccessMsg>}

        <SubmitButton type="submit">Signup</SubmitButton>
        
      </form>
    </FormContainer>
  );
}

export default SignupForm;
