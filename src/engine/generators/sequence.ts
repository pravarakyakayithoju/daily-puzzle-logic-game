import { SeededRNG } from '../dailySeed';
import type { SequenceConfig } from '../types';

export const generateSequencePuzzle = (seed: number): SequenceConfig => {
    const rng = new SeededRNG(seed);

    // More varied sequence types
    const type = rng.nextRange(0, 4); // 0: Arithmetic, 1: Geometric, 2: Squared, 3: Fibonacci, 4: Cubes
    const start = rng.nextRange(1, 10);
    const step = rng.nextRange(2, 5);

    const sequence: number[] = [];

    if (type === 0) { // Arithmetic
        for (let i = 0; i < 5; i++) sequence.push(start + (step * i));
    } else if (type === 1) { // Geometric
        for (let i = 0; i < 5; i++) sequence.push(start * Math.pow(step, i));
    } else if (type === 2) { // Squared
        const offset = rng.nextRange(1, 5);
        for (let i = 0; i < 5; i++) sequence.push(Math.pow(i + offset, 2));
    } else if (type === 3) { // Fibonacci-style
        sequence.push(start);
        sequence.push(start + step);
        for (let i = 2; i < 5; i++) sequence.push(sequence[i - 1] + sequence[i - 2]);
    } else { // Cubes
        const offset = rng.nextRange(1, 3);
        for (let i = 0; i < 5; i++) sequence.push(Math.pow(i + offset, 3));
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
