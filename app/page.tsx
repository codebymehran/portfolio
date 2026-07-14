"use client";

import { useState, useEffect, useRef } from "react";

const HEADLINE = ["Patience", "is", "not", "the", "absence", "of", "ambition."];

const PARAGRAPHS = [
  `To the developers, recruiters, and strangers messaging me about my "first project" — I see you, and I appreciate the interest.`,
  `But I don't owe anyone a shipping schedule for work I'm doing on my own time, with my own hands, for reasons that are mine. I'm a developer by trade, but a philosopher and historian by habit — and both have taught me that anything worth building is built at someone else's pace only if you let it be.`,
  `I'm not chasing anyone's deadline but my own. Twenty-two apps, real stack, real users, built the hard way. It'll be done when it's done right — not when it's convenient for your inbox.`,
  `Bookmark it, or don't. Either way, I'm not rushing.`,
];

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
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      speed: 0.003 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
      peak: 0.12 + Math.random() * 0.55,
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
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);   // badge
    const t2 = setTimeout(() => setStage(2), 700);   // headline
    const t3 = setTimeout(() => setStage(3), 1900);  // paragraphs
    const t4 = setTimeout(() => setStage(4), 3600);  // footer
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
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
        padding: "48px 32px",
        overflow: "hidden",
      }}
    >
      <Starfield />

      {/* ambient glow orbs */}
      <div style={{ position: "absolute", top: "8%", left: "6%", width: "42vw", height: "42vw", maxWidth: 520, maxHeight: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,124,246,0.15) 0%, transparent 70%)", filter: "blur(24px)", animation: "orbFloat 10s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "6%", right: "8%", width: "36vw", height: "36vw", maxWidth: 440, maxHeight: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(24px)", animation: "orbFloat 12s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)", pointerEvents: "none" }} />

      {/* content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 720, width: "100%" }}>

        {/* eyebrow badge */}
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
            marginBottom: 30,
            fontFamily: "'JetBrains Mono', monospace",
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa", animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
          a note, before you ask
        </div>

        {/* headline — word by word */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(30px, 5.2vw, 52px)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: "#f2f0ff",
            margin: "0 0 34px",
            textShadow: "0 0 40px rgba(139,124,246,0.2)",
          }}
        >
          {HEADLINE.map((word, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: "0.28em",
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.5s ease ${i * 90}ms, transform 0.5s cubic-bezier(.22,.68,0,1.1) ${i * 90}ms`,
                color: word === "ambition." ? "#8B7CF6" : undefined,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              style={{
                fontFamily: "'Instrument Sans', system-ui, sans-serif",
                fontSize: "clamp(14.5px, 1.6vw, 16.5px)",
                lineHeight: 1.75,
                color: i === PARAGRAPHS.length - 1 ? "rgba(238,234,248,0.55)" : "rgba(238,234,248,0.82)",
                fontStyle: i === PARAGRAPHS.length - 1 ? "italic" : "normal",
                margin: 0,
                opacity: stage >= 3 ? 1 : 0,
                transform: stage >= 3 ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.65s ease ${i * 180}ms, transform 0.65s ease ${i * 180}ms`,
              }}
            >
              {p}
            </p>
          ))}
        </div>

        {/* footer signature + progress chip */}
        {/* quote */}
<div
  style={{
    marginTop: 42,
    opacity: stage >= 4 ? 1 : 0,
    transition: "opacity .8s ease .3s",
    textAlign: "center",
  }}
>
  <p
    style={{
      margin: 0,
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontStyle: "italic",
      fontSize: "clamp(15px,1.5vw,18px)",
      color: "rgba(255,255,255,0.42)",
      letterSpacing: "0.01em",
    }}
  >
    “Find what you love and let it kill you.”
  </p>

  <p
    style={{
      marginTop: 8,
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.22)",
      fontFamily: "'JetBrains Mono', monospace",
    }}
  >
    — Charles Bukowski
  </p>
</div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #8B7CF6, transparent)" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
            Mehran Khan
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
          <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.28)", fontFamily: "'JetBrains Mono', monospace" }}>
            developer · philosopher · historian
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 11px",
              borderRadius: 20,
              background: "rgba(16,185,129,0.1)",
              color: "#34d399",
              border: "1px solid rgba(16,185,129,0.25)",
              letterSpacing: "0.05em",
              fontFamily: "'JetBrains Mono', monospace",
              marginLeft: "auto",
            }}
          >
            0 / 22 — and that's fine
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes pingDot { 0%{box-shadow:0 0 0 0 rgba(167,139,250,0.7)} 60%{box-shadow:0 0 0 7px rgba(167,139,250,0)} 100%{box-shadow:0 0 0 0 rgba(167,139,250,0)} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}
