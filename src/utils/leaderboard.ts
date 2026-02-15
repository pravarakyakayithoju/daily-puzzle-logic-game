import { collection, doc, setDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs";
import type { User } from "firebase/auth";

export interface LeaderboardEntry {
    uid: string;
    displayName: string;
    photoURL?: string;
    score: number;
    timeTaken: number; // in seconds
    timestamp: number;
}

export const submitScore = async (user: User, score: number, timeTaken: number) => {
    if (!user) return;
    const today = dayjs().format("YYYY-MM-DD");

    // Check if we already have a score for today that is better
    // For simplicity, we just overwrite for now, or we could check local state.
    // Ideally we only submit if it's the first time or a better score?
    // Daily puzzle is one-time usually. But let's assume one submission per day per user.

    const leaderboardRef = doc(db, "daily_leaderboard", today, "scores", user.uid);

    // Basic User Info
    const entry: LeaderboardEntry = {
        uid: user.uid,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || undefined,
        score,
        timeTaken,
        timestamp: Date.now()
    };

    await setDoc(leaderboardRef, entry);
};

export const getLeaderboard = async (dateStr?: string): Promise<LeaderboardEntry[]> => {
    const date = dateStr || dayjs().format("YYYY-MM-DD");
    const scoresRef = collection(db, "daily_leaderboard", date, "scores");

    // Sort by Score DESC, then Time ASC
    const q = query(scoresRef, orderBy("score", "desc"), orderBy("timeTaken", "asc"), limit(50));

    const snapshot = await getDocs(q);
    const results: LeaderboardEntry[] = [];
    snapshot.forEach(doc => {
        results.push(doc.data() as LeaderboardEntry);
    });

    return results;
};
