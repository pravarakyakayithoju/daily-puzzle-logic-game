import { useState } from "react";
import { LightBulbIcon } from "@heroicons/react/24/solid";
import { LightBulbIcon as LightBulbOutline } from "@heroicons/react/24/outline";

interface Props {
    hintsUsed: number;
    maxHints: number;
    onUseHint: () => void;
    hintText: string | null;
}

export default function HintButton({ hintsUsed, maxHints, onUseHint, hintText }: Props) {
    const [showHint, setShowHint] = useState(false);
    const remaining = maxHints - hintsUsed;

    const handleClick = () => {
        if (hintText) {
            // Toggle if already shown
            setShowHint(!showHint);
        } else {
            // Request new hint
            if (remaining > 0) {
                onUseHint();
                setShowHint(true);
            }
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                disabled={remaining === 0 && !hintText}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${remaining > 0 || hintText
                        ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border border-yellow-500/50"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                    }`}
            >
                {remaining > 0 ? <LightBulbOutline className="w-4 h-4" /> : <LightBulbIcon className="w-4 h-4" />}
                <span>Hints: {remaining}</span>
            </button>

            {showHint && hintText && (
                <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-yellow-900/90 text-yellow-100 text-sm rounded-xl border border-yellow-700 shadow-xl backdrop-blur-md z-50 animate-fade-in">
                    <div className="font-bold mb-1 flex items-center gap-2">
                        <LightBulbIcon className="w-4 h-4 text-yellow-400" />
                        Hint
                    </div>
                    {hintText}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-yellow-900/90 border-t border-l border-yellow-700 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
}
