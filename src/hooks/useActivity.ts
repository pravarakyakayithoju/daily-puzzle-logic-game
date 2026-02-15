import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getAllActivity, saveDailyActivity, clearAllActivity } from '../db/dailyActivity';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { syncActivity } from '../utils/sync';

interface DailyActivity {
    date: string; // YYYY-MM-DD
    solved: boolean;
    score: number;
    timeTaken: number;
    difficulty: number;
    synced: boolean;
    hintsUsed?: number;
}

export const useActivity = () => {
    const [user] = useAuthState(auth);
    const [activityMap, setActivityMap] = useState<Record<string, DailyActivity>>({});
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);

    const calculateStreak = (activities: Record<string, DailyActivity>) => {
        let currentStreak = 0;
        let checkDate = dayjs();

        // If today is solved, streak starts from today.
        // If today is not solved, streak starts from yesterday (if solved).
        // If neither, streak is 0.

        const todayStr = checkDate.format('YYYY-MM-DD');
        if (activities[todayStr]?.solved) {
            currentStreak++;
            checkDate = checkDate.subtract(1, 'day');
        } else {
            // Check yesterday
            const yesterdayStr = checkDate.subtract(1, 'day').format('YYYY-MM-DD');
            if (!activities[yesterdayStr]?.solved) {
                return 0;
            }
            checkDate = checkDate.subtract(1, 'day');
        }

        // Continue checking backwards
        while (true) {
            const dateStr = checkDate.format('YYYY-MM-DD');
            if (activities[dateStr]?.solved) {
                currentStreak++;
                checkDate = checkDate.subtract(1, 'day');
            } else {
                break;
            }
        }
        return currentStreak;
    };

    const refreshActivity = async () => {
        setLoading(true);
        try {
            if (user) {
                await syncActivity(user.uid);
            }
            const allActivities = await getAllActivity();
            const map: Record<string, DailyActivity> = {};
            allActivities.forEach(a => {
                map[a.date] = a;
            });
            setActivityMap(map);
            setStreak(calculateStreak(map));
        } catch (error) {
            console.error("Failed to fetch activity:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshActivity();
    }, [user]); // Run when user changes

    const markDayCompleted = async (date: string, score: number, timeTaken: number, hintsUsed: number = 0) => {
        const newEntry: DailyActivity = {
            date,
            solved: true,
            score,
            timeTaken,
            difficulty: 1, // Default for now
            synced: false, // Pending sync
            hintsUsed
        };

        await saveDailyActivity(newEntry);
        await refreshActivity(); // This will trigger sync if logged in
    };

    const resetActivity = async () => {
        await clearAllActivity();
        setActivityMap({});
        setStreak(0);
        // todo: clear remote if needed, but for now just local reset for testing
    };

    const recordHintUsage = async (date: string) => {
        const activity = activityMap[date] || {
            date,
            solved: false,
            score: 0,
            timeTaken: 0,
            difficulty: 1,
            synced: false,
            hintsUsed: 0
        };

        const updatedActivity = {
            ...activity,
            hintsUsed: (activity.hintsUsed || 0) + 1
        };

        await saveDailyActivity(updatedActivity);
        await refreshActivity();
        return updatedActivity.hintsUsed;
    };

    return {
        activityMap,
        streak,
        loading,
        refreshActivity,
        markDayCompleted,
        recordHintUsage,
        resetActivity
    };
};
