# Sextortion Escape

An educational **browser game** for teens and young people about **sextortion** (online sexual coercion and extortion). Players work through real-world–style **chat scenarios and quiz questions**, use **hints** and **remove-wrong-answer** tools, and race the clock. Scores, badges, and a **leaderboard** encourage replay while reinforcing safe actions: **tell a trusted adult**, **report to NCMEC / Take It Down**, **block**, and **never pay**.

---

## Table of contents

- [What this project is](#what-this-project-is)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Run locally (development)](#run-locally-development)
- [Environment variables](#environment-variables)
- [Build for production](#build-for-production)
- [Project structure](#project-structure)
- [Future work (Friend or Foe)](#future-work-friend-or-foe)
- [License](#license)

---

## What this project is

**Sextortion Escape** is a full-stack web app:

- **Frontend:** React single-page app (Vite) with routes for a content warning, welcome/name entry, short intro “frames,” instructions, the **main game** (scenarios, timer, chat-style UI, feedback popups), and an **end game** page with score, learning bullets, and leaderboard.
- **Backend:** Node.js **Express** API that creates a **player session**, updates **score and completion** when a run ends, and serves **leaderboard** data from **MongoDB** (Mongoose).

The game is designed to be used in **schools, youth programs, or at home** with a standard modern browser. Content is **non-graphic** and education-focused.

---

## Features

| Area | Description |
|------|-------------|
| **Scenarios** | JSON-driven **chat threads** and **quiz** questions with multiple choice, correct/incorrect feedback, and “why it matters” copy. |
| **Timer & scoring** | Per-level timer; **faster correct answers** earn more points. |
| **Abilities** | **Hint** and **remove two wrong answers** (limited uses per run). |
| **Helping-friend & special cases** | Some scenarios include follow-up “thread” replies and Mom/trusted-adult style switches for teaching narrative. |
| **Leaderboard** | Top players by score (from MongoDB), merged with the current run on the end screen. |
| **Checklist** | **PDF safety checklist** download on the end game page. |
| **Audio** | Optional **background music** and **UI sounds** (toggle where enabled). |
| **Mobile** | **Responsive** layout; on small screens, a **landscape** reminder overlay encourages sideways play. |

---

## Tech stack

### Frontend (`frontend/`)

| Technology | Role |
|------------|------|
| **React 19** | UI and component model |
| **Vite 7** | Dev server, HMR, production build |
| **React Router 7** | Client-side routing (`/`, `/welcome`, `/game`, `/endgame`, etc.) |
| **Tailwind CSS 4** | Styling (with `@tailwindcss/vite`) |
| **Motion** | Animations (e.g. delayed consequences, popups) |
| **Axios** | HTTP client for API calls to `/api` |
| **react-icons** | Icons (e.g. download button) |
| **ESLint** | Code linting |

The Vite dev server **proxies** `/api` to the backend (see `frontend/vite.config.js` → `http://localhost:8000`).

### Backend (repo root + `backend/`)

| Technology | Role |
|------------|------|
| **Node.js** | Runtime (ES modules: `"type": "module"`) |
| **Express 5** | HTTP API |
| **Mongoose 9** | MongoDB ODM |
| **dotenv** | Load `.env` (e.g. `MONGO_URI`) |
| **cors** | Cross-origin requests in development |
| **nodemon** | Auto-restart backend during `npm run dev` (root) |

In **production**, `server.js` can serve the **built** frontend from `frontend/dist` as static files and fall back to `index.html` for SPA routes.

### Data & content

- **Scenarios** live in `frontend/src/data/scenarios.json`.
- **Planned** (“Friend or Foe”): design docs in `docs/` (profile content, build plan)—see [Future work](#future-work-friend-or-foe).

---

## Requirements

| Requirement | Notes |
|-------------|--------|
| **Node.js** | **LTS 20.x or 22.x** recommended (matches modern Vite / React; use `node -v` to check). |
| **npm** | Comes with Node (`npm -v`). |
| **MongoDB** | A reachable **MongoDB** instance (local install, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), or Docker). The app needs a **connection string** in `.env`. |
| **Browser** | Current Chrome, Firefox, Safari, or Edge. |

**Optional:** `git` to clone the repository.

---

## Run locally (development)

You need **two processes** in development: the **API** (port **8000** by default) and the **Vite dev server** (port **5173** by default). The frontend is configured to proxy `/api` to the backend, so the browser can call `/api/players` on the Vite origin without CORS pain.

### 1. Install dependencies

From the **repository root**:

```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Configure environment

In the project root, create a **`.env`** file (or copy from an example if your team provides one):

```env
MONGO_URI=mongodb://127.0.0.1:27017/your_database_name
PORT=8000
```

- Replace `MONGO_URI` with your real MongoDB URI.
- `PORT` is optional; the default in code is **8000** if omitted.

> **Security:** Never commit real `.env` files or production secrets. Add `.env` to `.gitignore` (it usually is already).

### 3. Start MongoDB

- **Local install:** start the `mongod` service so it matches `MONGO_URI`.
- **Atlas:** use your cluster’s SRV string and allow your IP in the network rules.

### 4. Start the backend (API)

From the **repository root**:

```bash
npm run dev
```

This runs **nodemon** on `backend/server.js`. You should see logs that the server is listening and MongoDB is connected.

### 5. Start the frontend (Vite)

In a **second terminal**, from the repository root:

```bash
cd frontend
npm run dev
```

Vite will print a local URL, typically **http://localhost:5173**. Open that in your browser to play the game.

### 6. Open the app

- Visit the URL Vite shows (e.g. **http://localhost:5173**).
- You should be able to enter a name, play scenarios, and see the end screen; the leaderboard calls **`GET /api/players/leaderboard`** via the proxy.

**Troubleshooting**

| Issue | What to check |
|--------|----------------|
| `MongoDB` connection error | `MONGO_URI`, firewall, Atlas IP allowlist, local `mongod` running. |
| API 404 or network errors in browser | Backend running? Vite **proxy** target is `http://localhost:8000`—if you change `PORT`, update `frontend/vite.config.js` or set backend to 8000. |
| Blank page or wrong route | Open the root path; routing is client-side. Use Vite’s dev server, not `file://`. |

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | **Yes** (for API + leaderboard) | Full MongoDB connection string. |
| `PORT` | No | API port. Defaults to **8000** in `backend/server.js` if not set. |

The frontend does **not** need its own API URL in dev if you use the Vite proxy; production builds are expected to be served from the same host as the API (see `server.js` static + SPA fallback) or you must align `axios` base URLs with your deployment.

---

## Build for production

From the **repository root**, the `build` script installs root + frontend dependencies and runs the Vite production build:

```bash
npm run build
```

This produces `frontend/dist`. Then start the app with **Node** (serving API + static files):

```bash
npm start
```

Set `NODE_ENV=production` in your host environment if you rely on production-only static serving in `server.js`. Ensure `MONGO_URI` (and `PORT` if needed) are set on the server.

**Preview the built frontend only** (API still separate unless you use `npm start`):

```bash
cd frontend
npm run preview
```

---

## Project structure

```
Sextortion Escape/
├── backend/
│   ├── server.js              # Express app, CORS, routes, optional static + SPA
│   ├── lib/db.js              # MongoDB connect
│   ├── models/Player.js       # Player schema
│   ├── controllers/playerController.js
│   └── routes/playerRoutes.js # /api/players
├── frontend/
│   ├── index.html
│   ├── vite.config.js         # proxy /api → localhost:8000
│   ├── src/
│   │   ├── App.jsx            # routes, music/sound, orientation shell
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── data/scenarios.json
│   │   ├── services/playerService.js
│   │   ├── components/        # game UI, popups, banner, etc.
│   │   └── assets/            # images, audio, PDFs
│   ├── context/               # GameContext, Music, Sound
│   └── pages/                 # per-route screens
├── docs/                      # Friend or Foe design (future)
├── package.json               # root scripts + backend deps
└── .env                       # not committed; MONGO_URI, PORT
```

---

## Future work (Friend or Foe)

A separate design for **Friend or Foe** (profile trust / flagging game) is documented in this repo for planning and a future build:

- **`docs/FRIEND_OR_FOE_BUILD_PLAN.md`** – architecture and step-by-step build notes  
- **`docs/FRIEND_OR_FOE_PROFILE_CONTENT.md`** – profile copy and `elementKey` flag mapping  

The current runnable game in this repository is **Sextortion Escape**; Friend or Foe is **not** a second deployed app in this tree unless you add it following those docs.

---

## License

This project’s license is set in `package.json` (e.g. **ISC**). If you need a custom license for Our Rescue or partners, update this section and the `license` field accordingly.

---

**Built with** React, Vite, Tailwind, Express, and MongoDB — for safer choices online and faster help when sextortion happens.
