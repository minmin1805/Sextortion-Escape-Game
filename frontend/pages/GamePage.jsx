import React, { useState, useEffect } from "react";
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
        dismissFeedbackAndAdvance,
    } = useGame();

    const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);

    // Reset timer when advancing to next scenario
    useEffect(() => {
        setTimeRemaining(INITIAL_TIME);
    }, [currentScenarioIndex]);

    // 30s countdown; stop when feedback is showing
    useEffect(() => {
        if (showFeedback) return;
        if (timeRemaining <= 0) return;
        const t = setInterval(() => setTimeRemaining((p) => Math.max(0, p - 1)), 1000);
        return () => clearInterval(t);
    }, [showFeedback, timeRemaining]);

    const onContinue = () => dismissFeedbackAndAdvance(navigate);

    const onSelectAnswer = (optionId) => {
        selectAnswer(optionId, timeRemaining);
    };

    return (
        <div className="bg-[#8B5CF6] min-h-screen min-w-screen flex flex-col items-center">
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
                <AbilityDisplay />
                <QuestionDisplay
                    message={currentScenario?.message}
                    question={currentScenario?.question}
                    playerName={playerName}
                />
                <ClockDisplay timeRemaining={timeRemaining} />
            </div>

            <div className="mt-10">
                <AnswersDisplay
                    options={visibleOptions}
                    onSelectAnswer={onSelectAnswer}
                />
            </div>
        </div>
    );
}

export default GamePage
