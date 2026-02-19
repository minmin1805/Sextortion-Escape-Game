import React from "react";
import { useNavigate } from "react-router-dom";
import GameHeader from "../src/components/GameBanner";
import AbilityDisplay from "../src/components/AbilityDisplay";
import ClockDisplay from "../src/components/ClockDisplay";
import QuestionDisplay from "../src/components/QuestionDisplay";
import AnswersDisplay from "../src/components/AnswersDisplay";
import CorrectPopup from "../src/components/CorrectPopup";
import IncorrectPopup from "../src/components/IncorrectPopup";
import { useGame } from "../context/GameContext";

function GamePage() {
    const navigate = useNavigate();
    const { showFeedback, lastFeedback, lastPoints, lastAnswerCorrect, dismissFeedbackAndAdvance } = useGame();

    const onContinue = () => dismissFeedbackAndAdvance(navigate);

    return (
        <div className="bg-[#8B5CF6] min-h-screen min-w-screen flex flex-col items-center">
            {showFeedback === "true" && (
                <CorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
            )}
            {showFeedback === "false" && (
                <IncorrectPopup feedback={lastFeedback} points={lastPoints} onContinue={onContinue} />
            )}

            <GameHeader />

            <div className="flex flex-row w-full justify-center gap-15 mt-15">
                <AbilityDisplay />
                <QuestionDisplay />
                <ClockDisplay />
            </div>

            <div className="mt-10">
                <AnswersDisplay />
            </div>
        </div>
    );
}

export default GamePage
