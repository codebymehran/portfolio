"use client";

import { useState, useEffect, useMemo } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TOTAL = 22;
const DONE = 0;
const START_DATE = new Date("2026-04-10");

// ─── DATA ────────────────────────────────────────────────────────────────────

const phases = [
  {
    label: "Phase 1", title: "Core React", desc: "components · state · hooks · TypeScript",
    color: "#9B8FFF", colorBg: "rgba(155,143,255,0.08)", colorBorder: "rgba(155,143,255,0.25)",
    projects: [
      { id:"01",   name:"Task manager",     desc:"A to-do app that actually works — add, complete, delete tasks.",          live:"", type:"" },
      { id:"02",   name:"Expense tracker",  desc:"Track where your money goes with smart categories and totals.",           live:"", type:"" },
      { id:"02.5", name:"Weather widget",   desc:"Live weather for any city, pulling from a real forecast API.",            live:"", type:"" },
      { id:"03",   name:"Quiz app",         desc:"A slick multi-step quiz with scoring, timers, and results.",              live:"", type:"" },
      { id:"04",   name:"Recipe book",      desc:"Save and browse your favourite recipes with search and filters.",         live:"", type:"" },
      { id:"05",   name:"Kanban board",     desc:"Drag-and-drop task board — like Trello, built from scratch.",             live:"", type:"" },
      { id:"05.5", name:"Theme & settings", desc:"A settings panel with theme switching that remembers your preferences.",  live:"", type:"" },
      { id:"05C",  name:"Habit tracker",    desc:"Build streaks, log daily habits, and watch consistency compound.",        live:"", type:"" },
    ],
  },
  {
    label: "Phase 2", title: "Next.js Frontend", desc: "App Router · Tailwind · real APIs",
    color: "#4ECBA8", colorBg: "rgba(78,203,168,0.08)", colorBorder: "rgba(78,203,168,0.25)",
    projects: [
      { id:"06",   name:"Portfolio site",   desc:"A personal portfolio with fast page loads and beautiful typography.",     live:"", type:"" },
      { id:"07",   name:"Movie browser",    desc:"Search and discover films using a live movie database.",                  live:"", type:"" },
      { id:"07.5", name:"Notes app",        desc:"A rich-text note editor with auto-save and formatting tools.",            live:"", type:"" },
      { id:"08",   name:"Dashboard UI",     desc:"An analytics dashboard with live charts, filters, and data tables.",      live:"", type:"" },
      { id:"09",   name:"E-commerce store", desc:"A fully browsable shop with cart, checkout flow, and product pages.",     live:"", type:"" },
      { id:"09C",  name:"Music library",    desc:"Browse, play, and organise a personal music collection.",                 live:"", type:"" },
    ],
  },
  {
    label: "Phase 3", title: "Full Stack", desc: "Prisma · PostgreSQL · auth · Stripe",
    color: "#FF8B6B", colorBg: "rgba(255,139,107,0.08)", colorBorder: "rgba(255,139,107,0.25)",
    projects: [
      { id:"10",   name:"Full stack tasks", desc:"A task app with real accounts — sign up, log in, your data stays.",       live:"", type:"" },
      { id:"10.5", name:"Link shortener",   desc:"Paste a long URL, get a short one. Simple product, real engineering.",    live:"", type:"" },
      { id:"11",   name:"Blog + CMS",       desc:"A blog you can actually write and publish from — no code needed.",        live:"", type:"" },
      { id:"12",   name:"SaaS starter",     desc:"A subscription app with paid plans, billing, and team accounts.",         live:"", type:"" },
      { id:"12C",  name:"Real-time chat",   desc:"Messages that appear instantly — no refresh, no delay.",                  live:"", type:"" },
    ],
  },
  {
    label: "Phase 4", title: "Production Level", desc: "testing · CI/CD · real users",
    color: "#FFB830", colorBg: "rgba(255,184,48,0.08)", colorBorder: "rgba(255,184,48,0.25)",
    projects: [
      { id:"13",   name:"Test coverage",    desc:"Every critical feature tested — automated checks run on every save.",     live:"", type:"" },
      { id:"13.5", name:"Perf & a11y audit",desc:"Fast, accessible, and usable by everyone — measured and proven.",         live:"", type:"" },
      { id:"14",   name:"Real product",     desc:"My own idea, built for real users, with a real business model.",          live:"", type:"" },
    ],
  },
];

const allProjects = phases.flatMap((p) => p.projects);

const COMING_SOON = [
  "This one's coming — stay tuned.",
  "In the queue. Won't be long.",
  "Not yet, but it's being planned.",
  "Coming soon — good things take time.",
  "On the roadmap. Watch this space.",
  "Being built. Check back soon.",
  "Next up on the journey.",
  "Almost its turn.",
];

// ─── TILE ART ─────────────────────────────────────────────────────────────────

const tileArts = (color: string) => [
  <svg key={0} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="6" y="8" width="32" height="28" rx="4" fill={color} opacity=".08"/><circle cx="10" cy="17" r="2" fill={color}/><line x1="14" y1="17" x2="34" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><circle cx="10" cy="24" r="2" fill={color} opacity=".5"/><line x1="14" y1="24" x2="28" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".5"/><circle cx="10" cy="31" r="2" fill={color} opacity=".25"/><line x1="14" y1="31" x2="22" y2="31" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".25"/></svg>,
  <svg key={1} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="5" y="33" width="7" height="7" rx="2" fill={color} opacity=".25"/><rect x="14" y="25" width="7" height="15" rx="2" fill={color} opacity=".45"/><rect x="23" y="17" width="7" height="23" rx="2" fill={color} opacity=".7"/><rect x="32" y="9" width="7" height="31" rx="2" fill={color}/></svg>,
  <svg key={2} width="40" height="40" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="8" fill={color} opacity=".75"/>{[0,45,90,135,180,225,270,315].map((a,i)=>{const r=Math.PI*a/180;return <line key={i} x1={22+12*Math.cos(r)} y1={22+12*Math.sin(r)} x2={22+16*Math.cos(r)} y2={22+16*Math.sin(r)} stroke={color} strokeWidth="2" strokeLinecap="round"/>})}</svg>,
  <svg key={3} width="40" height="40" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="17" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><text x="22" y="30" fontSize="22" fontFamily="Georgia,serif" fontWeight="700" fill={color} textAnchor="middle">?</text></svg>,
  <svg key={4} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="8" y="6" width="18" height="32" rx="2" fill={color} opacity=".1" stroke={color} strokeWidth="1.2"/><rect x="18" y="6" width="18" height="32" rx="2" fill={color} opacity=".2" stroke={color} strokeWidth="1.2"/><line x1="22" y1="14" x2="32" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".65"/><line x1="22" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".45"/><line x1="22" y1="26" x2="28" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".25"/></svg>,
  <svg key={5} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="4" y="9" width="10" height="27" rx="3" fill={color} opacity=".12" stroke={color} strokeWidth="1.2"/><rect x="17" y="9" width="10" height="27" rx="3" fill={color} opacity=".32" stroke={color} strokeWidth="1.2"/><rect x="30" y="9" width="10" height="27" rx="3" fill={color} opacity=".58" stroke={color} strokeWidth="1.2"/><rect x="6" y="13" width="6" height="5" rx="1.5" fill={color} opacity=".65"/><rect x="19" y="13" width="6" height="5" rx="1.5" fill={color} opacity=".75"/><rect x="19" y="21" width="6" height="5" rx="1.5" fill={color} opacity=".55"/><rect x="32" y="13" width="6" height="5" rx="1.5" fill={color}/></svg>,
  <svg key={6} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="6" y="17" width="32" height="11" rx="5.5" fill={color} opacity=".15" stroke={color} strokeWidth="1.2"/><circle cx="32" cy="22.5" r="5" fill={color}/><circle cx="13" cy="22.5" r="3" fill={color} opacity=".28"/></svg>,
  <svg key={7} width="40" height="40" viewBox="0 0 44 44" fill="none">{Array.from({length:7}).map((_,col)=>Array.from({length:4}).map((_,row)=>{const seed=(col*4+row)*2654435761;const filled=(seed%100)>38;return <rect key={`${col}-${row}`} x={6+col*5.2} y={13+row*5.2} width="3.8" height="3.8" rx="1" fill={color} opacity={filled?0.75:0.1}/>}))}</svg>,
  <svg key={8} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="4" y="8" width="36" height="28" rx="4" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="4" y1="16" x2="40" y2="16" stroke={color} strokeWidth="1" opacity=".35"/><circle cx="10" cy="12" r="2" fill={color} opacity=".45"/><circle cx="16" cy="12" r="2" fill={color} opacity=".28"/><rect x="10" y="20" width="24" height="3" rx="1.5" fill={color} opacity=".38"/><rect x="10" y="26" width="16" height="3" rx="1.5" fill={color} opacity=".22"/><rect x="10" y="32" width="10" height="3" rx="1.5" fill={color} opacity=".12"/></svg>,
  <svg key={9} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="6" y="10" width="32" height="24" rx="3" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><rect x="6" y="10" width="6" height="24" fill={color} opacity=".15"/><rect x="32" y="10" width="6" height="24" fill={color} opacity=".15"/>{[0,1,2,3].map(i=><rect key={i} x="8" y={13+i*5} width="2" height="3" rx="1" fill={color} opacity=".55"/>)}{[0,1,2,3].map(i=><rect key={i} x="34" y={13+i*5} width="2" height="3" rx="1" fill={color} opacity=".55"/>)}<polygon points="20,18 20,26 28,22" fill={color} opacity=".65"/></svg>,
  <svg key={10} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="8" y="5" width="28" height="34" rx="3" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="14" y1="15" x2="30" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".6"/><line x1="14" y1="21" x2="30" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".4"/><line x1="14" y1="27" x2="24" y2="27" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".22"/><rect x="26" y="26" width="10" height="10" rx="2" fill={color} opacity=".72"/><path d="M28 31h6M31 28v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={11} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M22 8 A14 14 0 0 1 36 22 L22 22Z" fill={color} opacity=".75"/><path d="M36 22 A14 14 0 0 1 12 32 L22 22Z" fill={color} opacity=".45"/><path d="M12 32 A14 14 0 0 1 22 8 L22 22Z" fill={color} opacity=".22"/><circle cx="22" cy="22" r="5.5" fill="none" stroke={color} strokeWidth="2" opacity=".3"/></svg>,
  <svg key={12} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M6 8h4l5 18h18l4-12H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="20" cy="33" r="3" fill={color} opacity=".65"/><circle cx="32" cy="33" r="3" fill={color} opacity=".65"/></svg>,
  <svg key={13} width="40" height="40" viewBox="0 0 44 44" fill="none">{[6,12,18,24,30,36,42].map((x,i)=>{const h=[8,16,26,20,30,14,10][i];return <rect key={i} x={x-1.5} y={22-h/2} width="3" height={h} rx="1.5" fill={color} opacity={0.25+i*0.1}/>})}</svg>,
  <svg key={14} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill={color} opacity=".18" stroke={color} strokeWidth="1.2"/><rect x="24" y="4" width="16" height="16" rx="4" fill={color} opacity=".4" stroke={color} strokeWidth="1.2"/><rect x="4" y="24" width="16" height="16" rx="4" fill={color} opacity=".65" stroke={color} strokeWidth="1.2"/><rect x="24" y="24" width="16" height="16" rx="4" fill={color} stroke={color} strokeWidth="1.2"/><path d="M27 32l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={15} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M18 26a7 7 0 0 0 9.9 0l5-5a7 7 0 0 0-9.9-9.9L21 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M26 18a7 7 0 0 0-9.9 0l-5 5a7 7 0 0 0 9.9 9.9L23 31" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".5"/></svg>,
  <svg key={16} width="40" height="40" viewBox="0 0 44 44" fill="none"><rect x="8" y="8" width="22" height="28" rx="2" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="13" y1="17" x2="25" y2="17" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".55"/><line x1="13" y1="23" x2="25" y2="23" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".35"/><line x1="13" y1="29" x2="20" y2="29" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".2"/><path d="M28 26l8-8-4-4-8 8v4h4z" fill={color} opacity=".8"/></svg>,
  <svg key={17} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M22 8l17 9-17 9-17-9 17-9z" fill={color} opacity=".5"/><path d="M5 22l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/><path d="M5 29l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".4"/></svg>,
  <svg key={18} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M8 12h24a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H18l-6 5v-5H8a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill={color} opacity=".15" stroke={color} strokeWidth="1.2"/><circle cx="16" cy="19" r="2" fill={color} opacity=".65"/><circle cx="22" cy="19" r="2" fill={color} opacity=".65"/><circle cx="28" cy="19" r="2" fill={color} opacity=".65"/></svg>,
  <svg key={19} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M22 5L7 12v13c0 9 6.5 16 15 18 8.5-2 15-9 15-18V12L22 5z" fill={color} opacity=".1" stroke={color} strokeWidth="1.2"/><path d="M15 22l5 5 9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={20} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M8 30a14 14 0 1 1 28 0" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".22"/><path d="M8 30a14 14 0 0 1 22-13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="22" y1="30" x2="29" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="22" cy="30" r="3" fill={color}/></svg>,
  <svg key={21} width="40" height="40" viewBox="0 0 44 44" fill="none"><path d="M22 6c0 0-11 7-11 19v5l5 5h12l5-5v-5C33 13 22 6 22 6z" fill={color} opacity=".18" stroke={color} strokeWidth="1.2"/><circle cx="22" cy="21" r="4.5" fill={color} opacity=".75"/><path d="M17 35l-4 6h4l2-4 2 4h5l-5-6" fill={color} opacity=".38"/></svg>,
];

// ─── PHASE ICONS ─────────────────────────────────────────────────────────────

function PhaseIcon({ color, phase }: { color: string; phase: number }) {
  if (phase === 0) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" fill={color}/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none"/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(60 10 10)"/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(120 10 10)"/></svg>;
  if (phase === 1) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="2" fill={color}/><rect x="11" y="2" width="7" height="7" rx="2" fill={color} opacity=".45"/><rect x="2" y="11" width="7" height="7" rx="2" fill={color} opacity=".45"/><rect x="11" y="11" width="7" height="7" rx="2" fill={color}/></svg>;
  if (phase === 2) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="5.5" rx="7" ry="3" stroke={color} strokeWidth="1.3" fill="none"/><path d="M3 5.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/><path d="M3 10.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/></svg>;
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6l2-6z" fill={color}/></svg>;
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────

function Tooltip({ text, visible, color }: { text: string; visible: boolean; color: string }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "calc(100% + 10px)",
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 6}px)`,
      background: "rgba(10,10,22,0.97)",
      backdropFilter: "blur(14px)",
      border: `1px solid ${color}35`,
      borderRadius: 10,
      padding: "8px 13px",
      fontSize: 12,
      color: "#ddd9ff",
      lineHeight: 1.5,
      opacity: visible ? 1 : 0,
      transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
      pointerEvents: "none",
      zIndex: 50,
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      width: 190,
      textAlign: "center",
    }}>
      {text}
      <div style={{
        position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)",
        width: 8, height: 8,
        background: "rgba(10,10,22,0.97)",
        border: `1px solid ${color}35`,
        borderTop: "none", borderLeft: "none",
      }} />
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────

type Colors = {
  card: string; bg: string; bg3: string; border: string; borderH: string;
  text: string; text2: string; text3: string; acc1: string; acc2: string;
};

function FeedbackModal({ open, onClose, colors }: { open: boolean; onClose: () => void; colors: Colors }) {
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!msg.trim()) return;
    setSent(true);
    setTimeout(() => { setSent(false); setMsg(""); onClose(); }, 2000);
  };

  if (!open) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 440,
        boxShadow: "0 24px 80px rgba(0,0,0,0.45)", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14,
          width: 30, height: 30, borderRadius: "50%",
          background: colors.bg3, border: `1px solid ${colors.border}`,
          color: colors.text3, fontSize: 18, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit", lineHeight: 1,
        }}>×</button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🙏</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 8, letterSpacing: "-0.02em" }}>
              Thank you!
            </p>
            <p style={{ fontSize: 14, color: colors.text2 }}>Mehran will see this.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.acc1, fontWeight: 600, marginBottom: 10 }}>
              Leave a note
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 8, letterSpacing: "-0.025em", fontFamily: "'DM Serif Display', Georgia, serif" }}>
              What do you think?
            </p>
            <p style={{ fontSize: 13.5, color: colors.text2, marginBottom: 24, lineHeight: 1.65 }}>
              Encouragement, a question, anything — Mehran reads every message.
            </p>
            <textarea value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Type something..."
              rows={4}
              style={{
                width: "100%", background: colors.bg,
                border: `1px solid ${colors.borderH}`, borderRadius: 12,
                padding: "13px 15px", fontSize: 14, color: colors.text,
                resize: "none", outline: "none", fontFamily: "inherit",
                lineHeight: 1.6, marginBottom: 16, display: "block",
              }}
            />
            <button onClick={handleSend} style={{
              width: "100%", padding: "13px", borderRadius: 12,
              background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
              border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: msg.trim() ? "pointer" : "not-allowed",
              opacity: msg.trim() ? 1 : 0.45,
              letterSpacing: "-0.01em", transition: "opacity 0.2s",
              fontFamily: "inherit",
            }}>
              Send message
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── COLOR BUILDER ────────────────────────────────────────────────────────────

function buildColors(dark: boolean) {
  return dark ? {
    bg:           "#080812",
    bg2:          "#0e0e1d",
    bg3:          "#14142c",
    card:         "#0e0e1e",
    border:       "rgba(255,255,255,0.07)",
    borderH:      "rgba(155,143,255,0.3)",
    text:         "#eeeaf8",
    text2:        "rgba(238,234,248,0.68)",
    text3:        "rgba(238,234,248,0.4)",
    text4:        "rgba(238,234,248,0.2)",
    acc1:         "#9B8FFF",
    acc2:         "#4ECBA8",
    navBg:        "rgba(8,8,18,0.9)",
    lockedBg:     "rgba(255,255,255,0.018)",
    lockedBorder: "rgba(255,255,255,0.055)",
    lockedText:   "rgba(238,234,248,0.28)",
  } : {
    bg:           "#f4f3ef",
    bg2:          "#ffffff",
    bg3:          "#e8e6e0",
    card:         "#ffffff",
    border:       "rgba(0,0,0,0.08)",
    borderH:      "rgba(90,76,200,0.25)",
    text:         "#18172e",
    text2:        "rgba(24,23,46,0.65)",
    text3:        "rgba(24,23,46,0.42)",
    text4:        "rgba(24,23,46,0.24)",
    acc1:         "#5A4CC8",
    acc2:         "#0F7A5A",
    navBg:        "rgba(244,243,239,0.92)",
    lockedBg:     "rgba(24,23,46,0.03)",
    lockedBorder: "rgba(24,23,46,0.07)",
    lockedText:   "rgba(24,23,46,0.32)",
  };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(true);
  const [days, setDays] = useState(1);
  const [hovered, setHovered] = useState<number | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const link: HTMLLinkElement =
      document.querySelector("link[rel='icon']") ?? document.createElement("link");
    link.rel = "icon";
    link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%239B8FFF'/><text x='16' y='22' font-size='14' font-family='system-ui' font-weight='700' fill='white' text-anchor='middle'>MK</text></svg>`;
    document.head.appendChild(link);
    document.title = "Mehran Khan — Building 22 Apps";
    setDays(Math.max(1, Math.floor((Date.now() - START_DATE.getTime()) / 86400000)));
  }, []);

  const colors = useMemo(() => buildColors(dark), [dark]);
  const pct = Math.round((DONE / TOTAL) * 100);
  let globalIdx = 0;

  return (
    <main style={{
      background: colors.bg,
      minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      color: colors.text,
      transition: "background 0.3s, color 0.3s",
      overflowX: "hidden",
    }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "5%", width: "55vw", height: "55vh", background: `radial-gradient(ellipse, ${colors.acc1}12 0%, transparent 68%)` }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "0%", width: "45vw", height: "45vh", background: `radial-gradient(ellipse, ${colors.acc2}0c 0%, transparent 68%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── NAV ── */}
        <nav style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 32px", height: 60,
          borderBottom: `1px solid ${colors.border}`,
          background: colors.navBg, backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>MK</div>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}>mehrankhan.net</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setFeedbackOpen(true)}
              style={{
                padding: "6px 15px", borderRadius: 20,
                background: "transparent", border: `1px solid ${colors.border}`,
                color: colors.text3, fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.acc1;
                (e.currentTarget as HTMLButtonElement).style.color = colors.acc1;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLButtonElement).style.color = colors.text3;
              }}
            >
              Leave a note
            </button>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              aria-pressed={dark}
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: colors.bg3, border: `1px solid ${colors.border}`,
                cursor: "pointer", position: "relative",
                transition: "background 0.3s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 4, left: dark ? 4 : 20,
                width: 16, height: 16, borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
                transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
                display: "block", boxShadow: `0 2px 6px ${colors.acc1}55`,
              }} />
            </button>
          </div>
        </nav>

        {/* ── TICKER ── */}
        <div style={{
          overflow: "hidden",
          background: dark ? "rgba(155,143,255,0.025)" : "rgba(90,76,200,0.025)",
          borderBottom: `1px solid ${colors.border}`,
          padding: "8px 0",
        }}>
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "ticker 52s linear infinite" }}>
            {[...allProjects, ...allProjects].map((p, i) => (
              <span key={i} style={{ fontSize: 11, color: colors.text4, padding: "0 20px", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                {p.name}<span style={{ marginLeft: 20, opacity: 0.5 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{
          padding: "72px 32px 52px", textAlign: "center",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.75s ease, transform 0.75s ease",
        }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 26 }}>
            <div style={{
              width: 86, height: 86, borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, color: "#fff",
              boxShadow: `0 0 0 8px ${dark ? "rgba(155,143,255,0.08)" : "rgba(90,76,200,0.07)"}, 0 8px 40px ${colors.acc1}28`,
            }}>MK</div>
            <span style={{
              position: "absolute", bottom: 4, right: 4,
              width: 15, height: 15, borderRadius: "50%",
              background: colors.acc2, border: `3px solid ${colors.bg}`,
              boxShadow: `0 0 10px ${colors.acc2}`,
              animation: "pulseGlow 2.6s ease-in-out infinite",
            }} />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, letterSpacing: "0.14em", color: colors.acc2,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 20,
            padding: "5px 16px", borderRadius: 20,
            background: dark ? "rgba(78,203,168,0.07)" : "rgba(15,122,90,0.06)",
            border: `1px solid ${dark ? "rgba(78,203,168,0.18)" : "rgba(15,122,90,0.14)"}`,
          }}>
            {TOTAL} projects · 4 phases · 1 developer
          </div>

          <h1 style={{
            fontSize: "clamp(48px,9vw,86px)", fontWeight: 400,
            letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 22,
            fontFamily: "'DM Serif Display', Georgia, serif",
          }}>
            <span style={{
              background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.acc1} 45%, ${colors.acc2} 85%)`,
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", animation: "gradShift 8s ease infinite",
            }}>Mehran Khan</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px,2.1vw,20px)", color: colors.text2,
            lineHeight: 1.68, maxWidth: 570, margin: "0 auto 12px", letterSpacing: "-0.01em",
          }}>
            I set myself a challenge: build{" "}
            <strong style={{ color: colors.text, fontWeight: 600 }}>22 fully working apps</strong>{" "}
            — from the simplest to-do list right up to a product that real people pay for.
            Every single one shipped. No shortcuts.
          </p>
          <p style={{ fontSize: 14, color: colors.text3, lineHeight: 1.78, maxWidth: 480, margin: "0 auto 40px" }}>
            This page is the live record of that journey. Watch the tiles light up one by one.
          </p>

          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.text3, marginBottom: 10 }}>
              <span>journey progress</span>
              <span style={{ color: colors.text2 }}>{DONE} of {TOTAL} shipped</span>
            </div>
            <div style={{ height: 5, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: mounted ? `${DONE > 0 ? Math.max(pct, 3) : 0}%` : "0%",
                background: `linear-gradient(90deg, ${colors.acc1}, ${colors.acc2})`,
                borderRadius: 3, transition: "width 1.8s cubic-bezier(.4,0,.2,1)",
                boxShadow: `0 0 10px ${colors.acc1}55`,
              }} />
            </div>
          </div>
        </div>

        {/* ── QUOTE BANNER ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto 8px" }}>
          <div style={{
            borderRadius: 20,
            background: dark
              ? "linear-gradient(135deg, rgba(155,143,255,0.06) 0%, rgba(78,203,168,0.035) 100%)"
              : "linear-gradient(135deg, rgba(90,76,200,0.05) 0%, rgba(15,122,90,0.025) 100%)",
            border: `1px solid ${dark ? "rgba(155,143,255,0.13)" : "rgba(90,76,200,0.1)"}`,
            padding: "28px 32px",
            textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -40, left: -40, width: 180, height: 180, background: `radial-gradient(circle, ${colors.acc1}0e 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, background: `radial-gradient(circle, ${colors.acc2}0a 0%, transparent 70%)`, pointerEvents: "none" }} />
            <p style={{
              fontSize: "clamp(17px,2.6vw,24px)",
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontStyle: "italic", color: colors.text,
              lineHeight: 1.45, letterSpacing: "-0.02em", position: "relative",
            }}>
              &ldquo;Took a sledgehammer to my comfort zone.&nbsp; Currently homeless.&rdquo;
            </p>
            <p style={{ fontSize: 12, color: colors.text3, marginTop: 10, letterSpacing: "0.06em" }}>— Mehran Khan</p>
          </div>
        </div>

        {/* ── PHASES + TILES ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto" }}>
          {phases.map((phase, phaseIdx) => {
            const phaseStart = globalIdx;
            globalIdx += phase.projects.length;
            return (
              <div key={phase.label} style={{ marginBottom: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 12, margin: "40px 0 18px",
                  opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px)",
                  transition: `opacity 0.6s ease ${0.1 + phaseIdx * 0.07}s, transform 0.6s ease ${0.1 + phaseIdx * 0.07}s`,
                }}>
                  <PhaseIcon color={phase.color} phase={phaseIdx} />
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    background: phase.colorBg, color: phase.color, border: `1px solid ${phase.colorBorder}`,
                  }}>{phase.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors.text, letterSpacing: "-0.02em" }}>{phase.title}</span>
                  <span style={{ fontSize: 12, color: colors.text3 }}>— {phase.desc}</span>
                  <div style={{ flex: 1, height: 1, background: colors.border }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 12 }}>
                  {phase.projects.map((p, pi) => {
                    const i = phaseStart + pi;
                    const isDone = i < DONE;
                    const isNext = i === DONE;
                    const isLocked = !isDone && !isNext;
                    const isHov = hovered === i;

                    const tooltipText = isDone
                      ? `Open ${p.name} ↗`
                      : isNext
                      ? "This one's up next — almost ready."
                      : COMING_SOON[i % COMING_SOON.length];

                    return (
                      <div key={p.id} style={{ position: "relative" }}>
                        <Tooltip text={tooltipText} visible={isHov} color={phase.color} />
                        <a
                          href={isDone && p.live ? p.live : undefined}
                          target={isDone && p.live ? "_blank" : undefined}
                          rel="noreferrer"
                          aria-label={`${p.name}${isLocked ? " — coming soon" : isDone ? " — view live" : " — up next"}`}
                          onMouseEnter={() => setHovered(i)}
                          onMouseLeave={() => setHovered(null)}
                          style={{
                            borderRadius: 18,
                            border: `1px solid ${
                              isLocked ? colors.lockedBorder
                              : isHov ? phase.colorBorder
                              : isDone || isNext ? phase.colorBorder
                              : colors.border
                            }`,
                            padding: "18px 16px 38px",
                            background: isLocked
                              ? colors.lockedBg
                              : isHov || isDone
                              ? (dark ? `linear-gradient(145deg, ${phase.colorBg}, ${colors.card})` : phase.colorBg)
                              : colors.card,
                            cursor: isDone && p.live ? "pointer" : "default",
                            position: "relative", overflow: "visible",
                            textDecoration: "none", display: "block",
                            transform: isHov && !isLocked ? "translateY(-5px) scale(1.015)" : "none",
                            transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
                            boxShadow: isHov && !isLocked
                              ? `0 14px 36px ${phase.color}18, 0 4px 12px rgba(0,0,0,0.12)`
                              : "none",
                          }}
                        >
                          {(isDone || isNext) && (
                            <div style={{
                              position: "absolute", top: 0, left: "25%", right: "25%", height: 2,
                              background: `linear-gradient(90deg, transparent, ${phase.color}55, transparent)`,
                              borderRadius: "0 0 2px 2px",
                            }} />
                          )}

                          <div style={{ marginBottom: 14, opacity: isLocked ? 0.35 : 1, transition: "opacity 0.2s" }}>
                            {tileArts(phase.color)[i] ?? tileArts(phase.color)[0]}
                          </div>

                          <div style={{ fontSize: 9.5, color: isLocked ? colors.lockedText : colors.text4, fontFamily: "'DM Mono', monospace", marginBottom: 7, letterSpacing: "0.06em" }}>
                            {p.id}
                          </div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: isLocked ? colors.lockedText : colors.text, marginBottom: 5, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11, color: isLocked ? colors.lockedText : colors.text3, lineHeight: 1.55 }}>
                            {p.desc}
                          </div>

                          {isDone && (
                            <span style={{
                              position: "absolute", top: 14, right: 14, fontSize: 13, color: phase.color,
                              opacity: isHov ? 1 : 0, transform: isHov ? "translate(0,0)" : "translate(-3px,3px)",
                              transition: "all 0.18s ease",
                            }}>↗</span>
                          )}
                          {isNext && (
                            <span style={{
                              position: "absolute", bottom: 11, right: 11,
                              fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
                              background: dark ? "rgba(155,143,255,0.15)" : "rgba(90,76,200,0.09)",
                              color: colors.acc1, letterSpacing: "0.04em", textTransform: "uppercase",
                            }}>up next</span>
                          )}
                          {isLocked && (
                            <span style={{
                              position: "absolute", bottom: 11, right: 12, fontSize: 12,
                              opacity: isHov ? 0.5 : 0.2, transition: "opacity 0.2s",
                            }}>🔒</span>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MISSION BLOCK ── */}
        <div style={{ padding: "52px 32px 0", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{
            borderRadius: 24,
            background: dark
              ? "linear-gradient(135deg, rgba(155,143,255,0.05) 0%, rgba(78,203,168,0.028) 100%)"
              : "linear-gradient(135deg, rgba(90,76,200,0.04) 0%, rgba(15,122,90,0.02) 100%)",
            border: `1px solid ${colors.border}`,
            padding: "40px 36px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${colors.acc1}0c 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", position: "relative" }}>
              <div style={{
                width: 58, height: 58, minWidth: 58, borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 700, color: "#fff",
                boxShadow: `0 8px 24px ${colors.acc1}28`, flexShrink: 0,
              }}>MK</div>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.acc1, fontWeight: 600, marginBottom: 10 }}>
                  Why I&apos;m doing this
                </p>
                <p style={{ fontSize: 17, fontWeight: 600, color: colors.text, marginBottom: 14, lineHeight: 1.45, letterSpacing: "-0.025em" }}>
                  I wanted to build things that actually work — apps people use, not code that sits in a folder.
                </p>
                <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.82, marginBottom: 12 }}>
                  So I planned out 22 projects, each one designed to teach me something the previous one couldn&apos;t. Starting from the basics and ending with a real product with real users. No skipped steps, no faking it.
                </p>
                <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.82 }}>
                  This page exists so anyone who cares can follow along. If you&apos;re proud of me, I&apos;d love to know. If you have thoughts, drop a note — the button&apos;s at the top.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12, padding: "24px 32px 56px",
          maxWidth: 1100, margin: "0 auto",
        }}>
          {[
            { n: DONE,  label: "apps shipped", sub: `out of ${TOTAL}`, color: colors.acc1 },
            { n: days,  label: "days in",       sub: "and still going",  color: colors.acc2 },
            { n: TOTAL, label: "apps planned",  sub: "from scratch",     color: colors.text },
          ].map((s) => (
            <div key={s.label} style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: 18, padding: "22px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 300, color: s.color, lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "'DM Serif Display', Georgia, serif" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: colors.text2, marginTop: 7, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: colors.text3, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <footer style={{ padding: "22px 32px", borderTop: `1px solid ${colors.border}`, textAlign: "center", fontSize: 12, color: colors.text4, letterSpacing: "0.04em" }}>
          mehrankhan.net — updated every time something ships
        </footer>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} colors={colors} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Serif+Display:ital@0;1&family=DM+Mono&display=swap');
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulseGlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(155,143,255,0.2); border-radius: 3px; }
        textarea:focus { outline: none; box-shadow: 0 0 0 2px rgba(155,143,255,0.25); }
      `}</style>
    </main>
  );
}
