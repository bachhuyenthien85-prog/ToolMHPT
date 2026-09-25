# EFAUNT — Base44 Dev Environment

## What this is
A static HTML/JS app (no backend, no build step). Pages use Bootstrap (via CDN), crypto-js (local), jQuery (local), and localStorage for persistence. The browser calls external game APIs directly via `fetch`.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d
```
- nginx:alpine serves the repo root on host port 3000.
- No build, no compilation — edits to HTML/JS files are live on page refresh (call `reload_preview` after edits since there's no HMR).

## Entry point
`index.html` redirects to `listAccount.html` (the main user-list page). Navigation links to `registerAccount.html`, `listAccount.html`, and `servantList.html`.

## Path quirk
Some HTML files reference JS with `../` (e.g. `registerAccount.html` → `../crypto-js.min.js`). When served from the repo root, `../` resolves back to root, so all scripts load correctly.

## Secrets
None required. The app has no server-side code; external API calls are made client-side.
