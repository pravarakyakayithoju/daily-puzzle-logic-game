import { useState, useEffect } from "react";
import type { DailyPuzzle } from "../engine/types";
import { generateDailyPuzzle } from "../engine/puzzle";
import NumberMatrix from "./Puzzles/NumberMatrix";
import Sequence from "./Puzzles/Sequence";
import Pattern from "./Puzzles/Pattern";
import dayjs from "dayjs";
import HintButton from "./HintButton";
import { useActivity } from "../hooks/useActivity";
import { getHint } from "../engine/hints";

interface Props {
    onComplete: () => void;
}

export default function GameContainer({ onComplete }: Props) {
    const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
    const { activityMap, recordHintUsage } = useActivity();
    const [currentHint, setCurrentHint] = useState<string | null>(null);

    // Lifted States
    const [matrixState, setMatrixState] = useState<number[]>([]);
    const [patternState, setPatternState] = useState<boolean[][]>([]);

    useEffect(() => {
        const today = dayjs().format('YYYY-MM-DD');
        const p = generateDailyPuzzle(today);
        setPuzzle(p);

        // Reset states when puzzle changes (or on init)
        setMatrixState([]);
        setPatternState([]);
        setCurrentHint(null);
    }, []);

    const todayStr = dayjs().format('YYYY-MM-DD');
    const dailyActivity = activityMap[todayStr];
    const hintsUsed = dailyActivity?.hintsUsed || 0;

    const handleUseHint = async () => {
        let hint = "";
        if (puzzle?.type === 'NUMBER_MATRIX') hint = getHint(puzzle, matrixState.length > 0 ? matrixState : (puzzle as any).grid);
        else if (puzzle?.type === 'SEQUENCE') hint = getHint(puzzle, null);
        else if (puzzle?.type === 'PATTERN') hint = getHint(puzzle, patternState);

        setCurrentHint(hint);
        await recordHintUsage(todayStr);
    };

    if (!puzzle) return <div className="text-white animate-pulse">Loading Puzzle...</div>;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-start mb-6 align-top">
                <div className="text-left flex-1 mr-4">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-blue-900/50 text-blue-200 border border-blue-800 uppercase tracking-widest inline-block mb-2">
                        {puzzle.type.replace('_', ' ')}
                    </span>
                    <p className="text-gray-400 text-sm leading-relaxed">{puzzle.instructions}</p>
                </div>

                <HintButton
                    hintsUsed={hintsUsed}
                    maxHints={3}
                    onUseHint={handleUseHint}
                    hintText={currentHint}
                />
            </div>

            <div className="bg-gray-900/30 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm shadow-xl">
                {puzzle.type === 'NUMBER_MATRIX' && (
                    <NumberMatrix
                        data={puzzle as any}
                        onComplete={onComplete}
                        currentState={matrixState}
                        onStateChange={setMatrixState}
                    />
                )}
                {puzzle.type === 'SEQUENCE' && <Sequence data={puzzle as any} onComplete={onComplete} />}
                {puzzle.type === 'PATTERN' && (
                    <Pattern
                        data={puzzle as any}
                        onComplete={onComplete}
                        currentState={patternState}
                        onStateChange={setPatternState}
                    />
                )}
            </div>
        </div>
    );
}
