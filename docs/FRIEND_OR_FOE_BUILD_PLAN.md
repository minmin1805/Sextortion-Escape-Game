# Friend or Foe – Technical Build Plan

This document is a **detailed plan and step-by-step build guide** for the next game, **Friend or Foe**. It is written so that **another Cursor agent** (or developer) can understand the existing project structure, carry it over, and implement the new game without the original context.

---

## 1. Purpose of this document

- **Carry over** the same high-level structure as the current game (Sextortion Escape): backend with **models, controllers, routes**, frontend with **pages, components, context, services**, and shared patterns (env, db, API).
- **Define** what the new game does and what to build (data shapes, APIs, UI flow).
- **Give ordered steps** so a Cursor agent can build the game incrementally (backend first, then data, then frontend).

**Related doc:** Profile content and red-flag mapping live in **`docs/FRIEND_OR_FOE_PROFILE_CONTENT.md`**. Use that for copy, post text, and the list of `elementKey`s per profile. This doc focuses on **architecture and build steps**.

---

## 2. Game overview: Friend or Foe

**Concept:** The player sees a series of **social media profiles** (one at a time). For each profile they must decide: **ACCEPT** (safe to add as a friend) or **REJECT** (suspicious/fake). They can **flag** specific elements on the profile (photo, bio, individual posts, Friends section, Photos section) as red flags before submitting their decision. The game teaches teens to spot fake or predatory profiles.

**Core loop:**

1. Show one profile (intro section, posts list, Friends block, Photos block).
2. Player can click elements to “flag” them as suspicious (each flag is one `elementKey`).
3. Player chooses **ACCEPT** or **REJECT**.
4. Show feedback (correct/incorrect), explanation, and score.
5. Next profile until all are done; then show end screen and leaderboard.

**Scoring (to be tuned):** e.g. correct REJECT = points; correct ACCEPT = points; wrong decision = 0 or penalty; optional: bonus for flagging the right red-flag elements.

**Special abilities and helpers:**

- **Double Points ability:** Once the player’s score passes **4000 points**, they unlock a **one‑time “Double Points” ability**. They can activate it from a bar at the bottom of the game screen; when active, the **next profile decision** they make gives **double the normal points**, then the ability is consumed.
- **Reference notebook:** Every profile screen has a small **notebook icon**. Clicking it opens a popup that shows one section per profile (Profile 1–10) in the **actual order the player has played them**, with **reminders based on flags they missed** on each profile (e.g. “Remember to check the joined date”). Profiles where the player did not miss any flags have an empty reminder section.

---

## 3. Current project structure (carry this over)

The existing **Sextortion Escape** app uses this layout. **Reuse the same patterns** for Friend or Foe.

### 3.1 Repository layout

```
project-root/
├── backend/
│   ├── server.js           # Express app, CORS, mount routes, serve frontend in production
│   ├── lib/
│   │   └── db.js           # MongoDB connection (mongoose)
│   ├── models/
│   │   └── Player.js       # Mongoose schema (sessionId, name, score, correctAnswers, badge, completedAt)
│   ├── controllers/
│   │   └── playerController.js   # createPlayer, updatePlayer, getLeaderboard
│   └── routes/
│       └── playerRoutes.js      # GET /leaderboard, POST /, PATCH /:id
├── frontend/                # Vite + React
│   ├── src/
│   │   ├── App.jsx         # Router, providers (Game, Music, Sound), routes
│   │   ├── main.jsx
│   │   ├── index.css        # Tailwind + custom (e.g. orientation overlay)
│   │   ├── data/
│   │   │   └── scenarios.json   # All scenarios for current game
│   │   ├── services/
│   │   │   └── playerService.js # API calls: createPlayer, updatePlayer, getLeaderboard
│   │   └── components/     # Reusable UI (GameBanner, QuestionDisplay, etc.)
│   ├── context/
│   │   ├── GameContext.jsx  # Game state, scenario index, score, actions
│   │   ├── MusicContext.jsx
│   │   └── SoundContext.jsx
│   ├── pages/               # One component per route (WelcomePage, GamePage, EndgamePage, ...)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── FRIEND_OR_FOE_PROFILE_CONTENT.md   # All profile copy + red flags (elementKeys)
│   └── FRIEND_OR_FOE_BUILD_PLAN.md        # This file
├── .env                    # MONGO_URI, PORT, etc.
└── package.json            # "main": "backend/server.js", scripts: dev, start, build
```

### 3.2 Backend pattern

- **Model** (`backend/models/`): Mongoose schema, one file per entity.
- **Controller** (`backend/controllers/`): Async handlers; read/write DB; return JSON; use `req.params`, `req.body`, `req.query`.
- **Routes** (`backend/routes/`): Express router; map HTTP method + path to controller; export router.
- **server.js**: `connectDB()`, `app.use(express.json())`, `app.use("/api/players", playerRoutes)`, optional static frontend in production.

### 3.3 Frontend pattern

- **Services** (`frontend/src/services/`): Axios (or fetch) calls to backend API; no React.
- **Context** (`frontend/context/`): React context for global game state (e.g. player id, current scenario index, score); providers in `App.jsx`.
- **Pages** (`frontend/pages/`): Full-screen views; use context and router; render components.
- **Components** (`frontend/src/components/`): Reusable UI; receive props and callbacks.
- **Data** (`frontend/src/data/`): JSON (e.g. scenarios or profiles) imported by context or pages.

### 3.4 Environment and scripts

- **.env**: `MONGO_URI`, `PORT`; loaded in `backend/server.js` via `dotenv`.
- **Root package.json**: `"type": "module"`, `dev` (nodemon backend), `start` (node backend), `build` (install + build frontend).
- **Frontend**: Vite; proxy to backend in dev if needed (or same-origin when served by Express).

---

## 4. What to build for Friend or Foe

### 4.1 Backend (same structure, new/updated entities)

- **Keep:** `lib/db.js`, same connection pattern.
- **Player (or Session) model:** Either reuse existing `Player` model and extend fields, or add a new model (e.g. `FriendOrFoePlayer`) with at least: `sessionId`, `name`, `score`, `correctDecisions` (or similar), `completedAt`, optional `badge`. Match what the frontend and leaderboard need.
- **Controller:** Create/update player, get leaderboard (filter by game if you have multiple games, or use a separate collection).
- **Routes:** Same pattern: e.g. `POST /` (create), `PATCH /:id` (update), `GET /leaderboard` (list). Mount under e.g. `/api/players` or `/api/fof/players` if you want a separate prefix.

### 4.2 Data: profiles (replaces scenarios)

- **File:** `frontend/src/data/profiles.json` (or same repo, different path).
- **Structure (conceptual):** Array of profiles. Each profile has:
  - **Meta:** `profileId`, `difficulty` (easy / medium / hard), `correctDecision` (`"accept"` | `"reject"`).
  - **Intro (display only):** `username`, `displayName`, `profilePhoto` (url or asset key), `bio`, `location`, `accountAge` (e.g. "Created 3 days ago"), `friends`, `followers`, `following`, `mutualFriends`.
  - **Posts:** Array of `{ id: "post_1", text: "...", date: "...", hasImage: boolean }` (ids must match `elementKey` in red flags).
  - **Sections:** `friendsSection` (e.g. label + count), `photosSection` (e.g. description or image list).
  - **Red flags:** Array of `{ elementKey: string, reason: string }`. `elementKey` is one of: `profilePhoto`, `username`, `bio`, `location`, `joinedDate`, `friends`, `followers`, `following`, `mutualFriends`, `post_1` … `post_N`, `section_friends`, `section_photos`. See **`docs/FRIEND_OR_FOE_PROFILE_CONTENT.md`** for the exact list per profile.
  - **Copy:** `explanationRejectedCorrect`, `explanationAcceptedWrong` (and vice versa for accept-correct / reject-wrong).

Build `profiles.json` from the tables and text in `FRIEND_OR_FOE_PROFILE_CONTENT.md` so every red flag has exactly one `elementKey` and the UI can highlight/handle clicks per element.

### 4.3 Frontend: pages and flow

- **Flow:** ContentWarning (optional) → Welcome (name) → Instructions (optional) → **Game** (one profile at a time: view profile → flag elements → ACCEPT/REJECT → feedback) → **Endgame** (score, leaderboard, maybe PDF/download).
- **Pages to add/adapt:**
  - **WelcomePage:** Enter name; create player via API; store player id/session in context; navigate to instructions or game.
  - **InstructionsPage:** Explain rules: you’ll see profiles, flag red flags, then accept or reject; scoring rules.
  - **GamePage:** Main screen. Shows current profile (from `profiles.json` + context); **ProfileView** (intro, posts, friends section, photos section); **Flagging UI** (clickable elements with `elementKey`; track which are flagged); **ACCEPT / REJECT** buttons; on submit, compute correct/incorrect, show **FeedbackModal** (explanation + score), then next profile or end. The bottom of this page also shows a **Double Points bar** (locked until 4000 points, then a one-time activation button), and a **notebook icon** that opens the reference notebook popup.
  - **EndgamePage:** Final score, leaderboard (from API), optional checklist PDF download (reuse pattern from current game if desired).

### 4.4 Frontend: context and services

- **Context (e.g. FriendOrFoeContext or extend GameContext):**
  - State: 
    - Core: `playerId`, `playerName`, `currentProfileIndex`, `score`, `flaggedElements` (per profile: Set or array of `elementKey`), `decisions` (per profile: accept/reject), `gameComplete`.
    - **Double Points ability:** `doubleUnlocked` (score has reached 4000+ at least once), `doubleAvailable` (can be activated), `doubleActive` (will double the next decision), `doubleUsed` (ability consumed).
    - **Notebook / reminders:** `remindersByProfileId` (map: profileId → array of reminder strings like “Remember to check the joined date”), `playOrder` (array of profileIds in the actual order the player has played them).
  - Actions: 
    - Core: createPlayer, setFlag(elementKey), clearFlags, submitDecision(accept|reject), goToNextProfile, fetchLeaderboard.
    - Double Points: `activateDoublePointsForNextDecision()` (sets `doubleActive` and consumes `doubleAvailable`), logic inside `submitDecision` to multiply points by 2 if `doubleActive`, then mark `doubleUsed` and clear `doubleActive`; also unlock the ability (set `doubleUnlocked`/`doubleAvailable`) when `score` first reaches 4000+.
    - Notebook: after each decision, compute which red-flag `elementKey`s were **not** flagged by the player on that profile, convert them to reminder sentences, and store them in `remindersByProfileId[profileId]`; update `playOrder` to include that profileId if it isn’t already there.
- **Service:** Same as current: `createPlayer`, `updatePlayer`, `getLeaderboard` (or equivalent names). Base URL can be same `/api/players` or new prefix.

### 4.5 Frontend: components

- **ProfileView:** Renders one profile: intro block (photo, username, bio, location, account age, friends/followers/following/mutual with correct `elementKey` on each), list of posts (each post clickable with `post_1`…`post_N`), Friends section (one clickable block → `section_friends`), Photos section (one clickable block → `section_photos`). Accept `flaggedSet` and `onFlag(elementKey)` so clicking toggles flag and parent can style flagged state.
- **FeedbackModal:** Shows correct/incorrect, explanation text, points; button to continue (next profile or end).
- **Leaderboard:** Reuse or adapt existing leaderboard component; data from API.

---

## 5. Step-by-step build instructions (for a Cursor agent)

Follow in order; each step assumes the previous ones are done.

### Phase A: Backend

1. **Ensure backend runs:** From repo root, `npm run dev` (or `node backend/server.js`), `.env` has `MONGO_URI` and `PORT`. DB connection in `backend/lib/db.js` unchanged unless you need a second DB.

2. **Player (or session) model for Friend or Foe:**  
   - In `backend/models/`, add or update a schema (e.g. `Player.js` or `FriendOrFoePlayer.js`) with: `sessionId`, `name`, `score`, `correctDecisions`, `completedAt`, `badge` (or equivalent). Use the same collection as current game if you want one leaderboard, or a new collection for FOF-only.

3. **Controller:**  
   - In `backend/controllers/`, add or update (e.g. `playerController.js` or `friendOrFoeController.js`):  
     - `createPlayer`: create document with `sessionId` (e.g. crypto.randomUUID()), `name`; return `id`, `name`, `sessionId`.  
     - `updatePlayer`: by id, update `score`, `correctDecisions`, `badge`, `completedAt`.  
     - `getLeaderboard`: find completed (e.g. `completedAt` ne null), sort by score desc, limit (e.g. 10), return name, score, correctDecisions, badge.

4. **Routes:**  
   - In `backend/routes/`, add or update router: `POST /`, `PATCH /:id`, `GET /leaderboard`.  
   - In `backend/server.js`, mount router at e.g. `app.use("/api/players", playerRoutes)` (or `/api/fof/players`).

5. **Manual test:** Use curl or Postman: create player, patch update, get leaderboard. Confirm 201/200 and JSON shape.

### Phase B: Data

6. **Create `profiles.json`:**  
   - In `frontend/src/data/`, create `profiles.json`.  
   - For each profile in `docs/FRIEND_OR_FOE_PROFILE_CONTENT.md`, add one object: meta (profileId, difficulty, correctDecision), intro fields (username, displayName, bio, location, accountAge, friends, followers, following, mutualFriends), posts array (each with id matching `post_1`…`post_N`), friendsSection/photosSection, redFlags array (`elementKey` + reason), and explanation strings.  
   - Ensure every `elementKey` in redFlags exists as a clickable element (intro field, post id, or section_friends / section_photos).

### Phase C: Frontend – core flow

7. **Service:**  
   - In `frontend/src/services/`, add or update (e.g. `playerService.js` or `friendOrFoeService.js`): functions that call backend create, update, leaderboard. Use same base URL as backend routes (and proxy in Vite if needed).

8. **Context:**  
   - Add or update context (e.g. `FriendOrFoeContext.jsx` or reuse `GameContext.jsx`): state for playerId, playerName, currentProfileIndex, score, flaggedElements (e.g. Map or object keyed by profile index, value = Set of elementKey), decisions, gameComplete.  
   - Load `profiles.json` (import or fetch).  
   - Implement: createPlayer(name) → API, store id/name; setFlag(profileIndex, elementKey); submitDecision(profileIndex, accept|reject) → compare to profile.correctDecision, update score, push decision, advance index or set gameComplete; update player via API when game ends; getLeaderboard().

9. **Routing and providers:**  
   - In `frontend/src/App.jsx`, wrap app in the game context provider; add routes: `/` (or content warning), `/welcome`, `/instructions`, `/game`, `/endgame`. Wire navigation from Welcome → Instructions or Game, Game → next profile or Endgame, Endgame shows leaderboard.

10. **WelcomePage:**  
    - Input for name; on submit call context createPlayer; on success navigate to instructions or game. Handle loading and error.

11. **InstructionsPage:**  
    - Static copy explaining: view profile, flag red flags, accept or reject, scoring. Button to start game → navigate to `/game`.

### Phase D: Frontend – game screen

12. **ProfileView component:**  
    - Props: profile (from profiles.json), flaggedSet (Set of elementKey), onFlag(elementKey).  
    - Render intro: each field (photo, username, bio, location, accountAge, friends, followers, following, mutualFriends) in a wrapper that calls `onFlag` with the correct elementKey and shows “flagged” state when in flaggedSet.  
    - Render posts: map over profile.posts, each item clickable with id as elementKey.  
    - Render Friends section: one block, onClick → onFlag("section_friends").  
    - Render Photos section: one block, onClick → onFlag("section_photos").  
    - No backend call here; pure UI + callbacks.

13. **GamePage:**  
    - Get current profile from context (profiles[currentProfileIndex]).  
    - State: local flagged set for current profile (or read from context).  
    - Render ProfileView with profile, flaggedSet, onFlag (toggle in context or local state).  
    - Two buttons: ACCEPT, REJECT. On click: context.submitDecision(accept|reject); context will compute correctness and show feedback.  
    - When feedback is to be shown, render FeedbackModal (or inline) with explanation and “Continue” → next profile or navigate to endgame.  
    - If no more profiles, context sets gameComplete; GamePage can redirect to EndgamePage.  
    - Render a **Double Points bar** anchored at the bottom of the screen:
      - Before unlock: text like “Reach 4000 points to unlock Double Points ability”.
      - After unlock (and before use): text like “Double Points ready – use it for your next decision” plus a button that calls `activateDoublePointsForNextDecision()`.
      - When `doubleActive` is true: highlight the bar and show “Double Points ACTIVE – your next decision will earn double points.”
      - After use: show “Double Points ability used.”
    - Render a small **notebook icon** (e.g. in a corner of the game UI) that toggles `showNotebook` state and opens the notebook popup for reminders.

14. **FeedbackModal:**  
    - Props: correct (boolean), explanation (string), points (number), onContinue().  
    - Show “Correct” / “Incorrect”, explanation text, points; button to call onContinue.  
    - If the Double Points ability was active for this decision, also show a small “×2” indicator next to the awarded points.

15. **EndgamePage:**  
    - Show final score (from context). Fetch leaderboard via context or service; render Leaderboard component. Optional: button to download checklist PDF (reuse asset and download logic from current game).

### Phase E: Polish

16. **Scoring logic:** In context, define how many points for correct reject, correct accept; whether wrong decision is 0 or penalty; optional: bonus for flagging red-flag elements. Persist final score and completedAt via updatePlayer.
    - Implement Double Points: when `doubleActive` is true, multiply the base points by 2 for that decision, then set `doubleUsed = true`, `doubleActive = false`. Unlock the ability (set `doubleUnlocked`/`doubleAvailable`) the first time `score` reaches or exceeds 4000.

17. **Styling and responsiveness:** Use Tailwind (or existing CSS). Make ProfileView and buttons readable on mobile; consider orientation overlay for landscape-only play if desired (reuse from current game).

18. **Testing:** Play through: create player, complete one profile (flag some elements, submit accept/reject), see feedback, go to next; complete all profiles; see endgame and leaderboard. Verify leaderboard in DB/API.
    - Specifically test: unlocking Double Points at 4000+, activating it, and confirming that exactly one decision is doubled; also test the notebook popup shows reminders only for missed red flags per profile in the order profiles were played.

---

## 6. Summary for the agent

- **Structure:** Keep backend (model → controller → route) and frontend (service → context → pages → components). Use the same repo, env, and scripts.
- **Data:** Profiles live in `profiles.json`; every red flag has one `elementKey`; see `docs/FRIEND_OR_FOE_PROFILE_CONTENT.md` for content and mapping.
- **Order of work:** Backend (model, controller, routes) → profiles.json → service + context → routes + Welcome + Instructions → ProfileView + GamePage + FeedbackModal → Endgame + Leaderboard → scoring and polish.

If you are a Cursor agent building this game: start with **Phase A**, then **B**, then **C**, then **D**, then **E**. Use `FRIEND_OR_FOE_PROFILE_CONTENT.md` as the source of truth for profile copy and red-flag elementKeys.
