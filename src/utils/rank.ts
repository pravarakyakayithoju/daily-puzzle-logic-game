export interface RankInfo {
    label: string;
    color: string;
    level: number;
    icon: string;
}

export const RANKS: RankInfo[] = [
    { label: 'Beginner', color: 'bg-slate-500', level: 0, icon: '🌱' },
    { label: 'Intermediate', color: 'bg-blue-500', level: 3, icon: '🔥' },
    { label: 'Expert', color: 'bg-purple-500', level: 7, icon: '🧠' },
    { label: 'Master', color: 'bg-orange-500', level: 15, icon: '⚔️' },
    { label: 'Grand Master', color: 'bg-red-500', level: 30, icon: '👑' },
    { label: 'Legend', color: 'bg-yellow-500', level: 60, icon: '🌟' },
];

export const getUserRank = (streak: number): RankInfo => {
    // Find the highest rank whose level is <= current streak
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (streak >= RANKS[i].level) {
            return RANKS[i];
        }
    }
    return RANKS[0];
};

export const getNextRank = (streak: number): { rank: RankInfo | null, daysRemaining: number } => {
    for (let i = 0; i < RANKS.length; i++) {
        if (streak < RANKS[i].level) {
            return { rank: RANKS[i], daysRemaining: RANKS[i].level - streak };
        }
    }
    return { rank: null, daysRemaining: 0 };
};
