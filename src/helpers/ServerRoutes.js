// src/helpers/ServerRoutes.js

///////////// DEVELOPMENT /////////////

// Node server (game, sockets)
const NODE_PROXY_URL = "http://localhost:5000";

// Flask server (auth)
const FLASK_PROXY_URL = "http://127.0.0.1:8000";

// Node browser (rooms images)
const BROWSER_PROXY_URL = "http://localhost:3000";


///////////// PRODUCTIN /////////////
// For production, use Railway or any hosted URL
export const NODE_RENDER_URL = "https://mgduplicatesinarownode-production.up.railway.app"; // NODE on Railway

export const FLASK_RENDER_URL = "https://mgduplicatrsinarowflask-production.up.railway.app";    // Flask on Railway

export const BROWSER_RENDER_URL = "https://mgduplicatrsinarowflask-production.up.railway.app";    // FOR ROOMS SQUARE IMAGE PRDEIX 


////// CHOSE ENVIROMENT VARS //////
 
// Switch between local and render here
//const USE_LOCAL = true;
const USE_LOCAL = false;

// Export chosen URLs for use in frontend
export const CHOSEN_NODE_URL = USE_LOCAL ? NODE_PROXY_URL : NODE_RENDER_URL;

export const CHOSEN_FLASK_URL = USE_LOCAL ? FLASK_PROXY_URL : FLASK_RENDER_URL;

export const CHOSEN_BROWSER_URL = USE_LOCAL ? BROWSER_PROXY_URL : BROWSER_RENDER_URL;
