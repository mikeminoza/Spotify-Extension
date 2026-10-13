const SPOTIFY_URL = 'https://open.spotify.com/';
const LOGIN_URL = 'https://accounts.spotify.com/login?continue=' + encodeURIComponent(SPOTIFY_URL);
const FRAME_RULE_ID = 1;

const frame = document.getElementById('spotify');
const loginBar = document.getElementById('login-bar');

let loggedIn = false;
let loginTabId = null;

// Spotify sends X-Frame-Options / CSP frame-ancestors, which stop it loading in an iframe.
// Strip them only for Spotify frames outside any tab (tabId -1 = the side panel),
// so normal Spotify tabs and every other site keep their headers untouched.
async function allowFramingInPanel() {
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [FRAME_RULE_ID],
    addRules: [{
      id: FRAME_RULE_ID,
      priority: 1,
      action: {
        type: 'modifyHeaders',
        responseHeaders: [
          { header: 'x-frame-options', operation: 'remove' },
          { header: 'content-security-policy', operation: 'remove' },
        ],
      },
      condition: {
        requestDomains: ['spotify.com'],
        resourceTypes: ['sub_frame'],
        tabIds: [chrome.tabs.TAB_ID_NONE],
      },
    }],
  });
}

// sp_dc is Spotify's long-lived session cookie; it exists only while logged in.
async function checkLoggedIn() {
  const cookie = await chrome.cookies.get({ url: SPOTIFY_URL, name: 'sp_dc' });
  return Boolean(cookie);
}

function loadSpotify() {
  frame.src = SPOTIFY_URL;
}

async function init() {
  await allowFramingInPanel();
  loggedIn = await checkLoggedIn();
  loginBar.hidden = loggedIn;
  loadSpotify();
}

// Log in in a normal tab: Google/Apple/Facebook sign-in refuse to run inside frames.
document.getElementById('login').addEventListener('click', async () => {
  const tab = await chrome.tabs.create({ url: LOGIN_URL });
  loginTabId = tab.id;
});

document.getElementById('dismiss').addEventListener('click', () => {
  loginBar.hidden = true;
});

// Cookie updates fire as remove+add, so re-check state instead of trusting the event.
chrome.cookies.onChanged.addListener(async ({ cookie }) => {
  if (cookie.name !== 'sp_dc' || !cookie.domain.endsWith('spotify.com')) return;

  const nowLoggedIn = await checkLoggedIn();
  if (nowLoggedIn === loggedIn) return;
  loggedIn = nowLoggedIn;
  loginBar.hidden = loggedIn;

  if (loggedIn) {
    loadSpotify();
    if (loginTabId !== null) {
      chrome.tabs.remove(loginTabId).catch(() => {});
      loginTabId = null;
    }
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'reload') loadSpotify();
});

init().catch((error) => {
  console.error(error);
  loadSpotify();
});
