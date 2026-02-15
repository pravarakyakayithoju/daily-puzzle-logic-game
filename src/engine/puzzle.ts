import { getDailySeed } from './dailySeed';
import type { DailyPuzzle, PuzzleType } from './types';
import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';

import { generateSequencePuzzle } from './generators/sequence';
import { generatePatternPuzzle } from './generators/pattern';
import { generateNumberMatrix } from './generators/numberMatrix';

dayjs.extend(dayOfYear);

export const getDailyPuzzleType = (dateStr?: string): PuzzleType => {
    // Current Rotation: 3 types implemented
    const types: PuzzleType[] = ['NUMBER_MATRIX', 'SEQUENCE', 'PATTERN'];

    // Day of year logic
    const date = dateStr ? dayjs(dateStr) : dayjs();
    const dayNum = date.dayOfYear();

    // Deterministic rotation
    const index = dayNum % types.length;
    return types[index];
};

export const generateDailyPuzzle = (dateStr?: string): DailyPuzzle => {
    const type = getDailyPuzzleType(dateStr);
    const date = dateStr ? dayjs(dateStr) : dayjs();
    const seed = getDailySeed() + date.dayOfYear(); // Simple variation to ensure uniqueness per day

    switch (type) {
        case 'NUMBER_MATRIX':
            return generateNumberMatrix(seed);
        case 'SEQUENCE':
            return generateSequencePuzzle(seed);
        case 'PATTERN':
            return generatePatternPuzzle(seed);
        default:
            return generateNumberMatrix(seed);
    }
};
