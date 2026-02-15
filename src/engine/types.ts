export type PuzzleType = 'NUMBER_MATRIX' | 'SEQUENCE' | 'PATTERN' | 'DEDUCTION' | 'BINARY';

export interface PuzzleConfig {
    // Shared config
    type: PuzzleType;
    instructions: string;
}

export interface NumberMatrixConfig extends PuzzleConfig {
    type: 'NUMBER_MATRIX';
    grid: number[]; // 1D array of 16 numbers
}

export interface SequenceConfig extends PuzzleConfig {
    type: 'SEQUENCE';
    sequence: number[]; // e.g. [2, 4, 8, 16]
    options: number[]; // Multiple choice options
    answer: number;
}

export interface PatternConfig extends PuzzleConfig {
    type: 'PATTERN';
    gridSize: number; // e.g., 4 or 5
    targetGrid: boolean[][]; // The pattern to match
}

export type DailyPuzzle = NumberMatrixConfig | SequenceConfig | PatternConfig;
