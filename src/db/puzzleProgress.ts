import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface PuzzleProgressEntry {
    date: string; // YYYY-MM-DD (key)
    type: string;
    matrixState?: number[];
    patternState?: boolean[][];
    startedAt?: number; // timestamp ms
    elapsedMs?: number; // elapsed time in ms at last save
}

interface PuzzleProgressDB extends DBSchema {
    'puzzle-progress': {
        key: string;
        value: PuzzleProgressEntry;
    };
}

const DB_NAME = 'daily-puzzle-progress-db';
const STORE_NAME = 'puzzle-progress';

const initProgressDB = async () => {
    return openDB<PuzzleProgressDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'date' });
            }
        },
    });
};

export const savePuzzleProgress = async (entry: PuzzleProgressEntry) => {
    const db = await initProgressDB();
    return db.put(STORE_NAME, entry);
};

export const getPuzzleProgress = async (date: string): Promise<PuzzleProgressEntry | undefined> => {
    const db = await initProgressDB();
    return db.get(STORE_NAME, date);
};

export const clearPuzzleProgress = async (date: string) => {
    const db = await initProgressDB();
    return db.delete(STORE_NAME, date);
};
