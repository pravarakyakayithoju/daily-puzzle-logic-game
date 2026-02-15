import type { DailyPuzzle } from './types';

export const getHint = (puzzle: DailyPuzzle, currentState: any): string => {
    switch (puzzle.type) {
        case 'NUMBER_MATRIX':
            return getNumberMatrixHint(puzzle.grid, currentState as number[]);
        case 'SEQUENCE':
            return getSequenceHint(puzzle.sequence, puzzle.answer);
        case 'PATTERN':
            return getPatternHint(puzzle.targetGrid, currentState as boolean[][]);
        default:
            return "No hints available for this puzzle.";
    }
};

const getNumberMatrixHint = (solution: number[], current: number[]): string => {
    // Find the first tile that is out of place
    for (let i = 0; i < solution.length; i++) {
        if (current[i] !== i + 1) {
            return `Tile ${i + 1} should be in position ${i + 1}. Try to move it there!`;
        }
    }
    return "The puzzle looks solved! Check if you missed something.";
};

const getSequenceHint = (sequence: number[], _answer: number): string => {
    // Determine if arithmetic or geometric
    if (sequence.length < 2) return "Look closely at the pattern.";

    const diff1 = sequence[1] - sequence[0];
    const diff2 = sequence[2] - sequence[1];

    if (diff1 === diff2) {
        return `This is an arithmetic sequence. The number increases by ${diff1} each time.`;
    }

    const ratio1 = sequence[1] / sequence[0];
    const ratio2 = sequence[2] / sequence[1];
    if (Math.abs(ratio1 - ratio2) < 0.01) {
        return `This is a geometric sequence. Each number is multiplied by ${ratio1}.`;
    }

    return "Look at the difference between the numbers.";
};

const getPatternHint = (target: boolean[][], current: boolean[][]): string => {
    // Find a mismatch
    for (let r = 0; r < target.length; r++) {
        for (let c = 0; c < target[r].length; c++) {
            if (target[r][c] !== current[r][c]) {
                const action = target[r][c] ? "fill" : "clear";
                return `Check row ${r + 1}, column ${c + 1}. You need to ${action} it.`;
            }
        }
    }
    return "The pattern matches! Double check.";
};
