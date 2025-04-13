import React from 'react';
import GameCard from './GameCard';
import { Section, SectionTitle, SectionSubTitle, GameCardContainer } from './LandingPageStyles';
import styled from 'styled-components';

export const GSection = styled.section`
  align-items: center;
  text-align: center;
  margin-bottom: 70px;
`;

import gameImage1 from './about_active_litening.JPG';
import gameImage2 from './get_to_know.JPG';
import gameImage3 from './share_and_listen.JPG';
import gameImage4 from './relax_with_midnfullness.JPG';

const games = [
  {
    imageUrl: gameImage1,
    title: 'Active Listening Adventure',
    description: 'What is Active listening and how it relates to communication skills - Play to find out',
    playUrl: 'https://main--ng-about.netlify.app',
  },
  {
    imageUrl: gameImage2,
    title: 'Get to Know Each Other Challenge',
    description: 'Promote getting to know each other while having fun, and collaboration with diadic memory tasks.',
    playUrl: 'https://main--mg-any-subject.netlify.app/',
  },
  {
    imageUrl: gameImage3,
    title: 'Sharing and Listening Challenge',
    description: 'Promote sharing, listening while having fun, and collaboration with diadic memory tasks.',
    playUrl: 'https://main--know-better-1.netlify.app/',
  },
  {
    imageUrl: gameImage4,
    title: 'Mindfulness',
    description: 'Promote calm and relaxed mode of well being using mindfulness diadic memory tasks.',
    playUrl: 'https://main--mg-mindfulness.netlify.app',
  },
];

const FeaturedGamesSection = () => {
  return (
    <GSection>
      <SectionTitle>Explore Our Memory Match Games</SectionTitle>
      <SectionSubTitle>
        Enhance communication skills with engaging memory games tailored for specific goals.
      </SectionSubTitle>
      <GameCardContainer>
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            SectionSubTitle={game.description}
            imageUrl={game.imageUrl}
            playUrl={game.playUrl}
          />
        ))}
      </GameCardContainer>
    </GSection>
  );
};

export default FeaturedGamesSection;
