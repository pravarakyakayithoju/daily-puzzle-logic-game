import { useState, useEffect } from 'react';

const STREAK_KEY = 'daily-puzzle-streak';

interface StreakData {
    currentStreak: number;
    maxStreak: number;
    lastCompletedDate: string | null; // YYYY-MM-DD
    history: Record<string, boolean>; // Date -> Completed
}

export const useStreak = () => {
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        maxStreak: 0,
        lastCompletedDate: null,
        history: {}
    });

    useEffect(() => {
        const stored = localStorage.getItem(STREAK_KEY);
        if (stored) {
            try {
                setStreakData(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse streak data', e);
            }
        }
    }, []);

    const completeDailyPuzzle = () => {
        const today = new Date().toISOString().split('T')[0];

        // Prevent multiple completions for the same day affecting streak
        if (streakData.lastCompletedDate === today) {
            return;
        }

        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let newCurrentStreak = 1;

        // Check if yesterday was completed
        if (streakData.lastCompletedDate === yesterday) {
            newCurrentStreak = streakData.currentStreak + 1;
        } else if (streakData.lastCompletedDate === today) {
            // Should be handled by early return, but safe check
            newCurrentStreak = streakData.currentStreak;
        }

        const newMaxStreak = Math.max(newCurrentStreak, streakData.maxStreak);

        const newHistory = { ...streakData.history, [today]: true };

        const newData: StreakData = {
            currentStreak: newCurrentStreak,
            maxStreak: newMaxStreak,
            lastCompletedDate: today,
            history: newHistory
        };

        setStreakData(newData);
        localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
    };

    return { streakData, completeDailyPuzzle };
};
