"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/components/ui/LangContext";

// ── Maze 19×15: 1=wall/tree, 0=path ──────────────────────────────────
const MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
  [1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,0,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,0,1],
  [1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
const ROWS = 15, COLS = 19;

// ALL path cells = fragment positions (excluding player & ghost starts)
const FRAGMENT_POSITIONS: [number,number][] = [
  [1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,10],[1,11],[1,12],[1,13],[1,14],[1,15],[1,16],
  [2,1],[2,4],[2,8],[2,10],[2,14],[2,17],
  [3,1],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],[3,11],[3,12],[3,13],[3,14],[3,17],
  [4,1],[4,2],[4,3],[4,4],[4,6],[4,8],[4,9],[4,10],[4,12],[4,14],[4,15],[4,16],[4,17],
  [5,3],[5,6],[5,8],[5,10],[5,12],[5,15],
  [6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[6,15],[6,16],[6,17],
  [7,1],[7,3],[7,6],[7,8],[7,10],[7,12],[7,15],[7,17],
  [8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[8,15],[8,16],[8,17],
  [9,3],[9,6],[9,8],[9,10],[9,12],[9,15],
  [10,1],[10,2],[10,3],[10,4],[10,6],[10,8],[10,9],[10,10],[10,12],[10,14],[10,15],[10,16],[10,17],
  [11,1],[11,4],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],[11,11],[11,12],[11,13],[11,14],[11,17],
  [12,1],[12,4],[12,8],[12,10],[12,14],[12,17],
  [13,2],[13,3],[13,4],[13,5],[13,6],[13,7],[13,8],[13,10],[13,11],[13,12],[13,13],[13,14],[13,15],[13,16],
];
const TOTAL_DOTS = FRAGMENT_POSITIONS.length;

// Build initial dot set
function makeDots(): Set<string> {
  return new Set(FRAGMENT_POSITIONS.map(([r,c]) => `${r},${c}`));
}

const PLAYER_START: [number,number] = [7, 9];
const GHOST_STARTS: [number,number][] = [[1,1],[1,17],[13,1],[13,17]];

const GAME_TIME      = 180;
const PLAYER_SPEED   = 5.5;   // cells/sec
const GHOST_SPEED    = 2.2;   // normal cruise speed
const GHOST_SPEED_CHASE = 4.0; // speed when near player — aggressive!
const CHASE_RADIUS   = 5;     // cells distance to trigger chase mode

interface Entity {
  row: number; col: number; px: number; py: number;
  targetRow: number; targetCol: number;
  progress: number; speed: number;
}

function isPath(r: number, c: number) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS && MAZE[r][c] === 0;
}

// BFS shortest path first step
function bfsStep(fr: number, fc: number, tr: number, tc: number): [number,number] | null {
  if (fr === tr && fc === tc) return null;
  type Node = [number,number,number,number]; // r,c,fdr,fdc
  const q: Node[] = [[fr,fc,-1,-1]];
  const v = new Set<string>([`${fr},${fc}`]);
  const dirs: [number,number][] = [[-1,0],[1,0],[0,-1],[0,1]];
  while (q.length) {
    const [r,c,fdr,fdc] = q.shift()!;
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc, key=`${nr},${nc}`;
      if (!isPath(nr,nc) || v.has(key)) continue;
      v.add(key);
      const sd=fdr===-1?dr:fdr, sc=fdc===-1?dc:fdc;
      if (nr===tr && nc===tc) return [sd,sc];
      q.push([nr,nc,sd,sc]);
    }
  }
  return null;
}

// ── Tree drawing ───────────────────────────────────────────────────────
function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number, cs: number, seed: number, ts: number) {
  const rng = (n: number) => { const x2 = Math.sin(seed*n+7)*10000; return x2-Math.floor(x2); };
  const cx  = x + cs/2, cy = y + cs/2;
  const sway = Math.sin(ts*0.0007 + seed*1.4) * cs * 0.03;

  ctx.save();
  // Trunk
  ctx.beginPath();
  ctx.moveTo(cx-cs*0.07, cy+cs*0.45);
  ctx.lineTo(cx+cs*0.07, cy+cs*0.45);
  ctx.lineTo(cx+cs*0.04+sway, cy);
  ctx.lineTo(cx-cs*0.04+sway, cy);
  ctx.closePath();
  ctx.fillStyle = `rgba(${30+rng(3)*10|0},${18+rng(4)*8|0},${10+rng(5)*5|0},0.9)`;
  ctx.fill();

  // Foliage layers (2-3 triangles per tree)
  const layers = 2 + (rng(1) > 0.5 ? 1 : 0);
  for (let i = 0; i < layers; i++) {
    const sz = cs * (0.44 - i * 0.08);
    const ty = cy - cs*0.05 - i*cs*0.18 + sway;
    const gl = `rgba(${0+rng(i+6)*15|0},${rng(i+2)>0.4?55:38+rng(i+7)*20|0},${rng(i+3)>0.5?42:28+rng(i+8)*15|0},${0.75+rng(i+1)*0.2})`;
    ctx.beginPath();
    ctx.moveTo(cx+sway, ty - sz*0.9);
    ctx.lineTo(cx - sz*0.85+sway*0.5, ty + sz*0.5);
    ctx.lineTo(cx + sz*0.85+sway*0.5, ty + sz*0.5);
    ctx.closePath();
    ctx.fillStyle = gl;
    ctx.shadowBlur = 6; ctx.shadowColor = "rgba(0,180,140,0.35)";
    ctx.fill();
    ctx.shadowBlur = 0;
    // Dark outline
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Teal leaf glow on top
  ctx.beginPath();
  ctx.arc(cx+sway, cy - cs*0.35, cs*0.12, 0, Math.PI*2);
  ctx.fillStyle = `rgba(0,229,200,${0.06+rng(9)*0.06})`;
  ctx.fill();
  ctx.restore();
}

// ── Ghost drawing ──────────────────────────────────────────────────────
function drawGhost(ctx: CanvasRenderingContext2D, px: number, py: number, size: number,
  bodyColor: string, _glowColor: string, ts: number, bobSeed: number) {
  // Simplified ghost — no shadowBlur, no ctx.save/restore for performance
  const r   = size * 0.42;
  const bob = Math.sin(ts * 0.008 + bobSeed) * size * 0.04;
  const cy  = py + bob;
  // Body
  ctx.beginPath();
  ctx.arc(px, cy - r*0.12, r, Math.PI, 0);
  const bw = (r*2)/3;
  for (let i = 0; i < 3; i++) {
    const bx = px + r - i*bw - bw/2;
    ctx.quadraticCurveTo(bx, cy + r*0.55, bx - bw/2, cy + r*0.18);
  }
  ctx.closePath();
  ctx.fillStyle = bodyColor;
  ctx.fill();
  // Eyes — two simple dots
  const er = r * 0.16;
  [-0.23, 0.23].forEach((ox) => {
    ctx.beginPath();
    ctx.arc(px+r*ox, cy-r*0.16, er*1.1, 0, Math.PI*2);
    ctx.fillStyle = "rgba(0,0,0,0.85)"; ctx.fill();
  });
}

// ── Pre-render static maze once (trees + floor) to offscreen canvas ──
let _mazeOffscreen: HTMLCanvasElement | null = null;
let _mazeOffscreenCs = 0;

function prerenderMaze(cs: number, totalW: number, totalH: number) {
  if (_mazeOffscreenCs === cs && _mazeOffscreen) return; // already done for this cell size
  const offscreen = document.createElement("canvas");
  offscreen.width  = totalW;
  offscreen.height = totalH;
  const ctx = offscreen.getContext("2d")!;
  const offX = Math.floor((totalW - COLS * cs) / 2);
  const offY = Math.floor((totalH - 56 - ROWS * cs) / 2) + 56;

  ctx.fillStyle = "#030910";
  ctx.fillRect(0, 0, totalW, totalH);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cx = offX + c * cs, cy = offY + r * cs;
      if (MAZE[r][c] === 1) {
        ctx.fillStyle = "#030a06";
        ctx.fillRect(cx, cy, cs, cs);
        drawTreeStatic(ctx, cx, cy, cs, r * 100 + c);
      } else {
        ctx.fillStyle = "rgba(2,12,18,0.9)";
        ctx.fillRect(cx, cy, cs, cs);
      }
    }
  }
  _mazeOffscreen = offscreen;
  _mazeOffscreenCs = cs;
}

// Static tree (no sway — for pre-render)
function drawTreeStatic(ctx: CanvasRenderingContext2D, x: number, y: number, cs: number, seed: number) {
  const rng = (n: number) => { const v = Math.sin(seed * n + 7) * 10000; return v - Math.floor(v); };
  const cx = x + cs / 2, cy = y + cs / 2;
  ctx.save();
  // Trunk
  ctx.beginPath();
  ctx.moveTo(cx - cs * 0.07, cy + cs * 0.45);
  ctx.lineTo(cx + cs * 0.07, cy + cs * 0.45);
  ctx.lineTo(cx + cs * 0.04, cy);
  ctx.lineTo(cx - cs * 0.04, cy);
  ctx.closePath();
  ctx.fillStyle = `rgba(${28 + (rng(3) * 10) | 0},${16 + (rng(4) * 8) | 0},10,0.9)`;
  ctx.fill();
  // Foliage layers
  const layers = 2 + (rng(1) > 0.5 ? 1 : 0);
  for (let i = 0; i < layers; i++) {
    const sz = cs * (0.44 - i * 0.08);
    const ty = cy - cs * 0.05 - i * cs * 0.18;
    const g = rng(i + 2) > 0.4 ? 55 + (rng(i + 7) * 20) | 0 : 38 + (rng(i + 7) * 20) | 0;
    const b = rng(i + 3) > 0.5 ? 42 + (rng(i + 8) * 15) | 0 : 28 + (rng(i + 8) * 15) | 0;
    ctx.beginPath();
    ctx.moveTo(cx, ty - sz * 0.9);
    ctx.lineTo(cx - sz * 0.85, ty + sz * 0.5);
    ctx.lineTo(cx + sz * 0.85, ty + sz * 0.5);
    ctx.closePath();
    ctx.fillStyle = `rgba(0,${g},${b},${0.78 + rng(i + 1) * 0.18})`;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
  ctx.restore();
}

interface FragmentsGameProps { onComplete: () => void; standalone?: boolean; }

export default function FragmentsGame({ onComplete, standalone }: FragmentsGameProps) {
  const { t } = useLang();
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef      = useRef<number>(0);
  const lastTsRef    = useRef<number>(0);
  const keysRef      = useRef<Set<string>>(new Set());
  const queuedDir    = useRef<[number,number] | null>(null);
  const frameRef     = useRef(0);
  const nearGhostRef  = useRef(false);
  const csRef        = useRef(40);
  const mazeCanvasRef = useRef<HTMLCanvasElement | null>(null); // pre-rendered maze

  // Stable game state in refs
  const playerRef    = useRef<Entity>({ row:PLAYER_START[0], col:PLAYER_START[1], px:0, py:0, targetRow:PLAYER_START[0], targetCol:PLAYER_START[1], progress:1, speed:PLAYER_SPEED });
  const ghostsRef    = useRef<Entity[]>(GHOST_STARTS.map(([r,c],i) => ({ row:r, col:c, px:0, py:0, targetRow:r, targetCol:c, progress:1, speed:GHOST_SPEED*(0.85+i*0.08) })));
  const dotsRef      = useRef<Set<string>>(makeDots());
  const collectedRef = useRef(0);
  const caughtRef    = useRef(false);
  const phaseRef     = useRef<"countdown"|"play"|"end">("countdown");
  // treeSeedRef removed — maze pre-rendered once



  // React UI state
  const [phase, setPhase]           = useState<"countdown"|"play"|"end">("countdown");
  const [collected, setCollected]   = useState(0);
  const [timeLeft, setTimeLeft]     = useState(GAME_TIME);
  const [caught, setCaught]         = useState(false);
  const [countdownVal, setCdVal]    = useState(3);
  const [nearGhost, setNearGhost]   = useState(false);

  // Keyboard
  useEffect(() => {
    const dirMap: Record<string,[number,number]> = {
      ArrowUp:[-1,0], w:[-1,0], W:[-1,0],
      ArrowDown:[1,0], s:[1,0], S:[1,0],
      ArrowLeft:[0,-1], a:[0,-1], A:[0,-1],
      ArrowRight:[0,1], d:[0,1], D:[0,1],
    };
    const dn = (e: KeyboardEvent) => { keysRef.current.add(e.key); if (dirMap[e.key]) queuedDir.current = dirMap[e.key]; };
    const up = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  // Canvas click → swipe direction
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== "play") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cs = csRef.current;
    const cw = canvasRef.current!.width, ch = canvasRef.current!.height;
    const offX = (cw - COLS*cs)/2, offY = (ch - ROWS*cs)/2;
    const mx = e.clientX-rect.left-offX, my = e.clientY-rect.top-offY;
    const p = playerRef.current;
    const pcx = p.col*cs+cs/2, pcy = p.row*cs+cs/2;
    const dx = mx-pcx, dy = my-pcy;
    if (Math.abs(dx) > Math.abs(dy)) queuedDir.current = [0, dx>0?1:-1];
    else queuedDir.current = [dy>0?1:-1, 0];
  }, []);

  // Resize
  useEffect(() => {
    const resize = () => {
      const div = containerRef.current;
      if (!div) return;
      const w = div.clientWidth, h = div.clientHeight - 56;
      const cs = Math.max(24, Math.min(Math.floor(w/COLS), Math.floor(h/ROWS)));
      csRef.current = cs;
      [playerRef.current, ...ghostsRef.current].forEach((e) => {
        e.px = e.col*cs + cs/2; e.py = e.row*cs + cs/2;
      });
      if (canvasRef.current) {
        canvasRef.current.width  = div.clientWidth;
        canvasRef.current.height = div.clientHeight;
      }
      // Pre-render static maze (walls + floor) to offscreen canvas
      _mazeOffscreenCs = 0; // force re-render on resize
      prerenderMaze(cs, div.clientWidth, div.clientHeight);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdownVal <= 0) { setPhase("play"); phaseRef.current = "play"; return; }
    const t = setTimeout(() => setCdVal((v) => v-1), 1000);
    return () => clearTimeout(t);
  }, [countdownVal, phase]);

  // Timer
  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setTimeLeft((v) => {
      if (v <= 1) { onComplete(); }
      return Math.max(0, v-1);
    }), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // ── Main loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "play") return;

    const DIRS: Record<string,[number,number]> = {
      ArrowUp:[-1,0], w:[-1,0], W:[-1,0],
      ArrowDown:[1,0], s:[1,0], S:[1,0],
      ArrowLeft:[0,-1], a:[0,-1], A:[0,-1],
      ArrowRight:[0,1], d:[0,1], D:[0,1],
    };

    const loop = (ts: number) => {
      const dt = Math.min(ts - (lastTsRef.current||ts), 50);
      lastTsRef.current = ts;
      frameRef.current++;
      const cs = csRef.current;

      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext("2d");
      if (!canvas || !ctx) { animRef.current = requestAnimationFrame(loop); return; }

      const cw = canvas.width, ch = canvas.height;
      const offX = Math.floor((cw - COLS*cs)/2);
      const offY = Math.floor((ch - 56 - ROWS*cs)/2) + 56;

      // ── Player movement ──
      const p = playerRef.current;
      if (p.progress < 1) {
        p.progress = Math.min(1, p.progress + (p.speed*dt)/1000);
        p.px = (p.col + (p.targetCol-p.col)*p.progress)*cs + cs/2;
        p.py = (p.row + (p.targetRow-p.row)*p.progress)*cs + cs/2;
      } else {
        p.row = p.targetRow; p.col = p.targetCol;
        // Collect dot
        const key = `${p.row},${p.col}`;
        if (dotsRef.current.has(key)) {
          dotsRef.current.delete(key);
          collectedRef.current++;
          setCollected(collectedRef.current);
          if (collectedRef.current >= TOTAL_DOTS) { onComplete(); return; }
        }
        // Move
        const tryDir = (dr: number, dc: number) => {
          if (isPath(p.row+dr, p.col+dc)) {
            p.targetRow = p.row+dr; p.targetCol = p.col+dc; p.progress = 0; return true;
          }
          return false;
        };
        const q = queuedDir.current;
        if (q && tryDir(q[0],q[1])) { queuedDir.current = null; }
        else {
          for (const [k, dir] of Object.entries(DIRS))
            if (keysRef.current.has(k)) { if (tryDir(dir[0],dir[1])) break; }
        }
      }

      // ── Ghost movement — aggressive BFS every 8 frames ──
      let near = false;
      ghostsRef.current.forEach((g, gi) => {
        if (g.progress < 1) {
          g.progress = Math.min(1, g.progress + (g.speed*dt)/1000);
          g.px = (g.col + (g.targetCol-g.col)*g.progress)*cs + cs/2;
          g.py = (g.row + (g.targetRow-g.row)*g.progress)*cs + cs/2;
        } else {
          g.row = g.targetRow; g.col = g.targetCol;
          // Manhattan distance to player
          const dist = Math.abs(g.row - p.row) + Math.abs(g.col - p.col);
          const chasing = dist <= CHASE_RADIUS;
          // Chase mode: BFS every frame + fast speed
          // Patrol mode: BFS every 40 frames + 30% random wander
          if (chasing || frameRef.current % 40 === gi*10) {
            const dirs: [number,number][] = [[-1,0],[1,0],[0,-1],[0,1]];
            const useRandom = !chasing && Math.random() < 0.30;
            if (useRandom) {
              const valid = dirs.filter(([dr,dc]) => isPath(g.row+dr, g.col+dc));
              if (valid.length) {
                const [dr,dc] = valid[Math.floor(Math.random()*valid.length)];
                g.targetRow = g.row+dr; g.targetCol = g.col+dc; g.progress = 0;
              }
            } else {
              const step = bfsStep(g.row, g.col, p.row, p.col);
              if (step) {
                const nr = g.row+step[0], nc = g.col+step[1];
                if (isPath(nr,nc)) { g.targetRow = nr; g.targetCol = nc; g.progress = 0; }
              }
            }
          }
          // Update speed based on chase mode
          g.speed = chasing ? GHOST_SPEED_CHASE : GHOST_SPEED * (0.85 + gi * 0.08);
        }
        const d = Math.hypot(g.px-p.px, g.py-p.py);
        if (d < cs*0.72 && !caughtRef.current) { caughtRef.current = true; setCaught(true); setTimeout(() => { onComplete(); }, 900); }
        if (d < cs*2.8) near = true;
      });
      // Only update React state if value changed (prevents 60fps re-renders)
      if (near !== nearGhostRef.current) {
        nearGhostRef.current = near;
        setNearGhost(near);
      }

      // ── Draw ──
      ctx.clearRect(0, 0, cw, ch);

      // Blit pre-rendered maze (1 drawImage instead of 100+ draw calls)
      if (_mazeOffscreen) {
        ctx.drawImage(_mazeOffscreen, 0, 0);
      } else {
        ctx.fillStyle = "#030910";
        ctx.fillRect(0, 0, cw, ch);
      }

      // Dots on path
      // Draw dots in batches by color for performance
      ctx.shadowBlur = 6; ctx.shadowColor = "#00e5c8";
      dotsRef.current.forEach((key) => {
        const [dr,dc] = key.split(",").map(Number);
        const fx = offX+dc*cs+cs/2, fy = offY+dr*cs+cs/2;
        const pulse = 0.75 + 0.25*Math.sin(ts*0.003 + dr*1.4 + dc*0.9);
        ctx.beginPath();
        ctx.arc(fx, fy, cs*0.22*pulse, 0, Math.PI*2);  // bigger: 0.13 → 0.22
        ctx.fillStyle = `rgba(0,229,200,${0.9*pulse})`;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Ghosts (enemies) — red tones
      const eColors = ["rgba(200,0,40,0.9)","rgba(220,40,0,0.9)","rgba(180,0,80,0.9)","rgba(240,60,20,0.9)"];
      const eGlows  = ["rgba(200,0,40,0.7)","rgba(220,40,0,0.7)","rgba(180,0,80,0.7)","rgba(240,60,20,0.7)"];
      ghostsRef.current.forEach((g,i) => {
        drawGhost(ctx, offX+g.px, offY+g.py, cs, eColors[i], eGlows[i], ts, i*1.7);
      });

      // Player (teal ghost)
      if (caughtRef.current) ctx.globalAlpha = 0.4+0.6*Math.abs(Math.sin(ts*0.04));
      drawGhost(ctx, offX+p.px, offY+p.py, cs, "rgba(200,245,240,0.95)", "rgba(0,229,200,0.85)", ts, 0);
      ctx.globalAlpha = 1;

      // Near-ghost red vignette — cheap solid border instead of gradient
      if (near) {
        const a = 0.06+0.04*Math.sin(ts*0.012);
        ctx.strokeStyle = `rgba(200,0,30,${a*6})`;
        ctx.lineWidth = 24;
        ctx.strokeRect(0, 0, cw, ch);
      }

      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  const timeRatio = timeLeft / GAME_TIME;
  const pct = Math.round((collected/TOTAL_DOTS)*100);

  return (
    <motion.div ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none flex flex-col"
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

      {/* HUD */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ height:56, background:"rgba(4,4,10,0.92)", borderBottom:"1px solid rgba(0,229,200,0.09)" }}>
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-[10px] tracking-[0.3em] text-[rgba(200,240,240,0.4)] uppercase">
            {t("fragments_lbl")}
          </span>
          {/* Mini dot bar */}
          <div className="flex gap-0.5">
            {Array.from({length:10},(_,i)=>(
              <div key={i} className="w-2 h-2 rounded-full"
                style={{ background: i < Math.round(collected/TOTAL_DOTS*10) ? "#00e5c8" : "rgba(0,229,200,0.15)", boxShadow: i < Math.round(collected/TOTAL_DOTS*10) ? "0 0 4px #00e5c8" : "none", transition:"all 0.3s" }} />
            ))}
          </div>
          <span className="font-cinzel text-xs ml-1" style={{ color:"rgba(0,229,200,0.6)" }}>{pct}%</span>
        </div>
        <div className="font-cinzel text-lg" style={{
          color: timeLeft<8?"#e05050":timeLeft<15?"#f0a030":"#00e5c8",
          textShadow:`0 0 10px ${timeLeft<8?"#e05050":"#00e5c8"}`,
          animation: timeLeft<8?"countdownPulse 0.6s ease-in-out infinite":"none",
        }}>{timeLeft}s</div>
      </div>

      {/* Timer strip */}
      <div className="flex-shrink-0 h-0.5" style={{ background:"rgba(0,229,200,0.07)" }}>
        <div style={{
          height:"100%", width:`${timeRatio*100}%`,
          background: timeRatio>0.4?"linear-gradient(90deg,var(--teal-dim),var(--teal-glow))":timeRatio>0.2?"linear-gradient(90deg,#6b4000,#f0a030)":"linear-gradient(90deg,#6b0000,#e05050)",
          boxShadow:`0 0 5px ${timeRatio>0.4?"#00e5c8":"#e05050"}`,
          transition:"width 0.5s linear",
        }} />
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="flex-1 w-full" onClick={handleClick} style={{ touchAction:"none", cursor:"none" }} />

      {/* Countdown */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center z-30"
            style={{ background:"rgba(4,4,10,0.88)" }} exit={{ opacity:0 }}>
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="glow-border rounded px-6 py-2 mb-7">
              <span className="font-cinzel text-xs tracking-[0.35em] text-[rgba(240,160,48,0.9)] uppercase">
                ⚠ &nbsp; {t("fragments_warn")}
              </span>
            </motion.div>
            <p className="font-cinzel text-[var(--spirit-light)] text-xs tracking-[0.4em] uppercase mb-5 opacity-50">
              {t("fragments_title")}
            </p>
            <AnimatePresence mode="wait">
              <motion.div key={countdownVal} initial={{ scale:2.5, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.3, opacity:0 }}
                className="font-cinzel text-[var(--teal-glow)] text-glow-strong" style={{ fontSize:"7rem", lineHeight:1 }}>
                {countdownVal===0?"GO!":countdownVal}
              </motion.div>
            </AnimatePresence>
            <p className="font-gothic text-[rgba(200,240,240,0.35)] text-sm mt-7">{t("fragments_ctrl")}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* End overlay */}
      <AnimatePresence>
        {phase === "end" && (
          <motion.div className="absolute inset-0 flex items-center justify-center z-30 px-8"
            style={{ background:"rgba(4,4,10,0.93)" }} initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:0.15, type:"spring", stiffness:180 }} className="text-center">
              {caught ? (<>
                <div className="text-6xl mb-4" style={{ filter:"drop-shadow(0 0 20px rgba(200,0,30,0.9))" }}>👻</div>
                <h2 className="font-cinzel text-2xl text-[#e05050] mb-2" style={{ textShadow:"0 0 15px #e05050" }}>{t("caught")}</h2>
                <p className="font-crimson text-[var(--spirit-light)] text-lg italic opacity-70 mb-6">{collected} {t("caught_sub")}</p>
              </>) : collected >= TOTAL_DOTS ? (<>
                <div className="text-6xl mb-4" style={{ filter:"drop-shadow(0 0 20px rgba(0,229,200,0.9))" }}>✨</div>
                <h2 className="font-cinzel text-2xl text-[var(--teal-glow)] mb-2" style={{ textShadow:"0 0 14px #00e5c8" }}>{t("all_clear")}</h2>
                <p className="font-crimson text-[var(--spirit-light)] text-lg italic opacity-70 mb-6">{t("all_clear_sub")}</p>
              </>) : (<>
                <div className="text-6xl mb-4">⌛</div>
                <h2 className="font-cinzel text-2xl text-[var(--spirit-light)] mb-2">{t("timeout")}</h2>
                <p className="font-crimson text-[var(--spirit-light)] text-lg italic opacity-70 mb-6">
                  {collected} {t("timeout_sub")} {TOTAL_DOTS} {t("timeout_sub2")}
                </p>
              </>)}
              <div className="glow-border rounded px-8 py-3 mb-7 inline-block">
                <span className="font-cinzel text-[var(--teal-glow)] text-xl tracking-widest">{pct}%</span>
              </div>
              <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
                onClick={() => onComplete()}
                className="btn-spirit block px-10 py-3 font-cinzel text-xs tracking-[0.3em] uppercase">
                ✦ &nbsp; {standalone ? t("back_menu") : t("continue")} &nbsp; ✦
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
