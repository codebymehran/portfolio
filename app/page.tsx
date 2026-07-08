"use client";

import { useState, useEffect, useRef } from "react";

const MESSAGE =
  `To the developers, recruiters, and strangers messaging me about my "first project" — I see you. I appreciate the interest. But I don't owe anyone a shipping schedule for work I'm doing on my own time, with my own hands, for reasons that are mine. I'm a developer by trade, but a philosopher and historian by habit — I've learned that anything worth building is built on someone else's timeline only if you let it be. I've spent years writing code for other people's deadlines. This one's mine. Twenty-two apps, real stack, real users, built the hard way — and it'll be done when it's done right, not when it's convenient for your inbox. Bookmark it. Or don't. Either way, I'm not rushing.`;

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const resize = () => { el.width = el.offsetWidth; el.height = el.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.3,
      speed: 0.003 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
      peak: 0.15 + Math.random() * 0.6,
      col: Math.random() > 0.7 ? "139,124,246" : Math.random() > 0.5 ? "16,185,129" : "255,255,255",
    }));
    let t = 0;
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, el.width, el.height);
      t += 0.01;
      stars.forEach(s => {
        const o = s.peak * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * el.width, s.y * el.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.col},${o})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

export default function Home() {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current += 1;
      setTyped(MESSAGE.slice(0, indexRef.current));
      if (indexRef.current >= MESSAGE.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 24);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, #14101f 0%, #060509 60%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {/* starfield */}
      <Starfield />

      {/* glow orbs */}
      <div style={{ position: "absolute", top: "10%", left: "8%", width: "40vw", height: "40vw", maxWidth: 500, maxHeight: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,124,246,0.16) 0%, transparent 70%)", filter: "blur(20px)", animation: "orbFloat 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "10%", width: "35vw", height: "35vw", maxWidth: 420, maxHeight: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(20px)", animation: "orbFloat 11s ease-in-out infinite reverse" }} />

      {/* vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)", pointerEvents: "none" }} />

      {/* content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 780, width: "100%" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#a78bfa",
            padding: "5px 14px",
            borderRadius: 20,
            border: "1px solid rgba(167,139,250,0.35)",
            background: "rgba(139,124,246,0.08)",
            marginBottom: 28,
            animation: "fadeIn 0.6s ease",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa", animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
          status update
        </div>

        <p
          style={{
            fontSize: "clamp(17px, 2.6vw, 25px)",
            lineHeight: 1.75,
            color: "#f2f0ff",
            letterSpacing: "-0.01em",
            margin: 0,
            textShadow: "0 0 30px rgba(139,124,246,0.15)",
          }}
        >
          {typed}
          <span
            style={{
              display: "inline-block",
              width: 11,
              height: "1.15em",
              background: "linear-gradient(180deg, #8B7CF6, #10B981)",
              marginLeft: 4,
              verticalAlign: "text-bottom",
              boxShadow: "0 0 10px rgba(139,124,246,0.6)",
              animation: "caretBlink 0.9s steps(1) infinite",
            }}
          />
        </p>

        {done && (
          <div
            style={{
              marginTop: 40,
              display: "flex",
              alignItems: "center",
              gap: 14,
              animation: "fadeIn 0.8s ease",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #8B7CF6, transparent)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
              Mehran Khan
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>
              developer · philosopher · historian
            </span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes caretBlink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes pingDot { 0%{box-shadow:0 0 0 0 rgba(167,139,250,0.7)} 60%{box-shadow:0 0 0 7px rgba(167,139,250,0)} 100%{box-shadow:0 0 0 0 rgba(167,139,250,0)} }
        @keyframes fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}
