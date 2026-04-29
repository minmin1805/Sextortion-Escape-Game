import mongoose from "mongoose";

/**
 * Lightweight session rollup for dashboards (distinct from immutable Event stream).
 * Updated incrementally during telemetry ingest — not authoritative for audit replay.
 */
const gameSessionSchema = new mongoose.Schema(
  {
    analyticSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    gameId: {
      type: String,
      required: true,
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    environment: {
      type: String,
      default: "development",
    },

    /** Last seen route/path from funnel.route_enter (normalized string) */
    lastRouteSeen: {
      type: String,
      default: null,
    },

    /** Max scenario index reached (scenarioNumber field from content JSON) */
    maxScenarioReached: {
      type: Number,
      default: null,
    },

    hintsUsedSeen: {
      type: Boolean,
      default: false,
    },

    removeTwoUsedSeen: {
      type: Boolean,
      default: false,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completionAt: {
      type: Date,
      default: null,
    },

    finalScore: Number,
    correctAnswers: Number,
    badge: String,

    firstEventAt: { type: Date, default: null },
    lastEventAt: { type: Date, default: null },
  },
  { timestamps: true },
);

gameSessionSchema.index({ gameId: 1, updatedAt: -1 });

const GameSession = mongoose.model("GameSession", gameSessionSchema);

export default GameSession;
