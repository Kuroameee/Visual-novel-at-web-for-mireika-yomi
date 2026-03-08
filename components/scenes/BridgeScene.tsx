"use client";
import { motion } from "framer-motion";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

interface BridgeSceneProps {
  message: string;
  subtext?: string;
  buttonLabel: string;
  onContinue: () => void;
}

export default function BridgeScene({ message, subtext, buttonLabel, onContinue }: BridgeSceneProps) {
  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(0,60,55,0.3) 0%, #04040a 80%)",
        }}
      />
      <ParticleCanvas count={35} color="#00e5c8" />

      <div className="relative z-10 text-center max-w-xl px-8 flex flex-col items-center gap-6">
        <motion.div
          animate={{ y: [-12, 12, -12], rotate: [-5, 5, -5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,229,200,0.9))" }}
        >
          👻
        </motion.div>

        <div
          className="w-16 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,229,200,0.7), transparent)",
          }}
        />

        <div className="font-cinzel text-xs text-[var(--teal-glow)] tracking-[0.4em] uppercase">
          ✦ Mireika Yomi
        </div>

        <p className="font-crimson text-[var(--spirit-light)] text-xl italic leading-relaxed">
          &ldquo;{message}&rdquo;
        </p>

        {subtext && (
          <p className="font-gothic text-[rgba(200,240,240,0.6)] text-base leading-relaxed">
            {subtext}
          </p>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.02 }}
          onClick={onContinue}
          className="btn-spirit px-10 py-3 font-cinzel text-xs tracking-[0.3em] uppercase mt-2"
        >
          ✦ &nbsp; {buttonLabel} &nbsp; ✦
        </motion.button>
      </div>
    </motion.div>
  );
}
