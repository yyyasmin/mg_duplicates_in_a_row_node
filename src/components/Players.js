import React from "react";
import styled from "styled-components";

const PlayersContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  margin-bottom: 0.3rem;
  margin-top: 0.00rem;
`;

const Player = styled.div`
  margin-bottom: 0.5rem;
  font-size: calc(0.8rem + 0.5rem);
  color: ${(props) => (props.isPlayersTurn ? "brown" : "lightbrown")};
`;

const PlayerName = styled.span`
  font-size: calc(0.8rem + 0.5vw);
  color: #808000;
`;

const BoldPlayerName = styled(PlayerName)`
  font-weight: bold;
`;

const Turn = styled.div`
  margin-left: 0.5vw;
  font-size: calc(0.8rem + 0.5vw);
  color: #808000;
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center; /* Center items vertically */
`;

// Adjusted styling for the "PLAYERS" label
const PlayersLabel = styled.span`
  font-size: 0.9rem;
  font-weight: bold; /* Make the label bold */
  margin-right: 0.5rem; /* Add some space between the label and the player names */
`;

const Players = ({ maxMembers = 2, players = [], playerName }) => {
  const currentPlayerIndex = players.findIndex((player) => player.name === playerName);
  const activePlayer = players.find((player) => player.isActive);

  return (
    <PlayersContainer>
      <Player>
        <PlayerInfo>
          <PlayersLabel>PLAYERS:</PlayersLabel> {/* Bold label for "PLAYERS" */}
          {players.map((player, index) => (
            <React.Fragment key={index}>
              <PlayerName>
                {index === currentPlayerIndex ? `${player.name}(you)` : player.name}
              </PlayerName>
              &nbsp;
            </React.Fragment>
          ))}
          {players.length < maxMembers && (
            <>
              &nbsp;
              <PlayerName>
                Waiting for another player to join the game...
              </PlayerName>
            </>
          )}
        </PlayerInfo>
        {activePlayer && (
          <Turn>
            IT'S{" "}
            <BoldPlayerName>
              {activePlayer.name === playerName ? `${activePlayer.name}(your)` : activePlayer.name}
            </BoldPlayerName>'S TURN
          </Turn>
        )}
      </Player>
    </PlayersContainer>
  );
};

export default Players;
