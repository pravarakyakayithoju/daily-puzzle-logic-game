import { useActivity } from '../../hooks/useActivity';
import { HeatmapGrid } from './HeatmapGrid';
import { StreakDisplay } from './StreakDisplay';
import { MilestoneBadges } from './MilestoneBadges';

export const HeatmapContainer = () => {
    const { activityMap, streak, loading } = useActivity();

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-gray-600 text-sm py-4">
                <div className="w-4 h-4 border border-gray-600 border-t-transparent rounded-full animate-spin" />
                Loading activity...
            </div>
        );
    }

    const totalSolved = Object.values(activityMap).filter(a => a.solved).length;
    const perfectDays = Object.values(activityMap).filter(a => a.solved && a.score === 100 && (a.hintsUsed || 0) === 0).length;

    return (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
            {/* Stats Row */}
            <div className="flex justify-between items-end mb-6">
                <div className="relative">
                    <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2">
                        Current Streak
                    </h3>
                    <StreakDisplay streak={streak} />
                </div>

                <div className="flex gap-6 text-right">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Total Solved</div>
                        <div className="text-2xl font-bold text-white">{totalSolved}</div>
                    </div>
                    {perfectDays > 0 && (
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Perfect Days</div>
                            <div className="text-2xl font-bold text-green-400">{perfectDays}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto pb-2">
                <HeatmapGrid activityMap={activityMap} />
            </div>

            {/* Milestone Badges */}
            <MilestoneBadges activityMap={activityMap} streak={streak} />
        </div>
    );
};
