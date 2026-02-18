import { motion } from 'framer-motion';

interface StreakDisplayProps {
    streak: number;
}

export const StreakDisplay = ({ streak }: StreakDisplayProps) => {
    const showFire = streak >= 7;

    return (
        <div className="flex items-baseline gap-2">
            <motion.span
                className="text-4xl font-bold text-white"
                key={streak}
                initial={{ scale: 1.2, color: '#10b981' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
            >
                {streak}
            </motion.span>
            <span className="text-gray-500">days</span>

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
                    🔥
                </motion.span>
            )}

            {showFire && (
                <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg blur-xl"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
        </div>
    );
};
