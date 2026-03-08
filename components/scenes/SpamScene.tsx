"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";

interface SpamSceneProps { onBack: () => void; }
interface Ripple   { id: number; x: number; y: number; }
interface FloatTxt { id: number; x: number; y: number; }

// ── Audio — pakai spam.mp3 dari public/assets ──────────────────────────
let audioCtx: AudioContext | null = null;
let spamBuffer: AudioBuffer | null = null;
let bufferLoading = false;

async function loadSpamAudio() {
  if (spamBuffer || bufferLoading) return;
  bufferLoading = true;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const res = await fetch("/assets/spam.mp3");
    const arr = await res.arrayBuffer();
    spamBuffer = await audioCtx!.decodeAudioData(arr);
  } catch { /* silent fail — pakai beep */ }
  bufferLoading = false;
}

function playClick() {
  if (spamBuffer && audioCtx) {
    // Buat source baru tiap klik — bisa overlap, tidak ada delay
    const src = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    src.buffer = spamBuffer;
    src.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0.7;
    src.start();
  } else {
    // Fallback beep
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 350 + Math.random() * 350;
      o.type = "sine";
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    } catch {}
  }
}

export default function SpamScene({ onBack }: SpamSceneProps) {
  const countRef = useRef(0);
  const [display, setDisplay] = useState(0);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [floats,  setFloats]  = useState<FloatTxt[]>([]);
  const [shake,   setShake]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const nextId    = useRef(0);
  const shakeRef  = useRef<ReturnType<typeof setTimeout>>();

  // Load audio on mount
  useEffect(() => { loadSpamAudio(); }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    countRef.current++;
    setDisplay(countRef.current);
    playClick();

    // Shake
    if (shakeRef.current) clearTimeout(shakeRef.current);
    setShake(true);
    shakeRef.current = setTimeout(() => setShake(false), 160);

    // Ripple + float
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;

    setRipples(r => [...r.slice(-10), { id, x, y }]);
    setFloats(f  => [...f.slice(-6),  { id, x, y }]);

    setTimeout(() => setRipples(r => r.filter(p => p.id !== id)), 650);
    setTimeout(() => setFloats(f  => f.filter(p => p.id !== id)), 850);
  }, []);

  const milestone = display > 0 && display % 50 === 0;

  return (
    <motion.div
      className="relative w-full h-full flex flex-col overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,40,38,0.3) 0%, #04040a 75%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      {/* ── Header ── */}
      <div className="relative z-20 flex items-center justify-between px-5 pt-5 pb-2 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }} whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="font-cinzel text-[11px] tracking-[0.3em] uppercase px-4 py-2 rounded-lg"
          style={{ border: "1px solid rgba(0,229,200,0.2)", color: "rgba(0,229,200,0.5)" }}>
          ← Kembali
        </motion.button>

        <p className="font-cinzel text-[10px] tracking-[0.45em] uppercase"
          style={{ color: "rgba(0,229,200,0.3)" }}>
          Spam Mode
        </p>

        {/* Score */}
        <motion.div
          animate={milestone ? { scale: [1, 1.35, 1] } : {}}
          transition={{ duration: 0.3 }}
          className="text-right min-w-[56px]">
          <p className="font-cinzel text-[9px] tracking-widest uppercase mb-0.5"
            style={{ color: "rgba(0,229,200,0.35)" }}>Klik</p>
          <motion.p
            key={display}
            initial={{ scale: 1.2, color: "#ffd700" }}
            animate={{ scale: 1,   color: "#00e5c8" }}
            transition={{ duration: 0.12 }}
            className="font-zombie text-2xl leading-none">
            {display}
          </motion.p>
        </motion.div>
      </div>

      {/* Instruction */}
      <motion.p
        className="relative z-10 text-center font-crimson italic text-sm flex-shrink-0 mb-1"
        animate={{ opacity: [0.3, 0.55, 0.3] }} transition={{ duration: 2.8, repeat: Infinity }}
        style={{ color: "rgba(0,229,200,0.4)" }}>
        Klik Mirei sebanyak mungkin!
      </motion.p>

      {/* ── Click Canvas ── */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center"
        style={{ cursor: "pointer", userSelect: "none" }}
        onClick={handleClick}
      >
        {/* Ripples */}
        <AnimatePresence>
          {ripples.map(r => (
            <motion.div key={r.id}
              className="absolute rounded-full pointer-events-none"
              style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%",
                border: "1.5px solid rgba(0,229,200,0.55)" }}
              initial={{ width: 16, height: 16, opacity: 0.8 }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        {/* Float +1 */}
        <AnimatePresence>
          {floats.map(f => (
            <motion.span key={f.id}
              className="absolute pointer-events-none font-cinzel font-bold select-none"
              style={{
                left: f.x, top: f.y, translateX: "-50%",
                fontSize: 20, color: "#ffd700",
                textShadow: "0 0 10px rgba(255,215,0,0.7)",
              }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -60, opacity: 0 }}
              exit={{}}
              transition={{ duration: 0.75, ease: "easeOut" }}>
              +1
            </motion.span>
          ))}
        </AnimatePresence>

        {/* Mirei image — chibi art */}
        <motion.div
          animate={shake
            ? { x: [-5, 6, -6, 5, -3, 2, 0], rotate: [-4, 4, -3, 3, -1, 0] }
            : { y: [0, -8, 0], rotate: [-1, 1, -1] }}
          transition={shake
            ? { duration: 0.16, ease: "easeInOut" }
            : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ pointerEvents: "none", userSelect: "none" }}>
          <img
            src="/assets/spam-mirei.png"
            alt="Mirei"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "min(300px, 72vw)",
              height: "auto",
              filter: "drop-shadow(0 0 20px rgba(0,229,200,0.5)) drop-shadow(0 0 40px rgba(0,229,200,0.15))",
              userSelect: "none",
              display: "block",
            }}
          />
        </motion.div>

        {/* Ambient glow under image */}
        <div className="absolute rounded-full pointer-events-none"
          style={{
            width: 280, height: 280,
            background: "radial-gradient(circle, rgba(0,229,200,0.06) 0%, transparent 70%)",
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />

        {/* Milestone burst */}
        <AnimatePresence>
          {milestone && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 2] }}
              exit={{}}
              transition={{ duration: 0.55 }}>
              <span style={{ fontSize: 52 }}>✨</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Milestone banner */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            className="absolute top-24 left-0 right-0 flex justify-center pointer-events-none z-30"
            initial={{ opacity: 0, scale: 0.75, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}>
            <div className="px-6 py-2 rounded-full font-cinzel text-sm tracking-widest"
              style={{
                background: "rgba(255,215,0,0.14)",
                border: "1px solid rgba(255,215,0,0.45)",
                color: "#ffd700",
                boxShadow: "0 0 18px rgba(255,215,0,0.18)",
              }}>
              🌟 {display} klik! Mirei senang!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom */}
      <div className="relative z-10 flex justify-center items-center gap-6 py-4 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => { countRef.current = 0; setDisplay(0); }}
          className="font-cinzel text-[10px] tracking-[0.3em] uppercase px-5 py-1.5 rounded-lg"
          style={{ border: "1px solid rgba(0,229,200,0.12)", color: "rgba(0,229,200,0.3)" }}>
          Reset
        </motion.button>
      </div>

      {/* Note: letakkan spam.mp3 di public/assets/spam.mp3 */}
    </motion.div>
  );
}
