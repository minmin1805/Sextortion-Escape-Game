import mongoose from "mongoose";
import Event from "../models/Event.js";
import GameSession from "../models/GameSession.js";
import {
  GAME_ID_SEXTORTION_ESCAPE,
  validateAndNormalizeEvent,
  INGEST_VERSION,
} from "../telemetry/eventSchema.js";

function inferEnvironment(reqBody, nodeEnv = process.env.NODE_ENV) {
  if (
    typeof reqBody?.environment === "string" &&
    ["development", "staging", "production"].includes(reqBody.environment)
  ) {
    return reqBody.environment;
  }
  if (nodeEnv === "production") return "production";
  if (nodeEnv === "staging") return "staging";
  return "development";
}

async function applyGameSessionRollup(doc) {
  const aid = doc.analyticSessionId;
  if (!aid || !doc.timestamp) return;

  const meta = doc.metadata && typeof doc.metadata === "object" ? doc.metadata : {};
  const base = {
    lastEventAt: doc.timestamp,
    gameId: doc.gameId ?? GAME_ID_SEXTORTION_ESCAPE,
    environment: doc.environment ?? inferEnvironment({}, process.env.NODE_ENV),
  };

  if (doc.playerId && mongoose.Types.ObjectId.isValid(String(doc.playerId))) {
    base.playerId = new mongoose.Types.ObjectId(String(doc.playerId));
  }

  const $setExtra = {};

  switch (doc.eventType) {
    case "funnel.route_enter": {
      const r =
        typeof meta.route === "string"
          ? meta.route.slice(0, 160)
          : typeof meta.pathname === "string"
            ? meta.pathname.slice(0, 160)
            : null;
      if (r) $setExtra.lastRouteSeen = r;
      break;
    }
    case "gameplay.hint_opened":
      $setExtra.hintsUsedSeen = true;
      break;
    case "gameplay.remove_two_used":
      $setExtra.removeTwoUsedSeen = true;
      break;
    case "gameplay.level_start":
    case "gameplay.answer_submitted":
      break;
    case "session.complete":
      $setExtra.completed = true;
      $setExtra.completionAt = doc.timestamp;
      if (typeof meta.finalScore === "number") $setExtra.finalScore = Math.round(meta.finalScore);
      if (typeof meta.correctAnswers === "number")
        $setExtra.correctAnswers = Math.round(meta.correctAnswers);
      if (typeof meta.badge === "string") $setExtra.badge = meta.badge.slice(0, 64);
      break;
    default:
      break;
  }

  const $max =
    doc.eventType === "gameplay.level_start" || doc.eventType === "gameplay.answer_submitted"
      ? (() => {
          const sn =
            typeof doc.stepNumber === "number"
              ? doc.stepNumber
              : typeof meta.scenarioNumber === "number"
                ? meta.scenarioNumber
                : null;
          return typeof sn === "number" && Number.isFinite(sn) ? { maxScenarioReached: sn } : null;
        })()
      : null;

  const updateDoc = {
    $set: { ...base, ...$setExtra },
    $min: { firstEventAt: doc.timestamp },
    $setOnInsert: {
      analyticSessionId: aid,
      gameId: base.gameId,
      environment: base.environment,
    },
  };

  if ($max) updateDoc.$max = $max;

  await GameSession.updateOne({ analyticSessionId: aid }, updateDoc, { upsert: true });
}

export async function ingestTelemetryEvents(req, res) {
  const inferredEnv = inferEnvironment(req.body);
  const eventsPayload = Array.isArray(req.body?.events) ? req.body.events : [];

  if (eventsPayload.length === 0) {
    return res.status(400).json({ ok: false, error: "body.events array required (non-empty)" });
  }

  if (eventsPayload.length > 200) {
    return res.status(413).json({ ok: false, error: "batch too large (max 200 events)" });
  }

  const failures = [];
  const normalizedDocs = [];

  for (let i = 0; i < eventsPayload.length; i++) {
    const vn = validateAndNormalizeEvent(eventsPayload[i], {
      environment:
        typeof eventsPayload[i]?.environment === "string"
          ? eventsPayload[i].environment
          : inferredEnv,
    });
    if (!vn.ok) {
      failures.push({ index: i, errors: vn.errors });
      continue;
    }
    normalizedDocs.push(vn.document);
  }

  if (normalizedDocs.length === 0) {
    return res.status(422).json({
      ok: false,
      error: "all events rejected",
      ingestVersion: INGEST_VERSION,
      failures,
    });
  }

  try {
    await Event.bulkWrite(
      normalizedDocs.map((d) => ({
        updateOne: {
          filter: { eventId: d.eventId },
          update: { $set: d },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    await Promise.all(normalizedDocs.map((d) => applyGameSessionRollup(d)));

    return res.status(200).json({
      ok: true,
      accepted: normalizedDocs.length,
      rejected: failures.length,
      ingestVersion: INGEST_VERSION,
      failures: failures.length ? failures.slice(0, 20) : undefined,
    });
  } catch (err) {
    console.error("telemetry ingest:", err);
    return res.status(500).json({
      ok: false,
      error: "telemetry persistence failed",
      detail: String(err?.message ?? err),
    });
  }
}
