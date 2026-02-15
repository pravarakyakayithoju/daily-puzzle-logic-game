export const getDailySeed = (): number => {
  const now = new Date();
  // Create a seed based on the current date (YYYYMMDD)
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
};

export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Simple LCG (Linear Congruential Generator)
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextRange(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
