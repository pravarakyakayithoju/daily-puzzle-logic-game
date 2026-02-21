import { useEffect, useState } from "react";
import type { PatternConfig } from "../../engine/types";

interface Props {
    data: PatternConfig;
    onComplete: () => void;
    currentState: boolean[][]; // Lifted state
    onStateChange: (state: boolean[][]) => void;
}

export default function Pattern({ data, onComplete, currentState, onStateChange }: Props) {
    const [isWrong, setIsWrong] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (currentState.length === 0) {
            const size = data.gridSize;
            onStateChange(Array(size).fill(null).map(() => Array(size).fill(false)));
        }
    }, [data.gridSize, onStateChange]);

    const toggleCell = (r: number, c: number) => {
        if (isSuccess) return;
        setIsWrong(false);
        // Deep copy
        const newGrid = currentState.map(row => [...row]);
        newGrid[r][c] = !newGrid[r][c];
        onStateChange(newGrid);
    };

    const handleCheck = () => {
        if (isSuccess) return;
        let solved = true;
        for (let i = 0; i < data.gridSize; i++) {
            for (let j = 0; j < data.gridSize; j++) {
                if (currentState[i][j] !== data.targetGrid[i][j]) {
                    solved = false;
                    break;
                }
            }
        }

        if (solved) {
            setIsSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 800);
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    // Fallback
    const grid = currentState.length > 0 ? currentState : Array(data.gridSize).fill(null).map(() => Array(data.gridSize).fill(false));

    return (
        <div className="flex flex-col items-center">
            <div className="mb-6">
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wide text-center">Reference Pattern</h3>
                <div className="grid gap-1 bg-gray-900 p-2 rounded-lg border border-gray-800"
                    style={{ gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))` }}>
                    {data.targetGrid.map((row, r) =>
                        row.map((active, c) => (
                            <div
                                key={`ref-${r}-${c}`}
                                className={`w-6 h-6 rounded-sm ${active ? 'bg-blue-500' : 'bg-gray-800/50'}`}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className={`relative transition-transform ${isWrong ? 'animate-shake' : ''}`}>
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wide text-center">Your Grid</h3>
                <div className="grid gap-1.5 bg-gray-900 p-3 rounded-xl border border-gray-700"
                    style={{ gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))` }}>
                    {grid.map((row, r) =>
                        row.map((active, c) => (
                            <div
                                key={`grid-${r}-${c}`}
                                onClick={() => toggleCell(r, c)}
                                className={`w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 border-2 ${isSuccess && active
                                    ? 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                    : active
                                        ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                                    }`}
                            />
                        ))
                    )}
                </div>
            </div>

            <button
                onClick={handleCheck}
                disabled={isSuccess}
                className={`mt-8 px-8 py-3 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg w-full max-w-xs
                    ${isSuccess
                        ? 'bg-green-500 border-green-400 text-white scale-105 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                        : isWrong
                            ? 'bg-red-600 border-red-500 text-white animate-shake'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30'
                    }`}
            >
                {isSuccess ? '✓ Pattern Matched!' : isWrong ? 'Pattern Mismatch' : 'Check Pattern'}
            </button>
        </div>
    );
}
