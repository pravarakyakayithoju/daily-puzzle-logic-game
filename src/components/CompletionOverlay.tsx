import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getUserRank } from '../utils/rank';
import BluestockLogo from './BluestockLogo';

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

    // Auto-dismiss after 8 seconds for brand visibility
    useEffect(() => {
        if (!show || !onDismiss) return;
        const t = setTimeout(onDismiss, 8000);
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
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
                                    ease: 'linear',
                                }}
                            />
                        ))}
                    </div>

                    {/* Celebration Card */}
                    <motion.div
                        className="relative z-10 w-full max-w-2xl bg-[#0a0a10]/80 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-12 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col items-center text-center"
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Branding Auras */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20" />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <BluestockLogo className="scale-125" />
                        </motion.div>

                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Daily Challenge Complete</span>
                        </motion.div>

                        <motion.h2
                            className="text-5xl font-black text-white tracking-widest uppercase mb-10 selection:bg-blue-500/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Mission Success
                        </motion.h2>

                        {/* Stats Grid */}
                        <motion.div
                            className="grid grid-cols-2 gap-6 w-full mb-10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 relative group hover:bg-white/[0.05] transition-all">
                                <div className={`text-4xl font-black ${scoreColor} tracking-tighter`}>{score}</div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Yield</div>
                            </div>
                            <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 relative group hover:bg-white/[0.05] transition-all">
                                <div className="text-4xl font-black text-blue-400 tracking-tighter">{formatTime(timeTaken)}</div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Duration</div>
                            </div>
                            <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 relative group hover:bg-white/[0.05] transition-all">
                                <div className="text-4xl font-black text-orange-500 flex items-center justify-center gap-2 tracking-tighter">
                                    {streak}<span className="text-2xl">🔥</span>
                                </div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-2">Streak</div>
                            </div>
                            <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 relative group hover:bg-white/[0.05] transition-all">
                                <div className="text-xl font-black text-white flex flex-col items-center justify-center gap-1">
                                    <span className="text-3xl mb-1">{getUserRank(streak).icon}</span>
                                    {getUserRank(streak).label.toUpperCase()}
                                </div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-2">Status Tier</div>
                            </div>
                        </motion.div>

                        {hintsUsed > 0 && (
                            <motion.div
                                className="px-6 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl mb-8 transform -rotate-1 shadow-lg shadow-yellow-500/5"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <span className="text-sm font-black text-yellow-500 uppercase tracking-widest italic">
                                    ⚡ {hintsUsed} Logic Hints Activated (−{hintsUsed * 15} pts)
                                </span>
                            </motion.div>
                        )}

                        <motion.button
                            onClick={onDismiss}
                            className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl uppercase tracking-[0.4em] hover:bg-blue-50 hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            Return to Bluestock
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
