import os
import json
import shutil

def detect_background_image_extension(game_name, project_root):
    """Detect which background image extension exists in the public folder"""
    public_game_path = os.path.join(project_root, "public", "GameCards", game_name)
    
    # All games now use the standard [gameName]Bg.* pattern
    base_name = f"{game_name}Bg"
    
    # Try extensions in order of preference
    extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG']
    
    for ext in extensions:
        image_path = os.path.join(public_game_path, base_name + ext)
        if os.path.exists(image_path):
            print(f"✅ Found background image: {base_name}{ext}")
            return ext
    
    # Default to .png if none found
    print(f"⚠️ No background image found, defaulting to {base_name}.png")
    return '.png'

def add_game_to_init_js(game_name, project_root):
    """Add the game to src/helpers/init.js"""
    init_js_path = os.path.join(project_root, "src", "helpers", "init.js")
    
    if not os.path.exists(init_js_path):
        print(f"❌ Could not find {init_js_path}")
        return False
        
    with open(init_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the switch statement and add the new case
    switch_pattern = "case 'food':\n      cols = 4;\n      rows = 4;\n      break;"
    new_case = f"case '{game_name}':\n      cols = 4;\n      rows = 4;\n      break;"
    
    if f"case '{game_name}':" not in content:
        content = content.replace(switch_pattern, f"{switch_pattern}\n    {new_case}")
        
        with open(init_js_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Added {game_name} to init.js")
    else:
        print(f"⚠️ {game_name} already exists in init.js")
    
    return True

def add_game_to_rooms_list(game_name, project_root):
    """Add the game to src/components/RoomsList.js"""
    rooms_list_path = os.path.join(project_root, "src", "components", "RoomsList.js")
    
    if not os.path.exists(rooms_list_path):
        print(f"❌ Could not find {rooms_list_path}")
        return False
        
    with open(rooms_list_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Since we removed the switch statement, we don't need to add anything here anymore
    print(f"✅ RoomsList.js doesn't need updates (switch statement was removed)")
    return True

def add_game_to_rooms_json(game_name, game_display_name, frame_color, project_root):
    """Add the game to public/rooms.json"""
    rooms_json_path = os.path.join(project_root, "public", "rooms.json")
    
    if not os.path.exists(rooms_json_path):
        print(f"❌ Could not find {rooms_json_path}")
        return False
        
    with open(rooms_json_path, 'r', encoding='utf-8') as f:
        rooms_data = json.load(f)
    
    # Find the highest ID and increment
    max_id = max(int(room['id']) for room in rooms_data)
    new_id = str(max_id + 1)
    
    # Check if game already exists
    if any(room['gameName'] == game_name for room in rooms_data):
        print(f"⚠️ {game_name} already exists in rooms.json")
        return True
    
    # Detect the background image extension
    bg_extension = detect_background_image_extension(game_name, project_root)
    
    # All games now use the standard [gameName]Bg.* pattern
    image_base_name = f"{game_name}Bg"
    
    new_room = {
        "id": new_id,
        "name": game_display_name,
        "linkTilte": f"Learn {game_name}",
        "gameName": game_name,
        "difficulty": 2,
        "maxMembers": 2,
        "currentPlayers": [],
        "startGame": False,
        "endGame": False,
        "info": "https://www.youtube.com/watch?v=example",
        "frameColor": frame_color,
        "imagePath": f"/GameCards/{game_name}/{image_base_name}{bg_extension}"
    }
    
    rooms_data.append(new_room)
    
    with open(rooms_json_path, 'w', encoding='utf-8') as f:
        json.dump(rooms_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Added {game_name} to rooms.json with ID {new_id} and background {game_name}Bg{bg_extension}")
    return True

def create_public_game_cards(game_name, output_folder, project_root):
    """Create the public GameCards structure"""
    # Source paths
    source_json = os.path.join(output_folder, game_name, f"{game_name}.json")
    
    # Destination paths
    public_game_cards = os.path.join(project_root, "public", "GameCards", game_name)
    dest_json = os.path.join(public_game_cards, f"{game_name}.json")
    
    # Create directory
    os.makedirs(public_game_cards, exist_ok=True)
    
    if not os.path.exists(source_json):
        print(f"❌ Could not find source JSON: {source_json}")
        return False
    
    # Read the source JSON and modify it for public use
    with open(source_json, 'r', encoding='utf-8') as f:
        game_data = json.load(f)
    
    # Modify the JSON structure for public use
    for card in game_data['gameCards']:
        card_id = card['id']
        card['imagePath1'] = f"/GameCards/{game_name}/png1/p{card_id}.png"
        card['imagePath2'] = f"/GameCards/{game_name}/png2/p{card_id}.png"
        # Remove the old path fields
        if 'fileFolder' in card:
            del card['fileFolder']
        if 'fileFullPath' in card:
            del card['fileFullPath']
        if 'fileNameWithSufix' in card:
            del card['fileNameWithSufix']
    
    # Write the modified JSON
    with open(dest_json, 'w', encoding='utf-8') as f:
        json.dump(game_data, f, ensure_ascii=False, indent=4)
    
    print(f"✅ Created public GameCards structure for {game_name}")
    return True

def integrate_game(game_name, game_display_name=None, frame_color="#4CAF50", output_folder="output", project_root="../../"):
    """
    Integrate a game that was created by game_creator.py into the project
    
    Args:
        game_name: The name of the game (should match the folder name in output/)
        game_display_name: Human-readable name for the game
        frame_color: Hex color for the game frame
        output_folder: Path to the output folder where game_creator.py created the files
        project_root: Path to the project root
    """
    if game_display_name is None:
        game_display_name = f"Learn {game_name.title()}"
    
    print(f"🚀 Integrating game: {game_name}")
    print(f"   Display name: {game_display_name}")
    print(f"   Frame color: {frame_color}")
    
    # Check if output folder exists
    game_output_path = os.path.join(output_folder, game_name)
    if not os.path.exists(game_output_path):
        print(f"❌ Game output folder not found: {game_output_path}")
        print("   Make sure you've run game_creator.py first!")
        return False
    
    # Integrate into all necessary files
    success = True
    success &= add_game_to_init_js(game_name, project_root)
    success &= add_game_to_rooms_list(game_name, project_root)
    success &= add_game_to_rooms_json(game_name, game_display_name, frame_color, project_root)
    success &= create_public_game_cards(game_name, output_folder, project_root)
    
    if success:
        print(f"🎉 Successfully integrated {game_name} into the project!")
        print("\n📝 Don't forget to:")
        print(f"   1. Add the background image: src/assets/textures/{game_name}/{game_name}Bg.[PNG|png|jpg|jpeg]")
        print(f"   2. Add the card images: src/assets/textures/{game_name}/png1/p1.png to p8.png")
        print(f"   3. Add the card images: src/assets/textures/{game_name}/png2/p1.png to p8.png")
        print(f"   4. Copy the background to: public/GameCards/{game_name}/{game_name}Bg.[PNG|png|jpg|jpeg]")
        print(f"   5. Copy the images to: public/GameCards/{game_name}/png1/ and png2/")
        print(f"\n💡 The system will automatically detect which image format you use!")
    else:
        print(f"❌ Failed to integrate {game_name}")
    
    return success

if __name__ == "__main__":
    # Example usage
    game_name = input("Enter game name: ").strip()
    if not game_name:
        print("❌ Game name is required!")
        exit(1)
    
    game_display_name = input(f"Enter display name (or press Enter for 'Learn {game_name.title()}'): ").strip()
    if not game_display_name:
        game_display_name = f"Learn {game_name.title()}"
    
    frame_color = input("Enter frame color (or press Enter for #4CAF50): ").strip()
    if not frame_color:
        frame_color = "#4CAF50"
    
    integrate_game(game_name, game_display_name, frame_color) 