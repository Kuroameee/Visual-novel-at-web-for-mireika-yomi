"use client";
import { motion } from "framer-motion";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

// Simple atmospheric fade-in before VN starts (no button, auto-advance)
interface IntroSceneProps { onDone: () => void; }

export default function IntroScene({ onDone }: IntroSceneProps) {
  return (
    <motion.div
      className="relative w-full h-full bg-[#04040a] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      onAnimationComplete={onDone}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(0,180,160,0.05) 0%, transparent 70%)",
      }} />
      <ParticleCanvas count={20} color="#00e5c8" />
    </motion.div>
  );
}
