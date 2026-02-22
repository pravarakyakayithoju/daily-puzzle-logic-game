import { useState, useEffect, useCallback } from 'react';

export const useTimer = (isRunning: boolean, initialTime: number = 0) => {
    const [elapsedTime, setElapsedTime] = useState(initialTime);

    // Update state if initialTime changes (e.g., when progress is loaded)
    useEffect(() => {
        setElapsedTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (isRunning) {
            // Anchor from the initialTime to handle restoration correctly and avoid drift
            const startTime = Date.now() - initialTime;
            const intervalId = window.setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
            return () => clearInterval(intervalId);
        }
    }, [isRunning, initialTime]);

    const resetTimer = useCallback(() => {
        setElapsedTime(0);
    }, []);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return { elapsedTime, formatTime, resetTimer };
};
