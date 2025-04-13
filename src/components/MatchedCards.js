import React, { useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: ${(props) => props.cardWidth}px;
  height: ${(props) => props.cardHeight}px;
  margin: 2vw;
`;

const CardFrame = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: snow;
  border-radius: 25px;
  border: 1vw solid brown;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 25px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TextContainer = styled.div`
  width: 100%;
  height: 30%;
  padding: 2%;
  box-sizing: border-box;
  border: 1vw solid #fad5a5;
  color: black;
  text-align: center;
`;

const PlayerName = styled.div`
  font-weight: bold;
`;

const CardText = styled.div`
  font-size: 2vw;
`;

const ToggleButton = styled.button`
  margin-bottom: 2vw;
  display: block;
  width: 150px;
  height: 50px;
  font-size: 1.2rem;
  background-color: transparent;
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 0 auto; /* Center horizontally */

  &:hover {
    background-color: #f0f0f0;
  }
`;

const MatchedCards = ({ cardWidth, cardHeight, card, players, index }) => {
  const [language, setLanguage] = useState("hebrew");

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === "hebrew" ? "english" : "hebrew"));
  };

  const toggleButtonText = language === "hebrew" ? "Switch to English" : "החלף לעברית";

  const currentPlayer = players.find((player) => player.isActive);
  const opponentPlayer = players.find((player) => !player.isActive);
  const playerName = index === 0 ? opponentPlayer.name : currentPlayer.name;

  const currentText =
    language === "hebrew" ? (index === 0 ? card.text1 : card.text2) : (index === 0 ? card.text3 : card.text4);

  return (
    <CardContainer cardWidth={cardWidth} cardHeight={cardHeight}>
      <CardFrame>
        <ToggleButton onClick={toggleLanguage}>{toggleButtonText}</ToggleButton>
        <ImageWrapper>
          <Image src={card.imageImportName} alt={card.imageImportName} />
        </ImageWrapper>
        <TextContainer>
          <PlayerName>{playerName}</PlayerName>
          <CardText>{currentText}</CardText>
        </TextContainer>
      </CardFrame>
    </CardContainer>
  );
};

export default MatchedCards;
