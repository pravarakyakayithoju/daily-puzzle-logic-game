import { useState } from "react";
import type { SequenceConfig } from "../../engine/types";

interface Props {
    data: SequenceConfig;
    onComplete: () => void;
}

export default function Sequence({ data, onComplete }: Props) {
    const [selected, setSelected] = useState<number | null>(null);
    const [isWrong, setIsWrong] = useState(false);

    const handleSelect = (option: number) => {
        setSelected(option);
        if (option === data.answer) {
            setIsWrong(false);
            onComplete();
        } else {
            setIsWrong(true);
            setTimeout(() => setIsWrong(false), 800);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-sm mx-auto">
            <div className="flex gap-4 mb-8 text-3xl font-bold font-mono text-blue-300">
                {data.sequence.map((num, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded-lg min-w-[60px] text-center border border-gray-700">
                        {num}
                    </div>
                ))}
                <div className="bg-gray-800 p-4 rounded-lg min-w-[60px] text-center border border-blue-500 text-blue-500 animate-pulse">
                    ?
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full">
                {data.options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        className={`p-6 rounded-xl text-2xl font-bold transition-all ${selected === opt && isWrong
                            ? 'bg-red-500/20 text-red-400 border-red-500 animate-shake'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
