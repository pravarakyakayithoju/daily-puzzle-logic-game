import { motion } from 'framer-motion';

export default function BluestockLogo({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 ${className}`}>
            {/* Icon */}
            <div className="relative w-12 h-10 flex items-end gap-1 px-1">
                {/* Bars */}
                <div className="w-1.5 h-[40%] bg-gradient-to-t from-blue-700 to-purple-600 rounded-full" />
                <div className="w-1.5 h-[70%] bg-gradient-to-t from-blue-600 to-purple-500 rounded-full" />
                <div className="w-1.5 h-[100%] bg-gradient-to-t from-blue-500 to-purple-400 rounded-full" />
                <div className="w-1.5 h-[60%] bg-gradient-to-t from-blue-400 to-purple-300 rounded-full" />

                {/* Swoosh Line */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 48 40">
                    <motion.path
                        d="M 4 35 Q 12 35, 24 20 T 40 5"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                    <motion.circle
                        cx="40"
                        cy="5"
                        r="3"
                        fill="#f97316"
                        className="shadow-[0_0_10px_#f97316]"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    />
                </svg>
            </div>

            {/* Text Branding */}
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black tracking-tight text-white uppercase font-['Plus_Jakarta_Sans']">
                    BLUESTOCK<span className="text-xs align-top font-bold text-gray-500 ml-0.5">TM</span>
                </span>
                <span className="text-lg font-medium text-gray-500 lowercase">.in</span>
            </div>
        </div>
    );
}
