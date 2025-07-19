import { CHOSEN_NODE_URL } from "./ServerRoutes.js";

export const ROOMS_PER_GAME = 7;

async function fetchActiveRooms(rooms) {
////console.log("🔍 fetchActiveRooms: Starting with rooms:", rooms);
  
  const roomPlayersData = rooms.flat().map((room) => {
    return {
      id: room.id,
    };
  });
////console.log("IN init.js -- fetchActiveRooms -- roomPlayersData:", roomPlayersData)

  try {
////console.log("IN init.js -- fetchActiveRooms -- CHOSEN_NODE_URL:", CHOSEN_NODE_URL)
    const server_url = `${CHOSEN_NODE_URL}/api/activeRooms`;
////console.log("IN init.js -- fetchActiveRooms -- server_url:", server_url)
    const response = await fetch(server_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rooms: roomPlayersData })
    });

////console.log("IN init.js -- fetchActiveRooms -- response:", response)

    if (!response.ok) {
      throw new Error(`fetchActiveRooms: HTTP error! Status: ${response.status}, StatusText: ${response.statusText}`);
    }

    const data = await response.json();
////console.log("IN init.js -- fetchActiveRooms -- data:", data)

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
////console.log("IN init.js -- fetchActiveRooms -- roomFullData:", roomFullData)
    
    return roomFullData;

  } catch (error) {
    //console.error("❌ fetchActiveRooms: CRITICAL ERROR -", error.message);
    //console.error("❌ fetchActiveRooms: Full error object:", error);
    throw new Error(`fetchActiveRooms: ${error.message}`);
  }
}

const fetchDataFromJSON = async (jsonURL) => {
//////console.log("IN init -- fetchDataFromJSON --jsonURL:", jsonURL)   
  try {
    const response = await fetch(jsonURL);
//////console.log("IN init -- fetchDataFromJSON --response:", response)   
    
    if (!response.ok) {
      throw new Error(`fetchDataFromJSON: HTTP error! Status: ${response.status}, StatusText: ${response.statusText}, URL: ${jsonURL}`);
    }
    
    const data = await response.json();
//////console.log("IN init -- fetchDataFromJSON --data:", data)   
    return data;
  } catch (err) {
    //console.error("❌ fetchDataFromJSON: CRITICAL ERROR -", err.message);
    //console.error("❌ fetchDataFromJSON: Full error object:", err);
    throw new Error(`fetchDataFromJSON: ${err.message}`);
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
    case 'closingSession':
      cols = 2;
      rows = 3;
      break;
    case 'food':
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
    const gameJsonUrl = `/GameCards/${gameName}/${gameName}.json`;
//////console.log("IN inint -- createShuffledCardsArr -- gameJsonUrl:", gameJsonUrl);
    
    const response = await fetch(gameJsonUrl);
//////console.log("IN inint -- createShuffledCardsArr -- response:", response);
    
    if (!response.ok) {
      throw new Error(`createShuffledCardsArr: Could not load game JSON. Status: ${response.status}, StatusText: ${response.statusText}, URL: ${gameJsonUrl}`);
    }

    const data = await response.json();
//////console.log("IN init -- createShuffledCardsArr -- data:", data);
    
    const cards = data.gameCards;
//////console.log("IN init -- createShuffledCardsArr -- cards:", cards);

    if (!Array.isArray(cards) || cards.length < 8) {
      throw new Error(`createShuffledCardsArr: Insufficient cards to form 8 pairs. cards: ${JSON.stringify(cards)}`);
    }

    const selectedCards = cards.slice(0, 8);
//////console.log("IN init -- createShuffledCardsArr -- selectedCards:", selectedCards);

    const pairedCards = selectedCards.flatMap((card) => [
      { ...card },
      { ...card },
    ]);
//////console.log("IN init -- createShuffledCardsArr -- pairedCards:", pairedCards);

    const shuffled = pairedCards.sort(() => 0.5 - Math.random());
//////console.log("IN init -- createShuffledCardsArr -- shuffled:", shuffled);

    const withIds = shuffled.map((card, index) => ({
      ...card,
      //id: index + 1,
      id: index,
    }));
    
//////console.log("IN init -- createShuffledCardsArr -- withIds:", withIds);
    return withIds;
  } catch (error) {
    //console.error("❌ createShuffledCardsArr: CRITICAL ERROR -", error.message);
    //console.error("❌ createShuffledCardsArr: Full error object:", error);
    throw new Error(`createShuffledCardsArr: ${error.message}`);
  }
}


const initCardsInRoomsFromJson = async (rooms) => {
  //////console.log("🔍 initCardsInRoomsFromJson: Starting with rooms:", rooms);
  
  const processedRooms = [];
  const groupedRoomsArr = [];
  let cardsData = [];
  
  for (const room of rooms) {
    //////console.log("🔍 initCardsInRoomsFromJson: Processing room:", room);

    const indexInGroup = processedRooms.length % ROOMS_PER_GAME;
    //////console.log("🔍 initCardsInRoomsFromJson: indexInGroup:", indexInGroup);
	
    cardsData = await createShuffledCardsArr(room.gameName);
    //////console.log("🔍 initCardsInRoomsFromJson: cardsData received for", room.gameName, "length:", cardsData?.length);
	
    if (indexInGroup === 0) {
      //////console.log("🔍 initCardsInRoomsFromJson: Adding room without cards (index 0):", room);
      processedRooms.push(room);
    } else {
      //////console.log("🔍 initCardsInRoomsFromJson: Processing room with cards (index > 0):", room);
      //////console.log("🔍 initCardsInRoomsFromJson: cardsData:", cardsData);
	  
      if (cardsData && cardsData.length > 0)  {
        const processedRoom = {
          ...room,
          cardsData: cardsData
        };
        //////console.log("🔍 initCardsInRoomsFromJson: Adding processedRoom with cards:", processedRoom);
        processedRooms.push(processedRoom);
      } else {
        throw new Error(`initCardsInRoomsFromJson: No cards data for room ${room.gameName}. cardsData: ${JSON.stringify(cardsData)}`);
      }
    }
    
    if (processedRooms.length === ROOMS_PER_GAME) {
      //////console.log("🔍 initCardsInRoomsFromJson: Group complete, adding to groupedRoomsArr:", processedRooms);
      groupedRoomsArr.push([...processedRooms]);
      processedRooms.length = 0;
    }
  }

  //////console.log("✅ initCardsInRoomsFromJson: Final groupedRoomsArr:", groupedRoomsArr);
  return groupedRoomsArr;
};


const initRoomsFromJson = async () => {
  const jsonURL = `/rooms.json`; // <-- Now fetches from public/rooms.json
////console.log("In init -- initRoomsFromJson -- jsonURL:", jsonURL)  
  
  const roomsData = await fetchDataFromJSON(jsonURL);
////console.log("In init -- initRoomsFromJson -- roomsData:", roomsData)  

  if (!roomsData || !Array.isArray(roomsData)) {
    throw new Error(`initRoomsFromJson: Invalid or missing roomsData from ${jsonURL}. roomsData: ${JSON.stringify(roomsData)}`);
  }
    
  // Check for duplicate gameNames
  const seen = new Set();
  for (const room of roomsData) {
    if (seen.has(room.gameName)) {
      throw new Error(`initRoomsFromJson: Duplicate gameName '${room.gameName}' found in ${jsonURL}`);
    }
    seen.add(room.gameName);
  }
    
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
  
////console.log("In init -- initRoomsFromJson -- newRooms:", newRooms)  
  return newRooms;
};


export const initRoomsFunc = async () => {
  try {
    
    const initialRooms = await initRoomsFromJson();
////console.log("IN init -- initRoomsFunc -- initialRooms:", initialRooms)    
    const allRooms = await initCardsInRoomsFromJson(initialRooms);
    //////console.log("✅ initRoomsFunc: allRooms with cards loaded successfully:", allRooms);
    
    const activeRooms = await fetchActiveRooms(allRooms);
////console.log("IN inint -- initRoomsFunc -- activeRooms:", activeRooms);
    
    if (!activeRooms || !Array.isArray(activeRooms)) {
      throw new Error(`initRoomsFunc: Server not available or invalid response from fetchActiveRooms. activeRooms: ${JSON.stringify(activeRooms)}`);
    }
    
    const flatActiveRooms = activeRooms.flat();
    //////console.log("✅ initRoomsFunc: flatActiveRooms created:", flatActiveRooms);
    
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
    
    //////console.log("✅ initRoomsFunc: Final updatedRooms created successfully:", updatedRooms);
    return updatedRooms;
    
  } catch (error) {
    //console.error("❌ initRoomsFunc: CRITICAL ERROR -", error.message);
    //console.error("❌ initRoomsFunc: Full error object:", error);
    throw new Error(`initRoomsFunc: ${error.message}`);
  }
};
