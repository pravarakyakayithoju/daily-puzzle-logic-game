import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CompletionOverlayProps {
    show: boolean;
    score: number;
    timeTaken: number; // seconds
    hintsUsed: number;
    streak: number;
    onDismiss?: () => void;
}

// Simple deterministic confetti particle
const CONFETTI_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

interface Particle {
    id: number;
    x: number;
    color: string;
    delay: number;
    duration: number;
    size: number;
    rotate: number;
}

const generateParticles = (count: number): Particle[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.8,
        duration: 1.5 + Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
    }));

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function CompletionOverlay({ show, score, timeTaken, hintsUsed, streak, onDismiss }: CompletionOverlayProps) {
    const [particles] = useState<Particle[]>(() => generateParticles(40));

    // Auto-dismiss after 6 seconds if no interaction
    useEffect(() => {
        if (!show || !onDismiss) return;
        const t = setTimeout(onDismiss, 6000);
        return () => clearTimeout(t);
    }, [show, onDismiss]);

    const scoreColor = score >= 90 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-orange-400';

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                    onClick={onDismiss}
                >
                    {/* Confetti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute rounded-sm"
                                style={{
                                    left: `${p.x}%`,
                                    top: '-20px',
                                    width: p.size,
                                    height: p.size,
                                    backgroundColor: p.color,
                                    rotate: p.rotate,
                                }}
                                animate={{
                                    y: ['0vh', '110vh'],
                                    rotate: [p.rotate, p.rotate + 720],
                                    opacity: [1, 1, 0],
                                }}
                                transition={{
                                    duration: p.duration,
                                    delay: p.delay,
                                    ease: 'easeIn',
                                }}
                            />
                        ))}
                    </div>

                    {/* Card */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                        className="relative bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Trophy */}
                        <motion.div
                            className="text-6xl mb-4"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
                        >
                            🎉
                        </motion.div>

                        <motion.h2
                            className="text-2xl font-bold text-white mb-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Puzzle Solved!
                        </motion.h2>

                        <motion.p
                            className="text-gray-400 text-sm mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Great work! See you tomorrow.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            className="grid grid-cols-3 gap-3 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
                                <div className={`text-2xl font-bold ${scoreColor}`}>{score}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Score</div>
                            </div>
                            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
                                <div className="text-2xl font-bold text-blue-400">{formatTime(timeTaken)}</div>
                                <div className="text-xs text-gray-500 mt-0.5">Time</div>
                            </div>
                            <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700">
                                <div className="text-2xl font-bold text-orange-400 flex items-center justify-center gap-1">
                                    {streak}{streak >= 7 && <span className="text-lg">🔥</span>}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">Streak</div>
                            </div>
                        </motion.div>

                        {hintsUsed > 0 && (
                            <motion.p
                                className="text-xs text-yellow-500/70 mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                💡 {hintsUsed} hint{hintsUsed > 1 ? 's' : ''} used (−{hintsUsed * 15} pts)
                            </motion.p>
                        )}

                        <motion.button
                            onClick={onDismiss}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            View Stats
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
