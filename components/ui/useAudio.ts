"use client";
import { useEffect, useRef, useCallback } from "react";

export function useAudio(src: string, options?: { loop?: boolean; volume?: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = options?.loop ?? true;
    audio.volume = options?.volume ?? 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const fadeTo = useCallback((targetVol: number, duration = 1000) => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = audio.volume;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      audio.volume = start + (targetVol - start) * progress;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  return { play, pause, fadeTo };
}
