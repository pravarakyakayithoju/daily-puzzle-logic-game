import { SeededRNG } from '../dailySeed';
import type { PatternConfig } from '../types';

export const generatePatternPuzzle = (seed: number): PatternConfig => {
    const rng = new SeededRNG(seed);
    const gridSize = 5;

    // Generate a random boolean grid
    const targetGrid: boolean[][] = [];
    for (let i = 0; i < gridSize; i++) {
        const row: boolean[] = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(rng.nextRange(0, 100) > 60); // 40% chance of being filled
        }
        targetGrid.push(row);
    }

    return {
        type: 'PATTERN',
        instructions: 'Replicate the pattern shown above.',
        gridSize,
        targetGrid
    };
};
