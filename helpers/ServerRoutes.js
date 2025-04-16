// src/helpers/ServerRoutes.js

// Node server (game, sockets)
const NODE_PROXY_URL = "http://localhost:5000";

// Flask server (auth)
const FLASK_PROXY_URL = "http://127.0.0.1:8000";

// For production, use Railway or any hosted URL
export const NODE_RENDER_URL = "https://yyyasminallmg-production.up.railway.app"; // NODE on Railway
export const FLASK_RENDER_URL = "https://flask_auth-production.up.railway.app";    // Flask on Railway

// Switch between local and render here
const USE_LOCAL = true;

// Export chosen URLs for use in frontend
export const CHOSEN_NODE_URL = USE_LOCAL ? NODE_PROXY_URL : NODE_RENDER_URL;
export const CHOSEN_FLASK_URL = USE_LOCAL ? FLASK_PROXY_URL : FLASK_RENDER_URL;
