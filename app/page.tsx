"use client";

import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const phases = [
  {
    label: "Phase 1", title: "Core React", desc: "components · state · hooks · TypeScript",
    color: "#7F77DD", colorBg: "rgba(127,119,221,0.12)", colorBorder: "rgba(127,119,221,0.3)",
    projects: [
      { id:"01",  name:"Task manager",      tag:"useState · CRUD · derived state",     live:"", type:"" },
      { id:"02",  name:"Expense tracker",   tag:"useReducer · complex forms",          live:"", type:"" },
      { id:"02.5",name:"Weather widget",    tag:"useEffect · fetch · API keys",        live:"", type:"gap" },
      { id:"03",  name:"Quiz app",          tag:"TypeScript · multi-step UI",          live:"", type:"" },
      { id:"04",  name:"Recipe book",       tag:"useRef · custom hooks",               live:"", type:"" },
      { id:"05",  name:"Kanban board",      tag:"useReducer · drag & drop",            live:"", type:"" },
      { id:"05.5",name:"Theme & settings",  tag:"useContext + useReducer",             live:"", type:"gap" },
      { id:"05C", name:"Habit tracker",     tag:"Every Phase 1 concept",               live:"", type:"con" },
    ],
  },
  {
    label: "Phase 2", title: "Next.js Frontend", desc: "App Router · Tailwind · real APIs",
    color: "#5DCAA5", colorBg: "rgba(93,202,165,0.12)", colorBorder: "rgba(93,202,165,0.3)",
    projects: [
      { id:"06",  name:"Portfolio site",    tag:"App Router · layouts · next/font",    live:"", type:"" },
      { id:"07",  name:"Movie browser",     tag:"Server fetch · dynamic routes",       live:"", type:"" },
      { id:"07.5",name:"Notes app",         tag:"Tiptap · rich text · debounce",       live:"", type:"gap" },
      { id:"08",  name:"Dashboard UI",      tag:"Recharts · Zod · useTransition",      live:"", type:"" },
      { id:"09",  name:"E-commerce store",  tag:"Context · React Hook Form · Zod",     live:"", type:"" },
      { id:"09C", name:"Music library",     tag:"Every Phase 2 concept",               live:"", type:"con" },
    ],
  },
  {
    label: "Phase 3", title: "Full Stack", desc: "Prisma · PostgreSQL · auth · Stripe",
    color: "#F0997B", colorBg: "rgba(240,153,123,0.12)", colorBorder: "rgba(240,153,123,0.3)",
    projects: [
      { id:"10",  name:"Full stack tasks",  tag:"Prisma · NextAuth · TanStack Query",  live:"", type:"" },
      { id:"10.5",name:"Link shortener",    tag:"Server actions · rate limiting",      live:"", type:"gap" },
      { id:"11",  name:"Blog + CMS",        tag:"RBAC · image uploads · Sentry",       live:"", type:"" },
      { id:"12",  name:"SaaS starter",      tag:"Multi-tenant · Stripe · webhooks",    live:"", type:"" },
      { id:"12C", name:"Real-time chat",    tag:"Pusher · useOptimistic",              live:"", type:"con" },
    ],
  },
  {
    label: "Phase 4", title: "Production Level", desc: "testing · CI/CD · real users",
    color: "#EF9F27", colorBg: "rgba(239,159,39,0.12)", colorBorder: "rgba(239,159,39,0.3)",
    projects: [
      { id:"13",  name:"Test coverage",     tag:"Vitest · Playwright · GitHub CI",     live:"", type:"" },
      { id:"13.5",name:"Perf & a11y audit", tag:"Lighthouse · WCAG · bundle",          live:"", type:"gap" },
      { id:"14",  name:"Real product",      tag:"My idea · real users · Stripe",       live:"", type:"" },
    ],
  },
];

// ── Update this single number each time you ship a project ──────────────────
const DONE = 0;

// ─── PHASE ICONS ─────────────────────────────────────────────────────────────

function PhaseIcon({ color, phase }: { color: string; phase: number }) {
  if (phase === 0) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" fill={color}/>
      <ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none"/>
      <ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(60 10 10)"/>
      <ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(120 10 10)"/>
    </svg>
  );
  if (phase === 1) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" rx="2" fill={color}/>
      <rect x="11" y="2" width="7" height="7" rx="2" fill={color} opacity=".5"/>
      <rect x="2" y="11" width="7" height="7" rx="2" fill={color} opacity=".5"/>
      <rect x="11" y="11" width="7" height="7" rx="2" fill={color}/>
    </svg>
  );
  if (phase === 2) return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <ellipse cx="10" cy="5.5" rx="7" ry="3" stroke={color} strokeWidth="1.3" fill="none"/>
      <path d="M3 5.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/>
      <path d="M3 10.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/>
    </svg>
  );
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6l2-6z" fill={color}/>
    </svg>
  );
}

// ─── TILE ILLUSTRATIONS ───────────────────────────────────────────────────────

function TileArt({ index, color }: { index: number; color: string }) {
  const arts = [
    <svg key={0} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="6" y="8" width="32" height="28" rx="4" fill={color} opacity=".1"/>
      <circle cx="10" cy="17" r="2" fill={color}/><line x1="14" y1="17" x2="34" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="10" cy="24" r="2" fill={color} opacity=".55"/><line x1="14" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".55"/>
      <circle cx="10" cy="31" r="2" fill={color} opacity=".3"/><line x1="14" y1="31" x2="23" y2="31" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".3"/>
    </svg>,
    <svg key={1} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="5"  y="32" width="7" height="8" rx="2" fill={color} opacity=".3"/>
      <rect x="14" y="24" width="7" height="16" rx="2" fill={color} opacity=".5"/>
      <rect x="23" y="16" width="7" height="24" rx="2" fill={color} opacity=".75"/>
      <rect x="32" y="8"  width="7" height="32" rx="2" fill={color}/>
    </svg>,
    <svg key={2} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="8" fill={color} opacity=".8"/>
      {[0,45,90,135,180,225,270,315].map((a,i)=>{const r=Math.PI*a/180;return <line key={i} x1={22+12*Math.cos(r)} y1={22+12*Math.sin(r)} x2={22+16*Math.cos(r)} y2={22+16*Math.sin(r)} stroke={color} strokeWidth="2" strokeLinecap="round"/>})}
    </svg>,
    <svg key={3} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="17" fill={color} opacity=".1" stroke={color} strokeWidth="1.2"/>
      <text x="22" y="30" fontSize="22" fontFamily="system-ui" fontWeight="700" fill={color} textAnchor="middle">?</text>
    </svg>,
    <svg key={4} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="8" y="6" width="18" height="32" rx="2" fill={color} opacity=".12" stroke={color} strokeWidth="1.3"/>
      <rect x="18" y="6" width="18" height="32" rx="2" fill={color} opacity=".22" stroke={color} strokeWidth="1.3"/>
      <line x1="22" y1="14" x2="32" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".7"/>
      <line x1="22" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
      <line x1="22" y1="26" x2="28" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".3"/>
    </svg>,
    <svg key={5} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="4"  y="8" width="10" height="28" rx="3" fill={color} opacity=".15" stroke={color} strokeWidth="1.2"/>
      <rect x="17" y="8" width="10" height="28" rx="3" fill={color} opacity=".35" stroke={color} strokeWidth="1.2"/>
      <rect x="30" y="8" width="10" height="28" rx="3" fill={color} opacity=".6"  stroke={color} strokeWidth="1.2"/>
      <rect x="6"  y="12" width="6" height="5" rx="1.5" fill={color} opacity=".7"/>
      <rect x="19" y="12" width="6" height="5" rx="1.5" fill={color} opacity=".8"/>
      <rect x="19" y="20" width="6" height="5" rx="1.5" fill={color} opacity=".6"/>
      <rect x="32" y="12" width="6" height="5" rx="1.5" fill={color}/>
    </svg>,
    <svg key={6} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="6" y="17" width="32" height="12" rx="6" fill={color} opacity=".18" stroke={color} strokeWidth="1.3"/>
      <circle cx="32" cy="23" r="5.5" fill={color}/>
      <circle cx="13" cy="23" r="3" fill={color} opacity=".3"/>
    </svg>,
    <svg key={7} width="44" height="44" viewBox="0 0 44 44" fill="none">
      {Array.from({length:7}).map((_,col)=>Array.from({length:4}).map((_,row)=>{
        const seed=(col*4+row)*2654435761;const filled=(seed%100)>38;
        return <rect key={`${col}-${row}`} x={6+col*5.2} y={13+row*5.2} width="3.8" height="3.8" rx="1" fill={color} opacity={filled?0.8:0.12}/>
      }))}
    </svg>,
    <svg key={8} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="4" y="8" width="36" height="28" rx="4" fill={color} opacity=".1" stroke={color} strokeWidth="1.3"/>
      <line x1="4" y1="16" x2="40" y2="16" stroke={color} strokeWidth="1" opacity=".4"/>
      <circle cx="10" cy="12" r="2" fill={color} opacity=".5"/>
      <circle cx="16" cy="12" r="2" fill={color} opacity=".3"/>
      <rect x="10" y="20" width="24" height="3" rx="1.5" fill={color} opacity=".4"/>
      <rect x="10" y="26" width="16" height="3" rx="1.5" fill={color} opacity=".25"/>
      <rect x="10" y="32" width="10" height="3" rx="1.5" fill={color} opacity=".15"/>
    </svg>,
    <svg key={9} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="6" y="10" width="32" height="24" rx="3" fill={color} opacity=".1" stroke={color} strokeWidth="1.3"/>
      <rect x="6"  y="10" width="6" height="24" fill={color} opacity=".18"/>
      <rect x="32" y="10" width="6" height="24" fill={color} opacity=".18"/>
      {[0,1,2,3].map(i=><rect key={i} x="8"  y={13+i*5} width="2" height="3" rx="1" fill={color} opacity=".6"/>)}
      {[0,1,2,3].map(i=><rect key={i} x="34" y={13+i*5} width="2" height="3" rx="1" fill={color} opacity=".6"/>)}
      <polygon points="20,18 20,26 28,22" fill={color} opacity=".7"/>
    </svg>,
    <svg key={10} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="8" y="5" width="28" height="34" rx="3" fill={color} opacity=".1" stroke={color} strokeWidth="1.3"/>
      <line x1="14" y1="15" x2="30" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".65"/>
      <line x1="14" y1="21" x2="30" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".45"/>
      <line x1="14" y1="27" x2="24" y2="27" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".28"/>
      <rect x="26" y="26" width="10" height="10" rx="2" fill={color} opacity=".75"/>
      <path d="M28 31h6M31 28v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>,
    <svg key={11} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M22 8 A14 14 0 0 1 36 22 L22 22Z" fill={color} opacity=".8"/>
      <path d="M36 22 A14 14 0 0 1 12 32 L22 22Z" fill={color} opacity=".5"/>
      <path d="M12 32 A14 14 0 0 1 22 8 L22 22Z" fill={color} opacity=".25"/>
      <circle cx="22" cy="22" r="5.5" fill="none" stroke={color} strokeWidth="2" opacity=".35"/>
    </svg>,
    <svg key={12} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M6 8h4l5 18h18l4-12H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="20" cy="33" r="3" fill={color} opacity=".7"/>
      <circle cx="32" cy="33" r="3" fill={color} opacity=".7"/>
    </svg>,
    <svg key={13} width="44" height="44" viewBox="0 0 44 44" fill="none">
      {[6,12,18,24,30,36,42].map((x,i)=>{const h=[8,16,26,20,30,14,10][i];return <rect key={i} x={x-1.5} y={22-h/2} width="3" height={h} rx="1.5" fill={color} opacity={0.3+i*0.1}/>})}
    </svg>,
    <svg key={14} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="4"  y="4"  width="16" height="16" rx="4" fill={color} opacity=".2" stroke={color} strokeWidth="1.2"/>
      <rect x="24" y="4"  width="16" height="16" rx="4" fill={color} opacity=".45" stroke={color} strokeWidth="1.2"/>
      <rect x="4"  y="24" width="16" height="16" rx="4" fill={color} opacity=".7" stroke={color} strokeWidth="1.2"/>
      <rect x="24" y="24" width="16" height="16" rx="4" fill={color} stroke={color} strokeWidth="1.2"/>
      <path d="M27 32l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key={15} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M18 26a7 7 0 0 0 9.9 0l5-5a7 7 0 0 0-9.9-9.9L21 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M26 18a7 7 0 0 0-9.9 0l-5 5a7 7 0 0 0 9.9 9.9L23 31" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".55"/>
    </svg>,
    <svg key={16} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="8" y="8" width="22" height="28" rx="2" fill={color} opacity=".1" stroke={color} strokeWidth="1.3"/>
      <line x1="13" y1="17" x2="25" y2="17" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".6"/>
      <line x1="13" y1="23" x2="25" y2="23" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".4"/>
      <line x1="13" y1="29" x2="20" y2="29" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".25"/>
      <path d="M28 26l8-8-4-4-8 8v4h4z" fill={color} opacity=".85"/>
    </svg>,
    <svg key={17} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M22 8l17 9-17 9-17-9 17-9z" fill={color} opacity=".55"/>
      <path d="M5 22l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".75"/>
      <path d="M5 29l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".45"/>
    </svg>,
    <svg key={18} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M8 12h24a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H18l-6 5v-5H8a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill={color} opacity=".18" stroke={color} strokeWidth="1.3"/>
      <circle cx="16" cy="19" r="2" fill={color} opacity=".7"/>
      <circle cx="22" cy="19" r="2" fill={color} opacity=".7"/>
      <circle cx="28" cy="19" r="2" fill={color} opacity=".7"/>
    </svg>,
    <svg key={19} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M22 5L7 12v13c0 9 6.5 16 15 18 8.5-2 15-9 15-18V12L22 5z" fill={color} opacity=".12" stroke={color} strokeWidth="1.3"/>
      <path d="M15 22l5 5 9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>,
    <svg key={20} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M8 30a14 14 0 1 1 28 0" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".25"/>
      <path d="M8 30a14 14 0 0 1 22-13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <line x1="22" y1="30" x2="29" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="22" cy="30" r="3" fill={color}/>
    </svg>,
    <svg key={21} width="44" height="44" viewBox="0 0 44 44" fill="none">
      <path d="M22 6c0 0-11 7-11 19v5l5 5h12l5-5v-5C33 13 22 6 22 6z" fill={color} opacity=".22" stroke={color} strokeWidth="1.3"/>
      <circle cx="22" cy="21" r="4.5" fill={color} opacity=".8"/>
      <path d="M17 35l-4 6h4l2-4 2 4h5l-5-6" fill={color} opacity=".4"/>
    </svg>,
  ];
  return arts[index] ?? arts[0];
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const FAVICON = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%237F77DD'/><text x='16' y='22' font-size='16' font-family='system-ui' font-weight='700' fill='white' text-anchor='middle'>MK</text></svg>`;

export default function Home() {
  const [dark, setDark] = useState(true);
  const [days, setDays] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const link: HTMLLinkElement = document.querySelector("link[rel='icon']") ?? document.createElement("link");
    link.rel = "icon";
    link.href = `data:image/svg+xml,${FAVICON}`;
    document.head.appendChild(link);
    document.title = "Mehran Khan — Building 22 Apps";
    const start = new Date("2026-04-10");
    setDays(Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000)));
  }, []);

  const allProjects = phases.flatMap((p) => p.projects);

  const c = dark ? {
    bg: "#07070e", bg2: "#0d0d1c", bg3: "#15152a",
    card: "#0f0f1e", border: "rgba(255,255,255,0.07)", borderH: "rgba(255,255,255,0.16)",
    text: "#f0eee8", text2: "rgba(240,238,232,0.52)", text3: "rgba(240,238,232,0.24)",
    acc1: "#7F77DD", acc2: "#5DCAA5",
  } : {
    bg: "#f3f2ee", bg2: "#ffffff", bg3: "#e5e4df",
    card: "#ffffff", border: "rgba(0,0,0,0.08)", borderH: "rgba(127,119,221,0.4)",
    text: "#1a1928", text2: "rgba(26,25,40,0.55)", text3: "rgba(26,25,40,0.28)",
    acc1: "#534AB7", acc2: "#0F6E56",
  };

  let globalIdx = 0;

  return (
    <main style={{ background: c.bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: c.text, transition: "background .25s, color .25s" }}>

      {/* ── NAV ── */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", borderBottom: `1px solid ${c.border}`, background: c.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <rect width="30" height="30" rx="8" fill={c.acc1}/>
            <text x="15" y="21" fontSize="14" fontFamily="system-ui" fontWeight="700" fill="white" textAnchor="middle">MK</text>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500 }}>mehrankhan.net</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: c.text3 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.acc2, display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            building live
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme" style={{ width: 42, height: 24, borderRadius: 12, background: c.bg3, border: `1px solid ${c.border}`, cursor: "pointer", position: "relative", flexShrink: 0, transition: "background .25s" }}>
            <span style={{ position: "absolute", top: 3, left: dark ? 3 : 19, width: 16, height: 16, borderRadius: "50%", background: c.acc1, transition: "left .2s", display: "block" }} />
          </button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div style={{ overflow: "hidden", background: c.bg2, borderBottom: `1px solid ${c.border}`, padding: "8px 0" }}>
        <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 36s linear infinite" }}>
          {[...allProjects, ...allProjects].map((p, i) => (
            <span key={i} style={{ fontSize: 11, color: c.acc1, padding: "0 24px", letterSpacing: "0.05em", opacity: 0.75 }}>
              {p.name} <span style={{ opacity: 0.3 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <div style={{ padding: "60px 28px 50px", textAlign: "center" }}>
        <div style={{ margin: "0 auto 24px", width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${c.acc1}, ${c.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>
          MK
        </div>
        <div style={{ fontSize: 11, letterSpacing: "0.13em", color: c.acc2, textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>
          22 projects · 4 phases · 1 developer
        </div>
        <h1 style={{ fontSize: "clamp(40px,8vw,68px)", fontWeight: 500, lineHeight: 1.05, background: `linear-gradient(135deg,${c.text} 15%,${c.acc1} 50%,${c.acc2} 85%)`, backgroundSize: "200% 200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "gradShift 6s ease infinite", marginBottom: 16 }}>
          Mehran Khan
        </h1>
        <p style={{ fontSize: 17, color: c.text2, lineHeight: 1.72, maxWidth: 520, margin: "0 auto 8px" }}>
          My journey is to build <strong style={{ color: c.text }}>22 world class apps</strong> from absolute zero.<br />Watch me do it.
        </p>
        <p style={{ fontSize: 12, color: c.text3, fontStyle: "italic", marginBottom: 32 }}>Every tile is a real app. Click the live ones.</p>
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: c.text3, marginBottom: 8 }}>
            <span>journey progress</span><span>{DONE} of 22 shipped</span>
          </div>
          <div style={{ height: 4, background: c.bg3, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((DONE / 22) * 100)}%`, background: `linear-gradient(90deg,${c.acc1},${c.acc2})`, borderRadius: 2, transition: "width 1.5s cubic-bezier(.4,0,.2,1)" }} />
          </div>
        </div>
      </div>

      {/* ── PHASES + TILES ── */}
      {phases.map((phase, phaseIdx) => {
        const phaseStart = globalIdx;
        globalIdx += phase.projects.length;
        return (
          <div key={phase.label} style={{ padding: "0 28px 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 16px" }}>
              <PhaseIcon color={phase.color} phase={phaseIdx} />
              <span style={{ fontSize: 10, fontWeight: 500, padding: "5px 12px", borderRadius: 20, letterSpacing: "0.05em", background: phase.colorBg, color: phase.color, border: `1px solid ${phase.colorBorder}`, flexShrink: 0 }}>
                {phase.label}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: c.text }}>{phase.title}</span>
              <span style={{ fontSize: 12, color: c.text3 }}>— {phase.desc}</span>
              <div style={{ flex: 1, height: 1, background: c.border }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12, marginBottom: 8 }}>
              {phase.projects.map((p, pi) => {
                const i = phaseStart + pi;
                const isDone = i < DONE;
                const isNext = i === DONE;
                const isLocked = !isDone && !isNext;
                const isHov = hovered === i;

                const badgeText = isDone ? "live" : isNext ? "up next" : p.type === "gap" ? "gap-filler" : p.type === "con" ? "consolidation" : null;
                const badgeBg = isDone ? "rgba(93,202,165,0.15)" : isNext ? "rgba(127,119,221,0.18)" : p.type === "gap" ? "rgba(239,159,39,0.14)" : "rgba(240,153,123,0.14)";
                const badgeColor = isDone ? c.acc2 : isNext ? c.acc1 : p.type === "gap" ? "#EF9F27" : "#F0997B";

                return (
                  <a
                    key={p.id}
                    href={isDone && p.live ? p.live : undefined}
                    target={isDone && p.live ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={isLocked ? (e) => e.preventDefault() : undefined}
                    onMouseEnter={() => !isLocked && setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${isHov || isDone || isNext ? phase.colorBorder : c.border}`,
                      padding: "16px 14px 36px",
                      background: isHov ? phase.colorBg : isDone ? phase.colorBg : c.card,
                      cursor: isLocked ? "not-allowed" : "pointer",
                      position: "relative",
                      overflow: "hidden",
                      textDecoration: "none",
                      display: "block",
                      opacity: isLocked ? 0.2 : 1,
                      transform: isHov ? "translateY(-5px) scale(1.02)" : "none",
                      transition: "all .2s ease",
                    }}
                  >
                    <div style={{ marginBottom: 10 }}>
                      <TileArt index={i} color={phase.color} />
                    </div>
                    <div style={{ fontSize: 10, color: c.text3, fontFamily: "monospace", marginBottom: 7 }}>{p.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.text, marginBottom: 4, lineHeight: 1.35 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: c.text3, lineHeight: 1.5 }}>{p.tag}</div>
                    {!isLocked && (
                      <span style={{ position: "absolute", top: 12, right: 12, fontSize: 13, color: phase.color, opacity: isHov ? 1 : 0, transform: isHov ? "translate(0,0)" : "translate(-3px,3px)", transition: "all .2s" }}>↗</span>
                    )}
                    {badgeText && (
                      <span style={{ position: "absolute", bottom: 10, right: 10, fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 20, background: badgeBg, color: badgeColor }}>
                        {badgeText}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── ABOUT ── */}
      <div style={{ margin: "36px 28px", borderRadius: 20, background: c.bg2, border: `1px solid ${c.border}`, padding: "28px 24px", display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ width: 58, height: 58, minWidth: 58, borderRadius: "50%", background: `linear-gradient(135deg,${c.acc1},${c.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MK</div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 500, color: c.text, marginBottom: 6 }}>My mission</p>
          <p style={{ fontSize: 14, color: c.text2, lineHeight: 1.8 }}>
            To build 22 world class apps, learn everything along the way, and document every step publicly. Some of these will be rough early on. That&apos;s the point. Come back in 6 months and see the difference.
          </p>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, margin: "0 28px 40px" }}>
        {[
          { n: DONE, label: "apps shipped", color: c.acc1 },
          { n: 22,   label: "total planned", color: c.text },
          { n: days, label: "days building", color: c.acc2 },
        ].map((s) => (
          <div key={s.label} style={{ background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 16, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 500, color: s.color, lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: c.text3, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <footer style={{ padding: "22px 28px", borderTop: `1px solid ${c.border}`, textAlign: "center", fontSize: 11, color: c.text3 }}>
        mehrankhan.net — updated every time something ships
      </footer>

      <style>{`
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse     { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
      `}</style>
    </main>
  );
}
