/**
 * Telemetry contract for gameId "sextortion-escape".
 * Unknown metadata keys are stripped; forbidden keys rejected with validation error if present after strip.
 */

export const GAME_ID_SEXTORTION_ESCAPE = "sextortion-escape";

/** Ingest/API contract version increment on breaking ingestion changes */
export const INGEST_VERSION = "1";

/** Allowed environments */
export const ENVIRONMENTS = new Set(["development", "staging", "production"]);

const META_ALLOWLIST_BY_TYPE = Object.freeze({
  // Client shell / funnel
  "telemetry.shell_ready": [
    "clientTelemetryVersion",
    "locale",
    "viewportWidth",
    "viewportHeight",
    "pathname",
    "navigatorLanguage",
  ],

  /** Route-based funnel (sanitized pathname) */
  "funnel.route_enter": ["route"],

  // Player lifecycle — playerId injected server-side if missing but valid in body.playerId elsewhere
  "onboarding.player_created": [],

  // Gameplay — timed scenarios A–D, etc.
  "gameplay.level_start": ["scenarioNumber", "scenarioType", "difficulty"],
  "gameplay.answer_submitted": [
    "scenarioNumber",
    "scenarioType",
    "optionId",
    "correct",
    "timedOut",
    "timeRemainingSecs",
  ],
  /** Hint modal opened successfully (consumes quota or opens UI) — implementation detail: emits when modal opens before limit */
  "gameplay.hint_opened": ["scenarioNumber"],
  /** Remove-two clicked and succeeded (narrowed choices) */
  "gameplay.remove_two_used": ["scenarioNumber"],

  /** User dismissed Correct/Incorrect modal and advanced */
  "gameplay.feedback_continue": ["scenarioNumber"],

  /** End screen shown */
  "ui.endgame_view": [],

  /** Run completion after final scenario scoring + persistence attempt */
  "session.complete": ["finalScore", "correctAnswers", "badge", "durationMsApprox"],

  /** Lightweight PDF/tooling */
  "ui.checklist_download_click": [],

  /** Frontend catch-all for non-fatal issues (still sanitized) — avoid stack traces */
  "client.error_soft": ["code", "message"],
});

export const ALLOWED_EVENT_TYPES = new Set(Object.keys(META_ALLOWLIST_BY_TYPE));

const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function isPlainObject(val) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

/** Pick only keys in allowlist; reject non-scalar primitives for values (no nested blobs) except small numbers/strings/bools */
export function sanitizeMetadata(eventType, metadata) {
  const allowlist = META_ALLOWLIST_BY_TYPE[eventType];
  if (!allowlist || !metadata) return {};

  const out = {};
  for (const key of allowlist) {
    if (!(key in metadata)) continue;
    const v = metadata[key];
    const t = typeof v;
    if (v === null || v === undefined) continue;
    if (key === "timeRemainingSecs" || key === "viewportWidth" || key === "viewportHeight") {
      if (typeof v === "number" && Number.isFinite(v)) out[key] = Math.round(v);
      continue;
    }
    if (key === "durationMsApprox" || key === "finalScore" || key === "correctAnswers") {
      if (typeof v === "number" && Number.isFinite(v)) out[key] = Math.round(v);
      continue;
    }
    if (key === "correct" || key === "timedOut") {
      if (typeof v === "boolean") out[key] = v;
      continue;
    }
    if (key === "scenarioNumber") {
      if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
      continue;
    }
    if (
      [
        "scenarioType",
        "difficulty",
        "locale",
        "navigatorLanguage",
        "badge",
        "code",
      ].includes(key) &&
      typeof v === "string"
    ) {
      const s = v.slice(0, 96);
      if (s.length) out[key] = s;
      continue;
    }
    if (key === "optionId" && typeof v === "string") {
      out[key] = v.slice(0, 8);
      continue;
    }
    if (key === "message" && typeof v === "string") {
      out[key] = v.slice(0, 280);
      continue;
    }
    if (
      ["route", "pathname"].includes(key) &&
      typeof v === "string" &&
      v.length &&
      /^[/a-zA-Z0-9\-_.]+$/.test(v)
    ) {
      out[key] = v.slice(0, 128);
    }
    if (key === "clientTelemetryVersion" && typeof v === "string") out[key] = v.slice(0, 24);
  }
  return out;
}

/**
 * @param {*} rawIncoming - single event payload from HTTP body.events[]
 * @returns {{ ok: boolean, errors: string[], document: object|null }}
 */
export function validateAndNormalizeEvent(rawIncoming, serverDefaults = {}) {
  const errors = [];
  const e = rawIncoming && typeof rawIncoming === "object" ? { ...rawIncoming } : {};

  if (!e.eventId || typeof e.eventId !== "string") errors.push("eventId must be a string");
  else if (!/^[0-9a-f-]{36}$/i.test(e.eventId)) errors.push("eventId must look like a UUID");

  let ts;
  try {
    if (!e.timestamp) throw new Error("missing");
    ts = new Date(e.timestamp);
    if (Number.isNaN(ts.getTime())) throw new Error("bad date");
  } catch {
    errors.push("timestamp must be ISO-8601");
  }

  const gameId = e.gameId;
  if (!gameId || typeof gameId !== "string") errors.push("gameId is required");
  else if (gameId !== GAME_ID_SEXTORTION_ESCAPE) errors.push(`gameId must be ${GAME_ID_SEXTORTION_ESCAPE}`);

  if (!e.analyticSessionId || typeof e.analyticSessionId !== "string")
    errors.push("analyticSessionId is required");
  else if (e.analyticSessionId.length > 64) errors.push("analyticSessionId too long");

  let playerId = e.playerId;
  if (playerId !== undefined && playerId !== null) {
    if (typeof playerId !== "string" || !OBJECT_ID_RE.test(playerId)) errors.push("playerId must be Mongo ObjectId string if present");
    else playerId = playerId;
  } else {
    playerId = null;
  }

  const eventType = e.eventType;
  if (!eventType || typeof eventType !== "string") errors.push("eventType is required");
  else if (!ALLOWED_EVENT_TYPES.has(eventType))
    errors.push(`eventType '${eventType}' is not registered for this game`);

  let stepNumber = e.stepNumber;
  if (stepNumber !== undefined && stepNumber !== null) {
    if (typeof stepNumber !== "number" || !Number.isFinite(stepNumber)) errors.push("stepNumber must be finite number");
  } else {
    stepNumber = null;
  }

  let stepId = e.stepId;
  if (stepId !== undefined && stepId !== null) {
    if (typeof stepId !== "string" || stepId.length > 96) errors.push("stepId invalid");
  } else {
    stepId = null;
  }

  let environment = serverDefaults.environment || e.environment || "development";
  if (!ENVIRONMENTS.has(environment)) errors.push(`environment must be one of ${[...ENVIRONMENTS].join(",")}`);

  let ingestVersion =
    typeof e.ingestVersion === "string" ? e.ingestVersion : INGEST_VERSION;

  let clientVersion = e.clientVersion;
  if (clientVersion !== undefined && clientVersion !== null) {
    if (typeof clientVersion !== "string") errors.push("clientVersion must be string");
    else clientVersion = clientVersion.slice(0, 32);
  } else clientVersion = null;

  let metadataRaw = e.metadata ?? {};
  if (!isPlainObject(metadataRaw)) {
    metadataRaw = {};
    errors.push("metadata must be a plain object if present");
  }

  const sanitized = eventType ? sanitizeMetadata(eventType, metadataRaw) : {};
  /* Unknown metadata keys are stripped in sanitizeMetadata (no validation error). */

  if (errors.length) return { ok: false, errors, document: null };

  const document = {
    eventId: e.eventId,
    timestamp: ts,
    gameId,
    analyticSessionId: e.analyticSessionId,
    playerId,
    eventType,
    stepNumber:
      typeof stepNumber === "number"
        ? stepNumber
        : sanitized.scenarioNumber != null
          ? sanitized.scenarioNumber
          : null,
    stepId,
    metadata: sanitized,
    environment,
    ingestVersion,
    clientVersion,
  };

  return { ok: true, errors: [], document };
}
