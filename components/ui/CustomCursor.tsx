"use client";
import { useEffect, useRef, useState } from "react";

export default function GhostCursor() {
  const ghostRef  = useRef<HTMLDivElement>(null);
  const trailRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Trail positions dengan lag berbeda
    const trails = [
      { x: mouseX, y: mouseY, lag: 0.18 },
      { x: mouseX, y: mouseY, lag: 0.10 },
      { x: mouseX, y: mouseY, lag: 0.06 },
    ];

    let ghostX = mouseX, ghostY = mouseY;
    let animFrame: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      // Ghost utama
      ghostX += (mouseX - ghostX) * 0.15;
      ghostY += (mouseY - ghostY) * 0.15;

      if (ghostRef.current) {
        ghostRef.current.style.left = ghostX + "px";
        ghostRef.current.style.top  = ghostY + "px";
      }

      // Trail hantu kecil
      trails.forEach((t, i) => {
        const prev = i === 0 ? { x: ghostX, y: ghostY } : trails[i - 1];
        t.x += (prev.x - t.x) * t.lag;
        t.y += (prev.y - t.y) * t.lag;
        const el = trailRefs[i].current;
        if (el) {
          el.style.left = t.x + "px";
          el.style.top  = t.y + "px";
          el.style.opacity = String(0.25 - i * 0.07);
          el.style.transform = `translate(-50%, -50%) scale(${0.55 - i * 0.12})`;
        }
      });

      animFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    animFrame = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* Trail hantu kecil */}
      {trailRefs.map((ref, i) => (
        <div
          key={i}
          ref={ref}
          className="pointer-events-none fixed z-[9997]"
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <GhostSVG size={28} opacity={0.3} />
        </div>
      ))}

      {/* Ghost utama */}
      <div
        ref={ghostRef}
        className="pointer-events-none fixed z-[9999]"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <GhostSVG size={36} opacity={1} glow />
      </div>
    </>
  );
}

function GhostSVG({ size = 36, opacity = 1, glow = false }: { size?: number; opacity?: number; glow?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity,
        filter: glow
          ? "drop-shadow(0 0 6px rgba(0,229,200,0.9)) drop-shadow(0 0 12px rgba(0,229,200,0.5))"
          : "none",
        animation: glow ? "floatGhost 3s ease-in-out infinite" : "none",
      }}
    >
      {/* Body bulat atas */}
      <path
        d="M18 2 C9 2 3 8 3 16 L3 34 L7 30 L11 34 L15 30 L18 34 L21 30 L25 34 L29 30 L33 34 L33 16 C33 8 27 2 18 2 Z"
        fill="rgba(200,240,240,0.92)"
        stroke="rgba(0,229,200,0.6)"
        strokeWidth="0.8"
      />
      {/* Mata kiri */}
      <ellipse cx="13" cy="16" rx="2.5" ry="3" fill="rgba(0,60,55,0.9)" />
      <ellipse cx="13.8" cy="15" rx="0.8" ry="0.8" fill="rgba(0,229,200,0.7)" />
      {/* Mata kanan */}
      <ellipse cx="23" cy="16" rx="2.5" ry="3" fill="rgba(0,60,55,0.9)" />
      <ellipse cx="23.8" cy="15" rx="0.8" ry="0.8" fill="rgba(0,229,200,0.7)" />
      {/* Senyum kecil */}
      <path
        d="M15 21 Q18 23.5 21 21"
        stroke="rgba(0,60,55,0.7)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Pipi blush */}
      <ellipse cx="10" cy="19" rx="2" ry="1.2" fill="rgba(0,229,200,0.15)" />
      <ellipse cx="26" cy="19" rx="2" ry="1.2" fill="rgba(0,229,200,0.15)" />
    </svg>
  );
}
