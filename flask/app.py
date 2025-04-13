from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route('/get_game_names', methods=['GET'])
def get_game_names():
    game_files = []
    game_cards_path = 'database/gameCards'  # Update to your actual path

    # List all files in the gameCards directory
    for filename in os.listdir(game_cards_path):
        if filename.endswith('.json'):
            game_files.append(filename)
    print("")
    print("IN get_game_names -- game_files: ", game_files)
    print("")
    return jsonify(game_files)

if __name__ == '__main__':
    app.run()
