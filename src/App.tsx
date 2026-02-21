import { useState, useEffect } from "react";
import GameContainer from "./components/GameContainer";
import Leaderboard from "./components/Leaderboard";
import CompletionOverlay from "./components/CompletionOverlay";
import { useActivity } from "./hooks/useActivity";
import { useAuth } from "./hooks/useAuth";
import dayjs from "dayjs";
import { submitScore } from "./utils/leaderboard";
import { motion, AnimatePresence } from "framer-motion";
import { HeatmapGrid } from "./components/Heatmap/HeatmapGrid";
import { MilestoneBadges } from "./components/Heatmap/MilestoneBadges";
import { getUserRank, getNextRank } from "./utils/rank";
import BluestockLogo from "./components/BluestockLogo";

export default function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isHeatmapExpanded, setIsHeatmapExpanded] = useState(false);

  const { markDayCompleted, resetActivity, activityMap, streak, loading } = useActivity();
  const { user, login, logout } = useAuth();

  const today = dayjs().format("YYYY-MM-DD");
  const todayActivity = activityMap[today];
  const alreadyCompleted = todayActivity?.solved === true;

  const totalSolved = Object.values(activityMap).filter(a => a.solved).length;
  const perfectDays = Object.values(activityMap).filter(a => a.score >= 100).length;

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

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    await resetActivity();
    await logout();
    window.location.reload();
  };

  const handleComplete = async (timeTaken: number) => {
    const hints = activityMap[today]?.hintsUsed || 0;
    const timeBonus = Math.max(0, Math.round((60 - Math.min(timeTaken, 60)) * 0.5));
    const finalScore = Math.max(10, 100 - hints * 15 + timeBonus);

    setLastScore(finalScore);
    setLastTime(timeTaken);
    setShowOverlay(true);
    setIsGameActive(false);

    // Perform persistence and leaderboard submission in background
    markDayCompleted(today, finalScore, timeTaken, hints).then(newStreak => {
      if (user) submitScore(user, finalScore, timeTaken, newStreak);
    });
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center py-10 relative overflow-x-hidden selection:bg-blue-500/30">

      {/* Visual background layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.2 }}
            animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.2, 1, 0.2], y: [0, -100, 0] }}
            transition={{ duration: 5 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 10 }}
            className="absolute w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_10px_white]"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>
      <div className="aura-blob w-[800px] h-[800px] bg-blue-600/5 -top-40 -left-40" />
      <div className="aura-blob w-[800px] h-[800px] bg-purple-600/5 top-1/2 -right-40" style={{ animationDelay: '-5s' }} />

      <CompletionOverlay
        show={showOverlay}
        score={lastScore}
        timeTaken={lastTime}
        hintsUsed={activityMap[today]?.hintsUsed || 0}
        streak={streak}
        onDismiss={() => setShowOverlay(false)}
      />

      {/* Modern Fixed Top Nav */}
      <nav className="fixed top-0 inset-x-0 h-24 bg-black/60 backdrop-blur-2xl border-b border-white/5 z-50 px-12 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <BluestockLogo />

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-green-400 shadow-[0_0_10px_#4ade80]' : 'bg-gray-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{isOnline ? 'Active' : 'Offline'}</span>
          </div>

          <button
            onClick={() => resetActivity().then(() => window.location.reload())}
            className="text-[10px] font-black uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors border border-red-500/10 px-3 py-1 rounded-lg hover:bg-red-500/5"
          >
            Purge System
          </button>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <img src={user.photoURL!} alt="" className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-xs font-black uppercase tracking-widest text-white/80">{user.displayName}</span>
              </div>
              <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Sign Out</button>
            </div>
          ) : (
            <button onClick={login} className="bg-blue-600 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Sign In</button>
          )}
        </div>
      </nav>

      <div className="w-full max-w-[1920px] px-10 mt-24 z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" exit={{ opacity: 0 }} className="w-full flex flex-col items-center justify-center py-60 gap-12">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-[6px] border-blue-500/5 rounded-full" />
                <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-gray-500 text-2xl font-black uppercase tracking-[0.5em] animate-pulse">Syncing Network</p>
            </motion.div>
          ) : isGameActive && !alreadyCompleted ? (
            <motion.div key="game" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex flex-col items-center gap-12 max-w-7xl mx-auto">
              <div className="w-full flex justify-between items-center mb-10">
                <button onClick={() => setIsGameActive(false)} className="bg-white/5 px-8 py-4 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">← Abort Mission</button>
                <div className="flex flex-col items-end">
                  <div className="text-blue-400 text-sm font-black uppercase tracking-[0.5em] mb-1">Active Mission</div>
                  <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">System Version 2.0.4</div>
                </div>
              </div>
              <div className="w-full flex justify-center scale-125 md:scale-[1.6] py-40 origin-top relative mb-40">
                <div className="absolute inset-0 bg-blue-600/5 blur-[180px] rounded-full -z-10" />
                <GameContainer onComplete={handleComplete} />
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-40">

              {/* ENGAGING HEADING ROW */}
              <div className="flex flex-col items-center text-center mb-20 px-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] mb-6 rounded-full backdrop-blur-sm shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                >
                  {getUserRank(streak).label} Level Activated
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-none mb-8 relative"
                >
                  Master the <span className="text-blue-500 italic">Bluestock Challenge</span>
                </motion.h1>
                <p className="text-gray-500 text-lg md:text-xl font-medium tracking-wide max-w-3xl leading-relaxed">
                  Ready for today's <span className="text-white font-bold">Challenge?</span> <br />
                  Make your mind <span className="text-blue-400 italic">sharper, faster, and smarter.</span>
                </p>
              </div>

              {/* BENTO GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* 1. MAIN MISSION CARD (Left/Center) */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                  {!alreadyCompleted ? (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="w-full p-20 bg-gradient-to-br from-blue-600/30 via-transparent to-transparent border border-white/10 rounded-[5rem] backdrop-blur-[120px] flex flex-col items-center text-center gap-16 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
                    >
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent group-hover:via-white transition-all duration-1000" />
                      <div className="relative z-10 space-y-10">
                        <div className="flex items-center justify-center gap-4">
                          <span className="w-12 h-[1px] bg-blue-500/30" />
                          <div className="text-blue-400 text-[10px] font-black uppercase tracking-[0.8em]">Tactical Logic Sync</div>
                          <span className="w-12 h-[1px] bg-blue-500/30" />
                        </div>
                        <h2 className="text-7xl md:text-[10rem] font-black tracking-tighter text-white uppercase italic leading-none drop-shadow-2xl select-none">Begin <br />Challenge</h2>
                        <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-4xl mx-auto leading-relaxed italic opacity-80 decoration-blue-500/30 underline-offset-8">A high-tier cognitive anomaly has been detected. Are you sharp enough to solve it?</p>
                      </div>
                      <button
                        onClick={() => setIsGameActive(true)}
                        className="relative z-10 px-24 py-10 bg-white text-black rounded-[4rem] text-3xl font-black uppercase tracking-[0.4em] hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_20px_50px_rgba(255,255,255,0.15)] group/btn"
                      >
                        <span className="relative z-10">Engage Now</span>
                        <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover/btn:opacity-10 rounded-[4rem] transition-opacity" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="w-full p-20 bg-green-500/5 border border-green-500/20 rounded-[4rem] flex flex-col items-center text-center gap-10">
                      <div className="text-green-400 text-8xl font-black uppercase italic tracking-tighter transform -rotate-2">Mission Success</div>
                      <div className="flex gap-20">
                        <div className="text-center group">
                          <div className="text-gray-500 text-xs uppercase font-black tracking-[0.3em] mb-4">Final Score</div>
                          <div className="text-9xl font-black text-white group-hover:scale-110 transition-transform">{todayActivity.score}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* HEATMAP CARD (Now Large & Centered) */}
                  <div className={`transition-all duration-700 bg-white/[0.03] border border-white/10 rounded-[4rem] backdrop-blur-3xl overflow-hidden shadow-2xl ${isHeatmapExpanded ? 'fixed inset-10 z-[100] p-24 bg-black/95' : 'p-16'}`}>
                    <div className="flex justify-between items-center mb-16">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6]" />
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">Global Network Matrix</h3>
                      </div>
                      <button onClick={() => setIsHeatmapExpanded(!isHeatmapExpanded)} className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10">{isHeatmapExpanded ? 'Close Monitor' : 'Expand Matrix'}</button>
                    </div>
                    <div className={`transition-all duration-700 w-full overflow-hidden flex justify-center`}>
                      <HeatmapGrid activityMap={activityMap} cellSize={isHeatmapExpanded ? 24 : 14} gap={isHeatmapExpanded ? 8 : 4} />
                    </div>
                  </div>
                </div>

                {/* 2. SIDE STAT PANEL (Right) */}
                <div className="lg:col-span-4 flex flex-col gap-10">

                  {/* Streak Card */}
                  <div className="bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/20 rounded-[4rem] p-16 relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10 flex flex-col items-center text-center gap-8">
                      <motion.div animate={{ scale: [1, 1.2, 1], filter: ['drop-shadow(0 0 5px #f97316)', 'drop-shadow(0 0 30px #f97316)', 'drop-shadow(0 0 5px #f97316)'] }} transition={{ duration: 2, repeat: Infinity }} className="text-9xl">🔥</motion.div>
                      <div className="mb-0">
                        <div className="text-9xl font-black text-white leading-none tracking-tighter">{streak}</div>
                        <div className="text-sm text-orange-400 font-black uppercase tracking-[0.5em] mt-4">Active Loop</div>
                      </div>
                    </div>

                    {/* Next Rank Progress */}
                    {getNextRank(streak).rank && (
                      <div className="relative z-10 mt-10 mb-10 w-full max-w-[200px] mx-auto space-y-3">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                          <span className="text-gray-400">Next: {getNextRank(streak).rank?.label}</span>
                          <span className="text-orange-500">{getNextRank(streak).daysRemaining}d left</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(streak / getNextRank(streak).rank!.level) * 100}%` }}
                            className={`h-full ${getNextRank(streak).rank?.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-end h-20 gap-4 relative z-10">
                      {weekDays.map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 flex-1">
                          <div className="w-full flex-1 rounded-full bg-white/5 relative overflow-hidden min-h-[10px]">
                            {day.solved && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: '100%' }}
                                className="absolute inset-0 bg-gradient-to-t from-orange-600 to-yellow-400 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                              />
                            )}
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${day.isToday ? 'text-white' : 'text-gray-600'}`}>
                            {day.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-10">
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center group hover:bg-white/[0.08] transition-all">
                      <div className="text-7xl font-black text-white group-hover:scale-110 transition-all">{totalSolved}</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-4">Cycles</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 text-center group hover:bg-white/[0.08] transition-all">
                      <div className="text-7xl font-black text-green-400 group-hover:scale-110 transition-all">{perfectDays}</div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-4">Apex</div>
                    </div>
                  </div>

                  {/* Medals */}
                  <div className="bg-white/5 border border-white/10 rounded-[4rem] p-16">
                    <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_#a855f7]" /> Medals
                    </h3>
                    <MilestoneBadges activityMap={activityMap} streak={streak} />
                  </div>

                  {/* History */}
                  <div className="bg-white/5 border border-white/10 rounded-[4rem] p-16 flex-1">
                    <h3 className="text-xs font-black text-pink-400 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
                      <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_#ec4899]" /> Logs
                    </h3>
                    <div className="space-y-10">
                      {Object.values(activityMap).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5).map(a => (
                        <div key={a.date} className="flex justify-between items-center group">
                          <div>
                            <div className="text-sm font-black uppercase text-gray-200">{dayjs(a.date).format('MMM D')}</div>
                            <div className="text-[10px] text-gray-600 font-black uppercase">{a.score >= 100 ? 'Apex' : 'Stable'}</div>
                          </div>
                          <div className="text-3xl font-black text-blue-500 group-hover:scale-125 transition-all">{a.score}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* WORLD RANKING ROW */}
              <div className="w-full bg-white/[0.02] border border-white/5 rounded-[5rem] p-24">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.6em] mb-20 text-center">Protocol Universal Standings</h3>
                <Leaderboard />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
