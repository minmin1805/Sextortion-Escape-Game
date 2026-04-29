/**
 * Monthly / ad-hoc KPI report for telemetry events (default gameId: sextortion-escape).
 *
 * Usage:
 *   # All telemetry (no date filter — omit both --from and --to):
 *   node scripts/metrics/generateSextortionEscapeMetrics.js --env all
 *
 *   # Bounded window:
 *   node scripts/metrics/generateSextortionEscapeMetrics.js --from 2026-01-01 --to 2026-01-31T23:59:59.999Z --env all
 *
 *   Equivalent: npm run metrics:se -- (--env production)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Event from "../../backend/models/Event.js";
import { GAME_ID_SEXTORTION_ESCAPE } from "../../backend/telemetry/eventSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
dotenv.config({ path: path.join(repoRoot, ".env") });

function parseArgs(argv) {
  const out = {
    gameId: GAME_ID_SEXTORTION_ESCAPE,
    from: null,
    to: null,
    env: "all",
    /** True when neither --from nor --to: aggregate entire collection (still filtered by gameId + env) */
    allTime: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--gameId") out.gameId = argv[++i];
    else if (a === "--from") out.from = argv[++i];
    else if (a === "--to") out.to = argv[++i];
    else if (a === "--env") out.env = argv[++i];
  }
  if (!out.from && !out.to) {
    out.allTime = true;
  } else if (Boolean(out.from) !== Boolean(out.to)) {
    console.error(
      "Provide both --from and --to for a bounded range, or omit both to run metrics for ALL time.",
    );
    process.exit(1);
  }
  return out;
}

function envFilter(env) {
  if (env === "all") return {};
  return { environment: env };
}

/** @param {{ gameId: string, from: string|null, to: string|null, allTime: boolean, env: string }} args */
function buildBaseMatch(args) {
  const m = {
    gameId: args.gameId,
    ...envFilter(args.env),
  };
  if (!args.allTime && args.from && args.to) {
    const from = new Date(args.from);
    const to = new Date(args.to);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      console.error("Invalid --from/--to dates.");
      process.exit(1);
    }
    m.timestamp = { $gte: from, $lte: to };
  }
  return { baseMatch: m, windowFrom: args.from ? new Date(args.from) : null, windowTo: args.to ? new Date(args.to) : null };
}

async function distinctSessionsForRoute(baseMatch, route) {
  return Event.distinct("analyticSessionId", {
    ...baseMatch,
    eventType: "funnel.route_enter",
    "metadata.route": route,
  });
}

async function main() {
  const args = parseArgs(process.argv);
  await mongoose.connect(process.env.MONGO_URI);

  const { baseMatch, windowFrom, windowTo } = buildBaseMatch(args);
  if (args.allTime)
    console.log("Metrics: aggregating ALL time (no --from/--to), filtered by gameId + --env.");

  const sessionsTotal = await Event.distinct("analyticSessionId", baseMatch);

  /** Started timed game (proxy: first level load for scenario 1) */
  const sessionsEnteredGame = await Event.distinct("analyticSessionId", {
    ...baseMatch,
    eventType: "gameplay.level_start",
    $or: [{ stepNumber: 1 }, { "metadata.scenarioNumber": 1 }],
  });

  const sessionsOnRoot = await distinctSessionsForRoute(baseMatch, "/");
  const sessionsWelcome = await distinctSessionsForRoute(baseMatch, "/welcome");
  const sessionsInstructions = await distinctSessionsForRoute(baseMatch, "/instructions");
  const sessionsGameRoute = await distinctSessionsForRoute(baseMatch, "/game");
  const sessionsEndgameRoute = await distinctSessionsForRoute(baseMatch, "/endgame");

  const completeCount = await Event.countDocuments({ ...baseMatch, eventType: "session.complete" });

  const answerEvents = await Event.find({
    ...baseMatch,
    eventType: "gameplay.answer_submitted",
  })
    .select("metadata")
    .lean();

  let answered = 0;
  let correct = 0;
  let timeouts = 0;
  const threatHelp = { answered: 0, correct: 0 };
  const quiz = { answered: 0, correct: 0 };

  for (const e of answerEvents) {
    const m = e.metadata || {};
    if (m.timedOut) {
      timeouts += 1;
      answered += 1;
      continue;
    }
    answered += 1;
    if (m.correct) correct += 1;

    const t = typeof m.scenarioType === "string" ? m.scenarioType : "";
    const bucket = t === "threat" || t === "helping_friend" ? threatHelp : quiz;
    bucket.answered += 1;
    if (m.correct) bucket.correct += 1;
  }

  const scaffoldingSessions = await Event.distinct("analyticSessionId", {
    ...baseMatch,
    eventType: { $in: ["gameplay.hint_opened", "gameplay.remove_two_used"] },
  });

  const dropoffWelcomeToInstructions =
    sessionsWelcome.length === 0
      ? null
      : 1 - sessionsInstructions.length / sessionsWelcome.length;

  const dropoffInstructionsToGameRoute =
    sessionsInstructions.length === 0
      ? null
      : 1 - sessionsGameRoute.length / sessionsInstructions.length;

  const dropoffGameRouteToEndgame =
    sessionsGameRoute.length === 0 ? null : 1 - sessionsEndgameRoute.length / sessionsGameRoute.length;

  const report = {
    generatedAt: new Date().toISOString(),
    params: args,
    dateRangeUtc: args.allTime
      ? { mode: "all_time", from: null, to: null }
      : {
          mode: "bounded",
          from: windowFrom?.toISOString(),
          to: windowTo?.toISOString(),
        },
    kpis: {
      unique_sessions_with_any_event: sessionsTotal.length,
      sessions_that_started_game_by_level_start_scenario_1: sessionsEnteredGame.length,
      completions_session_complete_emitted: completeCount,
      completion_rate_vs_game_start:
        sessionsEnteredGame.length === 0
          ? null
          : Number((completeCount / sessionsEnteredGame.length).toFixed(4)),
      funnel_distinct_sessions_by_route_marker: {
        root_path: sessionsOnRoot.length,
        welcome: sessionsWelcome.length,
        instructions: sessionsInstructions.length,
        game_route: sessionsGameRoute.length,
        endgame_route: sessionsEndgameRoute.length,
      },
      drop_off_heuristic: {
        welcome_to_instructions: dropoffWelcomeToInstructions,
        instructions_to_game_route_marker: dropoffInstructionsToGameRoute,
        game_route_marker_to_endgame_route_marker: dropoffGameRouteToEndgame,
      },
      learning_performance: {
        answer_submit_events_total: answered,
        correct_when_not_timed_out: correct,
        timed_out_events: timeouts,
        scenario_accuracy_overall:
          answered === 0 ? null : Number((correct / answered).toFixed(4)),
        timed_out_attempt_rate_among_answer_events:
          answered === 0 ? null : Number((timeouts / answered).toFixed(4)),
        threat_or_helping_friend_accuracy:
          threatHelp.answered === 0
            ? null
            : Number((threatHelp.correct / threatHelp.answered).toFixed(4)),
        stats_quiz_scenario_accuracy:
          quiz.answered === 0 ? null : Number((quiz.correct / quiz.answered).toFixed(4)),
      },
      scaffolding: {
        sessions_with_hint_or_remove_two_distinct: scaffoldingSessions.length,
        help_seek_proxy_rate_vs_game_start:
          sessionsEnteredGame.length === 0
            ? null
            : Number((scaffoldingSessions.length / sessionsEnteredGame.length).toFixed(4)),
      },
    },
    methodology:
      "Funnel counts use funnel.route_enter metadata.route (distinct analyticSessionIds). Game start prefers gameplay.level_start for scenarioNumber 1. Drop-off ratios assume one session per player device run — not unique humans.",
    sampleSizes: {
      sessionsTotalDistinct: sessionsTotal.length,
      sessionsEnteredGameDistinct: sessionsEnteredGame.length,
    },
  };

  const subdir = args.allTime
    ? "all-time"
    : `${windowFrom?.getUTCFullYear()}-${String((windowFrom?.getUTCMonth() ?? 0) + 1).padStart(2, "0")}`;
  const outDir = path.join(repoRoot, "reports", subdir);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${args.gameId}-metrics.json`);
  fs.writeFileSync(outFile, JSON.stringify(report, null, 2), "utf8");
  console.log("Wrote:", outFile);
  console.log(JSON.stringify(report.kpis, null, 2));

  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
