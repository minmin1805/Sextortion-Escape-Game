import React, { useState, useEffect, useRef } from "react";
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

    const FEEDBACK_DELAY_MS = 3000;

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
        closeFeedback();
        setShowTransition(true);
    };

    const onSelectAnswer = (optionId, optionText) => {
        if (pendingAnswer) return;
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        setPendingAnswer({ optionId, optionText });
        feedbackTimeoutRef.current = setTimeout(() => {
            feedbackTimeoutRef.current = null;
            selectAnswer(optionId, timeRemaining);
            setPendingAnswer(null);
        }, FEEDBACK_DELAY_MS);
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
                <CorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
            )}
            {showFeedback === "false" && (
                <IncorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
            )}

            <GameHeader
                currentScenarioIndex={currentScenarioIndex}
                totalScenarios={totalScenarios}
                score={score}
            />

            <div className="flex flex-row w-full justify-center gap-15 mt-15">
                <AbilityDisplay
                    showHintModal={showHintModal}
                    onHintOpen={() => setShowHintModal(true)}
                    onCloseHint={() => setShowHintModal(false)}
                />
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
                />
                <ClockDisplay timeRemaining={timeRemaining} />
            </div>

            <div className="mt-10">
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
