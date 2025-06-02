# Memory Card Game Creator

This folder contains tools to automatically create new memory card games for the React Memory Card Games project.

## Files

- `game_creator.py` - Creates JSON and JS files from Hebrew text input
- `game_integrator.py` - Integrates the created game into the main project
- `input/` - Place your text files here
- `output/` - Generated game files will be created here
- `README.md` - This file

## Prerequisites

Install the required Python packages:

```bash
pip install python-docx deep-translator
```

## How to Create a New Game

### Step 1: Create a text file

Create a text file in the `input/` folder with your game content. The format should be:

```
Hebrew Word 1
Hebrew Description 1

Hebrew Word 2
Hebrew Description 2

Hebrew Word 3
Hebrew Description 3

...
```

**Example (`input/animals.txt`):**
```
כלב
כלב חום גדול

חתול
חתול לבן קטן

פיל
פיל אפור ענק

אריה
אריה זהוב חזק
```

Each pair of lines creates one memory card. The script will automatically translate to English.

### Step 2: Run the game creator

```bash
python game_creator.py
```

This will:
- Process all `.txt`, `.txy`, and `.docx` files in the `input/` folder
- Create a folder for each game in the `output/` folder
- Generate `.json` and `.js` files for each game
- Automatically translate Hebrew text to English

### Step 3: Integrate into the project

```bash
python game_integrator.py
```

This will prompt you for:
- Game name (should match the file name from step 1)
- Display name (human-readable name for the UI)
- Frame color (hex color code for the game's border)

The script will automatically:
- Add the game to `src/helpers/init.js`
- Add the game to `src/components/RoomsList.js`
- Add the game to `public/rooms.json`
- Create the `public/GameCards/[gameName]/` structure

### Step 4: Add images

After running the integrator, you need to manually add the images:

1. **Background image**: `src/assets/textures/[gameName]/[gameName]Bg.PNG`
2. **Card images**: 
   - `src/assets/textures/[gameName]/png1/p1.png` through `p8.png`
   - `src/assets/textures/[gameName]/png2/p1.png` through `p8.png`
3. **Public images**:
   - Copy background to: `public/GameCards/[gameName]/[gameName]Bg.PNG`
   - Copy card images to: `public/GameCards/[gameName]/png1/` and `png2/`

## Example Workflow

1. Create `input/colors.txt`:
```
אדום
צבע אדום יפה

כחול
צבע כחול של השמיים

ירוק
צבע ירוק של העלים

צהוב
צבע צהוב של השמש
```

2. Run `python game_creator.py`

3. Run `python game_integrator.py` and enter:
   - Game name: `colors`
   - Display name: `Learn Colors in Hebrew`
   - Frame color: `#FF5722`

4. Add your images to the appropriate folders

5. Your new "colors" game will appear in the game selection!

## File Structure Created

```
output/
  [gameName]/
    [gameName].json    # Game data with translations
    [gameName].js      # Image imports (not used in current setup)

project/
  src/helpers/init.js                    # Updated with game layout
  src/components/RoomsList.js            # Updated with game case
  public/rooms.json                      # Updated with game entry
  public/GameCards/[gameName]/
    [gameName].json                      # Public game data
    [gameName]Bg.PNG                     # Background (you add)
    png1/p1.png...p8.png                # Card images (you add)
    png2/p1.png...p8.png                # Card images (you add)
```

## Notes

- Each game supports up to 8 pairs (16 cards total)
- Text files should have an even number of lines (pairs)
- The script automatically handles Hebrew-to-English translation
- Game names should be unique and use camelCase
- Supported input formats: `.txt`, `.txy`, `.docx` 