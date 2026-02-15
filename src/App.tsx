import { useState } from "react";
import GameContainer from "./components/GameContainer";
import { HeatmapContainer } from "./components/Heatmap/HeatmapContainer";
import Leaderboard from "./components/Leaderboard";
import { useActivity } from "./hooks/useActivity";
import { useAuth } from "./hooks/useAuth";
import dayjs from "dayjs";
import { submitScore } from "./utils/leaderboard";

export default function App() {
  const [completed, setCompleted] = useState(false);
  const { markDayCompleted, resetActivity, activityMap } = useActivity();
  const { user, login, logout } = useAuth();

  const handleLogout = async () => {
    await resetActivity(); // Wipe local data
    await logout(); // Sign out from Firebase
    window.location.reload(); // Reload to clear memory state
  };

  const handleComplete = async () => {
    setCompleted(true);
    const today = dayjs().format("YYYY-MM-DD");
    const hints = activityMap[today]?.hintsUsed || 0;

    // Calculate final score
    const baseScore = 100;
    const finalScore = Math.max(10, baseScore - (hints * 15)); // Deduct 15 points per hint

    await markDayCompleted(today, finalScore, 0, hints);

    if (user) {
      await submitScore(user, finalScore, 60); // Mock time for now, or track in GameContainer
    }
  };

  const debugFillHistory = async () => {
    console.log("Filling history...");
    const today = dayjs();
    for (let i = 0; i < 150; i++) {
      if (Math.random() > 0.4) { // 60% chance
        const date = today.subtract(i, 'day').format('YYYY-MM-DD');
        await markDayCompleted(date, 100, 60);
      }
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-10 relative">
      <div className="absolute top-4 right-4 flex gap-2 items-center">
        {user ? (
          <>
            <div className="flex items-center gap-2 mr-4">
              {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-gray-600" />}
              <span className="text-sm text-gray-400 hidden sm:block">{user.displayName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-800 text-xs text-gray-300 px-3 py-1 rounded hover:bg-red-900/50 hover:text-red-200 transition-colors border border-gray-700"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="bg-blue-600 text-xs text-white px-3 py-1 rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
          >
            Sign In
          </button>
        )}

        <div className="w-px h-4 bg-gray-800 mx-1"></div>

        <button
          onClick={() => { resetActivity().then(() => window.location.reload()); }}
          className="bg-red-900/50 text-xs text-red-200 px-2 py-1 rounded hover:bg-red-800 transition-colors border border-red-800"
        >
          Reset Data
        </button>
        <button
          onClick={debugFillHistory}
          className="bg-gray-800 text-xs text-gray-400 px-2 py-1 rounded hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
        >
          DEV: Fill
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Daily Puzzle
      </h1>

      <div className="mb-8 w-full px-4">
        {!completed ? (
          <GameContainer onComplete={handleComplete} />
        ) : (
          <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-fade-in mx-auto max-w-md">
            <div className="text-green-400 text-2xl font-bold mb-2">🎉 Puzzle Completed!</div>
            <p className="text-gray-300 mb-6">See you tomorrow!</p>
            <Leaderboard />
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl px-4">
        <HeatmapContainer />
      </div>
    </div>
  );
}
