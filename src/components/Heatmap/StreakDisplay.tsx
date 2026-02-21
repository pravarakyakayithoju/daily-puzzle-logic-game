import { motion } from 'framer-motion';
import { getUserRank } from '../../utils/rank';

interface StreakDisplayProps {
    streak: number;
}

export const StreakDisplay = ({ streak }: StreakDisplayProps) => {
    const showFire = streak >= 7;
    const rank = getUserRank(streak);

    return (
        <div className="flex flex-col items-start gap-1 relative">
            <div className="flex items-baseline gap-2">
                <motion.span
                    className="text-4xl font-bold text-white tabular-nums"
                    key={streak}
                    initial={{ scale: 1.2, color: '#10b981' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    transition={{ duration: 0.3 }}
                >
                    {streak}
                </motion.span>
                <span className="text-gray-500 font-medium">day streak</span>

                {showFire && (
                    <motion.span
                        className="text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                            scale: 1,
                            rotate: 0,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20
                        }}
                    >
                        {rank.icon}
                    </motion.span>
                )}
            </div>

            {/* Rank Badge */}
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${rank.color} border border-white/20`}
            >
                <span className="opacity-80">Rank:</span>
                <span>{rank.label}</span>
            </motion.div>

            {showFire && (
                <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg blur-xl -z-10"
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
        </div>
    );
};
