"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

// ╔══════════════════════════════════════════════════════════╗
// ║  ✏️  GANTI ISI PESAN DI SINI                            ║
// ╠══════════════════════════════════════════════════════════╣

const SENDER_NAME  = "";  // nama dihapus per request
const SENDER_PHOTO = "/assets/sender.png"; // kosongkan "" jika tidak ada foto

const MESSAGES: string[] = [
  "Hei Mireika... selamat ya untuk debutmu hari ini 🎉",
  "Aku udah nungguin momen ini dari lama banget.",
  "Seneng banget bisa jadi bagian dari perjalananmu dari awal.",
  "Semoga kamu bisa nemuin banyak kepingan kehidupan bareng temen-temen baru di sini.",
  "Apapun yang terjadi nanti, ingat — selalu ada yang support kamu 💙",
  "Selamat datang ke dunia ini, Mireika. ✨",
];

// ╚══════════════════════════════════════════════════════════╝

interface MessageSceneProps { onComplete: () => void; }

interface BubbleData { id: number; text: string; }

export default function MessageScene({ onComplete }: MessageSceneProps) {
  const [started, setStarted]     = useState(false);       // after intro delay
  const [bubbles, setBubbles]     = useState<BubbleData[]>([]); // rendered bubbles (stable)
  const [isTyping, setIsTyping]   = useState(false);
  const [showBtn, setShowBtn]     = useState(false);
  const [step, setStep]           = useState(-1);          // which message is next (-1 = not started)
  const scrollRef                 = useRef<HTMLDivElement>(null);

  // Start after intro
  useEffect(() => {
    const t = setTimeout(() => { setStarted(true); setStep(0); }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Process each message one at a time
  useEffect(() => {
    if (!started || step < 0 || step >= MESSAGES.length) {
      if (started && step >= MESSAGES.length) {
        setTimeout(() => setShowBtn(true), 1000);
      }
      return;
    }

    const text = MESSAGES[step];
    const typingDuration = 600 + text.length * 18;  // typing time proportional to length
    const readDelay      = 400;                      // pause before showing

    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;

    // Show "typing..." indicator first
    t1 = setTimeout(() => {
      setIsTyping(true);
    }, readDelay);

    // Then show the bubble
    t2 = setTimeout(() => {
      setIsTyping(false);
      setBubbles((prev) => [...prev, { id: step, text }]);
      // Scroll to bottom
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
      // Queue next message
      setTimeout(() => setStep((s) => s + 1), 300);
    }, readDelay + typingDuration);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step, started]);

  // Auto-scroll when bubbles or typing indicator changes
  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [bubbles, isTyping]);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex flex-col"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* BG */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(10,40,60,0.5) 0%, #04040a 75%)" }} />
      <ParticleCanvas count={18} color="#00e5c8" className="opacity-25" />

      {/* ── Intro overlay ── */}
      <AnimatePresence>
        {!started && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-20"
            exit={{ opacity: 0, transition: { duration: 0.7 } }}>
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="text-center">
              <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 12px rgba(0,229,200,0.8))" }}>💌</div>
              <p className="font-cinzel text-[var(--teal-glow)] text-sm tracking-[0.4em] uppercase" style={{ textShadow: "0 0 12px rgba(0,229,200,0.5)" }}>
                Ada pesan untukmu, Mirei
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat Header — fixed at top ── */}
      <motion.div
        className="relative z-10 flex items-center gap-3 px-5 py-3 flex-shrink-0"
        style={{ background: "rgba(4,6,14,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(0,229,200,0.1)" }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
            style={{ background: "radial-gradient(circle, rgba(0,229,200,0.25) 0%, rgba(4,4,10,0.8) 100%)", border: "1px solid rgba(0,229,200,0.35)", boxShadow: "0 0 10px rgba(0,229,200,0.2)" }}>
            {SENDER_PHOTO ? (
              <img src={SENDER_PHOTO} alt={SENDER_NAME} className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")} />
            ) : (
              <span className="text-lg select-none">👤</span>
            )}
          </div>
          {/* Online dot */}
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
            style={{ background: "#00e5c8", border: "2px solid #04040a", boxShadow: "0 0 6px #00e5c8" }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-cinzel text-sm tracking-wide truncate" style={{ color: "var(--spirit-light)" }}>{SENDER_NAME}</div>
          <div className="font-gothic text-[11px]" style={{ color: "rgba(0,229,200,0.55)" }}>
            {isTyping ? (
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.7, repeat: Infinity }}>
                sedang mengetik...
              </motion.span>
            ) : (
              <span>online ·{" "}{timeStr}</span>
            )}
          </div>
        </div>
        <div className="font-cinzel text-xs flex-shrink-0" style={{ color: "rgba(0,229,200,0.3)" }}>✦</div>
      </motion.div>

      {/* ── Messages scroll area — fixed height, scroll within ── */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 pt-4 pb-2"
        style={{ scrollbarWidth: "none", overscrollBehavior: "contain" }}
      >
        {/* Spacer to push content to top initially */}
        <div className="flex flex-col gap-3">
          {bubbles.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col items-start gap-1"
            >
              {/* Bubble */}
              <div
                className="relative max-w-[82%] min-w-[80px] px-4 py-3 font-crimson text-[var(--spirit-light)] leading-relaxed"
                style={{
                  fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
                  borderRadius: "18px 18px 18px 4px",
                  background: i === bubbles.length - 1 && !isTyping && step >= MESSAGES.length
                    ? "linear-gradient(135deg, rgba(0,100,90,0.55), rgba(0,70,65,0.65))"
                    : "linear-gradient(135deg, rgba(10,20,35,0.88), rgba(5,12,25,0.92))",
                  border: i === bubbles.length - 1 && !isTyping && step >= MESSAGES.length
                    ? "1px solid rgba(0,229,200,0.45)"
                    : "1px solid rgba(0,229,200,0.12)",
                  boxShadow: i === bubbles.length - 1 && !isTyping && step >= MESSAGES.length
                    ? "0 0 18px rgba(0,229,200,0.18)"
                    : "none",
                }}
              >
                {b.text}
                {/* Tail */}
                <div className="absolute left-3 -bottom-2 w-3 h-3 overflow-hidden">
                  <div style={{ width: 12, height: 12, background: "rgba(10,20,35,0.88)", transform: "rotate(45deg) translate(-6px, -6px)", borderLeft: "1px solid rgba(0,229,200,0.12)", borderBottom: "1px solid rgba(0,229,200,0.12)" }} />
                </div>
              </div>

              {/* Read receipt */}
              <span className="font-cinzel text-[10px] pl-2" style={{ color: "rgba(0,229,200,0.25)" }}>✓✓</span>
            </motion.div>
          ))}

          {/* Typing indicator — always at the bottom of the list */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-[18px_18px_18px_4px]"
                  style={{ background: "rgba(10,20,35,0.88)", border: "1px solid rgba(0,229,200,0.1)", minWidth: 64 }}>
                  {[0,1,2].map((d) => (
                    <motion.div key={d} className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgba(0,229,200,0.65)" }}
                      animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.65, repeat: Infinity, delay: d * 0.16 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom input bar (decorative) + CTA ── */}
      <div className="relative z-10 flex-shrink-0" style={{ background: "rgba(4,6,14,0.95)", borderTop: "1px solid rgba(0,229,200,0.08)" }}>
        {/* Decorative input */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex-1 rounded-full px-4 py-2 font-gothic text-xs italic"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(200,240,240,0.2)" }}>
            Tulis pesan...
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: "rgba(0,229,200,0.1)", border: "1px solid rgba(0,229,200,0.25)" }}>✦</div>
        </div>

        {/* CTA */}
        <AnimatePresence>
          {showBtn && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center gap-2 px-4 pb-5"
            >
              <p className="font-cinzel text-[10px] tracking-[0.4em] text-[rgba(0,229,200,0.4)] uppercase">
                ✦ &nbsp; Pesan tersampaikan &nbsp; ✦
              </p>
              <motion.button whileHover={{ scale: 1.02 }} onClick={onComplete}
                className="btn-spirit w-full max-w-xs py-3 font-cinzel text-xs tracking-[0.3em] uppercase">
                ✦ &nbsp; Lihat Akhir Perjalanan &nbsp; ✦
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
