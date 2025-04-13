import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NameFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2vw;
  font-weight: 700;
`;

const NameInput = styled.input`
  font-size: 2vw;
  font-weight: 600;
`;

const SubmitButton = styled.button`
  background-color: #fbbe01;
  color: #000;
  text-transform: uppercase;
  font-size: 2vw;
  font-weight: 600;
  border: 3px solid transparent;
  outline: none;
  cursor: pointer;
  transition: all 290ms ease-in-out;
  border-radius: 8px;

  &:hover {
    background-color: transparent;
    color: #fff;
    border: 3px solid #fbbe01;
  }
`;

function NameForm({ setUserName }) {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserName(name);
    navigate("/rooms");
  };

  return (
    <NameFormContainer>
      <h2>Enter your username:</h2>
      <form onSubmit={handleSubmit}>
        <NameInput
          type="text"
          placeholder="Your Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </NameFormContainer>
  );
}

export default NameForm;
