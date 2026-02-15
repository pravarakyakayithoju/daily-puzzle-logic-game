import { SeededRNG } from '../dailySeed';
import type { SequenceConfig } from '../types';

export const generateSequencePuzzle = (seed: number): SequenceConfig => {
    const rng = new SeededRNG(seed);

    // Simple Arithmetic or Geometric Sequences
    const isGeometric = rng.nextRange(0, 1) === 1;
    const start = rng.nextRange(1, 10);
    const step = rng.nextRange(2, 5);

    const sequence: number[] = [];
    for (let i = 0; i < 4; i++) {
        if (isGeometric) {
            sequence.push(start * Math.pow(step, i));
        } else {
            sequence.push(start + (step * i));
        }
    }

    const answer = sequence.pop()!; // Remove last element as the answer

    // Generate options
    const options = [answer];
    while (options.length < 4) {
        const dist = rng.nextRange(1, 10);
        const wrong = rng.nextRange(0, 1) === 0 ? answer + dist : answer - dist;
        if (!options.includes(wrong) && wrong > 0) {
            options.push(wrong);
        }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = rng.nextRange(0, i);
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
        type: 'SEQUENCE',
        instructions: 'Find the next number in the sequence.',
        sequence,
        options,
        answer
    };
};
