"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

type Speaker = "mirei" | "player" | "narasi" | "crowd";
interface Line { speaker: Speaker; text: string; delay?: number; cooking?: boolean; }

const STORY: Line[] = [
  { speaker:"narasi",  text:"Beberapa saat setelah kontrak ditandatangani..." },
  { speaker:"narasi",  text:"Tiba-tiba alam menjadi sedikit lebih ramai dari biasanya." },
  { speaker:"crowd",   text:"( ´ ▽ ` )ﾉ  ( ´ ▽ ` )ﾉ  ( ´ ▽ ` )ﾉ", delay:400 },
  { speaker:"mirei",   text:"Eh... kamu tidak sendirian rupanya." },
  { speaker:"mirei",   text:"Ada banyak sekali orang yang ikut menyeberang bersamamu..." },
  { speaker:"player",  text:"...iya, mereka tadi ngikut dari belakang. Aku juga baru sadar." },
  { speaker:"crowd",   text:"HALO MIREI~~!! ヾ(≧▽≦*)o" },
  { speaker:"mirei",   text:"...ah. Halo. Kalian semua... datang untuk aku?" },
  { speaker:"crowd",   text:"IYA!! Kami semua mau jaga kamu, Mirei!!" },
  { speaker:"mirei",   text:"...", delay:800 },
  { speaker:"mirei",   text:"Kalau kalian mau tinggal di sini bersamaku..." },
  { speaker:"mirei",   text:"Aku mau kasih kalian nama." },
  { speaker:"narasi",  text:"Mirei diam sejenak, seperti sedang memikirkan sesuatu yang berat." },
  { speaker:"mirei",   text:"Mireinkarnasi." },
  { speaker:"player",  text:"...Mireinkarnasi?" },
  { speaker:"mirei",   text:"Karena kalian jiwa jiwa yang tersesat yang ketemu aku." },
  { speaker:"mirei",   text:"Setiap kali aku ada, kalian juga ada. Itu reinkarnasi kita bersama." },
  { speaker:"crowd",   text:"MIREINKARNASI!! MIREINKARNASI!! 🌙✨" },
  { speaker:"mirei",   text:"...berisik sekali.", delay:600 },
  { speaker:"mirei",   text:"Tapi aku suka." },
  { speaker:"narasi",  text:"Kemudian Mirei menatapmu dengan tatapan yang sangat serius.", delay:600 },
  { speaker:"mirei",   text:"Ngomong-ngomong." },
  { speaker:"mirei",   text:"Untuk merayakan ini, aku butuh sesajen." },
  { speaker:"player",  text:"Sesajen?" },
  { speaker:"mirei",   text:"Ya. Ini ritual penting. Tidak boleh datang ke alam arwah tanpa membawa sesuatu." },
  { speaker:"player",  text:"...aku cuma bawa Samyang Keju." },
  { speaker:"player",  text:"Yang bungkusan kuning itu. Belum dimasak juga." },
  { speaker:"mirei",   text:"...", delay:1000 },
  { speaker:"mirei",   text:"Samyang." },
  { speaker:"mirei",   text:"Keju." },
  { speaker:"player",  text:"Iya. Itu punya aku sendiri. Buat nanti malam." },
  { speaker:"mirei",   text:"...", delay:1200 },
  { speaker:"mirei",   text:"Masak sekarang." },
  { speaker:"player",  text:"Ha??" },
  { speaker:"mirei",   text:"Masak sekarang. Untuk aku." },
  { speaker:"player",  text:"Tapi ini alam arwah! Kompor dari mana?!" },
  { speaker:"narasi",  text:"Seketika muncul kompor portabel, wajan, dan air mendidih di hadapanmu.", cooking:true },
  { speaker:"narasi",  text:"Entah dari mana asalnya. Api menyala di atas kepala Mirei.", cooking:true },
  { speaker:"mirei",   text:"Alam arwah menyediakan kebutuhan sesajen.", cooking:true, delay:300 },
  { speaker:"mirei",   text:"Sekarang masak.", cooking:true },
  { speaker:"crowd",   text:"MASAK MASAK MASAK!! 🍜🍜🍜", cooking:true },
  { speaker:"player",  text:"...oke, oke. Demi ritual katanya.", cooking:true },
  { speaker:"narasi",  text:"Kamu memasak Samyang Keju di tengah alam arwah.", cooking:true },
  { speaker:"narasi",  text:"Disaksikan Mirei dan seluruh Mireinkarnasi. Aromanya menyebar ke seluruh penjuru alam.", cooking:true },
  { speaker:"mirei",   text:"...", delay:1000, cooking:true },
  { speaker:"mirei",   text:"Wanginya...", cooking:true },
  { speaker:"mirei",   text:"Aku sudah lama sekali tidak mencium sesuatu seperti ini.", cooking:true },
  { speaker:"player",  text:"Ini cuma mie instan, Mirei..." },
  { speaker:"mirei",   text:"Diam. Ini bukan cuma mie instan." },
  { speaker:"mirei",   text:"Ini sesajen pertama Mireinkarnasi." },
  { speaker:"mirei",   text:"Ini sakral." },
  { speaker:"crowd",   text:"IYAA MIREI BENAR!! SAKRAL!! 😭✨" },
  { speaker:"player",  text:"...wkwk ya sudah. Ini, sudah matang." },
  { speaker:"mirei",   text:"...", delay:800 },
  { speaker:"mirei",   text:"Duh enak banget sempurna." },
  { speaker:"mirei",   text:"Ini... enak sekali sebenarnya." },
  { speaker:"crowd",   text:"WKWKWK MIREI DOYAN 😭💛" },
  { speaker:"mirei",   text:"Kalian boleh datang lagi kapan saja.", delay:600 },
  { speaker:"mirei",   text:"Tapi lain kali bawa dua kardus." },
  { speaker:"player",  text:"DUA kardus?!" },
  { speaker:"mirei",   text:"Satu untuk ritual. Satu untuk aku stok." },
  { speaker:"crowd",   text:"WKWKWKWK MIREI STOK SAMYANG 💀💀💀" },
  { speaker:"narasi",  text:"Dan begitulah, Mireinkarnasi terbentuk —", delay:600 },
  { speaker:"narasi",  text:"dirayakan dengan Samyang Keju yang dimasak di alam arwah." },
  { speaker:"mirei",   text:"...selamat datang. Semua dari kalian." },
  { speaker:"mirei",   text:"Aku tunggu kunjungan berikutnya. 🌙" },
];

const CFG = {
  mirei:  { label:"Mireika Yomi",  color:"#00e5c8", align:"left"   as const, bg:"rgba(0,44,38,0.9)"   },
  player: { label:"Kamu",          color:"#c8f0f0", align:"right"  as const, bg:"rgba(20,20,45,0.9)"  },
  narasi: { label:"",              color:"rgba(200,240,240,0.55)", align:"center" as const, bg:"transparent" },
  crowd:  { label:"Mireinkarnasi", color:"#ffd700", align:"center" as const, bg:"rgba(44,34,0,0.8)"   },
};

interface BonusStoryProps { onDone: () => void; }

export default function BonusStoryScene({ onDone }: BonusStoryProps) {
  const [idx, setIdx]           = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [log, setLog]           = useState<{speaker:Speaker;text:string}[]>([]);
  const [showLog, setShowLog]   = useState(false);
  const isAdvancing             = useRef(false);   // ← guard double-click bug

  const line    = STORY[idx];
  const cfg     = CFG[line.speaker];
  const text    = line.text;
  const done    = charIdx >= text.length;
  const display = text.slice(0, charIdx);
  const isLast  = idx === STORY.length - 1;
  const isCooking = STORY[idx].cooking === true;

  // Typewriter
  useEffect(() => {
    if (done) return;
    const speed = line.speaker === "narasi" ? 30 : line.speaker === "crowd" ? 20 : 26;
    const t = setTimeout(() => setCharIdx(i => i + 1), speed);
    return () => clearTimeout(t);
  }, [charIdx, done, line.speaker]);

  const advance = useCallback(() => {
    if (isAdvancing.current) return;          // block rapid double-click
    if (!done) { setCharIdx(text.length); return; }
    if (isLast) { setTimeout(onDone, 500); return; }

    isAdvancing.current = true;
    // Save to log
    if (line.speaker !== "narasi") {
      setLog(l => [...l, { speaker: line.speaker, text: line.text }]);
    }

    const next = idx + 1;
    const nextLine = STORY[next];
    const pause = nextLine.delay ?? (line.speaker !== nextLine.speaker ? 140 : 50);

    setTimeout(() => {
      setIdx(next);
      setCharIdx(0);
      isAdvancing.current = false;
    }, pause);
  }, [done, text.length, isLast, line, idx, onDone]);

  // Auto-advance narasi
  useEffect(() => {
    if (done && line.speaker === "narasi" && !isAdvancing.current) {
      const t = setTimeout(advance, 1900);
      return () => clearTimeout(t);
    }
  }, [done, line.speaker, advance]);

  return (
    <motion.div
      className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background:"radial-gradient(ellipse at 50% 75%, rgba(0,80,60,0.2) 0%, #04040a 68%)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:1.1 }}
      onClick={advance}
    >
      <ParticleCanvas count={22} color="#00e5c8" />

      {/* ── Header ── */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-5 pb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-px w-10" style={{ background:"linear-gradient(90deg, transparent, rgba(0,229,200,0.4))" }} />
          <span className="font-cinzel text-[11px] tracking-[0.5em] uppercase" style={{ color:"rgba(0,229,200,0.45)" }}>
            Bonus Story
          </span>
        </div>

        {/* Log button */}
        <motion.button
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
          onClick={e => { e.stopPropagation(); setShowLog(v => !v); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cinzel text-[10px] tracking-widest uppercase"
          style={{
            background:"rgba(0,229,200,0.08)",
            border:"1px solid rgba(0,229,200,0.25)",
            color:"rgba(0,229,200,0.65)",
          }}>
          📜 Log
        </motion.button>
      </div>

      {/* ── Mirei avatar + fire ── */}
      <div className="relative z-10 flex justify-center flex-shrink-0 mb-1">
        <div className="relative" style={{ width:64, height:64 }}>
          {/* Fire on head during cooking */}
          <AnimatePresence>
            {isCooking && (
              <motion.div
                className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                initial={{ opacity:0, scale:0.5, y:8 }}
                animate={{ opacity:1, scale:1, y:0 }}
                exit={{ opacity:0 }}
              >
                <motion.div
                  animate={{ scaleY:[1,1.2,0.9,1.15,1], scaleX:[1,0.9,1.1,0.95,1] }}
                  transition={{ duration:0.6, repeat:Infinity }}
                  style={{ fontSize:26, lineHeight:1, filter:"drop-shadow(0 0 8px rgba(255,140,0,0.8))" }}>
                  🔥
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avatar circle */}
          <div className="w-full h-full rounded-full flex items-center justify-center"
            style={{
              background: isCooking
                ? "linear-gradient(135deg, rgba(255,100,0,0.3), rgba(0,80,70,0.5))"
                : "linear-gradient(135deg, rgba(0,180,160,0.25), rgba(0,60,55,0.5))",
              border: `1.5px solid ${isCooking ? "rgba(255,140,0,0.5)" : "rgba(0,229,200,0.35)"}`,
              boxShadow: isCooking
                ? "0 0 18px rgba(255,100,0,0.25)"
                : "0 0 12px rgba(0,229,200,0.12)",
              transition:"all 0.4s ease",
            }}>
            <img src="/assets/mireika.png" alt="M"
              className="w-full h-full object-contain rounded-full"
              style={{ filter: isCooking
                ? "drop-shadow(0 0 6px rgba(255,100,0,0.6))"
                : "drop-shadow(0 0 4px rgba(0,229,200,0.5))" }}
              onError={e => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.parentElement as HTMLElement).innerHTML += `<span style="font-size:24px">👻</span>`;
              }} />
          </div>
        </div>
      </div>

      {/* ── Dialog area ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 pb-4 gap-3 min-h-0">

        {/* Active bubble */}
        <motion.div key={idx}
          initial={{ opacity:0, y:10, scale:0.97 }}
          animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.2 }}
          className={`flex flex-col gap-1.5 flex-shrink-0 ${
            cfg.align==="right" ? "items-end" :
            cfg.align==="center" ? "items-center" : "items-start"
          }`}>
          {cfg.label && (
            <span className="font-cinzel text-[11px] tracking-[0.32em] uppercase px-1"
              style={{ color:cfg.color, opacity:0.7 }}>
              {cfg.label}
            </span>
          )}
          <div className="max-w-[85%] px-5 py-3.5 rounded-2xl"
            style={{
              background:cfg.bg,
              border:`1px solid ${cfg.color}30`,
              boxShadow:`0 0 16px ${cfg.color}10`,
              minWidth: line.speaker==="narasi" ? "60%" : "auto",
            }}>
            <p className={`whitespace-pre-line leading-relaxed ${
              line.speaker==="narasi" ? "font-crimson italic text-lg text-center" :
              line.speaker==="crowd"  ? "font-cinzel text-base tracking-wide text-center" :
              "font-crimson text-xl"
            }`} style={{ color:cfg.color }}>
              {display}
              {!done && (
                <motion.span animate={{ opacity:[1,0,1] }} transition={{ duration:0.5, repeat:Infinity }}
                  style={{ color:"#00e5c8", marginLeft:2 }}>▍</motion.span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Tap hint */}
        <AnimatePresence>
          {done && !isLast && line.speaker !== "narasi" && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex justify-center flex-shrink-0">
              <motion.span animate={{ opacity:[0.2,0.55,0.2] }} transition={{ duration:1.6, repeat:Infinity }}
                className="font-cinzel text-[10px] tracking-[0.45em] uppercase"
                style={{ color:"rgba(0,229,200,0.35)" }}>
                ketuk untuk lanjut
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final button */}
        <AnimatePresence>
          {isLast && done && (
            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              className="flex justify-center flex-shrink-0 mt-2">
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                onClick={e => { e.stopPropagation(); onDone(); }}
                className="btn-spirit px-10 py-3 font-cinzel text-xs tracking-[0.35em] uppercase">
                ✦ &nbsp; Selesai &nbsp; ✦
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 px-8 pb-4 flex-shrink-0">
        <div className="w-full h-0.5 rounded-full" style={{ background:"rgba(0,229,200,0.1)" }}>
          <motion.div className="h-full rounded-full"
            animate={{ width:`${((idx+1)/STORY.length*100).toFixed(1)}%` }}
            transition={{ duration:0.35 }}
            style={{ background:"rgba(0,229,200,0.45)" }} />
        </div>
      </div>

      {/* ── Log Panel (modal) ── */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e => e.stopPropagation()}
            style={{ background:"rgba(4,4,10,0.95)", backdropFilter:"blur(6px)" }}>

            {/* Log header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom:"1px solid rgba(0,229,200,0.12)" }}>
              <div>
                <h3 className="font-cinzel text-sm tracking-[0.3em] uppercase" style={{ color:"#00e5c8" }}>
                  📜 Log Dialog
                </h3>
                <p className="font-gothic text-xs mt-0.5" style={{ color:"rgba(200,240,240,0.35)" }}>
                  {log.length} baris tersimpan
                </p>
              </div>
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                onClick={() => setShowLog(false)}
                className="font-cinzel text-xs px-4 py-2 rounded-lg tracking-wider"
                style={{ border:"1px solid rgba(0,229,200,0.2)", color:"rgba(0,229,200,0.6)" }}>
                Tutup ✕
              </motion.button>
            </div>

            {/* Log entries */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
              style={{ scrollbarWidth:"thin", scrollbarColor:"rgba(0,229,200,0.2) transparent" }}>
              {log.length === 0 ? (
                <p className="font-crimson italic text-center mt-8" style={{ color:"rgba(200,240,240,0.3)" }}>
                  Belum ada dialog yang tersimpan...
                </p>
              ) : log.map((entry, i) => {
                const c = CFG[entry.speaker];
                return (
                  <div key={i} className={`flex flex-col gap-0.5 ${c.align==="right" ? "items-end" : "items-start"}`}>
                    <span className="font-cinzel text-[10px] tracking-widest uppercase"
                      style={{ color:c.color, opacity:0.55 }}>
                      {c.label || "Narasi"}
                    </span>
                    <div className="max-w-[85%] px-3.5 py-2.5 rounded-xl"
                      style={{ background:c.bg || "rgba(20,20,30,0.6)", border:`1px solid ${c.color}20` }}>
                      <p className="font-crimson text-base leading-snug" style={{ color:c.color }}>
                        {entry.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
