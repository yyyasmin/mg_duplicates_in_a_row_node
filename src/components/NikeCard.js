import styled from "styled-components";
import ReactCardFlip from "react-card-flip";

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
  

  // Removed unused state variables logoSize and cardImageSize

  // DUMMY CMDS - TO AVOID NOT USED VARS BUG IN NETIFLY
  console.log("IN NikeCard -- card: ", card)


  const handleCardClick = () => {
    if (toggleCardFlip != null) {
      toggleCardFlip(card.id);
    }
  };

  return (
    <ReactCardFlip isFlipped={faceType === "back"}>
      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
<CardImage src={card.imagePath1} alt={card.name}/>
      </CardContainer>

      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src="/logo.PNG" alt={card.name} />
      </CardContainer>
    </ReactCardFlip>
  );
};

export default NikeCard;
