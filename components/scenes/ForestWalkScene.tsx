"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

interface ForestWalkSceneProps {
  onComplete: () => void;
}

const WALK_STEPS = [
  {
    id: "walk1",
    pov: true,
    text: "Kamu berjalan menyusuri hutan yang sunyi...",
    subtext: "Angin berhenti. Sesuatu terasa berbeda.",
    duration: 3500,
    shake: false,
    shadow: 0,
  },
  {
    id: "walk2",
    pov: true,
    text: "Ada suara langkah...",
    subtext: "Sesuatu di belakangmu.",
    duration: 2800,
    shake: false,
    shadow: 0.15,
  },
  {
    id: "walk3",
    pov: true,
    text: "Semakin dekat...",
    subtext: "Napasku semakin cepat.",
    duration: 2500,
    shake: true,
    shadow: 0.3,
  },
  {
    id: "run",
    pov: true,
    text: "LARI!",
    subtext: "",
    duration: 2000,
    shake: true,
    shadow: 0.5,
  },
  {
    id: "meet",
    pov: false,
    text: "Sebuah cahaya menahanmu...",
    subtext: "\"Tolong jangan pergi... aku tidak bermaksud menakutimu.\"",
    duration: 99999,
    shake: false,
    shadow: 0,
  },
];

export default function ForestWalkScene({ onComplete }: ForestWalkSceneProps) {
  const [stepIdx, setStepIdx] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const current = WALK_STEPS[stepIdx];

  useEffect(() => {
    if (current.id === "meet") {
      const t = setTimeout(() => setShowButton(true), 2000);
      return () => clearTimeout(t);
    }

    setShowButton(false);
    const t = setTimeout(() => {
      setStepIdx((i) => Math.min(i + 1, WALK_STEPS.length - 1));
    }, current.duration);
    return () => clearTimeout(t);
  }, [stepIdx, current.id, current.duration]);

  const isRunning = current.id === "run";
  const isMeet = current.id === "meet";

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Forest background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(0,60,55,0.4) 0%, rgba(4,4,10,0.98) 65%)",
        }}
      />

      {/* Forest silhouette trees (CSS drawn) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Left trees */}
        {[60, 120, 200, 280].map((x, i) => (
          <rect key={`l${i}`} x={x - 8} y={200 - i * 30} width={16} height={520 + i * 30} fill="#0a1a18" />
        ))}
        {[60, 120, 200, 280].map((x, i) => (
          <ellipse key={`lt${i}`} cx={x} cy={200 - i * 30} rx={40 + i * 10} ry={80 + i * 15} fill="#0a1a18" />
        ))}
        {/* Right trees */}
        {[1220, 1160, 1080, 1000].map((x, i) => (
          <rect key={`r${i}`} x={x - 8} y={200 - i * 30} width={16} height={520 + i * 30} fill="#0a1a18" />
        ))}
        {[1220, 1160, 1080, 1000].map((x, i) => (
          <ellipse key={`rt${i}`} cx={x} cy={200 - i * 30} rx={40 + i * 10} ry={80 + i * 15} fill="#0a1a18" />
        ))}
        {/* Ground fog */}
        <ellipse cx={640} cy={680} rx={700} ry={80} fill="rgba(0,180,160,0.06)" />
      </svg>

      {/* Path (POV) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-20"
        style={{
          width: "300px",
          height: "400px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,229,200,0.08) 100%)",
          clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* Shadow chaser */}
      <AnimatePresence>
        {current.shadow > 0 && !isMeet && (
          <motion.div
            key="shadow"
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{
              opacity: current.shadow,
              scale: 1 + current.shadow * 0.3,
              y: [0, -8, 0],
            }}
            transition={{ y: { repeat: Infinity, duration: 0.5 }, opacity: { duration: 0.5 } }}
            style={{
              bottom: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "120px",
              background:
                "radial-gradient(ellipse at 50% 30%, rgba(120,0,40,0.8) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Mireika appears */}
      <AnimatePresence>
        {isMeet && (
          <motion.div
            className="absolute bottom-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Character */}
            <div className="relative" style={{ width:90, height:160 }}>
              {/* Subtle aura underneath */}
              <div className="absolute inset-0" style={{
                background:"radial-gradient(ellipse at 50% 40%, rgba(0,229,200,0.18) 0%, transparent 75%)",
                animation:"breathe 3s ease-in-out infinite",
              }} />
              {/* Ghost SVG — shown always, hidden when PNG loads */}
              <svg id="mirei-ghost-svg" viewBox="0 0 60 88" fill="none"
                className="absolute inset-0 w-full h-full"
                style={{ filter:"drop-shadow(0 0 16px rgba(0,229,200,0.95))", opacity:0.9 }}>
                <path d="M30 4 C14 4 6 16 6 30 L6 74 L12 67 L18 74 L24 67 L30 74 L36 67 L42 74 L48 67 L54 74 L54 30 C54 16 46 4 30 4 Z"
                  fill="rgba(205,248,248,0.93)" stroke="rgba(0,229,200,0.55)" strokeWidth="0.8"/>
                <ellipse cx="22" cy="31" rx="5" ry="6.5" fill="rgba(0,55,50,0.88)"/>
                <ellipse cx="23.5" cy="29" rx="1.6" ry="1.6" fill="rgba(0,229,200,0.75)"/>
                <ellipse cx="38" cy="31" rx="5" ry="6.5" fill="rgba(0,55,50,0.88)"/>
                <ellipse cx="39.5" cy="29" rx="1.6" ry="1.6" fill="rgba(0,229,200,0.75)"/>
                <path d="M25 41 Q30 45.5 35 41" stroke="rgba(0,55,50,0.65)" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
                <ellipse cx="16" cy="37" rx="3.5" ry="2" fill="rgba(0,229,200,0.1)"/>
                <ellipse cx="44" cy="37" rx="3.5" ry="2" fill="rgba(0,229,200,0.1)"/>
              </svg>
              {/* mireika.png — overlay, hides SVG when loaded */}
              <img
                src="/assets/mireika.png"
                alt="Mireika Yomi"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ filter:"drop-shadow(0 0 22px rgba(0,229,200,0.9))" }}
                onLoad={e => {
                  const svg = (e.currentTarget.parentElement as HTMLElement)?.querySelector("#mirei-ghost-svg") as HTMLElement;
                  if (svg) svg.style.display = "none";
                }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            {/* Glow rings */}
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-[rgba(0,229,200,0.3)]"
                style={{ width: 80 + i * 40, height: 80 + i * 40, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles - teal for normal, red-ish when chased */}
      <ParticleCanvas
        count={isRunning ? 60 : 25}
        color={current.shadow > 0.3 ? "#e83030" : "#00e5c8"}
      />

      {/* Screen shake wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={
          current.shake
            ? { x: [0, -4, 4, -2, 2, 0], y: [0, 2, -2, 1, -1, 0] }
            : { x: 0, y: 0 }
        }
        transition={
          current.shake
            ? { duration: 0.3, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      />

      {/* Footstep effect when running */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0] }}
            transition={{ duration: 0.2, repeat: Infinity }}
            style={{ background: "rgba(200, 0, 30, 0.1)" }}
          />
        )}
      </AnimatePresence>

      {/* Text box */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 vn-text-box px-8 pt-16 pb-8"
        key={stepIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isMeet ? (
          <>
            <p className="font-cinzel text-[var(--teal-glow)] text-sm tracking-[0.3em] uppercase mb-2 text-glow-soft">
              ✦ Mireika Yomi
            </p>
            <p className="font-crimson text-[var(--spirit-light)] text-2xl italic leading-relaxed mb-2">
              {current.text}
            </p>
            <p className="font-gothic text-[var(--spirit-light)] text-xl leading-relaxed opacity-80 mb-6">
              {current.subtext}
            </p>
          </>
        ) : (
          <>
            <p
              className={`font-crimson text-[var(--spirit-light)] leading-relaxed mb-1 ${
                isRunning ? "text-3xl font-semibold text-glow-strong" : "text-2xl italic"
              }`}
            >
              {current.text}
            </p>
            {current.subtext && (
              <p className="font-gothic text-[var(--spirit-light)] text-lg opacity-70">
                {current.subtext}
              </p>
            )}
          </>
        )}

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={onComplete}
              className="btn-spirit px-8 py-3 font-cinzel text-xs tracking-[0.3em] uppercase"
            >
              ✦ &nbsp; Dengarkan Dia &nbsp; ✦
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, rgba(4,4,10,${
            0.3 + current.shadow * 0.5
          }) 100%)`,
        }}
      />
    </motion.div>
  );
}
