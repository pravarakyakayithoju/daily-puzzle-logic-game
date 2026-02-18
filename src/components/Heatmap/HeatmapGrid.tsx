import { useMemo } from 'react';
import dayjs from 'dayjs';
import { HeatmapCell } from './HeatmapCell';

interface DailyActivity {
    solved: boolean;
    score: number;
    timeTaken: number;
    hintsUsed?: number;
    difficulty: number;
}

interface HeatmapGridProps {
    activityMap: Record<string, DailyActivity>;
}

// Calculate intensity based on score and hints (5 levels: 0-4)
const calculateIntensity = (activity: DailyActivity | undefined): number => {
    if (!activity?.solved) return 0;

    const { score, hintsUsed = 0 } = activity;

    if (score === 100 && hintsUsed === 0) return 4; // Perfect score, no hints
    if (score >= 80 && hintsUsed === 0) return 3;   // High score, no hints
    if (score >= 50 || hintsUsed === 1) return 2;   // Medium score or 1 hint
    return 1;                                         // Low score or multiple hints
};

export const HeatmapGrid = ({ activityMap }: HeatmapGridProps) => {
    const { gridData, monthLabels } = useMemo(() => {
        const today = dayjs();
        const startDate = today.subtract(51, 'weeks').startOf('week'); // Start from Sunday

        const days = [];
        let current = startDate;
        while (current.isBefore(today) || current.isSame(today, 'day')) {
            days.push(current);
            current = current.add(1, 'day');
        }

        // Build month labels: for each week column, determine if a new month starts
        const labels: { col: number; label: string }[] = [];
        let lastMonth = -1;
        days.forEach((day, idx) => {
            const col = Math.floor(idx / 7);
            const month = day.month();
            if (month !== lastMonth && day.date() <= 7) {
                labels.push({ col, label: day.format('MMM') });
                lastMonth = month;
            }
        });

        return { gridData: days, monthLabels: labels };
    }, []);

    const totalCols = Math.ceil(gridData.length / 7);

    return (
        <div className="flex flex-col gap-1">
            {/* Month labels */}
            <div className="relative h-5" style={{ display: 'grid', gridTemplateColumns: `repeat(${totalCols}, 12px)`, gap: '3px' }}>
                {monthLabels.map(({ col, label }) => (
                    <span
                        key={label + col}
                        className="text-[10px] text-gray-500 absolute"
                        style={{ left: col * 15 }}
                    >
                        {label}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div
                className="heatmap-grid"
                style={{ gridTemplateColumns: `repeat(${totalCols}, 12px)` }}
            >
                {gridData.map((day) => {
                    const dateStr = day.format('YYYY-MM-DD');
                    const activity = activityMap[dateStr];
                    const intensity = calculateIntensity(activity);

                    return (
                        <HeatmapCell
                            key={dateStr}
                            date={dateStr}
                            intensity={intensity}
                            activity={activity}
                        />
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                    <div className="w-3 h-3 bg-gray-800/50 rounded-sm border border-gray-700" title="No activity" />
                    <div className="w-3 h-3 bg-green-900/60 rounded-sm border border-gray-700" title="Completed (low)" />
                    <div className="w-3 h-3 bg-green-700/80 rounded-sm border border-gray-700" title="Medium" />
                    <div className="w-3 h-3 bg-green-500 rounded-sm border border-gray-700" title="High score" />
                    <div className="w-3 h-3 bg-green-400 rounded-sm border border-gray-700" title="Perfect" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};
