import { useState, useEffect } from "react";
import { getLeaderboard } from "../utils/leaderboard";
import type { LeaderboardEntry } from "../utils/leaderboard";
import dayjs from "dayjs";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserRank } from "../utils/rank";

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setEntries(data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div className="text-gray-500 text-sm animate-pulse text-center mt-4">Loading Leaderboard...</div>;

    return (
        <div className="w-full max-w-md mx-auto mt-8 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm overflow-hidden">
            <div className="bg-gray-800/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">Global Top 50</h3>
                <span className="text-xs text-gray-500">{dayjs().format("MMM D")}</span>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {entries.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 text-sm">
                        No scores yet. Be the first!
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-800/30 text-gray-400 text-xs">
                            <tr>
                                <th className="px-4 py-2 font-medium">#</th>
                                <th className="px-4 py-2 font-medium">Player</th>
                                <th className="px-4 py-2 font-medium text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {entries.map((entry, index) => {
                                const isMe = user?.uid === entry.uid;
                                return (
                                    <tr key={entry.uid} className={isMe ? "bg-blue-900/20" : "hover:bg-gray-800/30"}>
                                        <td className="px-4 py-3 text-gray-500 font-mono w-10">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {entry.photoURL ? (
                                                    <img src={entry.photoURL} className="w-5 h-5 rounded-full" alt="" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-[10px]">
                                                        {entry.displayName[0]}
                                                    </div>
                                                )}
                                                <span className={`${isMe ? "text-blue-300 font-bold" : "text-gray-300"} flex items-center gap-1.5`}>
                                                    {entry.displayName}
                                                    <span className="text-[10px]" title={getUserRank(entry.streak || 0).label}>
                                                        {getUserRank(entry.streak || 0).icon}
                                                    </span>
                                                    {isMe && "(You)"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-gray-300">
                                            {entry.score}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
