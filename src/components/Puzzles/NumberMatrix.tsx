import { useEffect } from "react";
import type { NumberMatrixConfig } from "../../engine/types";
import { isNumberMatrixSolved } from "../../engine/generators/numberMatrix";

interface Props {
    data: NumberMatrixConfig;
    onComplete: () => void;
    currentState: number[]; // Lifted state
    onStateChange: (state: number[]) => void;
}

export default function NumberMatrix({ data, onComplete, currentState, onStateChange }: Props) {

    useEffect(() => {
        // Only set initial state if empty (first load)
        if (currentState.length === 0) {
            onStateChange([...data.grid]);
        }
    }, [data]); // eslint-disable-line

    const handleSwap = (index: number) => {
        if (index === 0) return;

        const newTiles = [...currentState];
        // Linear swap logic
        [newTiles[index], newTiles[index - 1]] = [
            newTiles[index - 1],
            newTiles[index],
        ];

        onStateChange(newTiles);

        if (isNumberMatrixSolved(newTiles)) {
            onComplete();
        }
    };

    // Safe fallback if state isn't ready
    const tiles = currentState.length > 0 ? currentState : data.grid;

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 w-64 mx-auto mt-6">
                {tiles.map((num, index) => (
                    <button
                        key={`${index}-${num}`}
                        onClick={() => handleSwap(index)}
                        className="bg-blue-500 text-white text-xl flex items-center justify-center h-16 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                        {num}
                    </button>
                ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">Tap a tile to swap with the previous one.</p>
        </div>
    );
}
