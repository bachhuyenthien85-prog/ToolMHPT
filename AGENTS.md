# XZTW Bot Manager — Base44 Dev Environment

## What this is
A full-stack game bot management web app. Backend: Node.js + Express + SQLite (better-sqlite3). Frontend: static HTML/JS pages with Bootstrap (dark mode). The app manages game accounts and their bot configurations, and can run bot automation scripts in the browser.

## Running it
```bash
docker compose -f docker-compose.base44.yml up -d
```
- `node:22-slim` runs `server/server.js` on port 3000.
- `node --watch` auto-restarts on backend file changes.
- Frontend HTML changes need a page refresh (call `reload_preview`).
- SQLite database stored in `data/bot.db`.

## Architecture
- `server/server.js` — Express API + static file serving
- `server/db.js` — SQLite setup, schema, seed data
- `public/dashboard.html` — main page: account table, register modal (code-protected)
- `public/account.html` — bot config form (all settings checkboxes/fields)
- `public/run.html` — loads bot scripts in order, sets localStorage, runs auto functions
- `lib/` — crypto-js, jquery, encrypt, getToken, servants, miniEvents (DO NOT MODIFY)
- `auto/` — auto.js, autoV2.js, autoV3.js, webBrowser.js (DO NOT MODIFY)

## API
- `GET /api/accounts` — list all accounts
- `GET /api/accounts/:id` — get one account
- `POST /api/accounts` — create (requires `code: "Vunb7117@"` in body, 401 if wrong)
- `PUT /api/accounts/:id` — update account/settings
- `DELETE /api/accounts/:id` — delete
- `GET/PUT /api/settings/:key` — app settings

## Secrets
None required. The registration code `Vunb7117@` is hardcoded in `server/server.js`.

## Key rules
- Do NOT modify files in `/auto/` or `/lib/`.
- No login/register pages (only the code modal in dashboard).
- Dark mode throughout.
