# Sextortion Escape — Telemetry & Metrics

This document defines **game-specific KPIs**, event naming, **privacy guardrails**, and how to run **monthly reports** against stored telemetry (`Event` documents). It also includes a **resume claim policy**: only cite numbers that match these definitions.

**Game identifier (canonical):** `sextortion-escape`

---

## 1. Summary: what we measure

| Pillar | What it answers |
|--------|-----------------|
| **Adoption** | Are people reaching the game and registering a playable session? |
| **Engagement** | Are they advancing through onboarding, starting levels, finishing runs? |
| **Learning outcomes** | Are they answering safely (accuracy on timed scenarios, use of scaffolding)? |
| **Funnel / drop-off** | Where do we lose users between content warning → welcome → instructions → gameplay → completion? |

---

## 2. Core game loop (for analytics alignment)

Players: view **content warning** → optional **story frames** → **welcome** (creates backend `Player`) → **instructions** → **`/game`**: **10 timed scenarios** (chat-thread + quizzes + special “helping friend”) with optional **hint** (1/run) and **remove two wrong answers** (2/run) → **feedback popups** → **endgame** + leaderboard PDF.

Success per scenario: picking the **correct** option **before timer hits 0** (timeout = attempted level with outcome `timeout`). Overall success: **`session.complete`** emitted after scenario 10 with `correctAnswers`, `badge`, `score`.

---

## 3. Event pipeline (implementations)

- **Ingress:** `POST /api/telemetry/events` — JSON body `{ events: [...] }` (batch). Each item has **`eventId`** (UUID v4, idempotency), **`eventType`**, timestamps, **`gameId`** = `sextortion-escape`, **`analyticSessionId`** (browser session), optional **`playerId`**, **`scenarioNumber`** / **`stepId`** as applicable, sanitized **`metadata`**, **`environment`**, **`clientVersion`**.
- **Storage:** MongoDB collection **`events`** (+ optional **`gamesessions`** rollups — see implementation).
- **PII minimization:** Events **must not** include free‑typed learner text (names, chat). Use **scenario numbers**, **`optionId`** (e.g. `A`–`D`), enums, aggregates only.

---

## 4. KPI dictionary & formulas

All rates use the **same time window** and optional **`environment`** filter (`development` \| `staging` \| `production` \| query `all` for reporting script).

Unless noted, denominators exclude events missing required fields after validation.

### 4.1 Adoption

| KPI | Formula | Caveats |
|-----|---------|---------|
| **unique_play_sessions** | `COUNT DISTINCT analyticSessionId` where `eventType = onboarding.player_ready` OR first `gameplay.level_start` in window | Proxies “device/session” — not strictly unique humans. |
| **player_profiles_created** | `COUNT DISTINCT playerId` from `players` with `completedAt != null OR updatedAt in window` **or** count `CREATE` success path — prefer counting **`onboarding.player_created`** events in window | Align with backend `Player` records if audited. |
| **starts** | `COUNT DISTINCT analyticSessionId` with `gameplay.level_start` and `scenarioNumber = 1` | “Started the timed game.” |

### 4.2 Engagement & completion

| KPI | Formula | Caveats |
|-----|---------|---------|
| **session_completes** | Count `session.complete` in window | “Finished all 10 scenarios” end-to-end per run telemetry. |
| **completion_rate** | `session_completes / unique analyticSessionIds that emitted gameplay.level_start with scenarioNumber=1` | If `starts` denominator is 0, rate undefined (report null). |

### 4.3 Session duration (approximate)

| KPI | Formula | Caveats |
|-----|---------|---------|
| **avg_session_duration_sec** | For each `analyticSessionId`, `max(timestamp) − min(timestamp)` over events between first `telemetry.client_ready`/`onboarding.ready` proxy and **`session.complete`**, averaged | Network clock skew negligible; excludes abandoned sessions unless you add explicit `session.abandon` (optional future). |

Use client-side **`session.complete` metadata.durationMsApprox** when present for tighter estimates (script uses `median` optional).

### 4.4 Funnel / drop‑off

**Ordered funnel columns** (reuse `funnel.transition` **`toStep`** enum):

| Step key | Meaning |
|---------|---------|
| `content_warning` | Landed `/` |
| `after_content_warning` | Continued toward intro frames |
| `welcome` | Reached `/welcome` |
| `instructions` | Reached `/instructions` |
| `game` | Reached `/game` |
| `endgame` | Reached `/endgame` |

| KPI | Formula |
|-----|---------|
| **dropoff_by_step** | For each consecutive pair `(A,B)`, `1 - COUNT(distinct sessions reaching B)/COUNT(distinct sessions reaching A)` | **Session reaching** = at least one `funnel.transition` with `toStep = B`. |

### 4.5 Game‑specific learning / performance KPIs (Sextortion Escape)

These are **unique to this product** — timed branching scenarios + abilities.

| KPI | Formula | Interpretation |
|-----|---------|----------------|
| **scenario_accuracy_overall** | Among `gameplay.answer_submitted`, `SUM(outcome=="correct") / COUNT(*)` excluding `timedOut=true` if you want knowledge-only denominator | Optionally report **two** lines: **with timeout** vs **exclude timeout**. |
| **timed_out_attempt_rate_per_level** | For each `scenarioNumber`: `COUNT(timedOut) / COUNT(gameplay.answer_submitted)` | Pressure / readability issues. |
| **help_seeking_usage_rate** | `COUNT DISTINCT analyticSessionId` with **`gameplay.hint_used` OR gameplay.remove_two_used` ≥ 1`** among sessions with ≥1 **`gameplay.answer_submitted`** | Use of scaffolding. |
| **safety_critical_scenario_accuracy** | Filter `scenarioType in ("threat","helping_friend")` → accuracy as above | Targets prevention behaviors vs pure stats quizzes. |

**Resume claim policy**

- ✅ **Approved claims** must cite: **window** (e.g. “Jan 2026”), **environment**, **definition** matching this doc, **`n`** (sample size).
- ⚠️ **Do not** claim “X% of teens” unless you also have demographics (we do **not** collect age in telemetry by default).
- 🔒 Never paste raw `metadata` blobs in resumes; summarize aggregates only.

---

## 5. Retention policy (recommended)

- **Operational retention:** Rolling **24 months** for `events` in production Analytics DB → archive to cold storage or aggregate monthly into summary tables then TTL.
- **Development:** Exclude from production KPIs (`environment !== production`) unless flagged for QA.

---

## 6. Ingest API (implementation)

| Item | Detail |
|------|--------|
| **Endpoint** | `POST /api/telemetry/events` |
| **Body** | `{ "events": [ { eventId, timestamp, gameId, analyticSessionId, eventType, metadata?, playerId?, stepNumber?, ... } ], "environment"?: "development"\|"staging"\|"production" }` |
| **Idempotency** | Same `eventId` → upsert; duplicate deliveries do not double-count rows. |
| **Storage** | MongoDB `events` collection (`Event` model). Optional **`GameSession`** rollup for quick dashboards. |

## 7. Monthly report command

From the repo root (requires `MONGO_URI` in `.env`).

### All telemetry (no date range — omit `--from` and `--to`)

Uses every matching event for that `gameId` (still respects `--env`).

```bash
npm run metrics:se
```

```bash
npm run metrics:se -- --env all
```

Output: **`reports/all-time/sextortion-escape-metrics.json`**.

### Bounded window (specific month)

```bash
npm run metrics:se -- --from 2026-01-01 --to 2026-01-31T23:59:59.999Z --env production
```

Equivalent:

```bash
node scripts/metrics/generateSextortionEscapeMetrics.js --gameId sextortion-escape --from 2026-01-01 --to 2026-01-31T23:59:59.999Z --env production
```

Bounded output: `reports/YYYY-MM/sextortion-escape-metrics.json`.

**Rules:** omit **both** `--from` and `--to` for all-time; if you pass one, you must pass the other.

---

## 8. Versioning

- **`ingestVersion`** (API): bumps when ingestion schema breaks backward compatibility.
- **`clientTelemetryVersion`** (frontend constant): bumped when emitted event shapes change.
