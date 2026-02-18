import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import dayjs from 'dayjs';

interface TooltipProps {
    date: string;
    score?: number;
    timeTaken?: number;
    hintsUsed?: number;
    difficulty?: number;
    solved: boolean;
    position: { x: number; y: number };
    show: boolean;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const Tooltip = ({
    date, score, timeTaken, hintsUsed, difficulty, solved, position, show
}: TooltipProps) => {
    const isToday = dayjs().format('YYYY-MM-DD') === date;
    const isFuture = dayjs(date).isAfter(dayjs(), 'day');
    const formattedDate = dayjs(date).format('ddd, MMM D YYYY');

    const scoreColor =
        score === 100 ? 'text-green-400' :
            (score ?? 0) >= 80 ? 'text-green-500' :
                (score ?? 0) >= 50 ? 'text-yellow-400' :
                    'text-orange-400';

    const tooltip = (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 4 }}
                    transition={{ duration: 0.12 }}
                    className="fixed z-[9999] pointer-events-none"
                    style={{
                        left: `${position.x}px`,
                        top: `${position.y - 8}px`,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <div className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl px-3 py-2.5 min-w-[160px] max-w-[200px]">
                        {/* Date — always visible */}
                        <div className="text-xs font-semibold text-white mb-1.5 flex items-center gap-1">
                            {isToday && <span className="text-blue-400 text-[10px] font-bold">TODAY</span>}
                            {formattedDate}
                        </div>

                        <div className="w-full h-px bg-gray-700 mb-1.5" />

                        {isFuture ? (
                            <div className="text-xs text-gray-500 italic">Not yet available</div>
                        ) : solved ? (
                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-400">Score</span>
                                    <span className={`text-xs font-bold ${scoreColor}`}>{score ?? 0}</span>
                                </div>
                                {timeTaken !== undefined && timeTaken > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Time</span>
                                        <span className="text-xs text-white">{formatTime(timeTaken)}</span>
                                    </div>
                                )}
                                {hintsUsed !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Hints</span>
                                        <span className="text-xs text-white">{hintsUsed}</span>
                                    </div>
                                )}
                                {difficulty !== undefined && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Difficulty</span>
                                        <span className="text-xs text-white">
                                            {difficulty === 1 ? 'Easy' : difficulty === 2 ? 'Medium' : 'Hard'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-500">No activity</div>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-gray-600" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Render into document.body to avoid any layout interference
    return createPortal(tooltip, document.body);
};
