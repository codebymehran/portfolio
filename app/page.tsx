"use client";

import { useState, useEffect, useRef } from "react";

// TODO: replace with your real link (X, GitHub, or mailto:you@example.com)
const FOLLOW_URL = "https://x.com/yourhandle";
const FOLLOW_LABEL = "Follow the build";

const HEADLINE = ["Quiet", "is", "not", "the", "same", "as", "idle."];

const INTRO = `I promised this in public and haven't shown it yet. That's on me. While I built, AI rewired the industry, so I went deep on how LLMs really work, and what I'm learning is changing how I build.`;

const TOPICS = ["Transformers", "Embeddings", "RAG", "Agents", "MCP", "LoRA", "Evals"];

const MANIFESTO = ["You get one life. It ends either way.", "I'm not spending mine at half strength."];

function Gear({ size, reverse, duration }: { size: number; reverse?: boolean; duration: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{ animation: `${reverse ? "spinRev" : "spin"} ${duration}s linear infinite`, filter: "drop-shadow(0 0 6px rgba(245,158,11,0.55))" }}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x="43" y="4" width="14" height="20" rx="3" fill="#F59E0B" transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="31" fill="#F59E0B" />
      <circle cx="50" cy="50" r="13" fill="#1a1409" />
    </svg>
  );
}

function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shooters: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    const resize = () => { el.width = el.offsetWidth; el.height = el.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.4 + Math.random() * 1.2,
      speed: 0.003 + Math.random() * 0.01,
      phase: Math.random() * Math.PI * 2,
      peak: 0.1 + Math.random() * 0.4,
      col: Math.random() > 0.7 ? "245,158,11" : Math.random() > 0.5 ? "16,185,129" : "255,255,255",
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
      if (!reduce && Math.random() < 0.006 && shooters.length < 2) {
        shooters.push({ x: Math.random() * el.width * 0.8, y: Math.random() * el.height * 0.4, vx: 6 + Math.random() * 4, vy: 2.5 + Math.random() * 2, life: 1 });
      }
      for (let i = shooters.length - 1; i >= 0; i--) {
        const sh = shooters[i];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.014;
        if (sh.life <= 0 || sh.x > el.width || sh.y > el.height) { shooters.splice(i, 1); continue; }
        const g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 10, sh.y - sh.vy * 10);
        g.addColorStop(0, `rgba(255,236,190,${0.9 * sh.life})`);
        g.addColorStop(1, "rgba(255,236,190,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 10, sh.y - sh.vy * 10); ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />;
}

export default function Home() {
  const [stage, setStage] = useState(0);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const m = mainRef.current;
      if (!m) return;
      m.style.setProperty("--mx", e.clientX + "px");
      m.style.setProperty("--my", e.clientY + "px");
      m.style.setProperty("--px", String(e.clientX / window.innerWidth - 0.5));
      m.style.setProperty("--py", String(e.clientY / window.innerHeight - 0.5));
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);   // badge
    const t2 = setTimeout(() => setStage(2), 700);   // headline
    const t3 = setTimeout(() => setStage(3), 1700);  // intro, topics, manifesto
    const t4 = setTimeout(() => setStage(4), 3000);  // stay tuned, quote, footer
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <main
      ref={mainRef}
      className="hero-main"
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, #1a1409 0%, #060509 60%, #000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Starfield />

      {/* ambient glow orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", transform: "translate(calc(var(--px, 0) * -45px), calc(var(--py, 0) * -45px))", transition: "transform 0.7s ease-out" }}>
        <div style={{ position: "absolute", top: "8%", left: "6%", width: "42vw", height: "42vw", maxWidth: 520, maxHeight: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)", filter: "blur(24px)", animation: "orbFloat 10s ease-in-out infinite" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", transform: "translate(calc(var(--px, 0) * 35px), calc(var(--py, 0) * 35px))", transition: "transform 0.7s ease-out" }}>
        <div style={{ position: "absolute", bottom: "6%", right: "8%", width: "36vw", height: "36vw", maxWidth: 440, maxHeight: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(24px)", animation: "orbFloat 12s ease-in-out infinite reverse" }} />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)", pointerEvents: "none" }} />

      {/* cursor glow */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 440, height: 440, marginLeft: -220, marginTop: -220, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.11) 0%, transparent 65%)", pointerEvents: "none", transform: "translate3d(var(--mx, 50vw), var(--my, 40vh), 0)", transition: "transform 0.4s ease-out", willChange: "transform" }} />

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 680,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "clamp(8px, 2vh, 20px)",
        }}
      >
        {/* eyebrow badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: "clamp(10px, 1.5vh, 11.5px)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#fde68a",
            padding: "5px 14px",
            borderRadius: 20,
            border: "1px solid rgba(251,191,36,0.35)",
            background: "rgba(245,158,11,0.08)",
            fontFamily: "'JetBrains Mono', monospace",
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 8px #fbbf24", animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
          a progress note, not an excuse
        </div>

        {/* headline */}
        <h1
          className="headline"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: "clamp(28px, min(5.4vw, 7.4vh), 54px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#fff8ea",
            margin: 0,
            textShadow: "0 0 40px rgba(245,158,11,0.2)",
          }}
        >
          {HEADLINE.map((word, i) => (
            <span
              key={i}
              className={word === "idle." ? "shimmer" : undefined}
              style={{
                display: "inline-block",
                marginRight: "0.28em",
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 0.5s ease ${i * 90}ms, transform 0.5s cubic-bezier(.22,.68,0,1.1) ${i * 90}ms`,
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* intro */}
        <p
          style={{
            fontFamily: "'Instrument Sans', system-ui, sans-serif",
            fontSize: "clamp(13.5px, min(1.8vw, 2.5vh), 17px)",
            lineHeight: 1.6,
            color: "rgba(255,249,238,0.92)",
            margin: 0,
            maxWidth: 600,
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? "translateY(0)" : "translateY(12px)",
            filter: stage >= 3 ? "blur(0px)" : "blur(6px)",
            transition: "opacity 0.8s ease, transform 0.8s ease, filter 0.8s ease",
          }}
        >
          {INTRO}
        </p>

        {/* topics */}
        <div className="topics" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6 }}>
          {TOPICS.map((t, i) => (
            <span
              key={t}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(10px, 1.5vh, 11px)",
                letterSpacing: "0.06em",
                color: "#fde68a",
                padding: "3px 9px",
                borderRadius: 6,
                border: "1px solid rgba(251,191,36,0.35)",
                background: "rgba(245,158,11,0.08)",
                opacity: stage >= 3 ? 1 : 0,
                transform: stage >= 3 ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 0.5s ease ${400 + i * 70}ms, transform 0.5s ease ${400 + i * 70}ms`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* manifesto */}
        <div
          className="manifesto"
          style={{
            textAlign: "left",
            paddingLeft: 16,
            borderLeft: "2px solid #F59E0B",
            boxShadow: "-10px 0 28px -14px rgba(245,158,11,0.8)",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontWeight: 600,
          }}
        >
          {MANIFESTO.map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontSize: "clamp(17px, min(2.8vw, 3.8vh), 28px)",
                lineHeight: 1.3,
                color: i === MANIFESTO.length - 1 ? "#fde68a" : "#fff8ea",
                opacity: stage >= 3 ? 1 : 0,
                transform: stage >= 3 ? "translateX(0)" : "translateX(-14px)",
                transition: `opacity 0.7s ease ${900 + i * 450}ms, transform 0.7s ease ${900 + i * 450}ms`,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* work in progress + stay tuned */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(4px, 1vh, 10px)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: stage >= 4 ? 1 : 0,
              transition: "opacity 0.8s ease 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              <Gear size={30} duration={9} />
              <div style={{ marginBottom: 1 }}>
                <Gear size={18} duration={5} reverse />
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fde68a" }}>
              work in progress<span className="dots"><span>.</span><span>.</span><span>.</span></span>
            </span>
          </div>

          <div
            className="danger"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(32px, min(7vw, 9vh), 64px)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#F59E0B",
              lineHeight: 1.05,
            }}
          >
            {"Stay tuned.".split("").map((ch, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: stage >= 4 ? 1 : 0,
                  transform: stage >= 4 ? "translateY(0) scale(1)" : "translateY(24px) scale(0.8)",
                  transition: `opacity 0.5s ease ${500 + i * 80}ms, transform 0.6s cubic-bezier(.22,.68,0,1.4) ${500 + i * 80}ms`,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </div>

          <div
            style={{
              height: 2,
              width: stage >= 4 ? "min(200px, 50%)" : 0,
              background: "linear-gradient(90deg, transparent, #F59E0B, transparent)",
              transition: "width 1.2s cubic-bezier(.22,.68,0,1.1) 1.4s",
            }}
          />
        </div>

        {/* follow */}
        <a
          href={FOLLOW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="follow-link"
          style={{
            display: "inline-block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(10.5px, 1.6vh, 12px)",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#fde68a",
            textDecoration: "none",
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(251,191,36,0.55)",
            background: "rgba(245,158,11,0.1)",
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.8s ease 1.6s, transform 0.8s ease 1.6s, background 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          {FOLLOW_LABEL} →
        </a>

        {/* quote */}
        <p
          className="quote"
          style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(14px, 2vh, 17px)",
            color: "rgba(255,255,255,0.7)",
            opacity: stage >= 4 ? 1 : 0,
            transition: "opacity .8s ease 1.8s",
          }}
        >
          “Find what you love and let it kill you.”
          <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontStyle: "normal", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
            — Charles Bukowski
          </span>
        </p>

        {/* signature */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px 14px",
            flexWrap: "wrap",
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s",
          }}
        >
          <span className="shimmer" style={{ fontSize: "clamp(22px, min(3.4vw, 4.4vh), 32px)", fontWeight: 700, fontStyle: "italic", letterSpacing: "0.03em", lineHeight: 1.1, fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Mehran Khan
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>·</span>
          <span style={{ fontSize: 11.5, letterSpacing: "0.1em", color: "rgba(255,255,255,0.68)", fontFamily: "'JetBrains Mono', monospace" }}>
            Full-Stack · AI engineer · RAG
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,600;1,700&family=Instrument+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes pingDot { 0%{box-shadow:0 0 0 0 rgba(251,191,36,0.7)} 60%{box-shadow:0 0 0 7px rgba(251,191,36,0)} 100%{box-shadow:0 0 0 0 rgba(251,191,36,0)} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spinRev { to { transform: rotate(-360deg); } }
        @keyframes dotBlink { 0%, 20% { opacity: 0.15; } 50%, 100% { opacity: 1; } }
        .dots span { animation: dotBlink 1.4s infinite; }
        .dots span:nth-child(2) { animation-delay: 0.25s; }
        .dots span:nth-child(3) { animation-delay: 0.5s; }
        @keyframes dangerPulse {
          0%, 100% { text-shadow: 0 0 12px rgba(245,158,11,0.4); }
          50% { text-shadow: 0 0 22px rgba(251,191,36,0.95), 0 0 48px rgba(245,158,11,0.6); }
        }
        .danger { animation: dangerPulse 1.8s ease-in-out 5s infinite; }
        @keyframes warnFlash {
          0%, 40%, 100% { opacity: 1; text-shadow: 0 0 40px rgba(245,158,11,0.25); }
          4%  { opacity: 0.3; text-shadow: none; }
          8%  { opacity: 1; text-shadow: 0 0 26px rgba(251,191,36,0.95), 0 0 60px rgba(245,158,11,0.7); }
          12% { opacity: 0.4; text-shadow: none; }
          16% { opacity: 1; text-shadow: 0 0 26px rgba(251,191,36,0.95), 0 0 60px rgba(245,158,11,0.7); }
          22% { opacity: 1; text-shadow: 0 0 18px rgba(245,158,11,0.5); }
        }
        @keyframes idleBlink {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 0 rgba(251,191,36,0)); }
          50% { filter: brightness(1.45) drop-shadow(0 0 14px rgba(251,191,36,0.9)); }
        }
        .follow-link:hover { background: rgba(245,158,11,0.22) !important; box-shadow: 0 0 22px rgba(245,158,11,0.35); }
        .follow-link:focus-visible { outline: 2px solid #fbbf24; outline-offset: 3px; }
        .headline { animation: warnFlash 4s ease-in-out 2.6s infinite; }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .shimmer {
          background: linear-gradient(90deg, #F59E0B 0%, #fde68a 25%, #F59E0B 50%, #fde68a 75%, #F59E0B 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: shimmer 4s linear infinite, idleBlink 1.3s ease-in-out 2.6s infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
        }
        * { box-sizing: border-box; }

        .hero-main { padding: 24px 32px; }

        /* keep everything on one screen: drop the least important pieces on short screens */
        @media (max-height: 760px) { .quote { display: none; } }
        @media (max-height: 640px) { .topics { display: none; } }
        @media (max-height: 520px) { .manifesto { display: none; } }

        @media (max-width: 640px) {
          .hero-main { padding: 20px 20px; }
        }
        @media (max-width: 380px) {
          .hero-main { padding: 16px 16px; }
        }
      `}</style>
    </main>
  );
}
