import { useState, useEffect, useCallback, useMemo } from 'react';
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

    const calculateStreak = useCallback((activities: Record<string, DailyActivity>) => {
        let currentStreak = 0;
        let checkDate = dayjs();

        const todayStr = checkDate.format('YYYY-MM-DD');
        if (activities[todayStr]?.solved) {
            currentStreak++;
            checkDate = checkDate.subtract(1, 'day');
        } else {
            const yesterdayStr = checkDate.subtract(1, 'day').format('YYYY-MM-DD');
            if (!activities[yesterdayStr]?.solved) {
                return 0;
            }
            checkDate = checkDate.subtract(1, 'day');
        }

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
    }, []);

    const refreshActivity = useCallback(async (skipSync = false) => {
        setLoading(true);
        try {
            if (user && !skipSync) {
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
    }, [user, calculateStreak]);

    useEffect(() => {
        refreshActivity();
    }, [refreshActivity]);

    const markDayCompleted = useCallback(async (date: string, score: number, timeTaken: number, hintsUsed: number = 0) => {
        const newEntry: DailyActivity = {
            date,
            solved: true,
            score,
            timeTaken,
            difficulty: 1,
            synced: false,
            hintsUsed
        };

        await saveDailyActivity(newEntry);

        // Immediately sync to remote if logged in
        if (user) {
            try {
                await syncActivity(user.uid);
                // Mark as synced
                await saveDailyActivity({ ...newEntry, synced: true });
            } catch (e) {
                console.warn('Sync failed, will retry on next load:', e);
            }
        }

        const allActivities = await getAllActivity();
        const map: Record<string, DailyActivity> = {};
        allActivities.forEach(a => {
            map[a.date] = a;
        });
        const newStreak = calculateStreak(map);

        setActivityMap(map);
        setStreak(newStreak);
        setLoading(false);

        return newStreak;
    }, [user, calculateStreak]);

    const resetActivity = useCallback(async () => {
        await clearAllActivity();
        setActivityMap({});
        setStreak(0);
    }, []);

    const recordHintUsage = useCallback(async (date: string) => {
        // Use functional state update to avoid dependency on activityMap
        let hintCount = 0;
        setActivityMap(prev => {
            const activity = prev[date] || {
                date,
                solved: false,
                score: 0,
                timeTaken: 0,
                difficulty: 1,
                synced: false,
                hintsUsed: 0
            };
            const updated = {
                ...activity,
                hintsUsed: (activity.hintsUsed || 0) + 1
            };
            hintCount = updated.hintsUsed!;
            saveDailyActivity(updated);
            return { ...prev, [date]: updated };
        });
        return hintCount;
    }, []);

    return useMemo(() => ({
        activityMap,
        streak,
        loading,
        refreshActivity,
        markDayCompleted,
        recordHintUsage,
        resetActivity
    }), [activityMap, streak, loading, refreshActivity, markDayCompleted, recordHintUsage, resetActivity]);
};
