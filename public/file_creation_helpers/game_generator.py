import os
import json
import sys
import shutil
import requests
import google.generativeai as genai

# Get the absolute path to the project root (three levels up from this script)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# --- API KEYS ---
PEXELS_API_KEY = "9aGzJkjTnFJf8t1J66DAhkPuEr8FSaSnKJoqGEPvVMBfHaoZcSHDsmyk"
GOOGLE_AI_API_KEY = "AIzaSyCs983O6se5GTYoxIPQSTMLP4VoePITDWA"  # google cloud gemini api key

# --- CONFIGURATION ---
genai.configure(api_key=GOOGLE_AI_API_KEY)  # google cloud gemini api key

def generate_game_name(subject):
    return "".join(word.capitalize() for word in subject.split())

def generate_qa_pairs(age, subject):
    print(f"Generating real Q&A for age {age} on {subject} using Google AI...")
    try:
        model = genai.GenerativeModel('models/gemini-2.5-pro')  # best available Gemini model
        prompt = f"""
        Generate 8 simple, one-sentence questions and answers about '{subject}' suitable for a {age}-year-old.
        The questions should be distinct and varied.
        Provide the output as a valid JSON formatted list of objects.
        Each object must have a "q" key for the question and an "a" key for the answer.
        Example format: [ {{"q": "What color is the sky?", "a": "Blue"}}, {{"q": "How many legs does a spider have?", "a": "Eight"}} ]
        """
        response = model.generate_content(prompt)
        # Clean up the response to get raw JSON
        cleaned_json = response.text.strip().replace("```json", "").replace("```", "")
        qa_pairs = json.loads(cleaned_json)
        print("game_generator.py -- generate_qa_pairs -- qa_pairs:", qa_pairs)
        print("Successfully generated Q&A from Google AI.")
        return qa_pairs
    except Exception as e:
        print(f"ERROR: game_generator.py -- generate_qa_pairs -- Failed to generate Q&A from Google AI: {e}")
        raise

def fetch_pexels_image(query, save_path):
    url = "https://api.pexels.com/v1/search"
    headers = {"Authorization": PEXELS_API_KEY}
    params = {
        "query": query,
        "per_page": 1,
        "orientation": "landscape"
    }
    try:
        print(f"Fetching Pexels image for: {query}")
        response = requests.get(url, headers=headers, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("photos") and len(data["photos"]) > 0:
                photo_url = data["photos"][0]["src"]["medium"]
                img_response = requests.get(photo_url, timeout=10)
                if img_response.status_code == 200:
                    with open(save_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"Downloaded Pexels image to {save_path}")
                    return True
                else:
                    print(f"ERROR: Failed to download image from Pexels, status code: {img_response.status_code}")
                    return False
            else:
                print(f"ERROR: No photos found for query '{query}' on Pexels.")
                return False
        else:
            print(f"ERROR: Failed to fetch Pexels image, status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: Exception fetching Pexels image for '{query}': {e}")
        return False

def fetch_unsplash_image(query, save_path):
    url = f"https://source.unsplash.com/400x300/?{query}"
    try:
        print(f"Fetching Unsplash image for: {query}")
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded Unsplash image to {save_path}")
            return True
        else:
            print(f"ERROR: Failed to fetch Unsplash image, status code: {response.status_code}")
            return False
    except Exception as e:
        print(f"ERROR: Exception fetching Unsplash image for '{query}': {e}")
        return False

def create_game_files(game_name, qa_pairs, subject, age):
    # Ensure game_name is in the format subject_age
    game_name = f"{subject.lower()}_{age}"
    game_dir = os.path.join(PROJECT_ROOT, "public", "GameCards", game_name)
    try:
        os.makedirs(game_dir, exist_ok=True)
    except Exception as e:
        print(f"ERROR: Could not create game directory '{game_dir}': {e}")
        raise
    print(f"game_generator.py -- create_game_files -- game_dir: {os.path.abspath(game_dir)}")
    img_dir = os.path.join(game_dir, "png1")
    img_dir2 = os.path.join(game_dir, "png2")
    try:
        os.makedirs(img_dir, exist_ok=True)
        os.makedirs(img_dir2, exist_ok=True)
    except Exception as e:
        print(f"ERROR: Could not create image directories: {e}")
        raise

    # Create varied search terms for different images
    search_terms = [
        f"{subject}",
        f"{subject} cute",
        f"{subject} wild",
        f"{subject} baby",
        f"{subject} colorful",
        f"{subject} nature",
        f"{subject} close up",
        f"{subject} family"
    ]

    game_cards = []
    for i, pair in enumerate(qa_pairs):
        img_filename = f"p{i+1}.png"
        img_path1 = os.path.join(img_dir, img_filename)
        img_path2 = os.path.join(img_dir2, img_filename)
        img_query = search_terms[i % len(search_terms)]
        got_img = fetch_pexels_image(img_query, img_path1)
        if not got_img:
            got_img = fetch_unsplash_image(img_query, img_path1)
        if got_img:
            try:
                shutil.copy(img_path1, img_path2)
            except Exception as e:
                print(f"ERROR: Could not copy image from {img_path1} to {img_path2}: {e}")
                raise
        else:
            default_img = os.path.join(PROJECT_ROOT, "public", "GameCards", "food", "foodBg.JPG")
            if os.path.exists(default_img):
                try:
                    shutil.copy(default_img, img_path1)
                    shutil.copy(default_img, img_path2)
                    print(f"WARNING: Used default image for card {img_filename}")
                except Exception as e:
                    print(f"ERROR: Could not copy default image: {e}")
                    raise
            else:
                print(f"ERROR: No default image found at {default_img}. Cannot create card image for {img_filename}.")
                raise FileNotFoundError(f"No default image found at {default_img}")
        card = {
            "id": str(i + 1),
            "name": f"{pair['q']} = {pair['a']}",
            "imagePath1": f"/GameCards/{game_name}/png1/{img_filename}",
            "imagePath2": f"/GameCards/{game_name}/png2/{img_filename}",
            "faceType": "back",
            "text1": pair['q'],
            "text2": f"{subject.capitalize()} fun fact {i+1}",
            "text3": f"Did you know? {pair['a']}",
            "text4": f"{subject.capitalize()} challenge: {pair['q']}"
        }
        game_cards.append(card)

    game_json = {
        "gameName": game_name,
        "id": 99, # This should be dynamic
        "gameCards": game_cards
    }

    json_path = os.path.join(game_dir, f"{game_name}.json")
    try:
        with open(json_path, "w") as f:
            json.dump(game_json, f, indent=4)
        print(f"Created {json_path}")
    except Exception as e:
        print(f"ERROR: Could not write game JSON file '{json_path}': {e}")
        raise

    dynamic_bg = os.path.join(game_dir, f"{game_name}Bg.JPG")
    got_pexels = fetch_pexels_image(subject, dynamic_bg)
    got_unsplash = False
    if not got_pexels:
        got_unsplash = fetch_unsplash_image(subject, dynamic_bg)
    if got_pexels or got_unsplash:
        print(f"Used online image for background: {dynamic_bg}")
    else:
        default_bg = os.path.join(PROJECT_ROOT, "public", "GameCards", "food", "foodBg.JPG")
        if os.path.exists(default_bg):
            try:
                shutil.copy(default_bg, dynamic_bg)
                print(f"WARNING: Copied default background image to {dynamic_bg}")
            except Exception as e:
                print(f"ERROR: Could not copy default background image: {e}")
                raise
        else:
            print(f"ERROR: No background image found at {default_bg}. Skipping background copy.")
            raise FileNotFoundError(f"No background image found at {default_bg}")

def update_rooms_json(game_name, subject, age):
    game_name = f"{game_name.lower()}_{age}"
    rooms_path = os.path.join(PROJECT_ROOT, "public", "rooms.json")
    if not os.path.exists(rooms_path):
        with open(rooms_path, "w", encoding="utf-8") as f:
            json.dump([], f)
        print(f"Created missing {rooms_path} with empty list.")
    try:
        with open(rooms_path, "r+", encoding="utf-8") as f:
            rooms_data = json.load(f)
            # Filter duplicates by gameName
            if any(room['gameName'] == game_name for room in rooms_data):
                error_msg = f"ERROR in update_rooms_json: Duplicate gameName '{game_name}' detected in {rooms_path}. No new room added."
                print(error_msg)
                raise ValueError(error_msg)
            new_game_id = str(len(rooms_data) + 1)
            new_game_room = {
                "id": new_game_id,
                "name": subject.capitalize(),
                "linkTilte": f"Learn about {subject}",
                "gameName": game_name,
                "difficulty": 2,
                "maxMembers": 2,
                "currentPlayers": [],
                "startGame": False,
                "endGame": False,
                "info": "https://www.youtube.com/watch?v=example",
                "frameColor": "#4CAF50",
                "imagePath": f"/GameCards/{game_name}/{game_name}Bg.JPG"
            }
            rooms_data.append(new_game_room)
            f.seek(0)
            json.dump(rooms_data, f, indent=2, ensure_ascii=False)
            f.truncate()
        print(f"Updated {rooms_path} with new game: {game_name}")
    except Exception as e:
        error_msg = f"ERROR in update_rooms_json: Could not update rooms.json at '{rooms_path}': {e}"
        print(error_msg)
        raise ValueError(error_msg)

if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "batch":
        subjects = [
            "math",
            "bible",
            "civi",
            "social",
            "funny jokes",
            "english",
            "hebrew reading",
            "hebrew literature",
            "computer science",
            "sports",
            "soccer",
            "basketball",
            "geography",
            "history",
            "art",
            "music",
            "science",
            "nature",
            "animals",
            "logic puzzles"
        ]
        age = 10
        for subject in subjects:
            print(f"\n--- Creating game for subject: {subject} ---")
            game_name = generate_game_name(subject)
            qa_pairs = generate_qa_pairs(age, subject)
            create_game_files(game_name, qa_pairs, subject, age)
            update_rooms_json(game_name, subject, age)
        print("\nBatch game generation complete!")
    elif len(sys.argv) == 3:
        age = sys.argv[1]
        subject = sys.argv[2]
        game_name = generate_game_name(subject)
        qa_pairs = generate_qa_pairs(age, subject)
        create_game_files(game_name, qa_pairs, subject, age)
        update_rooms_json(game_name, subject, age)
        print("\nGame generation complete!")
    else:
        print("Usage: python game_generator.py <age> <subject> OR python game_generator.py batch")
        sys.exit(1) 