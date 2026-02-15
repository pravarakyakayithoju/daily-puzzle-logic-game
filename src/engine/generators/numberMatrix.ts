import { SeededRNG } from '../dailySeed';
import type { NumberMatrixConfig } from '../types';

export const generateNumberMatrix = (seed: number): NumberMatrixConfig => {
    const rng = new SeededRNG(seed);

    // Standard Linear Sorting Logic (1-16)
    const tiles = Array.from({ length: 16 }, (_, i) => i + 1);

    // Shuffle
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = rng.nextRange(0, i);
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }

    return {
        type: 'NUMBER_MATRIX',
        instructions: 'Sort the tiles in ascending order (1-16).',
        grid: tiles,
    };
};

export const isNumberMatrixSolved = (tiles: number[]): boolean => {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== i + 1) return false;
    }
    return true;
};
