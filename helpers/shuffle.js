const pickRandom8cards = (cardsArr, importPathArr) => {
    const shuffledcardsArr = [...cardsArr]; // Create a copy of the original cardsArr to avoid modifying it directly
    const shuffledimportPathArr = [...importPathArr]; // Create a copy of the original importPathArr to avoid modifying it directly

    for (let i = shuffledcardsArr.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and randomIndex
        [shuffledcardsArr[i], shuffledcardsArr[randomIndex]] = [shuffledcardsArr[randomIndex], shuffledcardsArr[i]];
        [shuffledimportPathArr[i], shuffledimportPathArr[randomIndex]] = [shuffledimportPathArr[randomIndex], shuffledimportPathArr[i]];
    }

    for (let i = 0; i < shuffledcardsArr.length; i++) {
        shuffledcardsArr[i].id = i;
        shuffledimportPathArr[i].id = i;
    }

    return { shuffledcardsArr, shuffledimportPathArr };
};

const shuffle = (array) => {
    const shuffledArray = [...array]; // Create a copy of the original array to avoid modifying it directly

    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements at i and randomIndex
        [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }

    for (let i = 0; i < shuffledArray.length; i++) {
        shuffledArray[i].id = i;
    }

    return shuffledArray;
};

module.exports = { pickRandom8cards, shuffle };
