"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

interface MainMenuProps {
  onEnterStory: () => void;
  onMinigame: () => void;
  onSpam: () => void;
}

export default function MainMenu({ onEnterStory, onMinigame, onSpam }: MainMenuProps) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); }, []);

  return (
    <motion.div
      className="relative w-full h-full bg-[#04040a] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity:0 }} transition={{ duration:1.2 }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse 70% 55% at 50% 55%, rgba(0,160,140,0.06) 0%, transparent 70%)" }} />
      <ParticleCanvas count={30} color="#00e5c8" />

      {/* Corner decorations */}
      {(["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"] as const).map((pos,i) => (
        <motion.div key={i} className={`absolute ${pos} w-8 h-8 pointer-events-none`}
          initial={{ opacity:0 }} animate={{ opacity:0.28 }} transition={{ delay:1.5+i*0.15 }}
          style={{
            borderTop:    i<2   ? "1px solid rgba(0,229,200,0.45)" : "none",
            borderBottom: i>=2  ? "1px solid rgba(0,229,200,0.45)" : "none",
            borderLeft:   i%2===0 ? "1px solid rgba(0,229,200,0.45)" : "none",
            borderRight:  i%2===1 ? "1px solid rgba(0,229,200,0.45)" : "none",
          }} />
      ))}

      {/* Title */}
      <motion.div className="flex flex-col items-center gap-3 mb-12"
        initial={{ opacity:0, y:28, filter:"blur(18px)" }}
        animate={{ opacity:1, y:0, filter:"blur(0px)" }}
        transition={{ duration:1.8, ease:"easeOut", delay:0.4 }}>
        <h1 className="font-zombie tracking-[0.14em] uppercase text-center" style={{
          fontSize:"clamp(2.6rem, 8.5vw, 5.8rem)",
          background:"linear-gradient(180deg, #c8f0f0 0%, #00e5c8 50%, #0ab8a8 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          filter:"drop-shadow(0 0 22px rgba(0,229,200,0.55))",
          lineHeight:1.1,
        }}>
          Mireika Yomi
        </h1>
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:1, duration:1.1 }}
          className="w-52 h-px"
          style={{ background:"linear-gradient(90deg, transparent, rgba(0,229,200,0.75), transparent)" }} />
        <motion.p initial={{ opacity:0 }} animate={{ opacity:0.55 }} transition={{ delay:1.4 }}
          className="font-crimson text-[var(--spirit-light)] tracking-[0.38em] uppercase text-sm">
          アルワー · Arwah · Spirit
        </motion.p>
      </motion.div>

      {/* Buttons */}
      <AnimatePresence>
        {show && (
          <motion.div
            className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs px-6"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>

            {/* Enter story */}
            <MenuBtn icon="✦" label="Masuk ke Cerita" primary onClick={onEnterStory} />

            {/* Minigame */}
            <MenuBtn icon="◈" label="Main Minigame Saja" onClick={onMinigame} />

            {/* Divider */}
            <div className="w-full h-px my-1" style={{ background:"rgba(0,229,200,0.08)" }} />

            {/* Spam */}
            <MenuBtn icon="👻" label="Spam Mirei" onClick={onSpam}
              style={{ borderColor:"rgba(0,229,200,0.15)", color:"rgba(200,240,240,0.45)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage:"repeating-linear-gradient(0deg, rgba(0,229,200,0.4) 0px, transparent 1px, transparent 4px)",
        backgroundSize:"100% 4px",
      }} />
    </motion.div>
  );
}

function MenuBtn({ icon, label, primary, onClick, style }: {
  icon:string; label:string; primary?:boolean;
  onClick:()=>void; style?: React.CSSProperties;
}) {
  return (
    <motion.button
      whileHover={{ scale:1.02, x:3 }} whileTap={{ scale:0.97 }}
      onClick={onClick}
      className="btn-spirit w-full py-3.5 font-cinzel text-xs tracking-[0.32em] uppercase flex items-center justify-center gap-3"
      style={{
        borderRadius:"8px",
        background: primary ? "rgba(0,229,200,0.07)" : "transparent",
        borderColor: primary ? "rgba(0,229,200,0.45)" : "rgba(0,229,200,0.2)",
        color: primary ? "#00e5c8" : "rgba(200,240,240,0.65)",
        boxShadow: primary ? "0 0 18px rgba(0,229,200,0.12)" : "none",
        ...style,
      }}>
      <span style={{ opacity:0.7 }}>{icon}</span>
      {label}
    </motion.button>
  );
}
