"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LangProvider } from "@/components/ui/LangContext";

const GhostCursor        = dynamic(() => import("@/components/ui/CustomCursor"),           { ssr:false });
const MainMenu           = dynamic(() => import("@/components/scenes/MainMenu"),           { ssr:false });
const VNScene            = dynamic(() => import("@/components/scenes/VNScene"),            { ssr:false });
const ForestWalkScene    = dynamic(() => import("@/components/scenes/ForestWalkScene"),    { ssr:false });
const ConversationScene  = dynamic(() => import("@/components/scenes/ConversationScene"),  { ssr:false });
const BridgeScene        = dynamic(() => import("@/components/scenes/BridgeScene"),        { ssr:false });
const FragmentsGame      = dynamic(() => import("@/components/games/FragmentsGame"),       { ssr:false });
const SoulQuiz           = dynamic(() => import("@/components/games/SoulQuiz"),            { ssr:false });
const IncomingCallScene  = dynamic(() => import("@/components/scenes/IncomingCallScene"),  { ssr:false });
const PhoneMockupScene   = dynamic(() => import("@/components/scenes/PhoneMockupScene"),   { ssr:false });
const EndingScene        = dynamic(() => import("@/components/scenes/EndingScene"),        { ssr:false });
const BonusStoryScene    = dynamic(() => import("@/components/scenes/BonusStoryScene"),    { ssr:false });
const SpamScene          = dynamic(() => import("@/components/scenes/SpamScene"),          { ssr:false });

type Scene =
  | "menu" | "vn" | "forestwalk" | "conversation"
  | "bridge-game" | "fragments" | "bridge-quiz"
  | "quiz" | "incoming-call" | "phone" | "ending"
  | "bonus-story" | "minigame-only" | "spam";

function Game() {
  const [scene, setScene]             = useState<Scene>("menu");
  const [totalScore, setTotalScore]   = useState(0);
  const audioRef = { v: false };

  const startAudio = () => {
    if (audioRef.v) return; audioRef.v = true;
    try { const a = new Audio("/assets/bgm.mp3"); a.loop=true; a.volume=0.35; a.play().catch(()=>{}); } catch {}
  };

  const go = (s: Scene) => setScene(s);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#04040a]">
      <div className="noise-overlay" /><div className="scan-line" />
      <GhostCursor />

      <AnimatePresence mode="wait">

        {scene==="menu" && <Wrap key="menu">
          <MainMenu
            onEnterStory={() => { startAudio(); go("vn"); }}
            onMinigame={() => { startAudio(); go("minigame-only"); }}
            onSpam={() => go("spam")}
          />
        </Wrap>}

        {scene==="vn" && <Wrap key="vn"><VNScene onComplete={() => go("forestwalk")} /></Wrap>}
        {scene==="forestwalk" && <Wrap key="fw"><ForestWalkScene onComplete={() => go("conversation")} /></Wrap>}
        {scene==="conversation" && <Wrap key="cv"><ConversationScene onComplete={() => go("bridge-game")} /></Wrap>}

        {scene==="bridge-game" && <Wrap key="bg">
          <BridgeScene
            message="Labirin ini penuh dengan kepingan jiwaku."
            subtext="Bayangan-bayangan gelap berkeliaran di sana. Tolong berhati-hati."
            buttonLabel="Masuki Labirin"
            onContinue={() => go("fragments")}
          />
        </Wrap>}

        {scene==="fragments" && <Wrap key="frag">
          <FragmentsGame onComplete={() => go("bridge-quiz")} />
        </Wrap>}

        {scene==="bridge-quiz" && <Wrap key="bq">
          <BridgeScene
            message="Kamu berhasil mengumpulkan kepingan jiwaku... Terima kasih."
            subtext="Satu langkah terakhir untuk menyempurnakan kontrak kita."
            buttonLabel="Lanjutkan Kontrak"
            onContinue={() => go("quiz")}
          />
        </Wrap>}

        {scene==="quiz" && <Wrap key="quiz">
          <SoulQuiz fragmentScore={0} onComplete={t => { setTotalScore(t); go("incoming-call"); }} />
        </Wrap>}

        {scene==="incoming-call" && <Wrap key="call">
          <IncomingCallScene onAccept={() => go("phone")} onReject={() => go("ending")} />
        </Wrap>}

        {scene==="phone" && <Wrap key="phone"><PhoneMockupScene onComplete={() => go("ending")} /></Wrap>}

        {scene==="ending" && <Wrap key="end">
          <EndingScene
            totalScore={totalScore}
            onBonusStory={() => go("bonus-story")}
            onReplay={() => { setTotalScore(0); go("menu"); }}
          />
        </Wrap>}

        {scene==="bonus-story" && <Wrap key="bonus"><BonusStoryScene onDone={() => go("menu")} /></Wrap>}

        {scene==="minigame-only" && <Wrap key="mini">
          <FragmentsGame standalone onComplete={() => go("menu")} />
        </Wrap>}

        {scene==="spam" && <Wrap key="spam"><SpamScene onBack={() => go("menu")} /></Wrap>}

      </AnimatePresence>

      {process.env.NODE_ENV==="development" && (
        <div className="fixed bottom-2 right-2 font-cinzel text-[10px] z-50 pointer-events-none"
          style={{ color:"rgba(0,229,200,0.15)" }}>{scene}</div>
      )}
    </main>
  );
}

export default function Home() {
  return <LangProvider><Game /></LangProvider>;
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="absolute inset-0"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:0.6 }}>
      {children}
    </motion.div>
  );
}
