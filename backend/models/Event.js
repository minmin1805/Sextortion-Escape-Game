import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    gameId: {
      type: String,
      required: true,
    },
    analyticSessionId: {
      type: String,
      required: true,
      index: true,
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      default: null,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    stepNumber: {
      type: Number,
      default: null,
    },
    stepId: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    environment: {
      type: String,
      default: "development",
    },
    ingestVersion: {
      type: String,
      default: "1",
    },
    clientVersion: {
      type: String,
      default: null,
    },
  },
  { timestamps: false },
);

/** game + kind + timeline (reports) */
eventSchema.index({ gameId: 1, eventType: 1, timestamp: -1 });

/** funnel / session timelines */
eventSchema.index({ analyticSessionId: 1, timestamp: 1 });

/** player rollup */
eventSchema.index({ playerId: 1, timestamp: -1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
