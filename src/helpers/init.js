//mport { knowYourFriend, knowYourFriendBg } from "./GameCards/knowYourFriend.js";
import { knowYourFriend } from "./GameCards/knowYourFriend.js";
//import { getToKnowYourGameMate, getToKnowYourGameMateBg } from "./GameCards/getToKnowYourGameMate.js";
import { getToKnowYourGameMate } from "./GameCards/getToKnowYourGameMate.js";
//import { pesachQuestions, pesachQuestionsBg } from "./GameCards/pesachQuestions.js";
import { pesachQuestions } from "./GameCards/pesachQuestions.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { pickRandom8cards, shuffle } from "./shuffle";
//import isEmpty from "./isEmpty";

const ROOMS_PER_GAME = 8;

async function fetchActiveRooms(rooms) {
  const roomPlayersData = rooms.flat().map((room) => {
    return {
      id: room.id,
    };
  });

  try {
    const server_url = `${CHOSEN_PROXY_URL}/api/activeRooms`;
    const response = await fetch(server_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rooms: roomPlayersData })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const roomFullData = rooms.map((roomArray) => {
      return roomArray.map((room) => {
        const matchingRoomData = data.find((roomData) => roomData.id === room.id);	  
        if (matchingRoomData) {
          return {
            ...room,
            currentPlayers: matchingRoomData.currentPlayers || [],
          };
        }
        return {
          ...room,
          currentPlayers: [],
        };
      });
    });
    return roomFullData;

  } catch (error) {
    console.error("Error fetching active rooms:", error);
    return null;
  }
}

const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const getInitialGallerySize = () => {
  const TITLE_SIZE = 2.5;
  const screenRemHeight = window.innerHeight / 16;
  const cardsContainerHeightRem = screenRemHeight - TITLE_SIZE;
  const cardsContainerWidthRem = cardsContainerHeightRem;

  return { cardsContainerWidthRem, cardsContainerHeightRem };
};

export const calculateCardSize = (cardsNum) => {
  const { cardsContainerWidthRem, cardsContainerHeightRem } = getInitialGallerySize();
  let cols, rows;

  switch (cardsNum) {
    case 2:
      cols = 2;
      rows = 1;
      break;
    case 16:
      cols = 4;
      rows = 4;
      break;
    default:
      cols = 4;
      rows = 4;
  }

  if (cardsContainerHeightRem > cardsContainerWidthRem) {
    let tmpCols = cols;
    cols = rows;
    rows = tmpCols;
  }

  let cardAndGapHeight = cardsContainerHeightRem / (rows * 1.1);
  let cardHeight = cardAndGapHeight * 0.95;
  const gapHeight = cardAndGapHeight * 0.1;
  const gapWidth = gapHeight;
  const cardWidth = cardHeight;

  return {
    containerWidth: `${cardsContainerHeightRem}rem`,
    containerHeight: `${cardsContainerHeightRem}rem`,
    card: { width: `${cardWidth}rem`, height: `${cardHeight}rem` },
    gap: { width: `${gapWidth}rem`, height: `${gapHeight}rem` },
  };
};


const initCardsInRoom = async (room, importPaths, backgroundImages) => {
  const backgroundImage = backgroundImages[room.gameName] || null;
  const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
  console.log("jsonURL: ", jsonURL)
  const cardsData = await fetchDataFromJSON(jsonURL);

  if (!cardsData || !Array.isArray(cardsData.gameCards) || cardsData.gameCards.length === 0) {
    return room;
  }

  const gameCardsRaw = cardsData.gameCards;
  const arraysObj = pickRandom8cards([...gameCardsRaw], [...importPaths[room.gameName]]);

  const gameCards = arraysObj.shuffledcardsArr.slice(0, 8);
  const importArr = arraysObj.shuffledimportPathArr.slice(0, 8);

  if (!importArr || importArr.length === 0) {
    return room;
  }

  const gameCards1 = gameCards.map((card, index) => ({
    ...card,
    imageImportName: importArr[index][0] || undefined,
  }));

  const gameCards2 = gameCards.map((card, index) => ({
    ...card,
    imageImportName: importArr[index][1] || undefined,
  }));

  const shuffledGameCards = shuffle(gameCards1.concat(gameCards2));

  return {
    ...room,
    cardsData: shuffledGameCards,
    cardSize: calculateCardSize(shuffledGameCards.length),
    MatchedCardSize: calculateCardSize(2),
    backgroundImage: backgroundImage,
  };
};

const initCardsInRoomsFromJson = async (rooms) => {
  const importPaths = {
    knowYourFriend: knowYourFriend.slice(1),
    getToKnowYourGameMate: getToKnowYourGameMate.slice(1),
    pesachQuestions: pesachQuestions.slice(1),
  };

  const backgroundImages = {
    knowYourFriend: knowYourFriend[0],
    getToKnowYourGameMate: getToKnowYourGameMate[0],
    pesachQuestions: pesachQuestions[0],
  };

  const processedRooms = [];
  const groupedRoomsArr = []
  for (const room of rooms) {
    const processedRoom = await initCardsInRoom(room, importPaths, backgroundImages);
    processedRooms.push(processedRoom);
	if (processedRooms.length === ROOMS_PER_GAME) {
		groupedRoomsArr.push([...processedRooms]);  // 
		processedRooms.length = 0;
   }
  }
  return groupedRoomsArr;
};


const initRoomsFromJson = async () => {
  const jsonURL = `${CHOSEN_PROXY_URL}/database/rooms.json`;
  const roomsData = await fetchDataFromJSON(jsonURL);
  if (roomsData) {
    let newRooms = [];

    roomsData.forEach((room) => {
      for (let i = 1; i <= ROOMS_PER_GAME; i++) {
        newRooms.push({
          ...room,
          id: `${room.id}-${i}`,
          roomURL: `${CHOSEN_PROXY_URL}/room/${room.id}-${i}`,
          cardsData: [],
        });
      }
    });
    return newRooms;
  }
  return [];
};


export const initRoomsFunc = async () => {
  const initialRooms = await initRoomsFromJson();
  const allRooms = await initCardsInRoomsFromJson(initialRooms);
  const activeRooms = await fetchActiveRooms(allRooms);
  const flatActiveRooms = activeRooms.flat();
  const updatedRooms = allRooms.map(roomArray => {
    const updatedRoomArray = roomArray.map(room => {
      const activeRoom = flatActiveRooms.find(activeRoom => activeRoom.id === room.id);
      console.log("FOUND MATCHING ROOM ID:", room.id, activeRoom, activeRoom?.currentPlayers || []);
      return {
        ...room,
        currentPlayers: activeRoom?.currentPlayers || [],
      };
    });
    return updatedRoomArray;
  });
  return updatedRooms;
};
