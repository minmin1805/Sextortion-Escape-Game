import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GameHeader from "../src/components/GameBanner";
import AbilityDisplay from "../src/components/AbilityDisplay";
import ClockDisplay from "../src/components/ClockDisplay";
import QuestionDisplay from "../src/components/QuestionDisplay";
import AnswersDisplay from "../src/components/AnswersDisplay";
import CorrectPopup from "../src/components/CorrectPopup";
import IncorrectPopup from "../src/components/IncorrectPopup";
import { useGame } from "../context/GameContext";

const INITIAL_TIME = 30;
const MESSAGE_DELAY_MS = 2000;

const NCMEC_REPLY = "We're here for you. You're not alone. We'll help you remove any images of you online and support you through this. Can you send us some info and evidence (e.g. screenshots) so we can help?";

function getTrustedAdultReply(name) {
  return `I am here ${name || "sweetie"}, don't be scared. I will always be here for you. Where are you right now? I can come and help you get through this.`;
}

function getStatsFriendCorrectReply(name) {
  return `Yes, you are correct ${name || "there"}, that is a surprising number isn't it!`;
}

function getStatsFriendIncorrectReply(correctAnswerText) {
  return `Oh that's almost correct! The correct answer is ${correctAnswerText}. It's important to know these facts and stay safe.`;
}

function getHelpingFriendCorrectReply(playerName) {
  return `Thank you so much for being there with me. I feel less alone.`;
}

function getThreadReply(pendingAnswer, currentScenario, playerName) {
  if (!pendingAnswer || !currentScenario) return { text: null, from: null, playerMessageOverride: null, switchedThreadPlayerMessage: null };
  const correctOptionId = currentScenario.options?.find((o) => o.correct)?.id;
  const isCorrect = pendingAnswer.optionId === correctOptionId;
  const fb = currentScenario.feedback?.[pendingAnswer.optionId];

  if (isCorrect) {
    const type = currentScenario.correctAnswerType;
    if (type === "report") return { text: NCMEC_REPLY, from: "ncmec", playerMessageOverride: null, switchedThreadPlayerMessage: null };
    if (type === "tell_adult") return { text: getTrustedAdultReply(playerName), from: "trusted_adult", playerMessageOverride: null, switchedThreadPlayerMessage: null };
    if (currentScenario.type === "quiz") return { text: getStatsFriendCorrectReply(playerName), from: "friend", playerMessageOverride: null, switchedThreadPlayerMessage: null };
    if (currentScenario.type === "helping_friend") return { text: getHelpingFriendCorrectReply(playerName), from: "friend", playerMessageOverride: null, switchedThreadPlayerMessage: null };
    return { text: null, from: null, playerMessageOverride: null, switchedThreadPlayerMessage: null };
  }

  if (currentScenario.type === "helping_friend" && fb) {
    if (fb.incorrectSwitchToAdult && fb.ourMessageToAdult) {
      return { text: fb.threadReply, from: "trusted_adult", playerMessageOverride: null, switchedThreadPlayerMessage: fb.ourMessageToAdult };
    }
    if (fb.ourThreadMessage) {
      return { text: fb.threadReply, from: "friend", playerMessageOverride: fb.ourThreadMessage, switchedThreadPlayerMessage: null };
    }
  }

  if (currentScenario.type === "quiz") {
    const correctOption = currentScenario.options?.find((o) => o.correct);
    return { text: getStatsFriendIncorrectReply(correctOption?.text ?? "the one you didn't pick"), from: "friend", playerMessageOverride: null, switchedThreadPlayerMessage: null };
  }
  if (fb?.threadReply) return { text: fb.threadReply, from: "trafficker", playerMessageOverride: null, switchedThreadPlayerMessage: null };
  return { text: null, from: null, playerMessageOverride: null, switchedThreadPlayerMessage: null };
}

function GamePage() {
    const navigate = useNavigate();
    const {
        showFeedback,
        lastFeedback,
        lastPoints,
        currentScenario,
        currentScenarioIndex,
        totalScenarios,
        score,
        playerName,
        visibleOptions,
        selectAnswer,
        closeFeedback,
        dismissFeedbackAndAdvance,
        handleTimeUp,
    } = useGame();

    const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
    const [showHintModal, setShowHintModal] = useState(false);
    const [showTransition, setShowTransition] = useState(false);
    const [pendingAnswer, setPendingAnswer] = useState(null);
    const [countdownStarted, setCountdownStarted] = useState(false);
    const prevTimeRemainingRef = useRef(INITIAL_TIME);
    const feedbackTimeoutRef = useRef(null);
    const messageDelayRef = useRef(null);

    const FEEDBACK_DELAY_MS_DEFAULT = 3000;
    const CONSEQUENCE_DELAY_SECONDS = 2;   // matches QuestionDisplay CONSEQUENCE_ANIMATION_DELAY (motion delay)
    const POPUP_AFTER_CONSEQUENCE_MS = 5000;  // ms after consequence appears before popup
    const FEEDBACK_DELAY_MS_WITH_CONSEQUENCE = CONSEQUENCE_DELAY_SECONDS * 1000 + POPUP_AFTER_CONSEQUENCE_MS;

    useEffect(() => {
        setPendingAnswer(null);
        setCountdownStarted(false);
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
        }
        if (messageDelayRef.current) {
            clearTimeout(messageDelayRef.current);
            messageDelayRef.current = null;
        }
        messageDelayRef.current = setTimeout(() => {
            messageDelayRef.current = null;
            setCountdownStarted(true);
        }, MESSAGE_DELAY_MS);
        return () => {
            if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
            if (messageDelayRef.current) clearTimeout(messageDelayRef.current);
        };
    }, [currentScenarioIndex]);

    // "A few days later..." overlay: show for 3s then advance to next level
    useEffect(() => {
        if (!showTransition) return;
        const t = setTimeout(() => {
            dismissFeedbackAndAdvance(navigate);
            setShowTransition(false);
        }, 3000);
        return () => clearTimeout(t);
    }, [showTransition, dismissFeedbackAndAdvance, navigate]);

    // Reset timer when advancing to next scenario
    useEffect(() => {
        setTimeRemaining(INITIAL_TIME);
    }, [currentScenarioIndex]);

    // When clock hits 0: show feedback only when we *transition* to 0 (not when already 0 after advancing)
    useEffect(() => {
        if (timeRemaining !== 0 || showFeedback) {
            prevTimeRemainingRef.current = timeRemaining;
            return;
        }
        if (prevTimeRemainingRef.current <= 0) {
            prevTimeRemainingRef.current = timeRemaining;
            return;
        }
        handleTimeUp();
        prevTimeRemainingRef.current = timeRemaining;
    }, [timeRemaining, showFeedback, handleTimeUp]);

    // 30s countdown: start after message is shown, stop when feedback, hint modal, or answer chosen
    useEffect(() => {
        if (!countdownStarted) return;
        if (showFeedback || showHintModal || pendingAnswer) return;
        if (timeRemaining <= 0) return;
        const t = setInterval(() => setTimeRemaining((p) => Math.max(0, p - 1)), 1000);
        return () => clearInterval(t);
    }, [countdownStarted, showFeedback, showHintModal, pendingAnswer, timeRemaining]);

    const onContinue = () => {
        setPendingAnswer(null); // clear thread so it doesn’t linger; was kept so player/consequence stayed visible during popup
        closeFeedback();
        setShowTransition(true);
    };

    const { text: threadReplyText, from: threadReplyFrom, playerMessageOverride, switchedThreadPlayerMessage } = getThreadReply(pendingAnswer, currentScenario, playerName);

    const onSelectAnswer = (optionId, optionText) => {
        if (pendingAnswer) return;
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;

        const correctOptionId = currentScenario?.options?.find((o) => o.correct)?.id;
        const isCorrect = optionId === correctOptionId;
        const isDelayedConsequenceScenario =
            isCorrect &&
            (currentScenario?.correctAnswerType === "report" ||
                currentScenario?.correctAnswerType === "tell_adult" ||
                currentScenario?.type === "helping_friend");

        setPendingAnswer({ optionId, optionText });

        const delayMs = isDelayedConsequenceScenario ? FEEDBACK_DELAY_MS_WITH_CONSEQUENCE : FEEDBACK_DELAY_MS_DEFAULT;
        feedbackTimeoutRef.current = setTimeout(() => {
            feedbackTimeoutRef.current = null;
            selectAnswer(optionId, timeRemaining);
            // Keep pendingAnswer so thread (player + consequence) stays visible while popup is open; clear on Continue
        }, delayMs);
    };

    return (
        <div className="bg-[#8B5CF6] min-h-screen min-w-screen flex flex-col items-center relative">
            {showTransition && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
                    aria-live="polite"
                    aria-label="Transition: a few days later"
                >
                    <p className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4 animate-pulse">
                        A few days later...
                    </p>
                </div>
            )}
            {showFeedback === "true" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.3 }}
                >
                    <CorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
                </motion.div>
            )}
            {showFeedback === "false" && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.3 }}
                >
                    <IncorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
                </motion.div>
            )}

            <GameHeader
                currentScenarioIndex={currentScenarioIndex}
                totalScenarios={totalScenarios}
                score={score}
            />

            {/* Main game layout: stack on small screens, row on larger */}
            <div className="w-full max-w-6xl px-3 sm:px-4 md:px-8 mt-6 md:mt-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
                {/* Left column: abilities + clock (stack or row depending on width) */}
                <div className="flex flex-row lg:flex-col items-start justify-between gap-4 lg:gap-6 w-full lg:w-auto">
                    <AbilityDisplay
                        showHintModal={showHintModal}
                        onHintOpen={() => setShowHintModal(true)}
                        onCloseHint={() => setShowHintModal(false)}
                    />
                    <div className="self-start">
                        <ClockDisplay timeRemaining={timeRemaining} />
                    </div>
                </div>

                {/* Center: chat/question thread */}
                <div className="flex-1 min-w-0">
                    <QuestionDisplay
                        message={currentScenario?.message}
                        question={currentScenario?.question}
                        playerName={playerName}
                        selectedAnswerText={pendingAnswer?.optionText}
                        isTransitioning={showTransition}
                        isStatsQuestion={currentScenario?.type === "quiz"}
                        statsFriend={currentScenario?.statsFriend}
                        correctAnswerType={currentScenario?.correctAnswerType}
                        trustedAdult={currentScenario?.trustedAdult}
                        selectedOptionId={pendingAnswer?.optionId}
                        correctOptionId={currentScenario?.options?.find((o) => o.correct)?.id}
                        threadReplyText={threadReplyText}
                        threadReplyFrom={threadReplyFrom}
                        isHelpingFriend={currentScenario?.type === "helping_friend"}
                        helpingFriend={currentScenario?.helpingFriend}
                        switchedThreadPlayerMessage={switchedThreadPlayerMessage}
                        playerMessageOverride={playerMessageOverride}
                    />
                </div>
            </div>

            {/* Answers – add horizontal padding and smaller top margin for phones */}
            <div className="w-full max-w-6xl px-3 sm:px-4 md:px-8 mt-6 md:mt-10">
                <AnswersDisplay
                    options={visibleOptions}
                    onSelectAnswer={onSelectAnswer}
                    disabled={!!pendingAnswer || !!showFeedback}
                />
            </div>
        </div>
    );
}

export default GamePage
