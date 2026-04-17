# VSkin Browser Extension

Official browser extension for [VSkin.gg](https://vskin.gg).
Allows users to sync their full CS2 inventory - including trade-locked and protected items - to build their VSkin showcase.

---

## What this extension does

- Reads your Steam login cookie locally to identify your account (Steam ID)
- Fetches your CS2 inventory directly from Steam's public inventory endpoint
- Sends the inventory data to VSkin servers so your showcase can be built
- All syncs are user-initiated - nothing happens in the background without your action

---

## What this extension does NOT do

VSkin is **read-only by design**.

The extension does **not**:
- Send or accept trade offers
- Access your Steam messages, friends list, or chat
- Modify your Steam account or settings in any way
- Use your Steam API key
- Send your Steam session cookie to VSkin or any third party
- Inject scripts into web pages (no content scripts)
- Run automatically - syncs only happen when you click "Sync Inventory"
- Perform any action on your behalf

At no point can VSkin interact with trades or your account actions.

---

## How it works

1. You log into Steam normally via your browser
2. When you open the extension popup, it reads your `steamLoginSecure` cookie **locally** to extract your 17-digit Steam ID
3. The cookie value itself is never transmitted - only the Steam ID is used
4. When you click "Sync Inventory", the extension fetches your CS2 inventory from Steam's public endpoint (`steamcommunity.com/inventory/...`)
5. Both standard and protected (trade-locked) items are retrieved
6. This inventory data is sent to VSkin's API to build your showcase
7. A 30-second cooldown is enforced between syncs

Your Steam credentials are **never** accessed or transmitted by VSkin.

---

## Permissions explained

### Browser permissions

| Permission | Reason |
|---|---|
| `cookies` | Read the `steamLoginSecure` cookie from `steamcommunity.com` to extract your Steam ID. The cookie is read locally and never sent anywhere. |
| `storage` | Persist the sync cooldown timer across popup sessions. Only stores a single timestamp. |

### Host permissions

| Host | Reason |
|---|---|
| `https://steamcommunity.com/*` | Fetch your CS2 inventory via Steam's public inventory API. |
| `https://api.vskin.gg/*` | Send inventory data to VSkin's backend for showcase sync. |

No other websites are accessed.

---

## Data sent to VSkin

When you click "Sync Inventory", the following is sent to `api.vskin.gg`:

- Your Steam ID (17-digit identifier)
- Your CS2 inventory items, including:
  - Item names and types
  - Asset IDs and class IDs
  - Float values and wear condition
  - Sticker and seal data
  - Rarity, category, and other item tags
  - Tradability and marketability status

This is the same data visible on any public Steam inventory page.

---

## Data NOT collected

VSkin does **not** collect or receive:
- Your Steam password
- Your `steamLoginSecure` cookie value
- Your Steam API key
- Private messages or chat history
- Trade history or trade offers
- Friends list
- Payment information
- Any data from websites other than `steamcommunity.com`

---

## Security model

The extension is designed to minimize risk:

- **No trade capability** - the extension cannot initiate, accept, or interact with trade offers
- **No API key** - no Steam API key is required or used
- **No content scripts** - the extension does not inject code into any web page
- **User-initiated only** - inventory sync only happens when you explicitly click the button
- **Host permissions** - the extension can only make requests to domains explicitly declared in the manifest (`steamcommunity.com`, `api.vskin.gg`). All other domains are blocked by Chrome.
- **Rate limiting** - a 30-second cooldown prevents rapid-fire requests

Even in the event of a compromise, the extension architecture cannot perform trades or access account credentials.

---

## How to verify

You can audit the extension's behavior yourself:

1. **Read the source code** - this repository contains the full, unobfuscated source
2. **Inspect network requests** - right-click the extension icon > "Inspect popup" to open the popup's developer tools. All requests (GET to `steamcommunity.com`, POST to `api.vskin.gg`) are visible in the Network tab.
3. **Check the manifest** - review `manifest.json` to confirm the declared permissions match this documentation
4. **Verify no content scripts** - the manifest declares no `content_scripts` entry. The extension does not inject code into any page.

---

## Build from source

```bash
npm install
npm run build
```

The compiled extension will be output to the `dist/` directory. You can load it in Chrome via `chrome://extensions` > "Load unpacked" and selecting the `dist` folder.

For development with auto-rebuild:

```bash
npm run dev
```

---

## Official links

- Website: [vskin.gg](https://vskin.gg)
- Chrome Web Store: [VSkin Extension](https://chromewebstore.google.com/detail/vskin/akhdlcilhidakkhbgnkeefifhblfconn)
- Extension info: [vskin.gg/extension](https://vskin.gg/extension)
- Privacy policy: [vskin.gg/extension-privacy](https://vskin.gg/extension-privacy)

---

## Transparency

This repository is open source to ensure full transparency about how the extension operates.

If you have questions or concerns, feel free to open an issue.
