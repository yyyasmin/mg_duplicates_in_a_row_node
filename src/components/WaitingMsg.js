import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2vw; /* Used vw for padding to make it responsive */
`;

const MsgContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2vw; /* Used vw for gap to make it responsive */
  justify-content: center;
  margin-bottom: 1vw; /* Used vw for margin to make it responsive */
`;

const MsgSection = styled.div`
  font-size: 2vw; /* Used vw for font-size to make it responsive */
  text-align: center;
`;

const WaitingMsg = () => {
  return (
    <Container>
      <MsgContainer>
        <MsgSection>Waiting for another player to join the room...</MsgSection>
      </MsgContainer>
    </Container>
  );
};

export default WaitingMsg;
