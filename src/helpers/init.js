
import { CHOSEN_NODE_URL } from "./ServerRoutes.js";

export const ROOMS_PER_GAME = 7;

async function fetchActiveRooms(rooms) {
  const roomPlayersData = rooms.flat().map((room) => {
    return {
      id: room.id,
    };
  });

  try {
    const server_url = `${CHOSEN_NODE_URL}/api/activeRooms`;
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
    return null;
  }
}

const fetchDataFromJSON = async (jsonURL) => {
  console.log("IN fetchDataFromJSON -- jsonURL: ", jsonURL);
  try {
    const response = await fetch(jsonURL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch JSON:", err);
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

async function createShuffledCardsArr(gameName) {
  try {
    const response = await fetch(`/GameCards/${gameName}/${gameName}.json`);
    if (!response.ok) throw new Error("Could not load game JSON");

    const data = await response.json();
    const cards = data.gameCards;

    if (!Array.isArray(cards) || cards.length < 8) {
      throw new Error("Insufficient cards to form 8 pairs.");
    }

    const selectedCards = cards.slice(0, 8);

    const pairedCards = selectedCards.flatMap((card) => [
      { ...card },
      { ...card },
    ]);

    const shuffled = pairedCards.sort(() => 0.5 - Math.random());

    const withIds = shuffled.map((card, index) => ({
      ...card,
      //id: index + 1,
      id: index,
    }));
	console.log("IN createShuffledCardsArr -- withIds: ", withIds)
    return withIds;
  } catch (error) {
    console.error("Error loading or processing cards:", error);
    return [];
  }
}


const initCardsInRoomsFromJson = async (rooms) => {
  const processedRooms = [];
  const groupedRoomsArr = [];
  let cardsData = [];
  for (const room of rooms) {
console.log("IN initCardsInRoomsFromJson -- room: ", room)

    const indexInGroup = processedRooms.length % ROOMS_PER_GAME;
	
	cardsData = await createShuffledCardsArr(room.gameName)
console.log("IN initCardsInRoomsFromJson -- shuffledcardsData: ", cardsData)
	
    if (indexInGroup === 0) {
      processedRooms.push(room);
    } else {
		
console.log("cardsData", cardsData)
	  if (cardsData && cardsData!=[])  {
		  const processedRoom = {
			...room,
			cardsData: cardsData
		  };
          processedRooms.push(processedRoom);
	      console.log("processedRoom: ", processedRoom)
	  }
	}
    if (processedRooms.length === ROOMS_PER_GAME) {
      groupedRoomsArr.push([...processedRooms]);
      processedRooms.length = 0;
    }
  }

  console.log("groupedRoomsArr: ", groupedRoomsArr);
  return groupedRoomsArr;
};


const initRoomsFromJson = async () => {
  const jsonURL = `/rooms.json`; // <-- Now fetches from public/rooms.json
  const roomsData = await fetchDataFromJSON(jsonURL);

  if (roomsData) {
    let newRooms = [];
    roomsData.forEach((room) => {
      for (let i = 0; i < ROOMS_PER_GAME; i++) {
        newRooms.push({
          ...room,
          id: `${room.id}-${i}`,
          roomURL: `${CHOSEN_NODE_URL}/room/${room.id}-${i}`,
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
console.log("initialRooms: ", initialRooms)
  const allRooms = await initCardsInRoomsFromJson(initialRooms);
console.log("allRooms: ", allRooms)

  const activeRooms = await fetchActiveRooms(allRooms);
  const flatActiveRooms = activeRooms.flat();
  const updatedRooms = allRooms.map(roomArray => {
    const updatedRoomArray = roomArray.map(room => {
      const activeRoom = flatActiveRooms.find(activeRoom => activeRoom.id === room.id);
      return {
        ...room,
        currentPlayers: activeRoom?.currentPlayers || [],
      };
    });
    return updatedRoomArray;
  });
  return updatedRooms;
};
