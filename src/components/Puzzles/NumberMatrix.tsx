import { useEffect } from "react";
import { motion } from "framer-motion";
import type { NumberMatrixConfig } from "../../engine/types";
import { isNumberMatrixSolved } from "../../engine/generators/numberMatrix";

interface Props {
    data: NumberMatrixConfig;
    onComplete: () => void;
    currentState: number[];
    onStateChange: (state: number[]) => void;
}

export default function NumberMatrix({ data, onComplete, currentState, onStateChange }: Props) {

    useEffect(() => {
        if (currentState.length === 0) {
            onStateChange([...data.grid]);
        }
    }, [data]); // eslint-disable-line

    const handleSwap = (index: number) => {
        if (index === 0) return;

        const newTiles = [...currentState];
        [newTiles[index], newTiles[index - 1]] = [newTiles[index - 1], newTiles[index]];
        onStateChange(newTiles);

        if (isNumberMatrixSolved(newTiles)) {
            onComplete();
        }
    };

    const tiles = currentState.length > 0 ? currentState : data.grid;
    const isInPlace = (num: number, idx: number) => num === idx + 1;

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-4 gap-2 w-full max-w-xs mx-auto mt-4">
                {tiles.map((num, index) => {
                    const correct = isInPlace(num, index);
                    return (
                        <motion.button
                            key={`${index}-${num}`}
                            layout
                            onClick={() => handleSwap(index)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`text-white text-xl font-bold flex items-center justify-center h-14 rounded-xl cursor-pointer transition-colors border-2 ${correct
                                    ? 'bg-green-600/70 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                    : 'bg-blue-600/80 border-blue-500 hover:bg-blue-500'
                                }`}
                        >
                            {num}
                        </motion.button>
                    );
                })}
            </div>
            <p className="text-gray-500 text-xs mt-4">Tap a tile to swap it with the one before it</p>
        </div>
    );
}
