"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

const CONTACT_NAME    = "karbit";
const CONTACT_INITIAL = "K";

const CHAT_MESSAGES = [
  { from: "them", text: "Aku udah nungguin momen ini dari lama banget 😭✨", delay: 900 },
  { from: "me",   text: "kamu saha? ", delay: 1400 },
  { from: "them", text: "Rahasia dong! Aku yang paling semangat soalnya wkwk", delay: 1100 },
  { from: "them", text: "Semoga perjalananmu di sini menyenangkan ya 🌑", delay: 1300 },
  { from: "them", text: "Kamu nggak sendirian lagi sekarang 💙", delay: 1500 },
  { from: "me",   text: "..makasih, siapapun kamu.", delay: 2000 },
] as const;

interface PhoneMockupSceneProps { onComplete: () => void; }
type ChatMsg = { from: "them" | "me"; text: string };

export default function PhoneMockupScene({ onComplete }: PhoneMockupSceneProps) {
  const [show, setShow]         = useState(false);
  const [msgs, setMsgs]         = useState<ChatMsg[]>([]);
  const [typing, setTyping]     = useState(false);
  const [msgIdx, setMsgIdx]     = useState(0);
  const [showBtn, setShowBtn]   = useState(false);
  const [buzz, setBuzz]         = useState(false);
  const chatEndRef              = useRef<HTMLDivElement>(null);

  useEffect(() => { const t = setTimeout(() => setShow(true), 1200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (!show) return;
    if (msgIdx >= CHAT_MESSAGES.length) { setTimeout(() => setShowBtn(true), 1500); return; }
    const msg = CHAT_MESSAGES[msgIdx];
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    if (msg.from === "them") {
      t1 = setTimeout(() => { setTyping(true); setBuzz(true); setTimeout(() => setBuzz(false), 350); }, msg.delay * 0.35);
      t2 = setTimeout(() => { setTyping(false); setMsgs(p => [...p, { from: msg.from, text: msg.text }]); setMsgIdx(i => i + 1); }, msg.delay);
    } else {
      t2 = setTimeout(() => { setMsgs(p => [...p, { from: msg.from, text: msg.text }]); setMsgIdx(i => i + 1); }, msg.delay);
    }
    return () => { clearTimeout(t1!); clearTimeout(t2); };
  }, [show, msgIdx]);

  // Auto-scroll
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

  return (
    <motion.div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,25,40,0.7) 0%, #04040a 75%)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.8 }}>

      <ParticleCanvas count={18} color="#00e5c8" />

      {/* Top label */}
      <AnimatePresence>
        {show && (
          <motion.p className="absolute top-8 font-cinzel text-[10px] tracking-[0.5em] uppercase text-center"
            style={{ color:"rgba(0,229,200,0.4)" }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
            ⁂ &nbsp; Di suatu alam yang tersambung &nbsp; ⁂
          </motion.p>
        )}
      </AnimatePresence>

      {/* Phone — fixed height, no overflow into button area */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y:60, opacity:0 }}
            animate={{ y: buzz ? [0,-5,5,-3,1,0] : 0, opacity:1 }}
            transition={{ opacity:{ duration:0.7 }, scale:{ duration:0.7 },
              y: buzz ? { duration:0.35 } : { duration:0.7 } }}
            style={{ width:"min(320px,82vw)", height:"min(500px,72vh)", flexShrink:0 }}>

            {/* Outer glow */}
            <div className="absolute inset-0 rounded-[36px] pointer-events-none"
              style={{ boxShadow:"0 0 40px rgba(0,229,200,0.18), 0 24px 50px rgba(0,0,0,0.65)" }} />

            {/* Phone body */}
            <div className="rounded-[36px] overflow-hidden flex flex-col"
              style={{
                width:"100%", height:"100%",
                background:"linear-gradient(160deg, #161625 0%, #0c0c1a 100%)",
                border:"1px solid rgba(0,229,200,0.22)",
              }}>

              {/* Notch */}
              <div className="flex justify-center pt-2.5 pb-1 flex-shrink-0">
                <div className="rounded-full flex items-center justify-center"
                  style={{ width:90, height:24, background:"#0a0a18", border:"1px solid rgba(0,229,200,0.08)" }}>
                  <div className="rounded-full"
                    style={{ width:8, height:8, background:"rgba(0,229,200,0.4)", boxShadow:"0 0 5px rgba(0,229,200,0.5)" }} />
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-5 flex-shrink-0" style={{ paddingBottom:4 }}>
                <span className="font-cinzel text-[9px]" style={{ color:"rgba(200,240,240,0.45)" }}>{timeStr}</span>
                <div className="flex items-center gap-1">
                  {[2,3,4,5].map(h => (
                    <div key={h} className="rounded-sm" style={{ width:3, height:h, background:"rgba(0,229,200,0.5)" }} />
                  ))}
                  <div className="ml-1 rounded-sm" style={{ width:17, height:8, border:"1px solid rgba(0,229,200,0.4)", padding:1 }}>
                    <div className="h-full rounded-sm" style={{ width:"70%", background:"#00e5c8" }} />
                  </div>
                </div>
              </div>

              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-2.5 flex-shrink-0"
                style={{ borderBottom:"1px solid rgba(0,229,200,0.1)", background:"rgba(8,8,22,0.9)" }}>
                <span className="font-cinzel text-sm" style={{ color:"rgba(0,229,200,0.55)" }}>‹</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs font-bold flex-shrink-0"
                  style={{ background:"rgba(0,100,90,0.5)", border:"1px solid rgba(0,229,200,0.45)", color:"#00e5c8" }}>
                  {CONTACT_INITIAL}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-cinzel text-xs tracking-wider truncate" style={{ color:"var(--spirit-light)" }}>
                    {CONTACT_NAME}
                  </div>
                  <div className="font-gothic text-[9px]" style={{ color:"rgba(0,229,200,0.55)" }}>
                    {typing
                      ? <motion.span animate={{ opacity:[1,0.4,1] }} transition={{ duration:0.8, repeat:Infinity }}>sedang mengetik...</motion.span>
                      : "online"}
                  </div>
                </div>
                <span className="font-cinzel text-xs" style={{ color:"rgba(0,229,200,0.35)" }}>⋮</span>
              </div>

              {/* Messages — flex-1 with overflow scroll */}
              <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2" style={{ scrollbarWidth:"none" }}>
                {msgs.map((msg, i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:10, scale:0.94 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    transition={{ duration:0.3 }}
                    className={`flex ${msg.from==="me" ? "justify-end" : "justify-start"} items-end gap-1.5`}>
                    {msg.from === "them" && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                        style={{ background:"rgba(0,100,90,0.5)", border:"1px solid rgba(0,229,200,0.3)", color:"#00e5c8" }}>
                        {CONTACT_INITIAL}
                      </div>
                    )}
                    <div className="max-w-[75%] px-3 py-2 font-crimson text-[13px] leading-snug"
                      style={{
                        borderRadius: msg.from==="me" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: msg.from==="me"
                          ? "linear-gradient(135deg, rgba(0,120,110,0.65), rgba(0,80,70,0.75))"
                          : "rgba(22,22,38,0.9)",
                        border: msg.from==="me"
                          ? "1px solid rgba(0,229,200,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                        color:"var(--spirit-light)",
                        boxShadow: msg.from==="me" ? "0 2px 10px rgba(0,229,200,0.12)" : "none",
                      }}>
                      {msg.text}
                    </div>
                    {msg.from === "me" && (
                      <span className="text-[9px] flex-shrink-0 self-end pb-0.5" style={{ color:"rgba(0,229,200,0.35)" }}>✓✓</span>
                    )}
                  </motion.div>
                ))}

                {/* Typing dots */}
                <AnimatePresence>
                  {typing && (
                    <motion.div className="flex items-end gap-1.5"
                      initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                        style={{ background:"rgba(0,100,90,0.5)", border:"1px solid rgba(0,229,200,0.3)", color:"#00e5c8" }}>
                        {CONTACT_INITIAL}
                      </div>
                      <div className="px-3 py-2.5 rounded-2xl flex items-center gap-1"
                        style={{ background:"rgba(22,22,38,0.9)", border:"1px solid rgba(255,255,255,0.07)" }}>
                        {[0,1,2].map(d => (
                          <motion.div key={d} className="w-1.5 h-1.5 rounded-full"
                            style={{ background:"rgba(0,229,200,0.65)" }}
                            animate={{ y:[0,-4,0], opacity:[0.4,1,0.4] }}
                            transition={{ duration:0.65, repeat:Infinity, delay:d*0.18 }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
                style={{ borderTop:"1px solid rgba(0,229,200,0.07)", background:"rgba(8,8,22,0.95)" }}>
                <div className="flex-1 rounded-full px-3 py-1.5 font-gothic text-[10px] italic"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", color:"rgba(200,240,240,0.22)" }}>
                  Tulis pesan...
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background:"rgba(0,229,200,0.13)", border:"1px solid rgba(0,229,200,0.28)" }}>
                  ✦
                </div>
              </div>

              {/* Home bar */}
              <div className="flex justify-center py-1.5 flex-shrink-0">
                <div className="rounded-full" style={{ width:80, height:3, background:"rgba(200,240,240,0.18)" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {showBtn && (
          <motion.div className="flex flex-col items-center gap-3 mt-5"
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <p className="font-crimson text-sm italic" style={{ color:"rgba(200,240,240,0.4)" }}>
              Cahaya dari dunia lain telah sampai...
            </p>
            <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={onComplete}
              className="btn-spirit px-10 py-3 font-cinzel text-xs tracking-[0.3em] uppercase">
              ✦ &nbsp; Lihat Ending &nbsp; ✦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
