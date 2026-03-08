"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

interface VNSlide {
  bg: string;
  lines: string[];
  dimLevel?: number;
  particleColor?: string;
  typeSpeed?: number;
}

const SLIDES: VNSlide[] = [
  { bg:"/assets/forest1.png", dimLevel:0.88, particleColor:"#004440", typeSpeed:80,
    lines:["Gelap.","Hanya gelap."] },
  { bg:"/assets/forest1.png", dimLevel:0.78, particleColor:"#004440", typeSpeed:52,
    lines:["Sudah berapa lama aku di sini?","Satu tahun? Satu abad?","Aku bahkan tidak bisa merasakannya lagi."] },
  { bg:"/assets/forest1.png", dimLevel:0.70, particleColor:"#004440", typeSpeed:50,
    lines:["Alam ini tidak pernah berubah.","Tidak ada angin. Tidak ada suara. Tidak ada apapun.","Hanya aku, dan kesunyian yang tak pernah berakhir."] },
  { bg:"/assets/forest1.png", dimLevel:0.62, particleColor:"#004a45", typeSpeed:50,
    lines:["Apakah ini yang namanya... tiada?","Aku pernah mendengar tentang alam ini semasa hidup.","Tapi kenyataannya jauh lebih sepi dari yang aku bayangkan."] },
  { bg:"/assets/forest2.png", dimLevel:0.55, particleColor:"#006a60", typeSpeed:62,
    lines:["Tapi hari ini...","Ada sesuatu yang berbeda."] },
  { bg:"/assets/forest2.png", dimLevel:0.46, particleColor:"#009080", typeSpeed:46,
    lines:["Cahaya itu memancar dari kejauhan.","Menerangi alam yang sunyi dan gelap ini.","Untuk pertama kalinya... tempat ini tidak lagi terasa kosong."] },
  { bg:"/assets/forest2.png", dimLevel:0.40, particleColor:"#00b8a0", typeSpeed:55,
    lines:["Indah...","Cahaya seperti ini... aku hampir lupa rasanya."] },
  { bg:"/assets/forest2.png", dimLevel:0.36, particleColor:"#00c8b0", typeSpeed:48,
    lines:["Harapan muncul dalam jiwa yang sudah tiada.","Perasaan aneh yang sudah lama tidak aku rasakan."] },
  { bg:"/assets/forest2.png", dimLevel:0.30, particleColor:"#00d8b8", typeSpeed:46,
    lines:["Apakah mungkin ini jalanku?","Untuk kembali mendekati kehidupan...","Meski hanya sebagai bayangan, meski hanya untuk sejenak."] },
  { bg:"/assets/forest2.png", dimLevel:0.26, particleColor:"#00e5c8", typeSpeed:44,
    lines:["Bagaimana jika aku melangkah?","Apa yang akan terjadi di balik cahaya itu?","Akankah aku benar-benar bebas... atau berubah menjadi sesuatu yang berbeda?"] },
  { bg:"/assets/forest1.png", dimLevel:0.50, particleColor:"#009080", typeSpeed:80,
    lines:["...","Satu langkah."] },
  { bg:"/assets/forest1.png", dimLevel:0.44, particleColor:"#00b0a0", typeSpeed:48,
    lines:["Batas antara dua alam itu rapuh.","Seperti menyentuh air — terasa asing, namun tidak menolak."] },
  { bg:"/assets/forest2.png", dimLevel:0.32, particleColor:"#00d0b8", typeSpeed:54,
    lines:["Dan kemudian...","Aku merasakannya.","Kehangatan. Kebisingan. Kehidupan."] },
  { bg:"/assets/forest2.png", dimLevel:0.26, particleColor:"#00e5c8", typeSpeed:46,
    lines:["Ada seseorang di sini.","Kehadiranmu... nyata sekali.","Kamu bisa melihatku? Mendengarku?"] },
  { bg:"/assets/forest2.png", dimLevel:0.20, particleColor:"#00e5c8", typeSpeed:44,
    lines:["Tolong jangan pergi dulu...","Aku hanya ingin tahu satu hal.","Maukah kamu bermain denganku?"] },
];

interface VNSceneProps { onComplete: () => void; }

export default function VNScene({ onComplete }: VNSceneProps) {
  const [slideIdx, setSlideIdx]         = useState(0);
  const [lineIdx, setLineIdx]           = useState(0);
  const [charIdx, setCharIdx]           = useState(0);
  const [revealedLines, setRevealedLines] = useState<string[]>([]);
  const [canAdvance, setCanAdvance]     = useState(false);
  const [glitching, setGlitching]       = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide   = SLIDES[slideIdx];
  const current = slide.lines[lineIdx] ?? "";
  const speed   = slide.typeSpeed ?? 50;
  const displayed = current.slice(0, charIdx);
  const done      = charIdx >= current.length;

  // Typewriter tick
  useEffect(() => {
    if (done) return;
    timerRef.current = setTimeout(() => setCharIdx((i) => i + 1), speed);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [charIdx, done, speed]);

  // When line finishes → short pause → next line or allow advance
  useEffect(() => {
    if (!done) return;
    if (lineIdx < slide.lines.length - 1) {
      const t = setTimeout(() => {
        setRevealedLines((p) => [...p, current]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 340);
      return () => clearTimeout(t);
    } else {
      setCanAdvance(true);
    }
  }, [done, lineIdx, slide.lines.length, current]);

  // Reset on slide change
  useEffect(() => {
    setLineIdx(0); setCharIdx(0);
    setRevealedLines([]); setCanAdvance(false);
  }, [slideIdx]);

  const triggerGlitch = useCallback(() => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 420);
  }, []);

  const advance = useCallback(() => {
    if (!done) {
      // Skip + glitch effect
      triggerGlitch();
      if (timerRef.current) clearTimeout(timerRef.current);
      // Instantly reveal all lines
      setRevealedLines(slide.lines.slice(0, slide.lines.length - 1));
      setLineIdx(slide.lines.length - 1);
      setCharIdx(slide.lines[slide.lines.length - 1].length);
      setCanAdvance(true);
      return;
    }
    if (!canAdvance) return;
    if (slideIdx < SLIDES.length - 1) {
      setSlideIdx((i) => i + 1);
    } else {
      onComplete();
    }
  }, [done, canAdvance, slideIdx, slide.lines, triggerGlitch, onComplete]);

  const progress = ((slideIdx + 1) / SLIDES.length) * 100;

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={advance}
    >
      {/* ── Background ── */}
      <AnimatePresence mode="wait">
        <motion.div key={`bg-${slideIdx}`} className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}>
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 45% 55%, rgba(0,110,100,0.18) 0%, #04040a 70%)`,
          }} />
          <Image src={slide.bg} alt="" fill className="object-cover" style={{ opacity: 0.62 }} priority onError={() => {}} />
          <div className="absolute inset-0" style={{ background: `rgba(4,4,10,${slide.dimLevel ?? 0.5})` }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(4,4,10,1) 0%, rgba(4,4,10,0.1) 45%, transparent 100%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(4,4,10,0.5) 100%)",
          }} />
        </motion.div>
      </AnimatePresence>

      <ParticleCanvas count={16 + slideIdx} color={slide.particleColor ?? "#00e5c8"} className="opacity-50" />

      {/* Glow orb second half */}
      {slideIdx >= 4 && (
        <motion.div className="absolute pointer-events-none" style={{ top:"28%", left:"47%" }}
          initial={{ opacity:0 }} animate={{ opacity:1, y:[-10,10,-10] }}
          transition={{ opacity:{ duration:1 }, y:{ duration:7, repeat:Infinity, ease:"easeInOut" } }}>
          <div style={{
            width:`${52+(slideIdx-4)*13}px`, height:`${52+(slideIdx-4)*13}px`,
            borderRadius:"50%",
            background:"radial-gradient(circle, rgba(0,229,200,0.28) 0%, transparent 70%)",
          }} />
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background:"rgba(0,229,200,0.07)" }}>
        <motion.div className="h-full" animate={{ width:`${progress}%` }} transition={{ duration:0.5 }}
          style={{ background:"linear-gradient(90deg, rgba(0,229,200,0.25), rgba(0,229,200,0.65))" }} />
      </div>

      {/* ── FIXED TEXT BOX — centered text ── */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height:"200px", pointerEvents:"none" }}>
        {/* Gradient bg */}
        <div className="absolute inset-0" style={{
          background:"linear-gradient(to top, rgba(4,4,10,0.97) 0%, rgba(4,4,10,0.70) 72%, transparent 100%)",
        }} />

        {/* Content — centered */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-6 overflow-hidden text-center"
          style={{ height:"200px" }}>

          {/* Glitch overlay */}
          <AnimatePresence>
            {glitching && (
              <motion.div
                className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Multiple displaced copies of text */}
                {[
                  { top:"22%", left:"2px",  color:"rgba(255,0,60,0.5)",   clip:"polygon(0 0,100% 0,100% 30%,0 30%)" },
                  { top:"22%", left:"-2px", color:"rgba(0,229,200,0.5)",  clip:"polygon(0 40%,100% 40%,100% 65%,0 65%)" },
                  { top:"22%", left:"3px",  color:"rgba(200,200,255,0.4)", clip:"polygon(0 70%,100% 70%,100% 90%,0 90%)" },
                ].map((g, i) => (
                  <motion.div key={i} className="absolute w-full"
                    style={{ top:g.top, left:g.left, clipPath:g.clip }}
                    animate={{ x:[0,-3,3,-2,1,0] }}
                    transition={{ duration:0.12*(i+1), repeat:3 }}>
                    <p className="font-crimson italic text-center"
                      style={{ fontSize:"1.15rem", color:g.color }}>
                      {[...revealedLines, displayed].join(" · ")}
                    </p>
                  </motion.div>
                ))}
                {/* Horizontal scan lines */}
                {[30,55,75].map((top) => (
                  <motion.div key={top} className="absolute left-0 right-0 h-px"
                    style={{ top:`${top}%`, background:"rgba(0,229,200,0.3)" }}
                    animate={{ opacity:[0,0.8,0], x:[-10,10,-5,0] }}
                    transition={{ duration:0.15, repeat:2 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Revealed lines (dimmer) */}
          {revealedLines.map((line, i) => (
            <motion.p key={`r-${slideIdx}-${i}`}
              className="font-crimson italic leading-snug mb-1"
              style={{ fontSize:"1.15rem", color:"rgba(200,240,240,0.55)" }}>
              {line}
            </motion.p>
          ))}

          {/* Active line */}
          <p className="font-crimson italic leading-snug mb-1"
            style={{ fontSize:"1.15rem", color:"rgba(200,240,240,0.95)" }}>
            {displayed}
            {!done && (
              <motion.span
                animate={{ opacity:[1,0,1] }} transition={{ duration:0.8, repeat:Infinity }}
                style={{ color:"#00e5c8", marginLeft:"1px" }}>|</motion.span>
            )}
          </p>

          {/* Advance hint */}
          <AnimatePresence>
            {canAdvance && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ delay:0.3 }}>
                <motion.span animate={{ opacity:[0.25,0.75,0.25] }}
                  transition={{ duration:1.6, repeat:Infinity }}
                  className="font-cinzel text-[10px] tracking-[0.4em] uppercase"
                  style={{ color:"rgba(0,229,200,0.45)" }}>
                  {slideIdx < SLIDES.length - 1 ? "▸ lanjut" : "▸ mulai"}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
