import React, { useState } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import logo from "../assets/textures/logo.PNG";

const computeBorderColor = (frameColor) => {
  return `border: 0.625rem solid ${frameColor};`; // Converted border width to rem
};


const CardContainer = styled.div`
  cursor: grab;
  position: relative;
  border-radius: 1.5625rem;
  width: ${({ cardSize }) => cardSize.card.width}; /* Set the width */
  height: ${({ cardSize }) => cardSize.card.height}; /* Set the height */
  ${({ frameColor }) => computeBorderColor(frameColor)}
  box-sizing: border-box;
`;


const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1.5625rem; // Converted border radius to rem
  object-fit: cover; /* Maintain aspect ratio and cover entire container */
  object-position: center; /* Ensure image is centered within container */
`;

const NikeCard = (props) => {
  const { card, cardSize, faceType, frameColor, toggleCardFlip } = props;

  const [logoSize, setlogoSize] = useState({ width: 0, height: 0 });
  const [cardImageSize, setCardImageSize] = useState({ width: 0, height: 0 });
  
  // DUMMY CMDS - TO AVOID NOT USED VARS BUG
  //console.log("IN NickCard --  logoSize: ", logoSize)
  //console.log("IN NickCard --  cardImageSize: ", cardImageSize)

  const handleCardClick = () => {
    if (toggleCardFlip != null) {
      toggleCardFlip(card.id);
    }
  };

  const handleImageLoad = (e, type) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (type === "logo") {
      setlogoSize({ width: naturalWidth, height: naturalHeight });
    } else {
      setCardImageSize({ width: naturalWidth, height: naturalHeight });
    }
  };

  return (
    <ReactCardFlip isFlipped={faceType === "back"}>
      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={card.imageImportName} alt={card.name} onLoad={(e) => handleImageLoad(e, "card")} />
      </CardContainer>

      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={logo} alt={card.name} onLoad={(e) => handleImageLoad(e, "logo")} />
      </CardContainer>
    </ReactCardFlip>
  );
};

export default NikeCard;
