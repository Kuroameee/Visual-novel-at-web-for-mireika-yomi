"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";

interface Question {
  q: string;
  options: string[];
  correct: number;
  reaction: string;
}

const questions: Question[] = [
  {
    q: "Dari alam mana Mireika Yomi berasal?",
    options: ["Alam mimpi", "Alam kegelapan", "Alam langit", "Alam manusia"],
    correct: 1,
    reaction: "Kamu mengenalku... jiwa ini bersinar sedikit lebih terang.",
  },
  {
    q: "Apa yang dicari Mireika di alam manusia?",
    options: ["Kekayaan", "Kekuatan", "Kehidupan", "Ketenangan"],
    correct: 2,
    reaction: "Ya. Aku ingin merasakan hidup kembali, meski hanya sebentar.",
  },
  {
    q: "Bagaimana cara Mireika kembali mendekati kehidupan?",
    options: [
      "Menghantui manusia",
      "Bermain game bersama manusia",
      "Menyerap jiwa",
      "Tidur abadi",
    ],
    correct: 1,
    reaction: "Bersamamu... itulah satu-satunya jalanku.",
  },
  {
    q: "Apa yang ada di kepala Mireika?",
    options: ["banddo tengkorak", "Paku tengkorak", "Topi sihir", "Bunga hitam"],
    correct: 1,
    reaction: "Ini adalah bagian dariku. Tanda dari alam tempatku berasal.",
  },
  {
    q: "Warna apa yang memancar dari Mireika?",
    options: ["Ungu dan hitam", "Merah dan abu", "Biru teal dan gelap", "Putih dan emas"],
    correct: 2,
    reaction: "Cahaya teal ini... adalah sisa kehidupan yang masih ada padaku.",
  },
];

interface SoulQuizProps {
  fragmentScore: number;
  onComplete: (totalScore: number) => void;
}

export default function SoulQuiz({ fragmentScore, onComplete }: SoulQuizProps) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const [phase, setPhase] = useState<"intro" | "quiz" | "done">("intro");
  const [soulLevel, setSoulLevel] = useState(fragmentScore * 8);

  const q = questions[qIdx];

  const answer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correct;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setSoulLevel((v) => Math.min(100, v + 12));
    }
    setShowReaction(true);
  };

  const next = () => {
    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
      setShowReaction(false);
    } else {
      setPhase("done");
    }
  };

  const totalScore = fragmentScore + correct;

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* BG */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(26,10,46,0.6) 0%, #04040a 70%)",
        }}
      />
      <ParticleCanvas count={30} color="#00e5c8" className="opacity-60" />

      {/* Soul level bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[rgba(0,229,200,0.08)]">
        <motion.div
          className="h-full soul-progress"
          animate={{ width: `${soulLevel}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Intro */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="text-center px-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="text-6xl mb-6"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,229,200,0.8))", animation: "floatGhost 4s ease-in-out infinite" }}
            >
              📜
            </div>
            <h2 className="font-cinzel text-2xl text-[var(--teal-glow)] text-glow mb-4 tracking-wider">
              Kontrak Jiwa
            </h2>
            <p className="font-crimson text-[var(--spirit-light)] text-lg italic leading-relaxed mb-3 opacity-80">
              &ldquo;Jika kamu sungguh-sungguh ingin membantuku... buktikan bahwa kamu mengenalku.&rdquo;
            </p>
            <p className="font-gothic text-[var(--spirit-light)] text-base leading-relaxed mb-8 opacity-60">
              Jawab {questions.length} pertanyaan tentang Mireika Yomi.
              Setiap jawaban benar memberi cahaya pada jiwaku.
            </p>
            <div className="font-cinzel text-xs text-[var(--teal-soft)] tracking-widest mb-6">
              Kepingan terkumpul: {fragmentScore}/{10} — Soul level: {soulLevel.toFixed(0)}%
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setPhase("quiz")}
              className="btn-spirit px-10 py-3 font-cinzel text-xs tracking-[0.3em] uppercase"
            >
              ✦ &nbsp; Mulai Kontrak &nbsp; ✦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz */}
      <AnimatePresence mode="wait">
        {phase === "quiz" && (
          <motion.div
            key={qIdx}
            className="w-full max-w-2xl px-6 flex flex-col items-center gap-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            {/* Question counter */}
            <div className="font-cinzel text-xs text-[rgba(200,240,240,0.4)] tracking-[0.4em] uppercase">
              Pertanyaan {qIdx + 1} / {questions.length}
            </div>

            {/* Question */}
            <div className="glow-border rounded-lg p-6 text-center w-full">
              <p className="font-crimson text-[var(--spirit-light)] text-xl italic leading-relaxed">
                {q.q}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-3 w-full">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOpt = i === q.correct;
                const showResult = answered;

                let borderColor = "rgba(0,229,200,0.2)";
                let bgColor = "rgba(26,10,46,0.8)";
                let textColor = "var(--spirit-light)";
                if (showResult && isCorrectOpt) {
                  borderColor = "rgba(0,229,200,0.8)";
                  bgColor = "rgba(0,100,80,0.3)";
                  textColor = "var(--teal-glow)";
                } else if (showResult && isSelected && !isCorrectOpt) {
                  borderColor = "rgba(200,0,30,0.6)";
                  bgColor = "rgba(100,0,20,0.3)";
                  textColor = "#e05050";
                }

                return (
                  <motion.button
                    key={i}
                    onClick={() => answer(i)}
                    disabled={answered}
                    whileHover={!answered ? { scale: 1.01 } : {}}
                    className="soul-card rounded-lg px-6 py-4 text-left font-crimson text-base transition-all"
                    style={{
                      border: `1px solid ${borderColor}`,
                      background: bgColor,
                      color: textColor,
                      cursor: answered ? "default" : "none",
                    }}
                  >
                    <span className="font-cinzel text-xs tracking-widest mr-3 opacity-50">
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {opt}
                    {showResult && isCorrectOpt && <span className="ml-2">✓</span>}
                    {showResult && isSelected && !isCorrectOpt && <span className="ml-2">✗</span>}
                  </motion.button>
                );
              })}
            </div>

            {/* Reaction */}
            <AnimatePresence>
              {showReaction && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="font-cinzel text-xs text-[var(--teal-glow)] tracking-widest mb-1">
                    ✦ Mireika
                  </div>
                  <p className="font-crimson text-[var(--spirit-light)] text-base italic opacity-80 mb-4">
                    &ldquo;{q.reaction}&rdquo;
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={next}
                    className="btn-spirit px-8 py-2 font-cinzel text-xs tracking-[0.3em] uppercase"
                  >
                    {qIdx < questions.length - 1 ? "▸ Lanjut" : "▸ Selesai"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            className="text-center px-8 max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <ParticleCanvas count={50} color="#00e5c8" />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-6xl mb-6"
              style={{ filter: "drop-shadow(0 0 20px rgba(0,229,200,0.9))" }}
            >
              ✨
            </motion.div>
            <h2 className="font-cinzel text-2xl text-[var(--teal-glow)] text-glow mb-3 tracking-wider">
              {correct >= 4 ? "Kontrak Tersegel" : correct >= 2 ? "Kontrak Diterima" : "Kontrak Lemah"}
            </h2>
            <p className="font-crimson text-[var(--spirit-light)] text-lg italic opacity-80 mb-6">
              {correct >= 4
                ? '"Kamu... benar-benar mengenalku. Terima kasih."'
                : correct >= 2
                ? '"Masih ada yang perlu kamu pelajari, tapi aku percaya padamu."'
                : '"Aku yakin... kamu akan mengenalku lebih baik seiring waktu."'}
            </p>
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="font-cinzel text-3xl text-[var(--teal-glow)] text-glow-strong">{correct}/{questions.length}</div>
                <div className="font-cinzel text-xs text-[rgba(200,240,240,0.4)] tracking-widest mt-1">Quiz</div>
              </div>
              <div className="w-px h-10 bg-[rgba(0,229,200,0.2)]" />
              <div className="text-center">
                <div className="font-cinzel text-3xl text-[var(--teal-glow)] text-glow-strong">{fragmentScore}/10</div>
                <div className="font-cinzel text-xs text-[rgba(200,240,240,0.4)] tracking-widest mt-1">Kepingan</div>
              </div>
              <div className="w-px h-10 bg-[rgba(0,229,200,0.2)]" />
              <div className="text-center">
                <div className="font-cinzel text-3xl text-[var(--teal-glow)] text-glow-strong">{Math.round(soulLevel)}%</div>
                <div className="font-cinzel text-xs text-[rgba(200,240,240,0.4)] tracking-widest mt-1">Soul</div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => onComplete(totalScore)}
              className="btn-spirit px-10 py-3 font-cinzel text-xs tracking-[0.3em] uppercase"
            >
              ✦ &nbsp; Menuju Akhir &nbsp; ✦
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
