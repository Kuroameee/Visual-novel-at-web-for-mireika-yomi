"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface IncomingCallProps {
  onAccept: () => void;
  onReject: () => void;
}

const CALLER_NAME    = "kuroameee";
const CALLER_INITIAL = "K";

export default function IncomingCallScene({ onAccept, onReject }: IncomingCallProps) {
  const [phase, setPhase] = useState<"ring" | "accepted" | "rejected">("ring");
  const [ring, setRing]   = useState(0); // ripple count

  // Ripple pulse every 1.4s
  useEffect(() => {
    if (phase !== "ring") return;
    const t = setInterval(() => setRing(r => r + 1), 1400);
    return () => clearInterval(t);
  }, [phase]);

  const handleAccept = () => {
    setPhase("accepted");
    setTimeout(onAccept, 600);
  };

  const handleReject = () => {
    setPhase("rejected");
    setTimeout(onReject, 900);
  };

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,20,18,0.95) 0%, #04040a 80%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(0,229,200,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,200,1) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Top label */}
      <motion.div
        className="absolute top-16 text-center"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
      >
        <p className="font-cinzel text-[10px] tracking-[0.6em] uppercase"
          style={{ color: "rgba(0,229,200,0.4)" }}>
          Panggilan Masuk
        </p>
      </motion.div>

      {/* Avatar with ripples */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Ripple rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`${ring}-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{ border: "1px solid rgba(0,229,200,0.35)" }}
            initial={{ width: 90, height: 90, opacity: 0.7 }}
            animate={{ width: 90 + (i + 1) * 55, height: 90 + (i + 1) * 55, opacity: 0 }}
            transition={{ duration: 1.8, delay: i * 0.4, ease: "easeOut" }}
          />
        ))}

        {/* Avatar circle */}
        <motion.div
          className="relative z-10 rounded-full flex items-center justify-center"
          style={{
            width: 90, height: 90,
            background: "linear-gradient(135deg, rgba(0,180,160,0.35) 0%, rgba(0,80,70,0.6) 100%)",
            border: "2px solid rgba(0,229,200,0.5)",
            boxShadow: "0 0 30px rgba(0,229,200,0.25), 0 0 60px rgba(0,229,200,0.08)",
          }}
          animate={{ boxShadow: [
            "0 0 25px rgba(0,229,200,0.2)",
            "0 0 45px rgba(0,229,200,0.4)",
            "0 0 25px rgba(0,229,200,0.2)",
          ]}}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          <span className="font-cinzel text-3xl font-bold" style={{ color: "#00e5c8" }}>
            {CALLER_INITIAL}
          </span>
        </motion.div>
      </div>

      {/* Caller info */}
      <motion.div
        className="text-center mb-2"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        <h2 className="font-cinzel text-xl tracking-[0.2em] uppercase mb-1"
          style={{ color: "var(--spirit-light)" }}>
          {CALLER_NAME}
        </h2>
        <motion.p
          className="font-crimson text-sm italic"
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ color: "rgba(0,229,200,0.6)" }}
        >
          sedang menghubungi dari dunia manusia...
        </motion.p>
      </motion.div>

      {/* Ringing indicator */}
      <motion.div className="flex gap-1.5 mb-16 mt-3">
        {[0,1,2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(0,229,200,0.5)" }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </motion.div>

      {/* Accept / Reject buttons */}
      <AnimatePresence>
        {phase === "ring" && (
          <motion.div
            className="flex items-center gap-16"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {/* Reject */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={handleReject}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 64, height: 64,
                  background: "linear-gradient(135deg, rgba(180,30,30,0.5), rgba(120,0,0,0.7))",
                  border: "1px solid rgba(220,60,60,0.5)",
                  boxShadow: "0 0 20px rgba(200,0,30,0.25)",
                  fontSize: 28,
                }}
              >
                📵
              </motion.button>
              <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(220,80,80,0.7)" }}>
                Tolak
              </span>
            </div>

            {/* Accept */}
            <div className="flex flex-col items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={handleAccept}
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 64, height: 64,
                  background: "linear-gradient(135deg, rgba(0,180,160,0.5), rgba(0,100,90,0.7))",
                  border: "1px solid rgba(0,229,200,0.5)",
                  boxShadow: "0 0 20px rgba(0,229,200,0.25)",
                  fontSize: 28,
                }}
                animate={{ boxShadow: [
                  "0 0 15px rgba(0,229,200,0.2)",
                  "0 0 30px rgba(0,229,200,0.45)",
                  "0 0 15px rgba(0,229,200,0.2)",
                ]}}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                📞
              </motion.button>
              <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase"
                style={{ color: "rgba(0,229,200,0.7)" }}>
                Terima
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accepted flash */}
      <AnimatePresence>
        {phase === "accepted" && (
          <motion.div className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            style={{ background: "rgba(0,229,200,0.15)" }}
          />
        )}
        {phase === "rejected" && (
          <motion.div className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.2, 0] }}
            transition={{ duration: 0.6 }}
            style={{ background: "rgba(180,30,30,0.2)" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
