import axios from "axios";

const GAME_ID = "sextortion-escape";
const STORAGE_SESSION = "se_telemetry_session_id";
const STORAGE_PLAYER = "se_telemetry_player_object_id";
const STORAGE_START = "se_telemetry_run_start_ms";

const FLUSH_MS = 500;
const CLIENT_TELEMETRY_VERSION = "1"; // bump when event contracts change

/** @type {{ eventId: string, timestamp: string, gameId: string, analyticSessionId: string, playerId: string|null, eventType: string, metadata: object, stepNumber?: number|null, environment: string, ingestVersion: string, clientVersion?: string|null }[]} */
let queue = [];
let flushTimer = null;

function getOrCreateAnalyticsSessionId() {
  try {
    let id = sessionStorage.getItem(STORAGE_SESSION);
    if (!id) {
      id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `se-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(STORAGE_SESSION, id);
      sessionStorage.setItem(STORAGE_START, String(Date.now()));
    }
    return id;
  } catch {
    return `se-fallback-${Date.now()}`;
  }
}

/** Call when backend returns Mongo ObjectId for Player */
export function setTelemetryPlayerId(id) {
  if (id && typeof id === "string") {
    try {
      sessionStorage.setItem(STORAGE_PLAYER, id);
    } catch {
      /* ignore */
    }
  }
}

function getTelemetryPlayerId() {
  try {
    return sessionStorage.getItem(STORAGE_PLAYER);
  } catch {
    return null;
  }
}

function getRunStartMs() {
  try {
    const s = sessionStorage.getItem(STORAGE_START);
    const n = Number(s);
    return Number.isFinite(n) ? n : Date.now();
  } catch {
    return Date.now();
  }
}

function clientEnv() {
  // Vite exposes import.meta.env.PROD
  try {
    return import.meta.env?.PROD ? "production" : "development";
  } catch {
    return "development";
  }
}

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(() => flushNow(), FLUSH_MS);
}

async function flushNow() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  if (!queue.length) return;
  const batch = queue;
  queue = [];
  try {
    await axios.post("/api/telemetry/events", { events: batch, environment: clientEnv() });
  } catch (e) {
    // Non-blocking — re-queue for one retry-lite (drop silently if still failing)
    console.warn("[telemetry] batch failed (silent):", e?.message ?? e);
  }
}

/**
 * Emit a validated telemetry envelope. Never include freeform user-typed dialogue.
 *
 * @param {string} eventType
 * @param {Record<string, unknown>} [metadata]
 * @param {{
 *    stepNumber?: number|null,
 *    playerOverride?: string|null,
 * }} [opts]
 */
export function trackTelemetryEvent(eventType, metadata = {}, opts = {}) {
  try {
    const payload = {
      eventId:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      timestamp: new Date().toISOString(),
      gameId: GAME_ID,
      analyticSessionId: getOrCreateAnalyticsSessionId(),
      playerId: opts.playerOverride ?? getTelemetryPlayerId(),
      eventType,
      ...(typeof opts.stepNumber === "number" ? { stepNumber: opts.stepNumber } : {}),
      metadata:
        metadata && typeof metadata === "object" ? metadata : {},
      environment: clientEnv(),
      ingestVersion: CLIENT_TELEMETRY_VERSION,
      clientVersion: "fe-0",
    };

    queue.push(payload);
    scheduleFlush();
    if (queue.length >= 40) flushNow();
  } catch (e) {
    console.warn("[telemetry] enqueue failed (silent):", e?.message ?? e);
  }
}

/** First paint / SPA shell hydrated – helps adoption baseline */
export function trackTelemetryShellReady(meta = {}) {
  trackTelemetryEvent("telemetry.shell_ready", {
    ...meta,
    clientTelemetryVersion: CLIENT_TELEMETRY_VERSION,
    pathname:
      typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/",
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : undefined,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : undefined,
    navigatorLanguage: typeof navigator !== "undefined" ? navigator.language ?? "" : "",
  });
}

/** Duration since analytics session bootstrap (milliseconds) → session.complete.durationMsApprox */
export function telemetryApproxSessionDurationMs() {
  const start = getRunStartMs();
  return Math.max(0, Date.now() - start);
}
