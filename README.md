# Spotify Side Panel

The real Spotify web player (open.spotify.com) in Chrome's or Edge's side panel. You log in once and then use
Spotify normally — search, playlists, library, playback — next to whatever tab you're on.

## Install (Chrome or Edge, unpacked)

1. Open `chrome://extensions` (Edge: `edge://extensions`).
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this `spotify-side-panel` folder.
4. Pin the extension to the toolbar.

## Use

- **Click the toolbar icon** (or press **Alt+Shift+S**) to open the panel.
- **Not logged in?** Click **Log in** in the bar at the top. Spotify's login opens in a normal tab, because
  Google, Apple and Facebook sign-in won't run inside a frame. Once you're in, the tab closes and the panel reloads
  logged in.
- **Right-click the toolbar icon** for:
  - **Pop out as mini window**: Spotify in a small standalone window.
  - **Reload Spotify panel**
  - **Log in / switch account**
- **Too narrow?** Drag the panel's left edge to make it wider.
- The shortcut can be changed at `chrome://extensions/shortcuts`.

## Good to know

- **Closing the side panel stops the music**, because the player lives in the panel. If you want playback to keep
  going, use **Pop out as mini window** or a normal Spotify tab. Your account stays logged in either way, and the
  panel can switch playback between devices with Spotify's device picker.
- **How it works:** Spotify sends headers that stop it from loading inside other pages. The extension removes those
  headers **only** for Spotify frames inside the side panel (`declarativeNetRequest` session rule with
  `tabIds: [-1]`), so regular tabs and every other site are untouched.
- **Login detection** looks for Spotify's `sp_dc` session cookie. The extension only checks whether the cookie
  exists; it never stores or sends it anywhere.
- This is for personal use. If Spotify changes its site, the panel could stop working; the pop-out window would
  keep working.
- Media keys and Chrome's media controls work as usual.
