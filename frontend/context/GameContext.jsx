import {createContext, useContext, useState, useCallback, useRef, useEffect} from "react";
import {createPlayer} from "../src/services/playerService";
import scenarios from "../src/data/scenarios.json";
import { updatePlayer } from "../src/services/playerService";

const GameContext  = createContext(null);

const LEVEL_VIEW_TIMER_SECONDS = 30;

const TOTAL_SCENARIOS = 10;

export function GameProvider({children}) {

    // areadly had this for currentplayer from welcome page 

    const [playerId, setPlayerId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [playerError, setPlayerError] = useState(null);
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [hintUsed, setHintUsed] = useState(0);
    const [removeTwoUsed, setRemoveTwoUsed] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(null);


    // Popup state: which feedback to show and its content
    const [showFeedback, setShowFeedback] = useState(null);
    const [lastFeedback, setLastFeedback] = useState(null);
    const [lastPoints, setLastPoints] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);

    const currentScenario = scenarios[currentScenarioIndex] ?? null;
    const visibleOptions = filteredOptions ?? currentScenario?.options ?? [];

    // Timer counts down (30 → 0). More time remaining = answered faster = more points.
    const getPointsForTime = (timeRemaining, isCorrect) => {
        if(!isCorrect) {
            return 0;
        }
        if(timeRemaining > 25) {
            return 1500;  // answered in first 5 seconds
        }
        if(timeRemaining > 20) {
            return 1000;  // answered in 5–10 seconds
        }
        if(timeRemaining > 10) {
            return 500;   // answered in 10–20 seconds
        }
        return 250;       // answered with ≤10 seconds left (still correct)
    }

    const getBadgeForScore = (score) => {
        if(score >= 8000) {
            return "Sextortion Expert";
        }
        if(score >= 5000) {
            return "Safety Scholar";
        }
        if(score >= 2500) {
            return "Learning Defender";
        }
    }



    const createPlayerAndGo = useCallback(async (name, navigate) => {
        if(!name) {
            setPlayerError("Please enter a valid name");
            return;
        }
        if(name.trim() === "") {
            setPlayerError("Please enter a valid name");
            return;
        }
        setPlayerError(null);
        try {
            const data = await createPlayer(name.trim());
            setPlayerId(data.id);
            setSessionId(data.sessionId);
            setPlayerName(name.trim());
            // Reset game state so new player starts at question 1
            setCurrentScenarioIndex(0);
            setScore(0);
            setCorrectAnswers(0);
            setHintUsed(0);
            setRemoveTwoUsed(0);
            setGameComplete(false);
            setFilteredOptions(null);
            setShowFeedback(null);
            setLastFeedback(null);
            setLastPoints(0);
            setLastAnswerCorrect(false);
            navigate('/instructions');
        } catch (error) {
            console.error("Error creating player:", error);
            setPlayerError("Failed to create player. Please try again.");
        }
    }, []);

    const selectAnswer = useCallback(async(optionId, timeRemaining) => {
        if(!optionId) {
            return;
        }
        if(!currentScenario) {
            return;
        }

        const foundOption = currentScenario.options.find((eachOption) => eachOption.id === optionId);
        const isCorrect = foundOption.correct;
        const pointsForThisAnswer = getPointsForTime(timeRemaining, isCorrect);
        
        setScore((prev) => prev + pointsForThisAnswer);
        if(isCorrect) {
            setCorrectAnswers((prev) => prev + 1);
        }

        // update feedback and lastpoint, lastanswer
        const feedback = currentScenario.feedback[optionId] ?? null
        setLastFeedback(feedback);
        setLastPoints(pointsForThisAnswer);
        setLastAnswerCorrect(isCorrect);
        setShowFeedback(isCorrect ? "true" : "false");


    }, [currentScenario]);

    const TIMEOUT_FEEDBACK = {
        title: "Time's Up",
        reason: "You ran out of time on this question.",
        consequence: "No points for this one, but you can learn from the feedback.",
        doThisInstead: "On the next question, read carefully and pick your answer before time runs out.",
        fact: "If you're ever in a real sextortion situation, tell an adult right away—there's no time limit on getting help.",
    };

    const handleTimeUp = useCallback(() => {
        if (!currentScenario) return;
        if (showFeedback) return;
        setLastFeedback(TIMEOUT_FEEDBACK);
        setLastPoints(0);
        setLastAnswerCorrect(false);
        setShowFeedback("false");
    }, [currentScenario, showFeedback]);

    const advanceToNextScenario = useCallback(() => {
        setShowFeedback(null);
        setFilteredOptions(null);
        setLastFeedback(null);
        setCurrentScenarioIndex((prev) => {
            const nextIndex = prev + 1;
            if(nextIndex >= TOTAL_SCENARIOS) {
                return prev;
            }
            else {
                return nextIndex;
            }
        })
    }, [])

    const finishGame = useCallback(async(navigate) => {
        const badge = getBadgeForScore(score);

        try {
            if(playerId) {
                await updatePlayer(playerId, {
                    score,
                    correctAnswers,
                    badge,
                    completedAt: new Date().toISOString()
                });
            }
        } catch (error) {
            console.warn("Could not update player to backend")
        }

        setGameComplete(true);
        setShowFeedback(null);
        setLastFeedback(null);
        navigate("/endgame")
    }, [playerId, score, correctAnswers]);

    const dismissFeedbackAndAdvance = useCallback(async(navigate) => {
        setShowFeedback(null);
        setLastFeedback(null);

        const nextIndex = currentScenarioIndex + 1;
        if(nextIndex >= TOTAL_SCENARIOS) {
            finishGame(navigate);
        }
        else {
            setCurrentScenarioIndex(nextIndex);
            setFilteredOptions(null);
        }
    }, [currentScenarioIndex, finishGame]);

    const useHint = useCallback(async() => {
        if(hintUsed >= 1) {
            return false;
        }
        else {
            setHintUsed((prev) => prev + 1);
        }
    }, [hintUsed]);
    

    const useRemoveTwo = useCallback(async() => {
        if(removeTwoUsed >= 2) {
            return false;
        }

        const currentScenario = scenarios[currentScenarioIndex];
        if(!currentScenario) {
            return false;
        }

        const wrongOptions = currentScenario.options.filter((eachOption) => !eachOption.correct);

        if(wrongOptions.length <= 2) {
            return false;
        }

        const shuffledOptions = [...wrongOptions].sort(() => Math.random() - 0.5);
        const toRemoveIds = shuffledOptions.slice(0, 2).map((eachOption) => eachOption.id);
        const keptOptions = currentScenario.options.filter((eachOption) => !toRemoveIds.includes(eachOption.id));
        setFilteredOptions(keptOptions);
        setRemoveTwoUsed((prev) => prev + 1);
        return true;
    }, [currentScenarioIndex, removeTwoUsed]);

    const value = {
        playerId,
        sessionId,
        playerName,
        playerError,
        currentScenarioIndex,
        currentScenario,
        visibleOptions,
        score,
        correctAnswers,
        hintUsed,
        removeTwoUsed,
        gameComplete,
        showFeedback,
        lastFeedback,
        lastPoints,
        lastAnswerCorrect,
        totalScenarios: TOTAL_SCENARIOS,
    
        createPlayerAndGo,
        selectAnswer,
        advanceToNextScenario,
        finishGame,
        dismissFeedbackAndAdvance,
        useHint,
        useRemoveTwo,
        handleTimeUp,
      };

      return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
    const ctx = useContext(GameContext);
    if(!ctx) {
        throw new Error("useGame must be used within GameProvider");
    }
    return ctx;
}