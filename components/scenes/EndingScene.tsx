"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import { useLang } from "@/components/ui/LangContext";

interface EndingSceneProps {
  totalScore: number;
  onReplay: () => void;
  onBonusStory: () => void;
}

// 🔧 GANTI INFO DEBUT DI SINI
const DEBUT_INFO = {
  date: "— 2025 —",
  message: "Aku telah menunggumu begitu lama di alam yang sunyi ini.\nKini kamu datang, membawa cahaya yang tidak pernah aku bayangkan.\n\nAku, Mireika Yomi, bersumpah akan terus bersamamu\n— selama kamu masih mau bermain bersamaku.",
};

export default function EndingScene({ totalScore, onReplay, onBonusStory }: EndingSceneProps) {
  const { t } = useLang();
  const [phase, setPhase] = useState<"rise" | "message" | "rank">("rise");
  const [lineIdx, setLineIdx] = useState(0);
  const [bonusHint, setBonusHint] = useState(false);

  const lines = DEBUT_INFO.message.split("\n");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("message"), 2800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase !== "message") return;
    if (lineIdx >= lines.length) { setTimeout(() => setPhase("rank"), 1200); return; }
    const delay = lines[lineIdx].trim() === "" ? 600 : 2100;
    const t2 = setTimeout(() => setLineIdx((i) => i + 1), delay);
    return () => clearTimeout(t2);
  }, [phase, lineIdx, lines.length]);

  // Bonus story hint muncul 1.5 detik setelah rank tampil
  useEffect(() => {
    if (phase !== "rank") return;
    const t3 = setTimeout(() => setBonusHint(true), 1500);
    return () => clearTimeout(t3);
  }, [phase]);

  const getRank = () => {
    if (totalScore >= 14) return { label: t("rank_1"), icon: "👑", color: "#ffd700" };
    if (totalScore >= 10) return { label: t("rank_2"), icon: "✨", color: "#00e5c8" };
    if (totalScore >= 6)  return { label: t("rank_3"), icon: "🌙", color: "#0ab8a8" };
    return { label: t("rank_4"), icon: "🌿", color: "#7ab8b8" };
  };
  const rank = getRank();

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
    >
      {/* BG */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 60%, rgba(0,120,100,0.18) 0%, rgba(26,10,46,0.25) 40%, #04040a 80%)",
      }} />
      <ParticleCanvas count={55} color="#00e5c8" />

      {/* Glow orb */}
      <motion.div className="absolute pointer-events-none"
        style={{ top:"18%", left:"50%", transform:"translateX(-50%)" }}
        animate={{ scale:[1,1.06,1], opacity:[0.5,0.85,0.5] }} transition={{ duration:4, repeat:Infinity }}>
        <div style={{ width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle, rgba(0,229,200,0.13) 0%, transparent 70%)" }} />
      </motion.div>

      {/* Character */}
      <motion.div className="absolute" style={{ top:"6%", left:"50%", transform:"translateX(-50%)" }}
        initial={{ y:35, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ duration:1.5, ease:"easeOut" }}>
        <div className="relative" style={{ width:130, height:210, animation:"breathe 4s ease-in-out infinite" }}>
          <div style={{
            width:"100%", height:"100%",
            background:"radial-gradient(ellipse at 50% 30%, rgba(0,229,200,0.55) 0%, rgba(0,180,160,0.25) 40%, transparent 70%)",
            filter:"blur(5px)",
          }} />
          <img src="/assets/mireika.png" alt="Mirei"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter:"drop-shadow(0 0 22px rgba(0,229,200,0.85)) drop-shadow(0 0 45px rgba(0,229,200,0.35))" }}
            onError={(e) => (e.currentTarget.style.display = "none")} />
        </div>
        {[80,130,180].map((r,i) => (
          <motion.div key={i} className="absolute rounded-full border" style={{
            width:r, height:r, top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            borderColor:`rgba(0,229,200,${0.28-i*0.07})`,
          }} animate={{ rotate: i%2===0 ? 360 : -360 }} transition={{ duration:9+i*4, repeat:Infinity, ease:"linear" }} />
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 mt-44 px-8 w-full max-w-xl">

        {/* Title */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5, duration:0.8 }} className="text-center">
          <h1 className="font-zombie tracking-[0.14em] uppercase" style={{
            fontSize:"clamp(1.4rem, 4.5vw, 2.5rem)",
            background:"linear-gradient(180deg, #c8f0f0 0%, #00e5c8 60%, #0ab8a8 100%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            filter:"drop-shadow(0 0 12px rgba(0,229,200,0.45))",
          }}>
            Mireika Yomi
          </h1>
          <p className="font-cinzel text-sm tracking-[0.4em] text-[rgba(0,229,200,0.55)] mt-1 uppercase">
            Debut {DEBUT_INFO.date}
          </p>
        </motion.div>

        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.8, duration:1 }}
          className="w-44 h-px"
          style={{ background:"linear-gradient(90deg,transparent,rgba(0,229,200,0.7),transparent)" }} />

        {/* Message */}
        <div className="text-center space-y-1.5">
          {lines.map((line, i) => (
            <AnimatePresence key={i}>
              {i < lineIdx && (
                <motion.p
                  initial={{ opacity:0, y:7, filter:"blur(4px)" }}
                  animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                  transition={{ duration:0.7 }}
                  className={line.trim() === "" ? "h-2" : "font-crimson text-[var(--spirit-light)] leading-relaxed italic"}
                  style={{ fontSize: i===0||i===3 ? "1.1rem" : "0.98rem", opacity: i===0||i===3 ? 1 : 0.82 }}
                >
                  {line}
                </motion.p>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Rank + buttons */}
        <AnimatePresence>
          {phase === "rank" && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.6 }}
              className="flex flex-col items-center gap-4 w-full mt-2">

              {/* Rank card */}
              <div className="glow-border rounded-xl px-10 py-4 text-center">
                <div className="text-3xl mb-2" style={{ filter:`drop-shadow(0 0 12px ${rank.color})` }}>
                  {rank.icon}
                </div>
                <div className="font-cinzel text-base tracking-wider"
                  style={{ color:rank.color, textShadow:`0 0 14px ${rank.color}` }}>
                  {rank.label}
                </div>

              </div>

              {/* Bonus Story button — muncul setelah jeda */}
              <AnimatePresence>
                {bonusHint && (
                  <motion.button
                    initial={{ opacity:0, y:10, scale:0.95 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0 }}
                    transition={{ duration:0.5 }}
                    whileHover={{ scale:1.03 }}
                    whileTap={{ scale:0.97 }}
                    onClick={onBonusStory}
                    className="w-full max-w-xs py-3.5 font-cinzel text-xs tracking-[0.3em] uppercase rounded-lg relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,229,200,0.12) 0%, rgba(255,215,0,0.08) 100%)",
                      border: "1px solid rgba(255,215,0,0.35)",
                      color: "#ffd700",
                      boxShadow: "0 0 20px rgba(255,215,0,0.08)",
                    }}
                  >
                    {/* Shimmer */}
                    <motion.div className="absolute inset-0 pointer-events-none"
                      animate={{ x:["-100%","100%"] }} transition={{ duration:2.5, repeat:Infinity, repeatDelay:1 }}
                      style={{ background:"linear-gradient(90deg, transparent, rgba(255,215,0,0.08), transparent)", width:"60%" }} />
                    🌙 &nbsp; Bonus Story — Mireinkarnasi &nbsp; 🌙
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Replay */}
              <motion.button whileHover={{ scale:1.02 }} onClick={onReplay}
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                className="btn-spirit px-8 py-2.5 font-cinzel text-xs tracking-[0.3em] uppercase opacity-45">
                ↺ &nbsp; {t("play_again")}
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
