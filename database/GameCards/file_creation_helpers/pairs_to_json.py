# pip install googletrans==4.0.0-rc1

import sys
import json
import importlib.util
import os
from googletrans import Translator

def load_pairs_from_file(filename):
    spec = importlib.util.spec_from_file_location("module.name", filename)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return getattr(mod, "pairs", [])

def translate_texts(texts, translator):
    return [translator.translate(t, src='iw', dest='en').text for t in texts]

def generate_game_cards(pairs, base_filename, translator):
    game_cards = []
    for i, (text1, text2) in enumerate(pairs, start=1):
        text1_en, text2_en = translate_texts([text1, text2], translator)
        card = {
            "id": str(i),
            "name": f"p{i}",
            "fileFolder": f"../../assets/textures/{base_filename}/png",
            "fileFullPath": f"../../assets/textures/{base_filename}/png/p{i}.png",
            "fileNameWithSufix": f"p{i}.png",
            "background": "red",
            "text1": text1,
            "text2": text2,
            "text3": text1_en,
            "text4": text2_en,
            "faceType": "back"
        }
        game_cards.append(card)
    return game_cards

def main():
    if len(sys.argv) != 2:
        print("Usage: python pairs_to_json.py <filename_without_py>")
        sys.exit(1)

    base_filename = sys.argv[1]
    py_filename = f"{base_filename}.py"
    json_filename = f"{base_filename}.json"

    if not os.path.isfile(py_filename):
        print(f"Error: File '{py_filename}' not found.")
        sys.exit(1)

    try:
        pairs = load_pairs_from_file(py_filename)
    except Exception as e:
        print(f"Error loading pairs from {py_filename}:", e)
        sys.exit(1)

    translator = Translator()
    output = {
        "gameName": base_filename,
        "id": 1,
        "gameCards": generate_game_cards(pairs, base_filename, translator)
    }

    with open(json_filename, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=4)

    print(f"✅ JSON file '{json_filename}' created successfully.")

if __name__ == "__main__":
    main()
