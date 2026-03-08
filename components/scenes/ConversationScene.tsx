"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import { useTypewriter } from "@/components/ui/useTypewriter";

type Speaker = "mirei" | "player" | "narrator";

interface DialogLine {
  speaker: Speaker;
  text: string;
  speed?: number;
}

const DIALOG: DialogLine[] = [
  { speaker: "narrator", text: "Cahaya itu berhenti bergerak...", speed: 60 },
  { speaker: "mirei",    text: "Tunggu.",                          speed: 80 },
  { speaker: "mirei",    text: "Kamu... bisa melihatku?",          speed: 55 },
  { speaker: "player",   text: "...Siapa kamu?",                   speed: 55 },
  { speaker: "mirei",    text: "Namaku Mirei.",                    speed: 60 },
  { speaker: "mirei",    text: "Aku sudah terjebak di alam ini entah berapa lama.", speed: 42 },
  { speaker: "mirei",    text: "Tidak ada yang bisa melihatku di sini... sampai kamu datang.", speed: 40 },
  { speaker: "player",   text: "Terjebak? Kenapa bisa begitu?",    speed: 48 },
  { speaker: "mirei",    text: "Aku tidak ingat semua detailnya.", speed: 48 },
  { speaker: "mirei",    text: "Yang aku tahu... kepingan-kepingan kehidupanku tersebar di alam ini.", speed: 38 },
  { speaker: "mirei",    text: "Tanpa mereka, aku akan benar-benar menghilang.", speed: 42 },
  { speaker: "player",   text: "Kepingan kehidupan?",              speed: 52 },
  { speaker: "mirei",    text: "Fragmen dari jiwa yang masih ingin hidup.", speed: 45 },
  { speaker: "mirei",    text: "Tapi ada bayangan-bayangan gelap yang menjaga mereka.", speed: 40 },
  { speaker: "mirei",    text: "Setiap kali aku mendekati... mereka mengusirku.", speed: 43 },
  { speaker: "player",   text: "Lalu kamu butuh aku untuk mengambilnya?",  speed: 46 },
  { speaker: "mirei",    text: "Kamu satu-satunya manusia yang bisa melihatku.", speed: 42 },
  { speaker: "mirei",    text: "Dan manusia... tidak terpengaruh oleh bayangan seperti yang aku rasakan.", speed: 36 },
  { speaker: "mirei",    text: "Setidaknya... tidak secepat itu.", speed: 48 },
  { speaker: "player",   text: "Ini terdengar berbahaya.",         speed: 52 },
  { speaker: "mirei",    text: "Aku tahu.",                        speed: 70 },
  { speaker: "mirei",    text: "Dan aku tidak akan memaksamu.",    speed: 50 },
  { speaker: "mirei",    text: "Tapi tolong...",                   speed: 55 },
  { speaker: "mirei",    text: "Ini satu-satunya kesempatanku.", speed: 48 },
];

interface ConversationSceneProps {
  onComplete: () => void;
}

export default function ConversationScene({ onComplete }: ConversationSceneProps) {
  const [lineIdx, setLineIdx]     = useState(0);
  const [showChoices, setShowChoices] = useState(false);
  const [chosen, setChosen]       = useState(false);
  const [choiceText, setChoiceText] = useState("");

  const current = DIALOG[lineIdx];
  const { displayed, done, skip } = useTypewriter(
    current?.text ?? "",
    current?.speed ?? 48
  );

  const advance = useCallback(() => {
    if (!done) { skip(); return; }
    if (lineIdx < DIALOG.length - 1) {
      setLineIdx((i) => i + 1);
    } else {
      setShowChoices(true);
    }
  }, [done, skip, lineIdx]);

  const choose = (text: string) => {
    setChosen(true);
    setChoiceText(text);
    setTimeout(onComplete, 1800);
  };

  if (!current) return null;

  const isMirei   = current.speaker === "mirei";
  const isPlayer  = current.speaker === "player";
  const isNarrator = current.speaker === "narrator";

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex flex-col justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={!showChoices ? advance : undefined}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(0,80,70,0.25) 0%, #04040a 70%)",
      }} />
      <ParticleCanvas count={22} color="#00e5c8" className="opacity-50" />

      {/* Mirei silhouette center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ marginBottom: "10%" }}
        >
          {/* Glow orb */}
          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            style={{
              width: 110, height: 170,
              background: "radial-gradient(ellipse at 50% 30%, rgba(0,229,200,0.55) 0%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />
          <img src="/assets/mireika.png" alt="Mirei"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,229,200,0.8))" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          {/* Ring animations */}
          {[60, 100].map((r, i) => (
            <motion.div key={i} className="absolute rounded-full"
              style={{
                width: r, height: r, top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                border: `1px solid rgba(0,229,200,${0.25 - i * 0.08})`,
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity }}
            />
          ))}
        </motion.div>
      </div>

      {/* Dialog box area */}
      <div className="relative z-10 px-6 pb-8 pt-4" style={{
        background: "linear-gradient(to top, rgba(4,4,10,0.97) 0%, rgba(4,4,10,0.7) 80%, transparent 100%)",
      }}>

        {/* Speaker label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`spk-${lineIdx}`}
            initial={{ opacity: 0, x: isPlayer ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-2 font-cinzel text-xs tracking-[0.35em] uppercase ${
              isNarrator ? "text-center text-[rgba(200,240,240,0.4)]"
              : isMirei   ? "text-left text-[rgba(0,229,200,0.8)]"
              : "text-right text-[rgba(200,240,240,0.5)]"
            }`}
            style={isMirei ? { textShadow: "0 0 10px rgba(0,229,200,0.5)" } : {}}
          >
            {isNarrator ? "— narasi —" : isMirei ? "✦ Mirei" : "Kamu"}
          </motion.div>
        </AnimatePresence>

        {/* Dialog bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`line-${lineIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative max-w-xl px-5 py-4 rounded-xl mb-3 ${
              isPlayer   ? "ml-auto"
              : isNarrator ? "mx-auto"
              : ""
            }`}
            style={{
              background: isNarrator
                ? "transparent"
                : isPlayer
                ? "linear-gradient(135deg, rgba(20,30,50,0.85), rgba(10,15,30,0.9))"
                : "linear-gradient(135deg, rgba(0,60,55,0.5), rgba(0,40,38,0.6))",
              border: isNarrator ? "none"
                : isPlayer ? "1px solid rgba(200,240,240,0.12)"
                : "1px solid rgba(0,229,200,0.3)",
              boxShadow: isMirei ? "0 0 20px rgba(0,229,200,0.12)" : "none",
            }}
          >
            {/* Tail */}
            {isMirei && (
              <div className="absolute left-4 -bottom-2 w-3 h-3" style={{
                background: "rgba(0,40,38,0.6)",
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                borderLeft: "1px solid rgba(0,229,200,0.3)",
                borderBottom: "1px solid rgba(0,229,200,0.3)",
              }} />
            )}
            {isPlayer && (
              <div className="absolute right-4 -bottom-2 w-3 h-3" style={{
                background: "rgba(10,15,30,0.9)",
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                borderRight: "1px solid rgba(200,240,240,0.12)",
                borderBottom: "1px solid rgba(200,240,240,0.12)",
              }} />
            )}

            <p className={`leading-relaxed ${
              isNarrator ? "font-gothic text-[rgba(200,240,240,0.5)] text-sm italic text-center"
              : "font-crimson text-[var(--spirit-light)] text-lg italic"
            }`}>
              {displayed}
              {!done && <span className="typewriter-cursor" />}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Click hint */}
        {!showChoices && done && (
          <motion.div
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-center font-cinzel text-[10px] text-[rgba(0,229,200,0.4)] tracking-[0.4em] uppercase mt-1"
          >
            ▸ klik untuk lanjut
          </motion.div>
        )}

        {/* Choices */}
        <AnimatePresence>
          {showChoices && !chosen && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-3 mt-4"
            >
              <p className="font-cinzel text-xs text-[rgba(0,229,200,0.5)] tracking-[0.3em] uppercase text-center mb-1">
                — Apa jawabanmu? —
              </p>
              {[
                "Baiklah. Aku akan membantumu.",
                "...Aku tidak bisa menolak.",
              ].map((choice, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.25 }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  onClick={() => choose(choice)}
                  className="btn-spirit text-left px-6 py-3 font-crimson text-base italic"
                  style={{ borderRadius: "12px" }}
                >
                  ▸ &nbsp; {choice}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* After choice */}
        <AnimatePresence>
          {chosen && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <div className="font-cinzel text-xs text-[rgba(0,229,200,0.6)] tracking-[0.35em] uppercase mb-2">
                ✦ Mirei
              </div>
              <p className="font-crimson text-[var(--teal-glow)] text-xl italic"
                style={{ textShadow: "0 0 15px rgba(0,229,200,0.5)" }}>
                "...Terima kasih."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
