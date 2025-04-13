import React from "react";
import styled from "styled-components";

const ReturnButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fdf2e9;
  color: #fad5a5;
  
  padding: 0.5rem; /* Converted padding to rem */
`;

const MsgAndButtonContainer = styled.div`
  display: flex; /* Updated to display horizontally */
  align-items: center;
  margin-bottom: 0.3125rem; /* Reduced the vertical gap and converted to rem */
`;

const ReturnButton = styled.button`
  background-color: #fad5a5;
  color: #808000;
  border: none;
  border-radius: 1rem; /* Converted border-radius to rem */
  cursor: pointer;
  box-shadow: 0.5rem 0.5rem 0 0 rgba(0, 0, 0, 0.5); /* Used rem for box-shadow to make it responsive */
  transition: transform 0.2s;
  font-size: 1.5rem; /* Reduced font size */
  font-weight: bold;
  padding: 1rem 2rem; /* Reduced padding */
  margin-bottom: 0; /* Removed margin-bottom */
 `;

const TougleMatchedCardButton = (props) => {
  let { isMatched, setIsMatched, setClearFlippedCards } = props;

  return (
    <ReturnButtonContainer>
      {!isMatched && (
        <MsgAndButtonContainer>
          <ReturnButton
            onClick={() => {
              setIsMatched(!isMatched);
              setClearFlippedCards(true);
            }}
          >
            Keep going!
          </ReturnButton>
        </MsgAndButtonContainer>
      )}
      {isMatched && (
        <MsgAndButtonContainer>
          <ReturnButton
            onClick={() => {
              setClearFlippedCards(true);
            }}
          >
            Back to game board
          </ReturnButton>
        </MsgAndButtonContainer>
      )}
    </ReturnButtonContainer>
  );
};

export default TougleMatchedCardButton;
