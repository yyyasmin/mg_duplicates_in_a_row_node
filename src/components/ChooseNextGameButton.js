// components/ChooseNextGameButton.js
import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const ChooseButton = styled.button`
  background-color: #fad5a5;
  color: #808000;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: 0.5rem 0.5rem 0 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.2s;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem 2rem;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChooseNextGameButton = () => {
  const navigate = useNavigate();

  return (
    <ButtonContainer>
      <ChooseButton onClick={() => navigate("/rooms")}>
        Choose Your Next Game
      </ChooseButton>
    </ButtonContainer>
  );
};

export default ChooseNextGameButton;
