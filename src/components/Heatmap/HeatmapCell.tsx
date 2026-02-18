import { motion } from 'framer-motion';
import { memo, useState, useRef } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Tooltip } from './Tooltip';

interface HeatmapCellProps {
    date: string;
    intensity: number; // 0-4
    activity?: {
        solved: boolean;
        score: number;
        timeTaken: number;
        hintsUsed?: number;
        difficulty: number;
    };
}

const INTENSITY_COLORS = [
    'bg-gray-800/50', // 0: Not played
    'bg-green-900/60', // 1: Solved with hints or low score
    'bg-green-700/80', // 2: Solved medium
    'bg-green-500',    // 3: Solved high score
    'bg-green-400',    // 4: Perfect score
];

const HeatmapCellComponent = ({ date, intensity, activity }: HeatmapCellProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const cellRef = useRef<HTMLDivElement>(null);

    const isToday = dayjs().format('YYYY-MM-DD') === date;
    const isFuture = dayjs(date).isAfter(dayjs(), 'day');

    const handleMouseEnter = () => {
        if (cellRef.current) {
            const rect = cellRef.current.getBoundingClientRect();
            setTooltipPos({
                x: rect.left + rect.width / 2,
                y: rect.top,
            });
        }
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    return (
        <>
            {/* Use a wrapper div to avoid layout shift from scale transforms */}
            <div
                ref={cellRef}
                className="relative"
                style={{ width: 12, height: 12 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: isFuture ? 0.25 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    // Use CSS hover via className instead of whileHover to avoid layout shift
                    className={clsx(
                        'w-3 h-3 rounded-sm cursor-pointer border transition-transform duration-100 hover:scale-125 hover:z-10',
                        isFuture ? 'border-gray-800' : 'border-gray-700',
                        INTENSITY_COLORS[intensity] ?? INTENSITY_COLORS[0],
                        isToday && 'ring-2 ring-blue-400 ring-offset-1 ring-offset-black',
                    )}
                    data-date={date}
                    aria-label={`${date}: ${activity?.solved ? `Solved, score ${activity.score}` : 'No activity'}`}
                    role="gridcell"
                >
                    {/* Pulse for today if solved */}
                    {isToday && activity?.solved && (
                        <motion.div
                            className="absolute inset-0 rounded-sm bg-green-400 pointer-events-none"
                            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    )}
                </motion.div>
            </div>

            {/* Tooltip rendered via portal-like fixed positioning — outside grid flow */}
            <Tooltip
                date={date}
                score={activity?.score}
                timeTaken={activity?.timeTaken}
                hintsUsed={activity?.hintsUsed}
                difficulty={activity?.difficulty}
                solved={activity?.solved ?? false}
                position={tooltipPos}
                show={showTooltip}
            />
        </>
    );
};

export const HeatmapCell = memo(HeatmapCellComponent, (prev, next) => {
    return (
        prev.intensity === next.intensity &&
        prev.activity?.score === next.activity?.score &&
        prev.activity?.solved === next.activity?.solved
    );
});
