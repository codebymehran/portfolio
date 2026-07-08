"use client";

import { useState, useEffect, useRef } from "react";

const LINES = [
  `To the developers, recruiters, and strangers`,
  `messaging me about my "first project" — I see you.`,
  `I appreciate the interest.`,
  ``,
  `But I don't owe anyone a shipping schedule`,
  `for work I'm doing on my own time,`,
  `with my own hands, for reasons that are mine.`,
  ``,
  `I'm a developer by trade,`,
  `but a philosopher and historian by habit —`,
  `I've learned that anything worth building`,
  `is built on someone else's timeline only if you let it be.`,
  ``,
  `I've spent years writing code for other people's deadlines.`,
  `This one's mine.`,
  ``,
  `Twenty-two apps. Real stack. Real users.`,
  `Built the hard way.`,
  ``,
  `It'll be done when it's done right —`,
  `not when it's convenient for your inbox.`,
  ``,
  `Bookmark it. Or don't.`,
  `Either way, I'm not rushing.`,
];

function RedCross({ drawn }: { drawn: boolean }) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (size.w === 0) return null;

  const { w, h } = size;
  const diag = Math.hypot(w, h);
  const strokeWidth = Math.max(6, Math.min(w, h) * 0.012); // scales with screen, min 6px

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <line
        x1={0} y1={0} x2={w} y2={h}
        stroke="#e11d2e"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          strokeDasharray: diag,
          strokeDashoffset: drawn ? 0 : diag,
          transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1)",
          filter: "drop-shadow(0 0 10px rgba(225,29,46,0.7))",
        }}
      />
      <line
        x1={w} y1={0} x2={0} y2={h}
        stroke="#e11d2e"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{
          strokeDasharray: diag,
          strokeDashoffset: drawn ? 0 : diag,
          transition: "stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1) 0.15s",
          filter: "drop-shadow(0 0 10px rgba(225,29,46,0.7))",
        }}
      />
    </svg>
  );
}

export default function Home() {
  const [crossDrawn, setCrossDrawn] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [doneTyping, setDoneTyping] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCrossDrawn(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!crossDrawn) return;
    const delay = setTimeout(() => setLineIdx(0), 900);
    return () => clearTimeout(delay);
  }, [crossDrawn]);

  useEffect(() => {
    if (!crossDrawn || lineIdx >= LINES.length) {
      if (lineIdx >= LINES.length && crossDrawn) setDoneTyping(true);
      return;
    }
    const currentLine = LINES[lineIdx];
    if (charIdx < currentLine.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx(i => i + 1);
        setCharIdx(0);
      }, currentLine === "" ? 120 : 260);
      return () => clearTimeout(t);
    }
  }, [crossDrawn, lineIdx, charIdx]);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        overflow: "hidden",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <RedCross drawn={crossDrawn} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(225,29,46,0.08) 0%, transparent 65%)",
          opacity: crossDrawn ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 720,
          width: "100%",
          opacity: crossDrawn ? 1 : 0,
          transition: "opacity 0.6s ease 0.6s",
        }}
      >
        {LINES.slice(0, lineIdx + 1).map((line, i) => {
          const isCurrent = i === lineIdx;
          const text = isCurrent ? line.slice(0, charIdx) : line;
          return (
            <p
              key={i}
              style={{
                margin: 0,
                minHeight: line === "" ? "0.9em" : "auto",
                fontSize: "clamp(15px, 2.1vw, 20px)",
                lineHeight: 1.8,
                color: "#3ef07c",
                letterSpacing: "-0.005em",
                textShadow: "0 0 12px rgba(62,240,124,0.35)",
              }}
            >
              {text}
              {isCurrent && !doneTyping && (
                <span
                  style={{
                    display: "inline-block",
                    width: 9,
                    height: "1.05em",
                    background: "#3ef07c",
                    marginLeft: 3,
                    verticalAlign: "text-bottom",
                    boxShadow: "0 0 8px rgba(62,240,124,0.7)",
                    animation: "caretBlink 0.85s steps(1) infinite",
                  }}
                />
              )}
            </p>
          );
        })}

        {doneTyping && (
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 14,
              animation: "fadeIn 0.8s ease",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #3ef07c, transparent)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(62,240,124,0.5)" }}>
              Mehran Khan
            </span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>·</span>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>
              developer · philosopher · historian
            </span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
        @keyframes caretBlink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes fadeIn { from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none} }
        * { box-sizing: border-box; }
      `}</style>
    </main>
  );
}
