import { useEffect } from "react";
import type { PatternConfig } from "../../engine/types";

interface Props {
    data: PatternConfig;
    onComplete: () => void;
    currentState: boolean[][]; // Lifted state
    onStateChange: (state: boolean[][]) => void;
}

export default function Pattern({ data, onComplete, currentState, onStateChange }: Props) {

    useEffect(() => {
        if (currentState.length === 0) {
            const size = data.gridSize;
            onStateChange(Array(size).fill(null).map(() => Array(size).fill(false)));
        }
    }, [data]); // eslint-disable-line

    const toggleCell = (r: number, c: number) => {
        // Deep copy
        const newGrid = currentState.map(row => [...row]);
        newGrid[r][c] = !newGrid[r][c];
        onStateChange(newGrid);

        // Check solution
        let solved = true;
        for (let i = 0; i < data.gridSize; i++) {
            for (let j = 0; j < data.gridSize; j++) {
                if (newGrid[i][j] !== data.targetGrid[i][j]) {
                    solved = false;
                    break;
                }
            }
        }

        if (solved) onComplete();
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
                                className={`w-8 h-8 rounded-sm ${active ? 'bg-blue-500' : 'bg-gray-800/50'}`}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="relative">
                <h3 className="text-gray-400 text-xs mb-2 uppercase tracking-wide text-center">Your Grid</h3>
                <div className="grid gap-2 bg-gray-900 p-4 rounded-xl border border-gray-700"
                    style={{ gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))` }}>
                    {grid.map((row, r) =>
                        row.map((active, c) => (
                            <div
                                key={`grid-${r}-${c}`}
                                onClick={() => toggleCell(r, c)}
                                className={`w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 border-2 ${active
                                        ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                        : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                                    }`}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
