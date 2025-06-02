const fs = require('fs');
const path = require('path');

/**
 * Script to automatically detect food image file and update rooms.json
 */

function findFoodImage() {
    const foodDir = path.join(__dirname, '..', 'public', 'GameCards', 'food');
    const extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG'];
    
    for (const ext of extensions) {
        const imagePath = path.join(foodDir, `food${ext}`);
        if (fs.existsSync(imagePath)) {
            console.log(`✅ Found food image: food${ext}`);
            return `/GameCards/food/food${ext}`;
        }
    }
    
    console.log('❌ No food image found');
    return null;
}

function updateRoomsJson(imagePath) {
    const roomsJsonPath = path.join(__dirname, '..', 'public', 'rooms.json');
    
    if (!fs.existsSync(roomsJsonPath)) {
        console.log('❌ rooms.json not found');
        return false;
    }
    
    try {
        const roomsData = JSON.parse(fs.readFileSync(roomsJsonPath, 'utf8'));
        
        // Find food game entry
        const foodRoom = roomsData.find(room => room.gameName === 'food');
        if (!foodRoom) {
            console.log('❌ Food game not found in rooms.json');
            return false;
        }
        
        // Update image path
        foodRoom.imagePath = imagePath;
        
        // Write back to file
        fs.writeFileSync(roomsJsonPath, JSON.stringify(roomsData, null, 2));
        console.log(`✅ Updated rooms.json with imagePath: ${imagePath}`);
        return true;
        
    } catch (error) {
        console.log(`❌ Error updating rooms.json: ${error.message}`);
        return false;
    }
}

function main() {
    console.log('🔍 Scanning for food image files...');
    
    const imagePath = findFoodImage();
    if (imagePath) {
        updateRoomsJson(imagePath);
        console.log('🎉 Food image configuration updated successfully!');
    } else {
        console.log('⚠️ Please add a food image file to public/GameCards/food/');
        console.log('   Supported formats: food.png, food.PNG, food.JPG, food.jpg, food.jpeg');
    }
}

if (require.main === module) {
    main();
}

module.exports = { findFoodImage, updateRoomsJson }; 