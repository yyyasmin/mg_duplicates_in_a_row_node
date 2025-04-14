import json
import os
import sys

def json_to_pairs(input_path):
    # Load JSON content
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Extract base name for output file
    game_name = data.get("gameName", "output")
    output_filename = f"{game_name}.py"

    # Extract pairs
    cards = data.get("gameCards", [])
    pairs = [(card["text1"], card["text2"]) for card in cards]

    # Write to Python file
    with open(output_filename, "w", encoding="utf-8") as out:
        out.write("pairs = [\n")
        for a, b in pairs:
            out.write(f"    ({json.dumps(a, ensure_ascii=False)}, {json.dumps(b, ensure_ascii=False)}),\n")
        out.write("]\n")

    print(f"✅ Created: {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python json_to_pairs.py <input_json_file>")
    else:
        json_file = sys.argv[1]
        if not os.path.isfile(json_file):
            print(f"❌ File not found: {json_file}")
        else:
            json_to_pairs(json_file)
