import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';

interface Milestone {
    id: string;
    name: string;
    description: string;
    icon: string;
    achieved: boolean;
    goalValue: number;
    currentValue: number;
}

interface MilestoneBadgesProps {
    activityMap: Record<string, { solved: boolean; score: number }>;
    streak: number;
}

export const MilestoneBadges = ({ activityMap, streak }: MilestoneBadgesProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const milestones = useMemo(() => {
        const totalSolved = Object.values(activityMap).filter(a => a.solved).length;
        const currentMonth = dayjs().format('MMMM');

        // Check for perfect month
        const startOfMonth = dayjs().startOf('month');
        const today = dayjs();
        let daysSolvedThisMonth = 0;
        let current = startOfMonth;
        const totalDaysSoFar = today.date();

        while (current.isBefore(today) || current.isSame(today, 'day')) {
            const dateStr = current.format('YYYY-MM-DD');
            if (activityMap[dateStr]?.solved) {
                daysSolvedThisMonth++;
            }
            current = current.add(1, 'day');
        }

        const badges: Milestone[] = [
            {
                id: '7-day-streak',
                name: 'Week Warrior',
                description: 'Hit a 7-day streak',
                icon: '🔥',
                achieved: streak >= 7,
                goalValue: 7,
                currentValue: streak,
            },
            {
                id: '30-day-streak',
                name: 'Monthly Master',
                description: 'Hit a 30-day streak',
                icon: '🏆',
                achieved: streak >= 30,
                goalValue: 30,
                currentValue: streak,
            },
            {
                id: 'perfect-month',
                name: `Flawless ${currentMonth}`,
                description: `Solve every day in ${currentMonth}`,
                icon: '⭐',
                achieved: daysSolvedThisMonth >= totalDaysSoFar && totalDaysSoFar >= 7,
                goalValue: dayjs().daysInMonth(),
                currentValue: daysSolvedThisMonth,
            },
            {
                id: '100-solved',
                name: 'Century Club',
                description: 'Solve 100 total puzzles',
                icon: '💎',
                achieved: totalSolved >= 100,
                goalValue: 100,
                currentValue: totalSolved,
            },
            {
                id: '365-day-streak',
                name: 'Year Legend',
                description: 'Complete a full year streak',
                icon: '🎯',
                achieved: streak >= 365,
                goalValue: 365,
                currentValue: streak,
            },
        ];

        return badges;
    }, [activityMap, streak]);

    const achievedMilestones = milestones.filter(m => m.achieved);

    return (
        <div className="w-full">
            {/* Achieved Badges (Minimized View) */}
            <div
                className={`flex flex-wrap gap-3 cursor-pointer transition-all duration-300 ${isExpanded ? 'mb-8' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {achievedMilestones.length > 0 ? (
                    achievedMilestones.map((milestone) => (
                        <motion.div
                            key={milestone.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/10 p-2 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors"
                        >
                            <span className="text-2xl" title={milestone.name}>{milestone.icon}</span>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest py-2">Click to reveal goals</p>
                )}
            </div>

            {/* Expandable Goals Section */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-orange-500 animate-pulse">🔥</span>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Active Goals</span>
                        </div>

                        {milestones.map((milestone) => (
                            <div key={milestone.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 relative group hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/5 border border-white/10 ${milestone.achieved ? 'shadow-[0_0_15px_rgba(255,165,0,0.2)]' : ''}`}>
                                            {milestone.icon}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white uppercase tracking-tight">{milestone.name}</div>
                                            <div className="text-[10px] text-gray-500 font-medium">{milestone.description}</div>
                                        </div>
                                    </div>
                                    {milestone.achieved ? (
                                        <div className="text-orange-500 text-xl animate-bounce">🔥</div>
                                    ) : (
                                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                            {Math.min(milestone.currentValue, milestone.goalValue)}/{milestone.goalValue}
                                        </div>
                                    )}
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (milestone.currentValue / milestone.goalValue) * 100)}%` }}
                                        className={`h-full ${milestone.achieved ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-blue-500/40'}`}
                                    />
                                </div>
                                {/* Glow for achieved items */}
                                {milestone.achieved && (
                                    <div className="absolute inset-0 bg-orange-500/5 blur-xl pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
