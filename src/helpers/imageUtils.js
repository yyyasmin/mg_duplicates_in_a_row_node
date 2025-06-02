// Utility functions for handling flexible image formats

/**
 * Attempts to find a background image with different extensions
 * @param {string} basePath - The base path without extension (e.g., "/GameCards/food/foodBg")
 * @param {Array} extensions - Array of extensions to try (default: ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG'])
 * @returns {Promise<string>} - The first existing image path, or the first extension as fallback
 */
export const findAvailableImage = async (basePath, extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG']) => {
  for (const ext of extensions) {
    const fullPath = basePath + ext;
    try {
      // Check if the image exists by attempting to load it
      const response = await fetch(fullPath, { method: 'HEAD' });
      if (response.ok) {
        return fullPath;
      }
    } catch (error) {
      // Continue to next extension
      continue;
    }
  }
  
  // Fallback to first extension if none found
  return basePath + extensions[0];
};

/**
 * Special function for food game that looks for food.* instead of foodBg.*
 * @param {string} directory - The directory path (default: "/GameCards")
 * @returns {Promise<string>} - The available food image path
 */
export const getFoodGameImage = async (directory = "/GameCards") => {
  const basePath = `${directory}/food/food`;
  // Try extensions in order of preference
  const extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG'];
  return await findAvailableImage(basePath, extensions);
};

/**
 * Creates a flexible image path that tries multiple extensions for ANY game
 * @param {string} gameName - The name of the game
 * @param {string} imageName - The base name of the image (e.g., "foodBg")
 * @param {string} directory - The directory path (default: "/GameCards")
 * @returns {Promise<string>} - The available image path
 */
export const getGameBackgroundImage = async (gameName, imageName = null, directory = "/GameCards") => {
  // All games now use the standard [gameName]Bg.* pattern
  const imageBaseName = imageName || `${gameName}Bg`;
  const basePath = `${directory}/${gameName}/${imageBaseName}`;
  return await findAvailableImage(basePath);
};

/**
 * Synchronous version that returns the most common format as fallback
 * @param {string} gameName - The name of the game
 * @param {string} imageName - The base name of the image (e.g., "foodBg")
 * @param {string} directory - The directory path (default: "/GameCards")
 * @returns {string} - The image path with .png extension as fallback
 */
export const getGameBackgroundImageSync = (gameName, imageName = null, directory = "/GameCards") => {
  // All games now use the standard [gameName]Bg.* pattern
  const imageBaseName = imageName || `${gameName}Bg`;
  return `${directory}/${gameName}/${imageBaseName}.png`;
};

/**
 * Simple function that constructs image paths with flexible extensions
 * This is used during the game creation process
 * @param {string} gameName - The name of the game
 * @param {string} preferredExtension - Preferred extension (.PNG, .png, .jpg, .jpeg)
 * @returns {string} - The image path
 */
export const createFlexibleImagePath = (gameName, preferredExtension = '.png') => {
  // All games now use the standard [gameName]Bg.* pattern
  return `/GameCards/${gameName}/${gameName}Bg${preferredExtension}`;
};

/**
 * Advanced function that detects the actual extension of an existing image
 * @param {string} gameName - The name of the game
 * @param {string} directory - The directory path (default: "/GameCards")
 * @returns {Promise<string>} - The actual extension found (e.g., ".PNG")
 */
export const detectImageExtension = async (gameName, directory = "/GameCards") => {
  const extensions = ['.png', '.PNG', '.JPG', '.jpg', '.jpeg', '.JPEG'];
  
  // All games now use the standard [gameName]Bg.* pattern
  const basePath = `${directory}/${gameName}/${gameName}Bg`;
  for (const ext of extensions) {
    try {
      const response = await fetch(basePath + ext, { method: 'HEAD' });
      if (response.ok) {
        return ext;
      }
    } catch (error) {
      continue;
    }
  }
  
  // Fallback to .png
  return '.png';
}; 