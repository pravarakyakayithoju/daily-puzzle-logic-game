import { useEffect, useState } from "react";
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
    const [isWrong, setIsWrong] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (currentState.length === 0) {
            onStateChange([...data.grid]);
        }
    }, [data.grid, onStateChange]);

    const handleSwap = (index: number) => {
        if (index === 0 || isSuccess) return;
        setIsWrong(false);

        const newTiles = [...currentState];
        [newTiles[index], newTiles[index - 1]] = [newTiles[index - 1], newTiles[index]];
        onStateChange(newTiles);
    };

    const handleCheck = () => {
        if (isSuccess) return;
        if (isNumberMatrixSolved(currentState)) {
            setIsSuccess(true);
            setTimeout(() => {
                onComplete();
            }, 200);
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 500);
        }
    };

    const tiles = currentState.length > 0 ? currentState : data.grid;
    const isInPlace = (num: number, idx: number) => num === idx + 1;

    return (
        <div className="flex flex-col items-center">
            <div className={`grid grid-cols-5 gap-2 w-full max-w-sm mx-auto mt-4 transition-transform ${isWrong ? 'animate-shake' : ''}`}>
                {tiles.map((num, index) => {
                    const correct = isInPlace(num, index);
                    return (
                        <motion.button
                            key={`${index}-${num}`}
                            layout
                            onClick={() => handleSwap(index)}
                            whileHover={{ scale: isSuccess ? 1 : 1.05 }}
                            whileTap={{ scale: isSuccess ? 1 : 0.95 }}
                            className={`text-white text-lg font-bold flex items-center justify-center h-12 rounded-lg cursor-pointer transition-all border-2 ${isSuccess
                                ? 'bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                                : correct
                                    ? 'bg-green-600/70 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                    : 'bg-blue-600/80 border-blue-500 hover:bg-blue-500'
                                }`}
                        >
                            {num}
                        </motion.button>
                    );
                })}
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
                {isSuccess ? '✓ Correct!' : isWrong ? 'Incorrect Sequence' : 'Check Solution'}
            </button>

            <p className="text-gray-500 text-xs mt-4">Tap a tile to swap it with the one before it</p>
        </div>
    );
}
