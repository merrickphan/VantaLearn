"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerOptions {
 initialSeconds: number;
 onExpire?: () => void;
 autoStart?: boolean;
}

export function useTimer({ initialSeconds, onExpire, autoStart = false }: UseTimerOptions) {
 const [seconds, setSeconds] = useState(initialSeconds);
 const [isRunning, setIsRunning] = useState(autoStart);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);

 const stop = useCallback(() => {
 setIsRunning(false);
 if (intervalRef.current) clearInterval(intervalRef.current);
 }, []);

 const start = useCallback(() => setIsRunning(true), []);
 const reset = useCallback(() => {
 stop();
 setSeconds(initialSeconds);
 }, [stop, initialSeconds]);

 useEffect(() => {
 if (!isRunning) return;
 intervalRef.current = setInterval(() => {
 setSeconds((prev) => {
 if (prev <= 1) {
 stop();
 onExpire?.();
 return 0;
 }
 return prev - 1;
 });
 }, 1000);
 return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
 }, [isRunning, stop, onExpire]);

 const formatted = {
 hours: Math.floor(seconds / 3600),
 minutes: Math.floor((seconds % 3600) / 60),
 seconds: seconds % 60,
 display: `${String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
 };

 return { seconds, formatted, isRunning, start, stop, reset };
}

// Countdown to exam date
export function useCountdown(targetDate: string) {
 const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

 useEffect(() => {
 const calculate = () => {
 const now = new Date().getTime();
 const target = new Date(targetDate).getTime();
 const diff = target - now;
 if (diff <= 0) {
 setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
 return;
 }
 setTimeLeft({
 days: Math.floor(diff / (1000 * 60 * 60 * 24)),
 hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
 minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
 seconds: Math.floor((diff % (1000 * 60)) / 1000),
 });
 };
 calculate();
 const interval = setInterval(calculate, 1000);
 return () => clearInterval(interval);
 }, [targetDate]);

 return timeLeft;
}
