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
    cellSize?: number;
    gap?: number;
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

export const HeatmapGrid = ({ activityMap, cellSize = 12, gap = 3 }: HeatmapGridProps) => {
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
        <div className="flex flex-col gap-2">
            {/* Month labels */}
            <div className="relative h-6 flex mb-1">
                {monthLabels.map(({ col, label }) => (
                    <span
                        key={label + col}
                        className="text-[9px] text-gray-500 absolute font-black uppercase tracking-widest"
                        style={{ left: col * (cellSize + gap) }}
                    >
                        {label}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div
                className="heatmap-grid"
                style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(7, ${cellSize}px)`,
                    gridAutoFlow: 'column',
                    gridTemplateColumns: `repeat(${totalCols}, ${cellSize}px)`,
                    gap: `${gap}px`
                }}
            >
                {gridData.map((day) => {
                    const dateStr = day.format('YYYY-MM-DD');
                    const activity = activityMap[dateStr];
                    const intensity = calculateIntensity(activity);

                    return (
                        <div
                            key={dateStr}
                            style={{ width: cellSize, height: cellSize }}
                        >
                            <HeatmapCell
                                date={dateStr}
                                intensity={intensity}
                                activity={activity}
                                cellSize={cellSize}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center text-[9px] text-gray-500 mt-6 font-black uppercase tracking-[0.3em]">
                <span>Empty</span>
                <div className="flex gap-1.5 items-center">
                    <div className="w-3.5 h-3.5 bg-gray-800/40 rounded-md border border-white/5" title="No activity" />
                    <div className="w-3.5 h-3.5 bg-orange-900/50 rounded-md border border-white/5" />
                    <div className="w-3.5 h-3.5 bg-orange-700/70 rounded-md border border-white/5" />
                    <div className="w-3.5 h-3.5 bg-orange-500/90 rounded-md border border-white/5" />
                    <div className="w-3.5 h-3.5 bg-orange-400 rounded-md border border-white/5" />
                </div>
                <span>Peak</span>
            </div>
        </div>
    );
};
