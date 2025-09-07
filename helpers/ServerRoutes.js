const NODE_PROXY_URL = "http://localhost:5000";
const FLASK_PROXY_URL = "http://127.0.0.1:8000";
const BROWSER_PROXY_URL = "http://localhost:3000";

const NODE_RENDER_URL = "https://mgduplicatesinarownode-production.up.railway.app";
const FLASK_RENDER_URL = "https://mgduplicatrsinarowflask-production.up.railway.app";
const BROWSER_RENDER_URL = "https://mgduplicatesrowreact.netlify.app/";

const USE_LOCAL = true;
//const USE_LOCAL = false;

const CHOSEN_NODE_URL = USE_LOCAL ? NODE_PROXY_URL : NODE_RENDER_URL;
const CHOSEN_FLASK_URL = USE_LOCAL ? FLASK_PROXY_URL : FLASK_RENDER_URL;
const CHOSEN_BROWSER_URL = USE_LOCAL ? BROWSER_PROXY_URL : BROWSER_RENDER_URL;

module.exports = {
  NODE_RENDER_URL,
  FLASK_RENDER_URL,
  BROWSER_RENDER_URL,
  CHOSEN_NODE_URL,
  CHOSEN_FLASK_URL,
  CHOSEN_BROWSER_URL
};
