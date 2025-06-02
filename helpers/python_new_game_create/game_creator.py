import os
import json
from deep_translator import GoogleTranslator
from docx import Document

# pip install python-docx deep-translator

def read_docx_lines(docx_path):
    document = Document(docx_path)
    return [para.text.strip() for para in document.paragraphs if para.text.strip()]

def read_text_lines(txt_path):
    with open(txt_path, 'r', encoding='utf-8') as f:
        return [line.strip() for line in f if line.strip()]

def create_json_and_js(game_name, id_number, file_path, output_path):
    # Determine input type and read lines
    if file_path.endswith('.docx'):
        hebrew_lines = read_docx_lines(file_path)
    elif file_path.endswith(('.txt', '.txy')):
        hebrew_lines = read_text_lines(file_path)
    else:
        print(f"Unsupported file format: {file_path}")
        return

    game_cards = []
    num_cards = len(hebrew_lines) // 2  # Each card uses 2 lines
    translator = GoogleTranslator(source='auto', target='en')

    for i in range(num_cards):
        card_id = str(i + 1)
        text1 = hebrew_lines[i * 2]
        text2 = hebrew_lines[i * 2 + 1]
        text3 = translator.translate(text1)
        text4 = translator.translate(text2)

        card = {
            "id": card_id,
            "name": f"p{card_id}",
            "fileFolder": f"../../assets/textures/{game_name}/png",
            "fileFullPath": f"../../assets/textures/{game_name}/png/p{card_id}.png",
            "fileNameWithSufix": f"p{card_id}.png",
            "background": "red",
            "text1": text1,
            "text2": text2,
            "text3": text3,
            "text4": text4,
            "faceType": "back"
        }
        game_cards.append(card)

    output_data = {
        "gameName": game_name,
        "id": id_number,
        "gameCards": game_cards
    }

    game_folder = os.path.join(output_path, game_name)
    os.makedirs(game_folder, exist_ok=True)

    json_file_path = os.path.join(game_folder, f"{game_name}.json")
    with open(json_file_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

    js_file_path = os.path.join(game_folder, f"{game_name}.js")
    with open(js_file_path, "w", encoding="utf-8") as f:
        f.write(f"// Import all the required images for {game_name}\n\n")
        for card in game_cards:
            card_id = card['id']
            f.write(f"export const {game_name}Bg = require(\"../../assets/textures/{game_name}/{game_name}Bg.PNG\");\n")
            f.write(f"export const p{card_id}_1 = require(\"../../assets/textures/{game_name}/png1/p{card_id}.png\");\n")
            f.write(f"export const p{card_id}_2 = require(\"../../assets/textures/{game_name}/png2/p{card_id}.png\");\n")

        f.write(f"\nexport const {game_name} = [\n")
        f.write(f"  {game_name}Bg,\n")
        for card in game_cards:
            card_id = card['id']
            f.write(f"  [p{card_id}_1, p{card_id}_2],\n")
        f.write(f"];\n")

    print(f"✅ JSON created at: {json_file_path}")
    print(f"✅ JS created at: {js_file_path}")

def process_all_input_files(input_folder, output_path):
    files = [f for f in os.listdir(input_folder) if f.endswith(('.docx', '.txt', '.txy'))]

    for file in files:
        file_path = os.path.join(input_folder, file)
        game_name = os.path.splitext(file)[0]
        create_json_and_js(game_name, 1, file_path, output_path)

if __name__ == "__main__":
    input_folder = 'input'   # Folder containing .docx, .txt, or .txy files
    output_path = 'output'   # Where output folders will be created
    process_all_input_files(input_folder, output_path) 