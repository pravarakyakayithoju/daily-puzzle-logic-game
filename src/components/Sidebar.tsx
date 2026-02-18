import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { MilestoneBadges } from './Heatmap/MilestoneBadges';
import { HeatmapGrid } from './Heatmap/HeatmapGrid';

interface SidebarProps {
    activityMap: Record<string, any>;
    streak: number;
    loading: boolean;
}

export default function Sidebar({ activityMap, streak, loading }: SidebarProps) {
    const totalSolved = Object.values(activityMap).filter(a => a.solved).length;
    const perfectDays = Object.values(activityMap).filter(a => a.score >= 100).length;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const weekDays = [...Array(7)].map((_, i) => {
        const d = dayjs().subtract(6 - i, 'day');
        const dateStr = d.format('YYYY-MM-DD');
        return {
            label: d.format('dd')[0],
            dateStr,
            solved: activityMap[dateStr]?.solved ?? false,
            isToday: i === 6,
        };
    });

    const recentHistory = Object.values(activityMap)
        .filter(a => a.solved)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10);

    if (loading) {
        return (
            <div className="flex flex-col gap-8 animate-pulse p-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-40 bg-gray-900/60 border border-gray-800 rounded-[3rem]" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 pb-32">

            {/* 🔥 Weekly Streak Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent border border-orange-500/20 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group shadow-2xl shadow-orange-500/5"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-orange-500/10 transition-colors" />

                <h3 className="text-xs font-black text-orange-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_#f97316]" />
                    Vital Signs
                </h3>

                <div className="flex items-center gap-6 mb-10">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            filter: ['drop-shadow(0 0 5px #f97316)', 'drop-shadow(0 0 20px #f97316)', 'drop-shadow(0 0 5px #f97316)']
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl"
                    >
                        🔥
                    </motion.div>
                    <div>
                        <div className="text-6xl font-black text-white group-hover:scale-110 transition-transform tracking-tighter">{streak}</div>
                        <div className="text-xs text-orange-400/70 font-black uppercase tracking-[0.2em] mt-1">Day Streak</div>
                    </div>
                </div>

                <div className="flex justify-between items-end h-16 gap-3">
                    {weekDays.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 flex-1">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: day.solved ? '100%' : '20%' }}
                                className={`w-full rounded-full relative overflow-hidden ${day.solved
                                        ? 'bg-gradient-to-t from-orange-600 to-yellow-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                        : 'bg-white/5'
                                    }`}
                                style={{ minHeight: '8px' }}
                            >
                                {day.isToday && !day.solved && (
                                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse" />
                                )}
                            </motion.div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${day.isToday ? 'text-white' : 'text-gray-600'
                                }`}>
                                {day.label}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* 📊 Metrics Grid */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 gap-6"
            >
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl hover:bg-white/[0.08] transition-all group cursor-default shadow-xl">
                    <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform tracking-tighter">{totalSolved}</div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Total Solve</div>
                    <div className="w-10 h-1 bg-blue-500/30 rounded-full mt-4 group-hover:w-full transition-all duration-500" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl hover:bg-white/[0.08] transition-all group cursor-default shadow-xl">
                    <div className="text-5xl font-black text-green-400 group-hover:scale-110 transition-transform tracking-tighter">{perfectDays}</div>
                    <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Perfect</div>
                    <div className="w-10 h-1 bg-green-500/30 rounded-full mt-4 group-hover:w-full transition-all duration-500" />
                </div>
            </motion.div>

            {/* 📉 Activity Heatmap */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl shadow-xl hover:border-white/20 transition-colors"
            >
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                    Global Network
                </h3>
                <div className="overflow-x-auto custom-scrollbar pb-4 scale-110 origin-left">
                    <HeatmapGrid activityMap={activityMap} />
                </div>
            </motion.div>

            {/* 🏆 Rewards & Badges */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 rounded-[3rem] p-10 backdrop-blur-2xl shadow-xl"
            >
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_#a855f7]" />
                    Stored Medals
                </h3>
                <MilestoneBadges activityMap={activityMap} streak={streak} />
            </motion.div>

            {/* 📅 History (Previous Problems) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl shadow-xl"
            >
                <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_#ec4899]" />
                    Past Missions
                </h3>
                <div className="space-y-8">
                    {recentHistory.length > 0 ? (
                        recentHistory.map((a) => {
                            const scoreColor = a.score === 100 ? 'text-green-400' : a.score >= 70 ? 'text-blue-400' : 'text-purple-400';
                            return (
                                <div key={a.date} className="flex items-center justify-between group cursor-default hover:bg-white/5 p-4 rounded-2xl transition-all -mx-4">
                                    <div className="space-y-1">
                                        <div className="text-sm text-gray-200 font-black uppercase tracking-wider group-hover:text-white transition-colors">
                                            {dayjs(a.date).format('MMM D, YYYY')}
                                        </div>
                                        <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                                            {a.hintsUsed ? `${a.hintsUsed} Protocol Hint${a.hintsUsed > 1 ? 's' : ''}` : 'Execution: Perfect'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        {a.timeTaken > 0 && (
                                            <span className="text-xs text-gray-500 font-mono font-bold tracking-tighter">{formatTime(a.timeTaken)}</span>
                                        )}
                                        <div className={`text-2xl font-black w-12 text-right ${scoreColor} group-hover:scale-125 transition-transform`}>{a.score}</div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-xs text-gray-600 font-black uppercase tracking-[0.3em] text-center py-10 opacity-50 italic">No missions logged</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
