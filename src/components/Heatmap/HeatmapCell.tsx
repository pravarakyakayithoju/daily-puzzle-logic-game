import { motion } from 'framer-motion';
import clsx from 'clsx';

interface HeatmapCellProps {
    date: string;
    intensity: number; // 0-4
    title?: string;
}

const INTENSITY_COLORS = [
    'bg-gray-800', // 0: Not played (Dark theme base)
    'bg-green-900', // 1: Solved Easy
    'bg-green-700', // 2: Solved Medium
    'bg-green-500', // 3: Solved Hard
    'bg-green-400', // 4: Perfect
];

export const HeatmapCell = ({ date, intensity, title }: HeatmapCellProps) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                'w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-white/50 transition-all border border-gray-700',
                INTENSITY_COLORS[intensity] || INTENSITY_COLORS[0]
            )}
            title={title || date}
            data-date={date}
        />
    );
};
