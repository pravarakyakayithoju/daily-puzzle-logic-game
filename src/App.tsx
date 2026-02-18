import { useState, useEffect } from "react";
import GameContainer from "./components/GameContainer";
import Leaderboard from "./components/Leaderboard";
import CompletionOverlay from "./components/CompletionOverlay";
import Sidebar from "./components/Sidebar";
import { useActivity } from "./hooks/useActivity";
import { useAuth } from "./hooks/useAuth";
import dayjs from "dayjs";
import { submitScore } from "./utils/leaderboard";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { markDayCompleted, resetActivity, activityMap, streak, loading } = useActivity();
  const { user, login, logout } = useAuth();

  const today = dayjs().format("YYYY-MM-DD");
  const todayActivity = activityMap[today];
  const alreadyCompleted = todayActivity?.solved === true;

  // Online/offline tracking
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

    await markDayCompleted(today, finalScore, timeTaken, hints);

    if (user) {
      await submitScore(user, finalScore, timeTaken);
    }
  };


  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col items-center py-12 relative overflow-x-hidden selection:bg-blue-500/30">

      {/* Star Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.2 }}
            animate={{
              opacity: [0.1, 0.7, 0.1],
              scale: [0.2, 1, 0.2],
              y: [0, -60, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 10px rgba(255,255,255,0.8)'
            }}
          />
        ))}
      </div>

      {/* Dynamic Background Aura */}
      <div className="aura-blob w-[700px] h-[700px] bg-blue-600/10 -top-20 -left-20" />
      <div className="aura-blob w-[600px] h-[600px] bg-purple-600/10 top-1/2 -right-20" style={{ animationDelay: '-5s' }} />
      <div className="aura-blob w-[500px] h-[500px] bg-indigo-600/10 -bottom-20 left-1/3" style={{ animationDelay: '-10s' }} />

      {/* Completion Overlay */}
      <CompletionOverlay
        show={showOverlay}
        score={lastScore}
        timeTaken={lastTime}
        hintsUsed={activityMap[today]?.hintsUsed || 0}
        streak={streak}
        onDismiss={() => setShowOverlay(false)}
      />

      {/* Top Bar */}
      <div className="absolute top-8 right-10 flex gap-6 items-center z-50">
        <div className="flex items-center gap-3 mr-2" title={isOnline ? 'Online – sync active' : 'Offline – changes saved locally'}>
          <div className={`w-3 h-3 rounded-full transition-colors ${isOnline ? 'bg-green-400 shadow-[0_0_15px_#4ade80]' : 'bg-gray-500'}`} />
          <span className="text-xs font-black text-gray-400 hidden sm:block tracking-[0.2em] uppercase">{isOnline ? 'Active' : 'Offline'}</span>
        </div>

        {user ? (
          <>
            <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full shadow-lg shadow-black/50" />}
              <span className="text-sm font-black text-white hidden sm:block uppercase tracking-tighter">{user.displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/10 text-[11px] font-black uppercase tracking-[0.2em] text-red-400 px-6 py-2.5 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/5 group"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="bg-blue-600 text-sm font-black uppercase tracking-[0.2em] text-white px-8 py-3 rounded-2xl hover:bg-blue-500 transition-all duration-300 shadow-2xl shadow-blue-500/20 border border-blue-400/30"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Header Area */}
      <div className="w-full max-w-7xl px-8 mb-24 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-9xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 tracking-tighter uppercase italic leading-none drop-shadow-2xl"
        >
          Logic Daily
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-xl font-black tracking-[0.6em] uppercase opacity-70"
        >
          {dayjs().format('dddd, MMMM D')}
        </motion.p>
      </div>

      {/* Main Layout Grid */}
      <div className="w-full max-w-[1600px] px-12 flex flex-col lg:flex-row gap-20 items-start min-h-[800px]">

        {/* Left Column: Stats & History */}
        <aside className="w-full lg:w-[450px] shrink-0 sticky top-16">
          <Sidebar activityMap={activityMap} streak={streak} loading={loading} />
        </aside>

        {/* Right/Center Column: Game & Banners */}
        <main className="flex-1 w-full flex flex-col items-center z-10">
          {loading ? (
            <div className="w-full flex flex-col items-center justify-center py-60 gap-12">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-[6px] border-blue-500/5 rounded-full" />
                <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-4 border-[6px] border-purple-500 border-b-transparent rounded-full animate-spin-slow" />
              </div>
              <p className="text-gray-500 text-2xl font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Data</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <AnimatePresence mode="wait">
                {!alreadyCompleted ? (
                  <motion.div
                    key="banner"
                    initial={{ opacity: 0, scale: 0.9, y: 60 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -60 }}
                    className="w-full mb-16 p-16 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 border border-white/10 rounded-[4rem] backdrop-blur-[100px] flex flex-col items-center text-center gap-12 relative overflow-hidden group shadow-[0_60px_150px_rgba(0,0,0,0.7)]"
                  >
                    {/* Decorative floating elements */}
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px] animate-pulse" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1.5s' }} />

                    <div className="relative z-10 space-y-6">
                      <div className="inline-block px-8 py-2 bg-blue-500/20 text-blue-400 text-sm font-black uppercase tracking-[0.4em] rounded-full border border-blue-500/30 mb-6 backdrop-blur-md">
                        Global Daily Protocol
                      </div>
                      <h2 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.85]">
                        Module <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Online</span>
                      </h2>
                      <p className="text-gray-400 text-2xl md:text-3xl font-medium max-w-4xl mx-auto leading-relaxed italic opacity-80">
                        New cognitive sequence established. Optimize logic paths for terminal velocity.
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 relative z-10 w-full max-w-5xl">
                      <div className="flex-1 min-w-[250px] p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 text-center transition-all hover:bg-white/[0.07] hover:scale-105 duration-700 shadow-2xl">
                        <div className="text-sm text-gray-500 uppercase font-black tracking-[0.3em] mb-4">Integrity</div>
                        <div className="text-3xl font-black text-green-400 uppercase tracking-tighter">Verified</div>
                      </div>
                      <div className="flex-1 min-w-[250px] p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 text-center transition-all hover:bg-white/[0.07] hover:scale-105 duration-700 shadow-2xl">
                        <div className="text-sm text-gray-500 uppercase font-black tracking-[0.3em] mb-4">Efficiency</div>
                        <div className="text-3xl font-black text-yellow-400 italic font-mono">&lt; 0:40s</div>
                      </div>
                      <div className="flex-1 min-w-[250px] p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 text-center transition-all hover:bg-white/[0.07] hover:scale-105 duration-700 shadow-2xl">
                        <div className="text-sm text-gray-500 uppercase font-black tracking-[0.3em] mb-4">Classification</div>
                        <div className="text-3xl font-black text-blue-400 uppercase">Grandmaster</div>
                      </div>
                    </div>

                    <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_30px_rgba(59,130,246,0.8)]"
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="w-full flex justify-center py-10">
                {alreadyCompleted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-center p-20 bg-white/[0.03] backdrop-blur-[100px] rounded-[4rem] border border-white/10 mx-auto max-w-4xl shadow-[0_80px_200px_rgba(0,0,0,0.8)] relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
                    <div className="text-green-400 text-7xl font-black mb-12 uppercase italic tracking-tighter drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]">Daily Challenge Completed</div>
                    <div className="flex justify-center gap-24 mb-16">
                      <div className="text-center group">
                        <div className="text-gray-500 text-sm uppercase font-black tracking-[0.3em] mb-4 group-hover:text-white transition-colors">Net Score</div>
                        <div className="text-7xl font-black text-white group-hover:scale-110 transition-transform">{todayActivity.score}</div>
                      </div>
                      {todayActivity.timeTaken > 0 && (
                        <div className="text-center group">
                          <div className="text-gray-500 text-sm uppercase font-black tracking-[0.3em] mb-4 group-hover:text-white transition-colors">Time Index</div>
                          <div className="text-7xl font-black text-white group-hover:scale-110 transition-transform">
                            {Math.floor(todayActivity.timeTaken / 60)}:{String(todayActivity.timeTaken % 60).padStart(2, '0')}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-2xl mb-16 font-semibold italic opacity-60">System standing updated. Next window opens at midnight.</p>
                    <Leaderboard />
                  </motion.div>
                ) : (
                  <div className="w-full flex justify-center scale-125 md:scale-[1.4] py-32 origin-top relative">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -z-10" />
                    <GameContainer onComplete={handleComplete} />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
