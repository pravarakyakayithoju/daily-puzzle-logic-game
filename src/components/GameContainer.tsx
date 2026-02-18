import { useState, useEffect, useCallback } from "react";
import type { DailyPuzzle } from "../engine/types";
import { generateDailyPuzzle } from "../engine/puzzle";
import NumberMatrix from "./Puzzles/NumberMatrix";
import Sequence from "./Puzzles/Sequence";
import Pattern from "./Puzzles/Pattern";
import dayjs from "dayjs";
import HintButton from "./HintButton";
import { useActivity } from "../hooks/useActivity";
import { getHint } from "../engine/hints";
import { useTimer } from "../hooks/useTimer";
import { savePuzzleProgress, getPuzzleProgress, clearPuzzleProgress } from "../db/puzzleProgress";

interface Props {
    onComplete: (timeTaken: number) => void;
}

export default function GameContainer({ onComplete }: Props) {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const { activityMap, recordHintUsage } = useActivity();
    const [currentHint, setCurrentHint] = useState<string | null>(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Lifted States
    const [matrixState, setMatrixState] = useState<number[]>([]);
    const [patternState, setPatternState] = useState<boolean[][]>([]);

    const { elapsedTime, formatTime, resetTimer } = useTimer(hasStarted && !isCompleted);

    const todayStr = dayjs().format('YYYY-MM-DD');
    const dailyActivity = activityMap[todayStr];
    const hintsUsed = dailyActivity?.hintsUsed || 0;

    // Load puzzle and restore progress
    useEffect(() => {
        const load = async () => {
            const p = generateDailyPuzzle(todayStr);
            setPuzzle(p);

            // Restore saved progress
            const saved = await getPuzzleProgress(todayStr);
            if (saved) {
                if (saved.matrixState && saved.matrixState.length > 0) {
                    setMatrixState(saved.matrixState);
                }
                if (saved.patternState && saved.patternState.length > 0) {
                    setPatternState(saved.patternState);
                }
                // Restore elapsed time by marking as started with saved time
                if (saved.elapsedMs && saved.elapsedMs > 0) {
                    setHasStarted(true);
                }
            }

            setCurrentHint(null);
        };
        load();
        resetTimer();
    }, []); // eslint-disable-line

    // Save progress whenever state changes
    const saveProgress = useCallback(async (mState: number[], pState: boolean[][]) => {
        if (!puzzle) return;
        await savePuzzleProgress({
            date: todayStr,
            type: puzzle.type,
            matrixState: mState.length > 0 ? mState : undefined,
            patternState: pState.length > 0 ? pState : undefined,
            elapsedMs: elapsedTime,
        });
    }, [puzzle, todayStr, elapsedTime]);

    const handleMatrixStateChange = async (state: number[]) => {
        setMatrixState(state);
        if (!hasStarted) setHasStarted(true);
        await saveProgress(state, patternState);
    };

    const handlePatternStateChange = async (state: boolean[][]) => {
        setPatternState(state);
        if (!hasStarted) setHasStarted(true);
        await saveProgress(matrixState, state);
    };

    const handleFirstInteraction = () => {
        if (!hasStarted) setHasStarted(true);
    };

    const handleComplete = async () => {
        setIsCompleted(true);
        const timeTakenSeconds = Math.floor(elapsedTime / 1000);
        await clearPuzzleProgress(todayStr);
        onComplete(timeTakenSeconds);
    };

    const handleUseHint = async () => {
        if (!hasStarted) setHasStarted(true);
        let hint = "";
        if (puzzle?.type === 'NUMBER_MATRIX') hint = getHint(puzzle, matrixState.length > 0 ? matrixState : (puzzle as any).grid);
        else if (puzzle?.type === 'SEQUENCE') hint = getHint(puzzle, null);
        else if (puzzle?.type === 'PATTERN') hint = getHint(puzzle, patternState);

        setCurrentHint(hint);
        await recordHintUsage(todayStr);
    };

    if (!puzzle) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-sm">Loading today's puzzle...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header: type badge + timer + hint */}
            <div className="flex justify-between items-start mb-6">
                <div className="text-left flex-1 mr-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-2 py-1 rounded bg-blue-900/50 text-blue-200 border border-blue-800 uppercase tracking-widest inline-block">
                            {puzzle.type.replace('_', ' ')}
                        </span>
                        {/* Live Timer */}
                        <span className={`font-mono text-sm font-semibold tabular-nums transition-colors ${hasStarted && !isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                            ⏱ {formatTime(elapsedTime)}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{puzzle.instructions}</p>
                </div>

                <HintButton
                    hintsUsed={hintsUsed}
                    maxHints={3}
                    onUseHint={handleUseHint}
                    hintText={currentHint}
                />
            </div>

            <div
                className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl"
                onClick={handleFirstInteraction}
            >
                {puzzle.type === 'NUMBER_MATRIX' && (
                    <NumberMatrix
                        data={puzzle as any}
                        onComplete={handleComplete}
                        currentState={matrixState}
                        onStateChange={handleMatrixStateChange}
                    />
                )}
                {puzzle.type === 'SEQUENCE' && (
                    <Sequence
                        data={puzzle as any}
                        onComplete={handleComplete}
                        onFirstInteraction={handleFirstInteraction}
                    />
                )}
                {puzzle.type === 'PATTERN' && (
                    <Pattern
                        data={puzzle as any}
                        onComplete={handleComplete}
                        currentState={patternState}
                        onStateChange={handlePatternStateChange}
                    />
                )}
            </div>

            {!hasStarted && (
                <p className="text-center text-xs text-gray-600 mt-3">Timer starts on first interaction</p>
            )}
        </div>
    );
}
