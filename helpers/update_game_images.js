const fs = require('fs');
const path = require('path');

/**
 * Universal script to automatically detect game image files and update rooms.json
 * Works for ALL games with flexible extensions
 */

function findGameImage(gameName, imageBaseName = null) {
    const gameDir = path.join(__dirname, '..', 'public', 'GameCards', gameName);
    const baseName = imageBaseName || `${gameName}Bg`;
    const extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG'];
    
    for (const ext of extensions) {
        const imagePath = path.join(gameDir, `${baseName}${ext}`);
        if (fs.existsSync(imagePath)) {
            console.log(`✅ Found ${gameName} image: ${baseName}${ext}`);
            return `/GameCards/${gameName}/${baseName}${ext}`;
        }
    }
    
    console.log(`❌ No ${gameName} image found (looking for ${baseName}.*))`);
    return null;
}

function findAllGameImages() {
    const gameCardsDir = path.join(__dirname, '..', 'public', 'GameCards');
    const results = {};
    
    if (!fs.existsSync(gameCardsDir)) {
        console.log('❌ GameCards directory not found');
        return results;
    }
    
    const gameDirectories = fs.readdirSync(gameCardsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    for (const gameName of gameDirectories) {
        // All games now use the standard [gameName]Bg.* pattern
        const imageBaseName = `${gameName}Bg`;
        const imagePath = findGameImage(gameName, imageBaseName);
        
        if (imagePath) {
            results[gameName] = imagePath;
        }
    }
    
    return results;
}

function updateRoomsJson(gameImagePaths) {
    const roomsJsonPath = path.join(__dirname, '..', 'public', 'rooms.json');
    
    if (!fs.existsSync(roomsJsonPath)) {
        console.log('❌ rooms.json not found');
        return false;
    }
    
    try {
        const roomsData = JSON.parse(fs.readFileSync(roomsJsonPath, 'utf8'));
        let updatedCount = 0;
        
        for (const room of roomsData) {
            const gameName = room.gameName;
            if (gameImagePaths[gameName]) {
                const oldPath = room.imagePath;
                room.imagePath = gameImagePaths[gameName];
                console.log(`✅ Updated ${gameName}: ${oldPath} → ${gameImagePaths[gameName]}`);
                updatedCount++;
            }
        }
        
        if (updatedCount > 0) {
            // Write back to file
            fs.writeFileSync(roomsJsonPath, JSON.stringify(roomsData, null, 2));
            console.log(`✅ Updated ${updatedCount} games in rooms.json`);
            return true;
        } else {
            console.log('⚠️ No games needed updating');
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error updating rooms.json: ${error.message}`);
        return false;
    }
}

function updateSingleGame(gameName, imageBaseName = null) {
    console.log(`🔍 Scanning for ${gameName} image files...`);
    
    const imagePath = findGameImage(gameName, imageBaseName);
    if (imagePath) {
        const gameImagePaths = { [gameName]: imagePath };
        updateRoomsJson(gameImagePaths);
        console.log(`🎉 ${gameName} image configuration updated successfully!`);
        return true;
    } else {
        const baseName = imageBaseName || `${gameName}Bg`;
        console.log(`⚠️ Please add a ${gameName} image file to public/GameCards/${gameName}/`);
        console.log(`   Supported formats: ${baseName}.png, ${baseName}.PNG, ${baseName}.JPG, ${baseName}.jpg, ${baseName}.jpeg`);
        return false;
    }
}

function updateAllGames() {
    console.log('🔍 Scanning ALL games for image files...');
    
    const gameImagePaths = findAllGameImages();
    const gameCount = Object.keys(gameImagePaths).length;
    
    if (gameCount > 0) {
        updateRoomsJson(gameImagePaths);
        console.log(`🎉 Updated ${gameCount} games successfully!`);
        return true;
    } else {
        console.log('⚠️ No game images found. Make sure to add images to public/GameCards/[gameName]/');
        return false;
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // Update all games
        updateAllGames();
    } else if (args[0] === '--game' && args[1]) {
        // Update specific game
        const gameName = args[1];
        const imageBaseName = args[2]; // Optional custom base name
        updateSingleGame(gameName, imageBaseName);
    } else {
        console.log('Usage:');
        console.log('  node helpers/update_game_images.js                    # Update all games');
        console.log('  node helpers/update_game_images.js --game food        # Update specific game');
        console.log('  node helpers/update_game_images.js --game food food   # Update with custom base name');
    }
}

if (require.main === module) {
    main();
}

module.exports = { 
    findGameImage, 
    findAllGameImages, 
    updateRoomsJson, 
    updateSingleGame, 
    updateAllGames 
}; 