import { useState, useEffect, useRef } from 'react';

export const useTimer = (isRunning: boolean, initialTime: number = 0) => {
    const [elapsedTime, setElapsedTime] = useState(initialTime);
    const intervalRef = useRef<number | null>(null);

    // Update state if initialTime changes (e.g., when progress is loaded)
    useEffect(() => {
        setElapsedTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - elapsedTime;
            intervalRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const resetTimer = () => {
        setElapsedTime(0);
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return { elapsedTime, formatTime, resetTimer };
};
