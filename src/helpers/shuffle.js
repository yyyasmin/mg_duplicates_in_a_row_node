export const shuffle = (cardsArr, importPathArr) => {
  ////console.log("IN shuffle -- original cardsArr: ", cardsArr);
  ////console.log("IN shuffle -- original importPathArr: ", importPathArr);

  // Step 1: Shuffle the pairs in parallel
  const indices = [...Array(cardsArr.length).keys()];
  for (let i = indices.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[randomIndex]] = [indices[randomIndex], indices[i]];
  }

  // Step 2: Extract 8 random pairs based on shuffled indices
  const pairedCards = [];
  for (let i = 0; i < 8; i++) {
    const index = indices[i];
    const card = cardsArr[index];
    const importPair = importPathArr[index];

    const cardA = {
      ...card,
      text: card.text1,
      translatedText: card.text3,
      imagePath: importPair?.[0],
    };

    const cardB = {
      ...card,
      text: card.text2,
      translatedText: card.text4,
      imagePath: importPair?.[1],
    };

    pairedCards.push(cardA, cardB);
  }

  // Step 3: Shuffle the 16 cards individually
  for (let i = pairedCards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [pairedCards[i], pairedCards[randomIndex]] = [pairedCards[randomIndex], pairedCards[i]];
  }

  // Step 4: Assign unique IDs
  for (let i = 0; i < pairedCards.length; i++) {
    pairedCards[i].id = i;
  }

  ////console.log("IN shuffle -- final pairedCards: ", pairedCards);
  return pairedCards;
};
