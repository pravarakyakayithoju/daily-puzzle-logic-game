import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface DailyActivity {
    date: string; // YYYY-MM-DD
    solved: boolean;
    score: number;
    timeTaken: number;
    difficulty: number;
    synced: boolean;
}

interface DailyPuzzleDB extends DBSchema {
    'daily-activity': {
        key: string;
        value: DailyActivity;
    };
}

const DB_NAME = 'daily-puzzle-db';
const STORE_NAME = 'daily-activity';

export const initDB = async () => {
    return openDB<DailyPuzzleDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'date' });
            }
        },
    });
};

export const saveDailyActivity = async (activity: DailyActivity) => {
    const db = await initDB();
    return db.put(STORE_NAME, activity);
};

export const getDailyActivity = async (date: string) => {
    const db = await initDB();
    return db.get(STORE_NAME, date);
};

export const getAllActivity = async () => {
    const db = await initDB();
    return db.getAll(STORE_NAME);
};

export const clearAllActivity = async () => {
    const db = await initDB();
    return db.clear(STORE_NAME);
};
