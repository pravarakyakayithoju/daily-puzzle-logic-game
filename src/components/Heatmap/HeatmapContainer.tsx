import { useActivity } from '../../hooks/useActivity';
import { HeatmapGrid } from './HeatmapGrid';

export const HeatmapContainer = () => {
    const { activityMap, streak, loading } = useActivity();

    if (loading) {
        return <div className="text-gray-500 text-sm animate-pulse">Loading activity...</div>;
    }

    return (
        <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Current Streak</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{streak}</span>
                        <span className="text-gray-500">days</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Total Active Days</div>
                    <div className="text-xl font-bold text-white">{Object.keys(activityMap).length}</div>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <HeatmapGrid activityMap={activityMap} />
            </div>
        </div>
    );
};
