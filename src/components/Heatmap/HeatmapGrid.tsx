import { useMemo } from 'react';
import dayjs from 'dayjs';
import { HeatmapCell } from './HeatmapCell';

interface HeatmapGridProps {
    activityMap: Record<string, { solved: boolean; score: number }>;
}

export const HeatmapGrid = ({ activityMap }: HeatmapGridProps) => {
    const gridData = useMemo(() => {
        const today = dayjs();
        // Generate last 365 days mostly, but let's align to weeks for the grid
        // 52 weeks * 7 days = 364 days
        const endDate = today;
        const startDate = endDate.subtract(51, 'weeks').startOf('week'); // Start from a Sunday

        const days = [];
        let current = startDate;
        while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
            days.push(current);
            current = current.add(1, 'day');
        }
        return days;
    }, []);

    return (
        <div className="flex flex-col gap-1">
            <div className="grid grid-flow-col gap-1 grid-rows-7">
                {gridData.map((day) => {
                    const dateStr = day.format('YYYY-MM-DD');
                    const activity = activityMap[dateStr];
                    const intensity = activity?.solved ? (activity.score > 0 ? 3 : 1) : 0; // Simplified intensity

                    return (
                        <HeatmapCell
                            key={dateStr}
                            date={dateStr}
                            intensity={intensity}
                            title={`${dateStr}: ${activity ? 'Solved' : 'No activity'}`}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 bg-gray-800 rounded-sm" />
                    <div className="w-3 h-3 bg-green-900 rounded-sm" />
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};
