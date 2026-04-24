"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TOTAL = 22;
const DONE = 0;
const START_DATE = new Date("2026-04-10");
const GITHUB_USER = "codebymehran";
const GITHUB_REPO = "portfolio";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const phases = [
  {
    label: "Phase 1", title: "Core React", desc: "components · state · hooks · TypeScript",
    color: "#8B7CF6", colorLight: "#EDE9FE", colorBg: "rgba(139,124,246,0.08)", colorBorder: "rgba(139,124,246,0.22)",
    icon: "⚛",
    projects: [
      { id:"01",   name:"Task manager",     desc:"A to-do app that actually works — add, complete, delete tasks.",          live:"", stack:["React","TypeScript","localStorage"],  learned:"Lifting state, controlled components, and why unidirectional data flow actually makes your life easier." },
      { id:"02",   name:"Expense tracker",  desc:"Track where your money goes with smart categories and totals.",           live:"", stack:["React","Recharts","useReducer"],      learned:"Complex state with useReducer and how to turn raw numbers into something visually meaningful." },
      { id:"02.5", name:"Weather widget",   desc:"Live weather for any city, pulling from a real forecast API.",            live:"", stack:["React","OpenWeather API","useEffect"], learned:"Async data fetching, loading states, and handling API errors gracefully." },
      { id:"03",   name:"Quiz app",         desc:"A slick multi-step quiz with scoring, timers, and results.",              live:"", stack:["React","TypeScript","Framer Motion"], learned:"Multi-step flows, timers with useInterval, and animating between states." },
      { id:"04",   name:"Recipe book",      desc:"Save and browse your favourite recipes with search and filters.",         live:"", stack:["React","Fuse.js","localStorage"],     learned:"Client-side fuzzy search, complex filtering logic, and CRUD with persistence." },
      { id:"05",   name:"Kanban board",     desc:"Drag-and-drop task board — like Trello, built from scratch.",             live:"", stack:["React","dnd-kit","Zustand"],          learned:"Drag and drop primitives, optimistic UI updates, and global state with Zustand." },
      { id:"05.5", name:"Theme & settings", desc:"A settings panel with theme switching that remembers your preferences.",  live:"", stack:["React","Context API","CSS vars"],     learned:"React Context at scale, CSS custom properties, and persisting user preferences." },
      { id:"05C",  name:"Habit tracker",    desc:"Build streaks, log daily habits, and watch consistency compound.",        live:"", stack:["React","date-fns","IndexedDB"],       learned:"Date arithmetic, streak algorithms, and offline-first storage with IndexedDB." },
    ],
  },
  {
    label: "Phase 2", title: "Next.js Frontend", desc: "App Router · Tailwind · real APIs",
    color: "#10B981", colorLight: "#D1FAE5", colorBg: "rgba(16,185,129,0.08)", colorBorder: "rgba(16,185,129,0.22)",
    icon: "▲",
    projects: [
      { id:"06",   name:"Portfolio site",   desc:"A personal portfolio with fast page loads and beautiful typography.",     live:"", stack:["Next.js","Tailwind","MDX"],          learned:"App Router fundamentals, static generation, and why font loading strategy matters." },
      { id:"07",   name:"Movie browser",    desc:"Search and discover films using a live movie database.",                  live:"", stack:["Next.js","TMDB API","SWR"],           learned:"Server components vs client components and how to cache API responses properly." },
      { id:"07.5", name:"Notes app",        desc:"A rich-text note editor with auto-save and formatting tools.",            live:"", stack:["Next.js","Tiptap","Tailwind"],        learned:"ProseMirror internals, debounced auto-save, and building toolbar UI." },
      { id:"08",   name:"Dashboard UI",     desc:"An analytics dashboard with live charts, filters, and data tables.",      live:"", stack:["Next.js","Recharts","Tanstack Table"],learned:"Data visualisation patterns, virtual scrolling for tables, and responsive grid layouts." },
      { id:"09",   name:"E-commerce store", desc:"A fully browsable shop with cart, checkout flow, and product pages.",     live:"", stack:["Next.js","Zustand","Tailwind"],       learned:"Cart state management, optimistic stock updates, and multi-step checkout UX." },
      { id:"09C",  name:"Music library",    desc:"Browse, play, and organise a personal music collection.",                 live:"", stack:["Next.js","Web Audio API","SWR"],       learned:"The Web Audio API, visualiser with Canvas, and building a persistent queue." },
    ],
  },
  {
    label: "Phase 3", title: "Full Stack", desc: "Prisma · PostgreSQL · auth · Stripe",
    color: "#F59E0B", colorLight: "#FEF3C7", colorBg: "rgba(245,158,11,0.08)", colorBorder: "rgba(245,158,11,0.22)",
    icon: "⬡",
    projects: [
      { id:"10",   name:"Full stack tasks", desc:"A task app with real accounts — sign up, log in, your data stays.",       live:"", stack:["Next.js","Prisma","NextAuth"],        learned:"JWT sessions, role-based access control, and designing a sensible database schema." },
      { id:"10.5", name:"Link shortener",   desc:"Paste a long URL, get a short one. Simple product, real engineering.",    live:"", stack:["Next.js","Redis","Vercel Edge"],       learned:"Edge functions, Redis for low-latency lookups, and rate limiting." },
      { id:"11",   name:"Blog + CMS",       desc:"A blog you can actually write and publish from — no code needed.",        live:"", stack:["Next.js","Sanity","MDX"],             learned:"Headless CMS patterns, real-time preview, and structured content modelling." },
      { id:"12",   name:"SaaS starter",     desc:"A subscription app with paid plans, billing, and team accounts.",         live:"", stack:["Next.js","Stripe","Prisma"],          learned:"Stripe webhooks, subscription lifecycle, and multi-tenant data isolation." },
      { id:"12C",  name:"Real-time chat",   desc:"Messages that appear instantly — no refresh, no delay.",                  live:"", stack:["Next.js","Pusher","Prisma"],           learned:"WebSocket patterns, optimistic message rendering, and read receipts." },
    ],
  },
  {
    label: "Phase 4", title: "Production Level", desc: "testing · CI/CD · real users",
    color: "#EF4444", colorLight: "#FEE2E2", colorBg: "rgba(239,68,68,0.08)", colorBorder: "rgba(239,68,68,0.22)",
    icon: "✦",
    projects: [
      { id:"13",   name:"Test coverage",    desc:"Every critical feature tested — automated checks run on every save.",     live:"", stack:["Vitest","Testing Library","Playwright"],learned:"The difference between unit, integration, and e2e tests — and when each earns its place." },
      { id:"13.5", name:"Perf & a11y audit",desc:"Fast, accessible, and usable by everyone — measured and proven.",         live:"", stack:["Lighthouse","axe","Webpack Bundle Analyzer"],learned:"Core Web Vitals, WCAG 2.1 compliance, and cutting bundle size by 40%." },
      { id:"14",   name:"Real product",     desc:"My own idea, built for real users, with a real business model.",          live:"", stack:["Everything above","Real users","Stripe"],learned:"Shipping is just the beginning — the hard part is what comes after." },
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

const filterTags = ["All", "React", "Next.js", "Full Stack", "Production"];
const stackMatch: Record<string, string[]> = {
  "React":       ["01","02","02.5","03","04","05","05.5","05C"],
  "Next.js":     ["06","07","07.5","08","09","09C"],
  "Full Stack":  ["10","10.5","11","12","12C"],
  "Production":  ["13","13.5","14"],
};

// ─── ICONS ────────────────────────────────────────────────────────────────────

const Icons = {
  close: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>),
  external: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8M9 1h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  check: (<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  lock: (<svg width="11" height="13" viewBox="0 0 11 13" fill="none"><rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 5.5V3.5a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  send: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2L7 9M14 2L9 14l-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  github: (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>),
  clock: (<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/><path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
  commit: (<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 6.5h3M9 6.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>),
};

// ─── TILE ARTS ────────────────────────────────────────────────────────────────

const tileArts = (color: string) => [
  <svg key={0} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="6" y="8" width="32" height="28" rx="4" fill={color} opacity=".1"/><circle cx="10" cy="17" r="2.2" fill={color}/><line x1="15" y1="17" x2="34" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="24" r="2.2" fill={color} opacity=".5"/><line x1="15" y1="24" x2="28" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" opacity=".5"/><circle cx="10" cy="31" r="2.2" fill={color} opacity=".25"/><line x1="15" y1="31" x2="22" y2="31" stroke={color} strokeWidth="2" strokeLinecap="round" opacity=".25"/></svg>,
  <svg key={1} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="5" y="33" width="7" height="7" rx="2" fill={color} opacity=".25"/><rect x="14" y="25" width="7" height="15" rx="2" fill={color} opacity=".45"/><rect x="23" y="17" width="7" height="23" rx="2" fill={color} opacity=".7"/><rect x="32" y="9" width="7" height="31" rx="2" fill={color}/></svg>,
  <svg key={2} width="38" height="38" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="8" fill={color} opacity=".75"/>{[0,45,90,135,180,225,270,315].map((a,i)=>{const r=Math.PI*a/180;return <line key={i} x1={22+12*Math.cos(r)} y1={22+12*Math.sin(r)} x2={22+17*Math.cos(r)} y2={22+17*Math.sin(r)} stroke={color} strokeWidth="2.2" strokeLinecap="round"/>})}</svg>,
  <svg key={3} width="38" height="38" viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="17" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><text x="22" y="30" fontSize="22" fontFamily="Georgia,serif" fontWeight="700" fill={color} textAnchor="middle">?</text></svg>,
  <svg key={4} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="8" y="6" width="18" height="32" rx="2" fill={color} opacity=".1" stroke={color} strokeWidth="1.2"/><rect x="18" y="6" width="18" height="32" rx="2" fill={color} opacity=".2" stroke={color} strokeWidth="1.2"/><line x1="22" y1="14" x2="32" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".65"/><line x1="22" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".45"/><line x1="22" y1="26" x2="28" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity=".25"/></svg>,
  <svg key={5} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="4" y="9" width="10" height="27" rx="3" fill={color} opacity=".12" stroke={color} strokeWidth="1.2"/><rect x="17" y="9" width="10" height="27" rx="3" fill={color} opacity=".32" stroke={color} strokeWidth="1.2"/><rect x="30" y="9" width="10" height="27" rx="3" fill={color} opacity=".58" stroke={color} strokeWidth="1.2"/><rect x="6" y="13" width="6" height="5" rx="1.5" fill={color} opacity=".65"/><rect x="19" y="13" width="6" height="5" rx="1.5" fill={color} opacity=".75"/><rect x="19" y="21" width="6" height="5" rx="1.5" fill={color} opacity=".55"/><rect x="32" y="13" width="6" height="5" rx="1.5" fill={color}/></svg>,
  <svg key={6} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="6" y="17" width="32" height="11" rx="5.5" fill={color} opacity=".15" stroke={color} strokeWidth="1.2"/><circle cx="32" cy="22.5" r="5" fill={color}/><circle cx="13" cy="22.5" r="3" fill={color} opacity=".28"/></svg>,
  <svg key={7} width="38" height="38" viewBox="0 0 44 44" fill="none">{Array.from({length:7}).map((_,col)=>Array.from({length:4}).map((_,row)=>{const seed=(col*4+row)*2654435761;const filled=(seed%100)>38;return <rect key={`${col}-${row}`} x={6+col*5.2} y={13+row*5.2} width="3.8" height="3.8" rx="1" fill={color} opacity={filled?0.75:0.1}/>}))}</svg>,
  <svg key={8} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="4" y="8" width="36" height="28" rx="4" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="4" y1="16" x2="40" y2="16" stroke={color} strokeWidth="1" opacity=".35"/><circle cx="10" cy="12" r="2" fill={color} opacity=".45"/><circle cx="16" cy="12" r="2" fill={color} opacity=".28"/><rect x="10" y="20" width="24" height="3" rx="1.5" fill={color} opacity=".38"/><rect x="10" y="26" width="16" height="3" rx="1.5" fill={color} opacity=".22"/><rect x="10" y="32" width="10" height="3" rx="1.5" fill={color} opacity=".12"/></svg>,
  <svg key={9} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="6" y="10" width="32" height="24" rx="3" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><rect x="6" y="10" width="6" height="24" fill={color} opacity=".15"/><rect x="32" y="10" width="6" height="24" fill={color} opacity=".15"/><polygon points="20,18 20,26 28,22" fill={color} opacity=".65"/></svg>,
  <svg key={10} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="8" y="5" width="28" height="34" rx="3" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="14" y1="15" x2="30" y2="15" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".6"/><line x1="14" y1="21" x2="30" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".4"/><line x1="14" y1="27" x2="24" y2="27" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity=".22"/><rect x="26" y="26" width="10" height="10" rx="2" fill={color} opacity=".72"/><path d="M28 31h6M31 28v6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  <svg key={11} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M22 8 A14 14 0 0 1 36 22 L22 22Z" fill={color} opacity=".75"/><path d="M36 22 A14 14 0 0 1 12 32 L22 22Z" fill={color} opacity=".45"/><path d="M12 32 A14 14 0 0 1 22 8 L22 22Z" fill={color} opacity=".22"/><circle cx="22" cy="22" r="5.5" fill="none" stroke={color} strokeWidth="2" opacity=".3"/></svg>,
  <svg key={12} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M6 8h4l5 18h18l4-12H14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="20" cy="33" r="3" fill={color} opacity=".65"/><circle cx="32" cy="33" r="3" fill={color} opacity=".65"/></svg>,
  <svg key={13} width="38" height="38" viewBox="0 0 44 44" fill="none">{[6,12,18,24,30,36,42].map((x,i)=>{const h=[8,16,26,20,30,14,10][i];return <rect key={i} x={x-1.5} y={22-h/2} width="3" height={h} rx="1.5" fill={color} opacity={0.25+i*0.1}/>})}</svg>,
  <svg key={14} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" fill={color} opacity=".18" stroke={color} strokeWidth="1.2"/><rect x="24" y="4" width="16" height="16" rx="4" fill={color} opacity=".4" stroke={color} strokeWidth="1.2"/><rect x="4" y="24" width="16" height="16" rx="4" fill={color} opacity=".65" stroke={color} strokeWidth="1.2"/><rect x="24" y="24" width="16" height="16" rx="4" fill={color} stroke={color} strokeWidth="1.2"/><path d="M27 32l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={15} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M18 26a7 7 0 0 0 9.9 0l5-5a7 7 0 0 0-9.9-9.9L21 13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/><path d="M26 18a7 7 0 0 0-9.9 0l-5 5a7 7 0 0 0 9.9 9.9L23 31" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".5"/></svg>,
  <svg key={16} width="38" height="38" viewBox="0 0 44 44" fill="none"><rect x="8" y="8" width="22" height="28" rx="2" fill={color} opacity=".08" stroke={color} strokeWidth="1.2"/><line x1="13" y1="17" x2="25" y2="17" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".55"/><line x1="13" y1="23" x2="25" y2="23" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".35"/><line x1="13" y1="29" x2="20" y2="29" stroke={color} strokeWidth="1.7" strokeLinecap="round" opacity=".2"/><path d="M28 26l8-8-4-4-8 8v4h4z" fill={color} opacity=".8"/></svg>,
  <svg key={17} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M22 8l17 9-17 9-17-9 17-9z" fill={color} opacity=".5"/><path d="M5 22l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7"/><path d="M5 29l17 9 17-9" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" opacity=".4"/></svg>,
  <svg key={18} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M8 12h24a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H18l-6 5v-5H8a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill={color} opacity=".15" stroke={color} strokeWidth="1.2"/><circle cx="16" cy="19" r="2" fill={color} opacity=".65"/><circle cx="22" cy="19" r="2" fill={color} opacity=".65"/><circle cx="28" cy="19" r="2" fill={color} opacity=".65"/></svg>,
  <svg key={19} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M22 5L7 12v13c0 9 6.5 16 15 18 8.5-2 15-9 15-18V12L22 5z" fill={color} opacity=".1" stroke={color} strokeWidth="1.2"/><path d="M15 22l5 5 9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key={20} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M8 30a14 14 0 1 1 28 0" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".22"/><path d="M8 30a14 14 0 0 1 22-13" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/><line x1="22" y1="30" x2="29" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="22" cy="30" r="3" fill={color}/></svg>,
  <svg key={21} width="38" height="38" viewBox="0 0 44 44" fill="none"><path d="M22 6c0 0-11 7-11 19v5l5 5h12l5-5v-5C33 13 22 6 22 6z" fill={color} opacity=".18" stroke={color} strokeWidth="1.2"/><circle cx="22" cy="21" r="4.5" fill={color} opacity=".75"/><path d="M17 35l-4 6h4l2-4 2 4h5l-5-6" fill={color} opacity=".38"/></svg>,
];

// ─── COLOR BUILDER ─────────────────────────────────────────────────────────────

function buildColors(dark: boolean) {
  return dark ? {
    bg: "#111118", bg2: "#17171f", bg3: "#1e1e28", card: "#16161e",
    border: "rgba(255,255,255,0.08)", borderH: "rgba(139,124,246,0.35)",
    text: "#eeeaf8", text2: "rgba(238,234,248,0.75)", text3: "rgba(238,234,248,0.48)", text4: "rgba(238,234,248,0.24)",
    acc1: "#8B7CF6", acc2: "#10B981", navBg: "rgba(17,17,24,0.9)",
    lockedBg: "rgba(255,255,255,0.022)", lockedBorder: "rgba(255,255,255,0.06)", lockedText: "rgba(238,234,248,0.28)",
  } : {
    bg: "#f7f6f2", bg2: "#ffffff", bg3: "#ebe9e2", card: "#ffffff",
    border: "rgba(0,0,0,0.09)", borderH: "rgba(79,60,210,0.3)",
    text: "#0f0e1a", text2: "#3a384f", text3: "#6e6b82", text4: "#a8a5b8",
    acc1: "#4f3cd2", acc2: "#0a7a56", navBg: "rgba(247,246,242,0.92)",
    lockedBg: "rgba(15,14,26,0.03)", lockedBorder: "rgba(15,14,26,0.08)", lockedText: "#9996ab",
  };
}

// ─── SCROLL REVEAL HOOK ────────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────

function Confetti({ x, y, color, onDone }: { x: number; y: number; color: string; onDone: () => void }) {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i, angle: (i / 18) * Math.PI * 2 + Math.random() * 0.4,
      speed: 60 + Math.random() * 80, size: 4 + Math.random() * 5,
      color: [color, "#ffffff", color + "aa"][i % 3],
    })), [color]);
  useEffect(() => { const t = setTimeout(onDone, 1000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 300 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: x, top: y, width: p.size, height: p.size,
          borderRadius: "50%", background: p.color,
          animation: `confettiPop 0.9s cubic-bezier(.22,.68,0,1.2) forwards`,
          animationDelay: `${p.id * 20}ms`,
          "--vx": `${Math.cos(p.angle) * p.speed}px`,
          "--vy": `${Math.sin(p.angle) * p.speed}px`,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

// ─── PROJECT MODAL ─────────────────────────────────────────────────────────────

type Project = typeof phases[0]["projects"][0];
type Phase = typeof phases[0];

function ProjectModal({ project, phase, onClose, colors, dark }: {
  project: Project; phase: Phase; onClose: () => void;
  colors: ReturnType<typeof buildColors>; dark: boolean;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", animation: "fadeIn 0.18s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: colors.card, border: `1px solid ${phase.colorBorder}`, borderRadius: 28, width: "100%", maxWidth: 480, boxShadow: `0 32px 80px ${phase.color}22, 0 8px 24px rgba(0,0,0,0.3)`, position: "relative", overflow: "hidden", animation: "slideUp 0.22s cubic-bezier(.4,0,.2,1)",  overflowY: "auto", maxHeight: "90vh"}}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${phase.color}, ${phase.color}44)` }} />
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: phase.colorBg, border: `1px solid ${phase.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {tileArts(phase.color)[parseInt(project.id) % 22] ?? tileArts(phase.color)[0]}
              </div>
              <div>
                <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.color, fontWeight: 600, marginBottom: 4 }}>{phase.label} · #{project.id}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em", lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif" }}>{project.name}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", background: colors.bg3, border: `1px solid ${colors.border}`, color: colors.text3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", flexShrink: 0, marginTop: 2 }}>{Icons.close}</button>
          </div>
          <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.7, marginBottom: 24 }}>{project.desc}</p>
        </div>
        <div style={{ padding: "0 28px 22px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.text3, fontWeight: 600, marginBottom: 10 }}>Tech stack</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {project.stack.map(s => (<span key={s} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 8, background: phase.colorBg, color: phase.color, border: `1px solid ${phase.colorBorder}`, fontWeight: 500 }}>{s}</span>))}
          </div>
        </div>
        {project.learned && (
          <div style={{ margin: "0 28px 28px", padding: "16px 18px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)", borderRadius: 14, border: `1px solid ${colors.border}`, borderLeft: `3px solid ${phase.color}` }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.text3, fontWeight: 600, marginBottom: 7 }}>What I learned</div>
            <p style={{ fontSize: 13.5, color: colors.text2, lineHeight: 1.65, margin: 0 }}>{project.learned}</p>
          </div>
        )}
        {project.live ? (
          <div style={{ padding: "0 28px 28px" }}>
            <a href={project.live} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 14, background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`, color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>{Icons.external} View live project</a>
          </div>
        ) : (
          <div style={{ padding: "0 28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 14, background: colors.lockedBg, border: `1px solid ${colors.lockedBorder}`, color: colors.lockedText, fontSize: 13, fontWeight: 500 }}>{Icons.lock} Not shipped yet — check back soon</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────

function FeedbackModal({ open, onClose, colors, dark }: {
  open: boolean; onClose: () => void; colors: ReturnType<typeof buildColors>; dark: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSend = name.trim().length > 0 && msg.trim().length > 0;

  const handleSend = async () => {
    if (!canSend || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "821b5a66-e7e4-4d4e-a046-506c051daf4a",
          subject: "Note from mehrankhan.net",
          message: msg,
          name: name,
          email: email || `anonymous-${Date.now()}@mehrankhan.net`,
          from_name: name,
          botcheck: "",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setState("sent");
        setTimeout(() => { setState("idle"); setName(""); setEmail(""); setMsg(""); onClose(); }, 2200);
      } else {
        setErrorMsg(json.message || "Submission failed.");
        setState("error");
        setTimeout(() => { setState("idle"); setErrorMsg(""); }, 4000);
      }
    } catch {
      setErrorMsg("Network error — check your connection.");
      setState("error");
      setTimeout(() => { setState("idle"); setErrorMsg(""); }, 4000);
    }
  };

  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, animation: "fadeIn 0.15s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.4)", position: "relative", animation: "slideUp 0.2s cubic-bezier(.4,0,.2,1)" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", background: colors.bg3, border: `1px solid ${colors.border}`, color: colors.text3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>{Icons.close}</button>
       {state === "sent" ? (
  <div style={{ textAlign: "center", padding: "12px 0" }}>
    <div style={{ fontSize: 64, marginBottom: 8, animation: "wowBounce 0.6s cubic-bezier(.22,.68,0,1.4)" }}>🎉</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 16 }}>
      {["✦", "✦", "✦"].map((s, i) => (
        <span key={i} style={{ color: colors.acc1, fontSize: 14, animation: `starPulse 1.2s ease-in-out ${i * 0.15}s infinite` }}>{s}</span>
      ))}
    </div>
    <p style={{ fontSize: 28, fontWeight: 700, color: colors.text, marginBottom: 8, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
      Message sent.
    </p>
    <p style={{ fontSize: 13.5, color: colors.text2, lineHeight: 1.7, maxWidth: 260, margin: "0 auto" }}>
      Mehran reads every single one.<br/>
      <span style={{ color: colors.acc1, fontWeight: 500 }}>He'll see yours.</span>
    </p>
    <button onClick={onClose} style={{ marginTop: 20, fontSize: 12, color: colors.text4, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>close</button>
  </div>
) : (
  <>
    <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.acc1, fontWeight: 600, marginBottom: 10 }}>Leave a note</p>
    <p style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 7, fontFamily: "'Playfair Display', Georgia, serif" }}>What do you think?</p>
    <p style={{ fontSize: 13.5, color: colors.text2, marginBottom: 22, lineHeight: 1.65 }}>Encouragement, a question, or a critique — Mehran reads every message.</p>
    {/* Name — required */}
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: colors.text3, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
        Name
        <span style={{ color: colors.acc1, fontSize: 13, lineHeight: 1 }}>*</span>
      </label>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        style={{ width: "100%", background: colors.bg, border: `1px solid ${name ? colors.borderH : colors.border}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, color: colors.text, outline: "none", fontFamily: "inherit", transition: "border-color 0.2s", display: "block" }}
        onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139,124,246,0.22)"}
        onBlur={e => e.currentTarget.style.boxShadow = "none"}
      />
    </div>

            {/* Email — optional */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: colors.text3, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                Email
                <span style={{ fontSize: 9, fontWeight: 500, color: colors.text4, letterSpacing: "0.03em", fontStyle: "italic" }}>optional</span>
              </label>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                style={{ width: "100%", background: colors.bg, border: `1px solid ${email ? colors.borderH : colors.border}`, borderRadius: 12, padding: "11px 14px", fontSize: 14, color: colors.text, outline: "none", fontFamily: "inherit", transition: "border-color 0.2s", display: "block" }}
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139,124,246,0.22)"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"}
              />
            </div>

            {/* Message */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: colors.text3, letterSpacing: "0.06em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                Message
                <span style={{ color: colors.acc1, fontSize: 13, lineHeight: 1 }}>*</span>
              </label>
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
                placeholder="What's on your mind…"
                rows={4}
                style={{ width: "100%", background: colors.bg, border: `1px solid ${msg ? colors.borderH : colors.border}`, borderRadius: 12, padding: "13px 15px", fontSize: 14, color: colors.text, resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.6, display: "block", transition: "border-color 0.2s" }}
                onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(139,124,246,0.22)"}
                onBlur={e => e.currentTarget.style.boxShadow = "none"}
              />
            </div>

            {state === "error" && <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>{errorMsg || "Something went wrong. Try again?"}</p>}

            <button
              onClick={handleSend}
              disabled={!canSend || state === "sending"}
              style={{ width: "100%", padding: "13px", borderRadius: 12, background: canSend ? `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})` : colors.bg3, border: "none", color: canSend ? "#fff" : colors.text3, fontSize: 14, fontWeight: 600, cursor: canSend ? "pointer" : "not-allowed", transition: "all 0.2s", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {Icons.send}{state === "sending" ? "Sending…" : "Send message"}<span style={{ fontSize: 11, opacity: 0.6 }}>⌘↵</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── GITHUB BANNER ─────────────────────────────────────────────────────────────

function GitHubBanner({ colors, dark }: { colors: ReturnType<typeof buildColors>; dark: boolean }) {
  const [data, setData] = useState<{ message: string; sha: string; date: string } | null>(null);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/commits?per_page=1`)
      .then(r => r.json()).then(commits => {
        if (!Array.isArray(commits) || !commits[0]) return;
        const c = commits[0];
        const rawDate = c.commit?.author?.date ?? "";
        const s = Math.floor((Date.now() - new Date(rawDate).getTime()) / 1000);
        const ago = s < 60 ? `${s}s ago` : s < 3600 ? `${Math.floor(s/60)}m ago` : s < 86400 ? `${Math.floor(s/3600)}h ago` : `${Math.floor(s/86400)}d ago`;
        setData({ message: c.commit?.message?.split("\n")[0] ?? "", sha: c.sha?.slice(0, 7) ?? "", date: ago });
      }).catch(() => {});
  }, []);
  if (!data) return null;
  return (
    <a href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", background: dark ? "rgba(139,124,246,0.07)" : "rgba(90,76,200,0.055)", border: `1px solid ${dark ? "rgba(139,124,246,0.18)" : "rgba(90,76,200,0.13)"}`, borderRadius: 10, textDecoration: "none", transition: "background 0.2s" }} onMouseEnter={e => (e.currentTarget.style.background = dark ? "rgba(139,124,246,0.13)" : "rgba(90,76,200,0.1)")} onMouseLeave={e => (e.currentTarget.style.background = dark ? "rgba(139,124,246,0.07)" : "rgba(90,76,200,0.055)")}>
      <span style={{ color: colors.acc1 }}>{Icons.commit}</span>
      <span style={{ fontSize: 12, color: colors.text3 }}>{Icons.clock}</span>
      <span style={{ fontSize: 12, color: colors.text3 }}>{data.date}</span>
      <span style={{ fontSize: 12, color: colors.text2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.message}</span>
      <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: colors.acc1, background: dark ? "rgba(139,124,246,0.12)" : "rgba(90,76,200,0.08)", padding: "2px 6px", borderRadius: 5 }}>{data.sha}</span>
    </a>
  );
}

// ─── REVEAL TILE WRAPPER ──────────────────────────────────────────────────────

function RevealTile({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(18px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

// ─── PHASE ICONS ──────────────────────────────────────────────────────────────

function PhaseIcon({ color, phase }: { color: string; phase: number }) {
  if (phase === 0) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" fill={color}/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none"/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(60 10 10)"/><ellipse cx="10" cy="10" rx="9" ry="4" stroke={color} strokeWidth="1.3" fill="none" transform="rotate(120 10 10)"/></svg>;
  if (phase === 1) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l8 14H2L10 2z" stroke={color} strokeWidth="1.4" fill="none"/></svg>;
  if (phase === 2) return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="5.5" rx="7" ry="3" stroke={color} strokeWidth="1.3" fill="none"/><path d="M3 5.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/><path d="M3 10.5v5c0 1.65 3.13 3 7 3s7-1.35 7-3v-5" stroke={color} strokeWidth="1.3" fill="none"/></svg>;
  return <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6l2-6z" fill={color}/></svg>;
}

// ─── ANIMATED CYCLER ─────────────────────────────────────────────────────────

const cyclerItems = [
  { text: "a task manager",           color: "#8B7CF6" },
  { text: "an expense tracker",       color: "#10B981" },
  { text: "a weather widget",         color: "#38BDF8" },
  { text: "a quiz app",               color: "#F59E0B" },
  { text: "a recipe book",            color: "#8B7CF6" },
  { text: "a kanban board",           color: "#10B981" },
  { text: "a habit tracker",          color: "#F59E0B" },
  { text: "a portfolio site",         color: "#38BDF8" },
  { text: "a movie browser",          color: "#8B7CF6" },
  { text: "a dashboard",              color: "#10B981" },
  { text: "an e-commerce store",      color: "#F59E0B" },
  { text: "a blog + CMS",             color: "#38BDF8" },
  { text: "a real-time chat app",     color: "#8B7CF6" },
  { text: "a SaaS product",           color: "#10B981" },
  { text: "something people pay for", color: "#EF4444" },
];

function AnimatedCycler({ dark, colors }: { dark: boolean; colors: ReturnType<typeof buildColors> }) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  useEffect(() => {
    const durations: Record<string, number> = { in: 400, hold: 2200, out: 300 };
    const timer = setTimeout(() => {
      if (phase === "in") setPhase("hold");
      else if (phase === "hold") setPhase("out");
      else { setIdx(i => (i + 1) % cyclerItems.length); setPhase("in"); }
    }, durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, idx]);
  const item = cyclerItems[idx];
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "12px 28px 14px", background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, borderRadius: 16 }}>
      <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.text3, fontWeight: 500, marginBottom: 6 }}>currently building</span>
      <div style={{ fontSize: "clamp(18px,3vw,26px)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: item.color, opacity: phase === "out" ? 0 : 1, transform: phase === "out" ? "translateY(-8px)" : "translateY(0)", transition: phase === "in" ? "opacity 0.4s ease, transform 0.4s cubic-bezier(.22,.68,0,1.2)" : "opacity 0.3s ease, transform 0.3s ease", textShadow: `0 0 24px ${item.color}55`, whiteSpace: "nowrap", position: "relative" }}>
        {item.text}
        <span style={{ position: "absolute", bottom: -3, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`, borderRadius: 2, opacity: phase === "hold" ? 1 : 0, transition: "opacity 0.3s ease" }}/>
      </div>
    </div>
  );
}

// ─── CIRCLE HIGHLIGHT ─────────────────────────────────────────────────────────
// Draws an animated hand-drawn circle around "22 real apps"

function CircleHighlight({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 220 60" preserveAspectRatio="none"
      style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "calc(100% + 28px)", height: "calc(100% + 22px)", pointerEvents: "none", overflow: "visible" }}
    >
      <ellipse
        cx="110" cy="30" rx="104" ry="24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="660"
        strokeDashoffset="660"
        style={{ animation: "drawCircle 1s cubic-bezier(.4,0,.2,1) 0.3s forwards" }}
      />
      {/* second offset stroke for hand-drawn feel */}
      <ellipse
        cx="111" cy="31" rx="103" ry="23"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="660"
        strokeDashoffset="660"
        opacity="0.4"
        style={{ animation: "drawCircle 1s cubic-bezier(.4,0,.2,1) 0.5s forwards" }}
      />
    </svg>
  );
}

// ─── BUILD STREAK GRID ────────────────────────────────────────────────────────

function BuildStreakGrid({ colors, dark }: { colors: ReturnType<typeof buildColors>; dark: boolean }) {
  const [commits, setCommits] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    // Fetch last 90 days of commits
const since = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

// Fetch all events for the user (includes pushes across all repos)
fetch(`https://api.github.com/users/${GITHUB_USER}/events?per_page=100`)
  .then(r => r.json())
  .then(data => {
    if (!Array.isArray(data)) return;
    const map: Record<string, number> = {};
    data.forEach((event: { type?: string; created_at?: string; payload?: { commits?: unknown[] } }) => {
      if (event.type !== "PushEvent") return;
      const date = event.created_at?.slice(0, 10);
      if (!date) return;
      // Count each commit in the push
      const commitCount = Array.isArray(event.payload?.commits) ? event.payload.commits.length : 1;
      map[date] = (map[date] || 0) + commitCount;
    });
        setCommits(map);

        // Calculate current streak
        let s = 0;
        const today = new Date();
        for (let i = 0; i < 90; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          if (map[key]) s++;
          else if (i > 0) break;
        }
        setStreak(s);
        setTotalDays(Object.keys(map).length);
      })
      .catch(() => {});
  }, []);

  // Build 15 weeks × 7 days grid (105 days back from today)
  const weeks = 15;
  const cells: { date: string; count: number; dayOfWeek: number }[] = [];
  const today = new Date();
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    cells.push({ date: key, count: commits[key] || 0, dayOfWeek: d.getDay() });
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getCellColor = (count: number) => {
    if (count === 0) return dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
    if (count === 1) return dark ? "rgba(139,124,246,0.35)" : "rgba(79,60,210,0.25)";
    if (count === 2) return dark ? "rgba(139,124,246,0.6)" : "rgba(79,60,210,0.5)";
    return dark ? "#8B7CF6" : "#4f3cd2";
  };

  const getCellGlow = (count: number) => {
    if (count >= 3) return `0 0 6px ${dark ? "rgba(139,124,246,0.8)" : "rgba(79,60,210,0.6)"}`;
    if (count >= 2) return `0 0 4px ${dark ? "rgba(139,124,246,0.5)" : "rgba(79,60,210,0.3)"}`;
    return "none";
  };

  return (
    <div style={{ padding: "24px 32px 0", maxWidth: 680, margin: "0 auto", width: "100%" }}>
      <div style={{
        background: dark ? "rgba(22,22,30,0.9)" : "#ffffff",
        borderRadius: 20,
        border: `1px solid ${dark ? "rgba(139,124,246,0.18)" : "rgba(79,60,210,0.12)"}`,
        padding: "24px 26px 20px",
        boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 4px 24px rgba(0,0,0,0.07)",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, letterSpacing: "-0.01em", marginBottom: 2 }}>
              Build streak
            </div>
            <div style={{ fontSize: 11, color: colors.text3, fontFamily: "'JetBrains Mono', monospace" }}>
              {GITHUB_USER}/{GITHUB_REPO} · last 15 weeks
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: colors.acc1, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{streak}</div>
              <div style={{ fontSize: 10, color: colors.text3, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>day streak</div>
            </div>
            <div style={{ width: 1, background: colors.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 600, color: colors.acc2, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{totalDays}</div>
              <div style={{ fontSize: 10, color: colors.text3, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>days coded</div>
            </div>
          </div>
        </div>

        {/* Day labels */}
        <div style={{ display: "flex", gap: 3, marginBottom: 4, paddingLeft: 28 }}>
          {Array.from({ length: weeks }).map((_, wi) => (
            wi % 3 === 0 ? (
              <div key={wi} style={{ width: 12, fontSize: 9, color: colors.text4, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                {new Date(cells[wi * 7]?.date || "").toLocaleString("default", { month: "short" })}
              </div>
            ) : <div key={wi} style={{ width: 12, flexShrink: 0 }} />
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "flex", gap: 2 }}>
          {/* Day of week labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginRight: 4 }}>
            {dayLabels.map((d, i) => (
              <div key={d} style={{ height: 12, fontSize: 9, color: i % 2 === 1 ? colors.text4 : "transparent", fontFamily: "'JetBrains Mono', monospace", lineHeight: "12px", width: 20, flexShrink: 0 }}>
                {i % 2 === 1 ? d.slice(0, 1) : ""}
              </div>
            ))}
          </div>

          {/* Cells grouped by week */}
          {Array.from({ length: weeks }).map((_, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const cell = cells[wi * 7 + di];
                if (!cell) return <div key={di} style={{ width: 12, height: 12 }} />;
                const isToday = cell.date === today.toISOString().slice(0, 10);
                return (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.count} commit${cell.count !== 1 ? "s" : ""}`}
                    style={{
                      width: 12, height: 12, borderRadius: 3,
                      background: getCellColor(cell.count),
                      boxShadow: isToday ? `0 0 0 1.5px ${colors.acc1}` : getCellGlow(cell.count),
                      transition: "transform 0.15s ease",
                      cursor: cell.count > 0 ? "pointer" : "default",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { if (cell.count > 0) e.currentTarget.style.transform = "scale(1.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 10, color: colors.text4, fontFamily: "'JetBrains Mono', monospace" }}>less</span>
          {[0, 1, 2, 3].map(n => (
            <div key={n} style={{ width: 10, height: 10, borderRadius: 2, background: getCellColor(n === 3 ? 3 : n) }} />
          ))}
          <span style={{ fontSize: 10, color: colors.text4, fontFamily: "'JetBrains Mono', monospace" }}>more</span>
        </div>
      </div>
    </div>
  );
}

// ─── ROCKET VISUAL ────────────────────────────────────────────────────────────

function RocketVisual({ done, total, dark, colors, mounted }: {
  done: number; total: number; dark: boolean; colors: ReturnType<typeof buildColors>; mounted: boolean;
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const rPhases = [
    [0, 8,  "Phase 1 — Core React"],
    [8, 14, "Phase 2 — Next.js Frontend"],
    [14, 19,"Phase 3 — Full Stack"],
    [19, 22,"Phase 4 — Production"],
  ] as const;
  const currentPhase = rPhases.find(([s, e]) => done >= s && done < e) ?? rPhases[rPhases.length - 1];
  const techTags = [
    { name: "React",      color: "#61DAFB", glow: "rgba(97,218,251,0.35)",  ring: 1, icon: "⚛" },
    { name: "Next.js",    color: "#ffffff", glow: "rgba(255,255,255,0.25)", ring: 1, icon: "▲" },
    { name: "TypeScript", color: "#3B82F6", glow: "rgba(59,130,246,0.4)",   ring: 1, icon: "TS" },
    { name: "Prisma",     color: "#A855F7", glow: "rgba(168,85,247,0.4)",   ring: 1, icon: "◈" },
    { name: "Postgres",   color: "#38BDF8", glow: "rgba(56,189,248,0.35)",  ring: 2, icon: "🐘" },
    { name: "Stripe",     color: "#818CF8", glow: "rgba(129,140,248,0.4)",  ring: 2, icon: "⚡" },
    { name: "Auth",       color: "#F59E0B", glow: "rgba(245,158,11,0.4)",   ring: 2, icon: "🔑" },
    { name: "Vitest",     color: "#4ADE80", glow: "rgba(74,222,128,0.4)",   ring: 2, icon: "✓" },
  ];
  const orbitR1 = 105, orbitR2 = 132;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0 24px", opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
      <div style={{ position: "relative", width: 320, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: orbitR1*2, height: orbitR1*2, borderRadius: "50%", border: `1px solid ${dark ? "rgba(139,124,246,0.12)" : "rgba(79,60,210,0.08)"}`, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", width: orbitR2*2, height: orbitR2*2, borderRadius: "50%", border: `1px dashed ${dark ? "rgba(139,124,246,0.07)" : "rgba(79,60,210,0.05)"}`, pointerEvents: "none" }}/>
        {Array.from({ length: 30 }).map((_, i) => { const seed = i * 137.5; return <span key={i} style={{ position: "absolute", borderRadius: "50%", width: (seed%1.8)+0.8, height: (seed%1.8)+0.8, top: `${(seed*3.1)%100}%`, left: `${(seed*7.3)%100}%`, background: dark ? `rgba(196,181,253,${0.1+(i%4)*0.08})` : `rgba(79,60,210,${0.06+(i%3)*0.05})`, animation: `starPulse ${1.4+(seed%2.8)}s ease-in-out ${-(seed%3.5)}s infinite` }} />; })}
        {techTags.map((tech) => {
          const ring = tech.ring === 1 ? orbitR1 : orbitR2;
          const totalInRing = techTags.filter(t => t.ring === tech.ring).length;
          const idxInRing = techTags.filter(t => t.ring === tech.ring).findIndex(t => t.name === tech.name);
          const baseAngle = (idxInRing / totalInRing) * 360;
          const isReverse = tech.ring === 2;
          const dur = tech.ring === 1 ? 16 : 22;
          return (
            <span key={tech.name} style={{ position: "absolute", left: "50%", top: "50%", fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace", color: tech.color, background: dark ? `${tech.color}15` : `${tech.color}18`, border: `1px solid ${tech.color}55`, borderRadius: 20, padding: "3px 9px", whiteSpace: "nowrap", boxShadow: `0 0 10px ${tech.glow}`, animation: `${isReverse ? "orbitTagR" : "orbitTag"}${ring} ${dur}s linear ${-(baseAngle/360)*dur}s infinite`, transformOrigin: `calc(-${ring}px + 50%) 50%`, fontWeight: 600, zIndex: 3 }}>
              <span style={{ marginRight: 4, fontSize: 9 }}>{tech.icon}</span>{tech.name}
            </span>
          );
        })}
        <svg width="110" height="200" viewBox="0 0 110 200" fill="none" style={{ position: "relative", zIndex: 2, animation: "rocketFloat 3.2s ease-in-out infinite" }}>
          <defs>
            <linearGradient id="rBodyGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5b4fbe"/><stop offset="50%" stopColor="#8b7cf6"/><stop offset="100%" stopColor="#5b4fbe"/></linearGradient>
            <linearGradient id="rFuelGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#059669" stopOpacity="0.7"/></linearGradient>
            <linearGradient id="rFlame1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="55%" stopColor="#f97316"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0"/></linearGradient>
            <linearGradient id="rFlame2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef9c3"/><stop offset="60%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f97316" stopOpacity="0"/></linearGradient>
            <clipPath id="rBodyClip"><path d="M38 50 Q55 10 72 50 L72 142 Q55 150 38 142 Z"/></clipPath>
          </defs>
          <polygon points="16,142 38,108 38,150" fill="#3c3489" opacity="0.9"/>
          <polygon points="94,142 72,108 72,150" fill="#3c3489" opacity="0.9"/>
          <path d="M38 50 Q55 10 72 50 L72 142 Q55 150 38 142 Z" fill="url(#rBodyGrad)"/>
          {done > 0 && <rect x="38" y={50 + 92*(1-pct/100)} width="34" height={92*(pct/100)} fill="url(#rFuelGrad)" opacity="0.45" clipPath="url(#rBodyClip)" style={{ transition: "y 1.8s cubic-bezier(.4,0,.2,1), height 1.8s cubic-bezier(.4,0,.2,1)" }}/>}
          <path d="M38 50 Q55 10 72 50 L72 142 Q55 150 38 142 Z" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.4"/>
          <circle cx="55" cy="88" r="14" fill={dark ? "#0d0d1c" : "#e8e4ff"} opacity="0.95"/>
          <circle cx="55" cy="88" r="14" fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.7"/>
          <circle cx="55" cy="88" r="6" fill="#8b7cf6" opacity="0.9"/>
          <circle cx="55" cy="88" r="2.5" fill="#c4b5fd"/>
          <line x1="38" y1="108" x2="72" y2="108" stroke="#a78bfa" strokeWidth="0.5" opacity="0.25"/>
          {done > 0 && <text x="55" y="92" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="500" fill={dark ? "#c4b5fd" : "#4338ca"} opacity="0.9">{pct}%</text>}
          <g style={{ animation: "flameOuter .18s ease-in-out infinite", transformOrigin: "55px 150px" }}>
            <path d="M43 150 Q46 172 51 178 Q55 184 59 178 Q64 172 67 150 Z" fill="url(#rFlame1)" opacity="0.9"/>
          </g>
          <g style={{ animation: "flameInner .13s ease-in-out infinite", transformOrigin: "55px 150px" }}>
            <path d="M48 150 Q51 164 55 170 Q59 164 62 150 Z" fill="url(#rFlame2)"/>
          </g>
        </svg>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 4 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 500, color: colors.acc1, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{done}</div>
          <div style={{ fontSize: 10.5, color: colors.text3, marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>shipped</div>
        </div>
        <div style={{ width: 1, height: 36, background: colors.border }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 500, color: colors.text3, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{total}</div>
          <div style={{ fontSize: 10.5, color: colors.text3, marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>total</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: colors.text3, fontFamily: "'JetBrains Mono', monospace", marginTop: 10, letterSpacing: "0.04em" }}>{currentPhase[2]}</div>
      <style>{`
        @keyframes rocketFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes starPulse { 0%,100%{opacity:.2} 50%{opacity:.7} }
        @keyframes flameOuter { 0%,100%{transform:scaleY(1) scaleX(1)} 30%{transform:scaleY(.85) scaleX(1.1)} 65%{transform:scaleY(1.06) scaleX(.94)} }
        @keyframes flameInner { 0%,100%{transform:scaleY(.9)} 40%{transform:scaleY(1.12) scaleX(.88)} 70%{transform:scaleY(.74)} }
        @keyframes orbitTag105  { from{transform:rotate(0deg) translateX(105px) rotate(0deg)} to{transform:rotate(360deg) translateX(105px) rotate(-360deg)} }
        @keyframes orbitTagR132 { from{transform:rotate(0deg) translateX(132px) rotate(0deg)} to{transform:rotate(-360deg) translateX(132px) rotate(360deg)} }
      `}</style>
    </div>
  );
}
// ─── DEV LOG ─────────────────────────────────────────────────────────────────

type LogEntry = {
  id: string;
  date: string;
  mood: "built" | "skipped" | "thinking" | "blocked";
  title: string;
  body: string;
  createdAt: number;
};

const MOOD_META: Record<LogEntry["mood"], {
  label: string; color: string; bg: string; border: string;
  darkColor: string; darkBg: string; darkBorder: string;
  emoji: string; glyph: string;
}> = {
  built:    { label: "built",     emoji: "🔨", glyph: "◆", color: "#059669", bg: "rgba(5,150,105,0.08)",   border: "rgba(5,150,105,0.25)",   darkColor: "#34d399", darkBg: "rgba(52,211,153,0.1)",  darkBorder: "rgba(52,211,153,0.28)"  },
  skipped:  { label: "skipped",   emoji: "💤", glyph: "◇", color: "#b45309", bg: "rgba(180,83,9,0.08)",    border: "rgba(180,83,9,0.25)",    darkColor: "#fbbf24", darkBg: "rgba(251,191,36,0.1)",  darkBorder: "rgba(251,191,36,0.28)"  },
  thinking: { label: "thinking",  emoji: "💭", glyph: "○", color: "#6d28d9", bg: "rgba(109,40,217,0.08)",  border: "rgba(109,40,217,0.25)",  darkColor: "#a78bfa", darkBg: "rgba(167,139,250,0.1)", darkBorder: "rgba(167,139,250,0.28)" },
  blocked:  { label: "blocked",   emoji: "🧱", glyph: "✕", color: "#be123c", bg: "rgba(190,18,60,0.08)",   border: "rgba(190,18,60,0.25)",   darkColor: "#fb7185", darkBg: "rgba(251,113,133,0.1)", darkBorder: "rgba(251,113,133,0.28)" },
};

const TRUNCATE_AT = 200;
const PAGE_SIZE = 5;

const LOG_GLYPHS = ["◆","◇","○","●","▲","△","■","□","✦","✧"];

function EntryCard({ entry, colors, dark, index }: {
  entry: LogEntry; colors: ReturnType<typeof buildColors>; dark: boolean; index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pwd, setPwd] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [hov, setHov] = useState(false);

  const meta = MOOD_META[entry.mood];
  const mc = dark ? meta.darkColor : meta.color;
  const mb = dark ? meta.darkBg : meta.bg;
  const mbd = dark ? meta.darkBorder : meta.border;

  const isLong = entry.body.length > TRUNCATE_AT;
  const bodyText = isLong && !expanded
    ? entry.body.slice(0, TRUNCATE_AT).trimEnd() + "…"
    : entry.body;

  const deleteEntry = async () => {
    if (!pwd.trim()) return;
    setDeleting(true);
    await fetch("/api/devlog", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: entry.id, password: pwd }),
    });
    setDeleting(false);
    setConfirmDelete(false);
    window.location.reload();
  };

const dateObj = new Date(entry.date + "T12:00:00");
const day = dateObj.getDate();
const monthShort = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr",
        gap: 0,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${hov ? mbd : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)")}`,
        background: hov ? mb : (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)"),
        transition: "all 0.22s ease",
        transform: hov ? "translateX(3px)" : "none",
      }}
    >
      {/* Date column */}
<div style={{
  background: mb,
  borderRight: `1px solid ${mbd}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px 10px",
  gap: 1,
  flexShrink: 0,
  minWidth: 64,
}}>
<span style={{ fontSize: 9, fontWeight: 700, color: mc, letterSpacing: "0.14em", fontFamily: "'JetBrains Mono', monospace", opacity: 0.7 }}>{monthShort}</span>
<span style={{ fontSize: 28, fontWeight: 700, color: mc, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{day}</span>
<span style={{ fontSize: 9, fontWeight: 600, color: mc, opacity: 0.45, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>{dateObj.getFullYear()}</span>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 5, opacity: 0.5 }}>
  {entry.mood === "built"    && <path d="M2 10L5 4l3 4 2-3 2 5" stroke={mc} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>}
  {entry.mood === "skipped"  && <path d="M7 2v5M7 9.5v1" stroke={mc} strokeWidth="1.5" strokeLinecap="round"/>}
  {entry.mood === "thinking" && <><circle cx="7" cy="6" r="3.5" stroke={mc} strokeWidth="1.3"/><path d="M7 11v1.5" stroke={mc} strokeWidth="1.5" strokeLinecap="round"/></>}
  {entry.mood === "blocked"  && <path d="M3 3l8 8M11 3L3 11" stroke={mc} strokeWidth="1.4" strokeLinecap="round"/>}
</svg>
</div>

      {/* Content column */}
      <div style={{ padding: "14px 16px", minWidth: 0 }}>
        {/* Top row */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
            background: mb, color: mc, border: `1px solid ${mbd}`,
            letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {meta.glyph} {meta.label}
          </span>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: colors.text, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
            {entry.title}
          </span>
          {/* Delete button */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ width: 20, height: 20, borderRadius: "50%", background: "transparent", border: `1px solid transparent`, color: colors.text4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", fontSize: 9, flexShrink: 0, opacity: hov ? 1 : 0, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#fb7185"; e.currentTarget.style.borderColor = "#fb718544"; e.currentTarget.style.background = "#fb71851a"; }}
              onMouseLeave={e => { e.currentTarget.style.color = colors.text4; e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
            >✕</button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <input
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                type="password"
                placeholder="password"
                autoFocus
                onKeyDown={e => { if (e.key === "Enter") deleteEntry(); if (e.key === "Escape") { setConfirmDelete(false); setPwd(""); } }}
                style={{ width: 80, padding: "2px 7px", borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 10, outline: "none", fontFamily: "inherit" }}
              />
              <button onClick={deleteEntry} disabled={deleting} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "#fb71851a", border: "1px solid #fb718544", color: "#fb7185", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{deleting ? "…" : "del"}</button>
              <button onClick={() => { setConfirmDelete(false); setPwd(""); }} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "transparent", border: `1px solid ${colors.border}`, color: colors.text3, cursor: "pointer", fontFamily: "inherit" }}>esc</button>
            </div>
          )}
        </div>

        {/* Body */}
        {entry.body && (
          <>
            <p style={{ fontSize: 12.5, color: colors.text2, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
              {bodyText}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(v => !v)}
                style={{ marginTop: 5, fontSize: 11, color: mc, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0, fontWeight: 600, letterSpacing: "0.02em" }}
              >
                {expanded ? "↑ collapse" : "↓ read more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DevLog({ colors, dark }: { colors: ReturnType<typeof buildColors>; dark: boolean }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [filter, setFilter] = useState<LogEntry["mood"] | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [form, setForm] = useState({ mood: "built" as LogEntry["mood"], title: "", body: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const { ref: sectionRef, visible: sectionVisible } = useScrollReveal();

  useEffect(() => {
    fetch("/api/devlog")
      .then(r => r.json())
      .then(data => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [filter]);

  const saveEntry = async () => {
    if (!form.title.trim() || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/devlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 401) { setError("Wrong password."); setSaving(false); return; }
      const entry = await res.json();
      setEntries(prev => [entry, ...prev]);
      setForm({ mood: "built", title: "", body: "", password: "" });
      setComposing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { setError("Something went wrong."); }
    setSaving(false);
  };

  const filtered = filter === "all" ? entries : entries.filter(e => e.mood === filter);
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visibleCount;

  const streak = (() => {
    if (!entries.length) return 0;
    const dates = [...new Set(entries.map(e => e.date))].sort().reverse();
    let s = 0;
    const today = new Date().toISOString().slice(0, 10);
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      if (dates[i] === expected) s++;
      else break;
    }
    return s;
  })();

  const builtCount = entries.filter(e => e.mood === "built").length;

  return (
    <div
      ref={sectionRef}
      style={{
        padding: "32px 32px 0",
        maxWidth: 680,
        margin: "0 auto",
        width: "100%",
        opacity: sectionVisible ? 1 : 0,
        transform: sectionVisible ? "none" : "translateY(24px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Outer card */}
      <div style={{
        borderRadius: 24,
        overflow: "hidden",
        border: `1px solid ${dark ? "rgba(139,124,246,0.2)" : "rgba(79,60,210,0.13)"}`,
        boxShadow: dark ? "0 12px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,124,246,0.08)" : "0 8px 40px rgba(79,60,210,0.08)",
      }}>

        {/* ── HEADER BANNER ── */}
        <div style={{
          position: "relative",
          overflow: "hidden",
          background: dark
            ? "linear-gradient(135deg, #0d0b1a 0%, #110d1f 50%, #0a0f1a 100%)"
            : "linear-gradient(135deg, #faf9ff 0%, #f3f0ff 50%, #f7fbff 100%)",
          padding: "28px 28px 24px",
          borderBottom: `1px solid ${dark ? "rgba(139,124,246,0.15)" : "rgba(79,60,210,0.1)"}`,
        }}>
          {/* Background grid */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: dark ? 0.12 : 0.06, pointerEvents: "none" }} viewBox="0 0 400 120" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2="120" stroke={dark ? "#8B7CF6" : "#4f3cd2"} strokeWidth="0.5" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke={dark ? "#8B7CF6" : "#4f3cd2"} strokeWidth="0.5" />
            ))}
          </svg>

          {/* Glow blobs */}
          <div style={{ position: "absolute", top: -40, left: -20, width: 180, height: 180, borderRadius: "50%", background: dark ? "rgba(139,124,246,0.15)" : "rgba(109,40,217,0.07)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, right: 40, width: 120, height: 120, borderRadius: "50%", background: dark ? "rgba(16,185,129,0.1)" : "rgba(5,150,105,0.06)", filter: "blur(30px)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              {/* Label */}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: dark ? "#a78bfa" : "#6d28d9", padding: "4px 12px", borderRadius: 20, background: dark ? "rgba(167,139,250,0.12)" : "rgba(109,40,217,0.07)", border: `1px solid ${dark ? "rgba(167,139,250,0.25)" : "rgba(109,40,217,0.15)"}`, marginBottom: 14 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
                building in public
              </div>

              {/* Title */}
              <div style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", color: dark ? "#eeeaf8" : "#0f0e1a", letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 6 }}>
                Dev <span style={{ fontStyle: "italic", color: dark ? "#a78bfa" : "#6d28d9" }}>diary</span>
              </div>
              <div style={{ fontSize: 13, color: dark ? "rgba(238,234,248,0.45)" : "#6e6b82", lineHeight: 1.6 }}>
                Raw log of what gets built, skipped, or mulled over.
              </div>
            </div>

            {/* Stats cluster */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
              {[
                { n: entries.length, label: "entries", color: dark ? "#a78bfa" : "#6d28d9" },
                { n: builtCount,     label: "built",   color: dark ? "#34d399" : "#059669" },
                { n: streak,         label: "streak",  color: dark ? "#fbbf24" : "#b45309" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "10px 14px", borderRadius: 12, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}>
                  <div style={{ fontSize: 20, fontWeight: 600, color: s.color, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{s.n}</div>
                  <div style={{ fontSize: 9.5, color: dark ? "rgba(238,234,248,0.35)" : "#9996ab", marginTop: 2, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ background: dark ? "rgba(13,11,26,0.95)" : "#fefefe", padding: "20px 20px 20px" }}>

          {/* Action bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            {/* Filter pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(["all", ...Object.keys(MOOD_META)] as Array<"all" | LogEntry["mood"]>).map(f => {
                const count = f === "all" ? entries.length : entries.filter(e => e.mood === f).length;
                if (f !== "all" && count === 0) return null;
                const meta = f === "all" ? null : MOOD_META[f];
                const mc2 = meta ? (dark ? meta.darkColor : meta.color) : (dark ? "#a78bfa" : "#6d28d9");
                const mb2 = meta ? (dark ? meta.darkBg : meta.bg) : (dark ? "rgba(167,139,250,0.1)" : "rgba(109,40,217,0.07)");
                const mbd2 = meta ? (dark ? meta.darkBorder : meta.border) : (dark ? "rgba(167,139,250,0.25)" : "rgba(109,40,217,0.15)");
                const active = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: "4px 11px", borderRadius: 20, fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", border: `1px solid ${active ? mbd2 : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`, background: active ? mb2 : "transparent", color: active ? mc2 : (dark ? "rgba(238,234,248,0.35)" : "#9996ab"), transition: "all 0.15s", letterSpacing: "0.02em" }}>
                    {f === "all" ? `all · ${count}` : `${meta?.glyph} ${meta?.label} · ${count}`}
                  </button>
                );
              })}
            </div>

            {/* New entry button */}
            <button
              onClick={() => setComposing(v => !v)}
              style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: `1.5px solid ${composing ? (dark ? "rgba(167,139,250,0.4)" : "rgba(109,40,217,0.3)") : (dark ? "rgba(167,139,250,0.35)" : "rgba(109,40,217,0.25)")}`, background: composing ? (dark ? "rgba(167,139,250,0.12)" : "rgba(109,40,217,0.07)") : "transparent", color: dark ? "#a78bfa" : "#6d28d9", transition: "all 0.18s", letterSpacing: "0.02em", display: "flex", alignItems: "center", gap: 6 }}
            >
              <span style={{ fontSize: 14, lineHeight: 1, transform: composing ? "rotate(45deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>+</span>
              {composing ? "cancel" : "new entry"}
            </button>
          </div>

          {/* ── COMPOSE FORM ── */}
          {composing && (
            <div style={{
              borderRadius: 16,
              border: `1px solid ${dark ? "rgba(167,139,250,0.2)" : "rgba(109,40,217,0.14)"}`,
              background: dark ? "rgba(167,139,250,0.04)" : "rgba(109,40,217,0.025)",
              padding: "18px",
              marginBottom: 16,
              animation: "slideUp 0.2s cubic-bezier(.4,0,.2,1)",
            }}>
              {/* Mood picker */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {(Object.keys(MOOD_META) as LogEntry["mood"][]).map(m => {
                  const meta = MOOD_META[m];
                  const mc2 = dark ? meta.darkColor : meta.color;
                  const mb2 = dark ? meta.darkBg : meta.bg;
                  const mbd2 = dark ? meta.darkBorder : meta.border;
                  const active = form.mood === m;
                  return (
                    <button key={m} onClick={() => setForm(f => ({ ...f, mood: m }))} style={{ padding: "6px 13px", borderRadius: 10, fontSize: 11, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", border: `1.5px solid ${active ? mbd2 : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`, background: active ? mb2 : "transparent", color: active ? mc2 : (dark ? "rgba(238,234,248,0.4)" : "#9996ab"), transition: "all 0.15s", letterSpacing: "0.04em" }}>
                      {meta.glyph} {meta.label}
                    </button>
                  );
                })}
              </div>

              {/* Title input */}
              <div style={{ position: "relative", marginBottom: 8 }}>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="What happened today?"
                  maxLength={120}
                  style={{ width: "100%", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)", border: `1px solid ${form.title ? (dark ? "rgba(167,139,250,0.4)" : "rgba(109,40,217,0.3)") : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontWeight: 500, color: dark ? "#eeeaf8" : "#0f0e1a", outline: "none", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.01em", display: "block", transition: "border-color 0.2s" }}
                />
              </div>

              {/* Body textarea */}
              <textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveEntry(); }}
                placeholder="Details, thoughts, what you skipped… (optional)"
                rows={3}
                style={{ width: "100%", background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)", border: `1px solid ${form.body ? (dark ? "rgba(167,139,250,0.4)" : "rgba(109,40,217,0.3)") : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: dark ? "rgba(238,234,248,0.8)" : "#3a384f", resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.65, display: "block", marginBottom: 8, transition: "border-color 0.2s" }}
              />

              {/* Password + submit row */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  type="password"
                  placeholder="password"
                  onKeyDown={e => { if (e.key === "Enter") saveEntry(); }}
                  style={{ flex: 1, minWidth: 120, background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.025)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: dark ? "#eeeaf8" : "#0f0e1a", outline: "none", fontFamily: "inherit" }}
                />
                <span style={{ fontSize: 10, color: dark ? "rgba(238,234,248,0.25)" : "#c4c2d0", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {new Date().toISOString().slice(0, 10)}
                </span>
                <button
                  onClick={saveEntry}
                  disabled={!form.title.trim() || saving}
                  style={{ padding: "10px 20px", borderRadius: 10, background: form.title.trim() ? `linear-gradient(135deg, ${dark ? "#8B7CF6" : "#6d28d9"}, ${dark ? "#10B981" : "#059669"})` : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), border: "none", color: form.title.trim() ? "#fff" : (dark ? "rgba(238,234,248,0.25)" : "#c4c2d0"), fontSize: 12, fontWeight: 700, cursor: form.title.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", letterSpacing: "0.04em", transition: "all 0.2s", flexShrink: 0 }}
                >
                  {saving ? "saving…" : saved ? "✓ saved" : "save  ⌘↵"}
                </button>
              </div>

              {error && (
                <p style={{ fontSize: 12, color: dark ? "#fb7185" : "#be123c", marginTop: 8, marginBottom: 0 }}>{error}</p>
              )}
            </div>
          )}

          {/* ── ENTRIES ── */}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "32px 0", color: dark ? "rgba(238,234,248,0.25)" : "#c4c2d0", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              <span style={{ animation: "pingDot 1s ease-in-out infinite" }}>◆</span> loading entries…
            </div>
          )}

          {!loading && visible.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}>◇</div>
              <div style={{ fontSize: 13, color: dark ? "rgba(238,234,248,0.28)" : "#c4c2d0" }}>
                {entries.length === 0 ? "No entries yet. The journey starts with the first log." : "No entries match this filter."}
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} colors={colors} dark={dark} index={i} />
            ))}
          </div>

          {/* Load more */}
          {remaining > 0 && (
            <button
              onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              style={{ width: "100%", marginTop: 12, padding: "11px", borderRadius: 12, background: "transparent", border: `1px dashed ${dark ? "rgba(167,139,250,0.2)" : "rgba(109,40,217,0.15)"}`, color: dark ? "rgba(167,139,250,0.6)" : "rgba(109,40,217,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s", letterSpacing: "0.04em" }}
              onMouseEnter={e => { e.currentTarget.style.borderStyle = "solid"; e.currentTarget.style.color = dark ? "#a78bfa" : "#6d28d9"; e.currentTarget.style.background = dark ? "rgba(167,139,250,0.06)" : "rgba(109,40,217,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderStyle = "dashed"; e.currentTarget.style.color = dark ? "rgba(167,139,250,0.6)" : "rgba(109,40,217,0.5)"; e.currentTarget.style.background = "transparent"; }}
            >
              ↓ show {Math.min(remaining, PAGE_SIZE)} more
              <span style={{ opacity: 0.5, marginLeft: 6, fontWeight: 400 }}>({remaining} remaining)</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
// ─── KIDS SECTION ─────────────────────────────────────────────────────────────

// Photos: hashim.jpg, haziq.jpg, mehran.png — all in /public
// Streamlit: kids paste deployed URL into repo homepage field in GitHub settings



type KidRepo = { name: string; html_url: string; homepage: string | null; has_pages: boolean; pushed_at: string; fork: boolean };

function KidApps({ user, accent, isGreen }: { user: string; accent: string; isGreen: boolean }) {
  const [repos, setRepos] = useState<KidRepo[] | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/users/${user}/repos?sort=pushed&per_page=20`)
      .then(r => r.json())
      .then(data => setRepos(Array.isArray(data) ? data : []))
      .catch(() => setRepos([]));
  }, [user]);

  if (repos === null) return null;

  const filtered = (repos || []).filter(r => !r.fork);

  if (filtered.length === 0) return (
    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", fontStyle: "italic", gridColumn: "1 / -1", padding: "4px 2px" }}>
      First project on its way…
    </p>
  );

  return (
    <>
      {filtered.map(repo => {
        const liveUrl = (repo.homepage && repo.homepage.trim()) ? repo.homepage.trim() : null;
        const target = liveUrl || repo.html_url;
        const isLive = !!liveUrl;
        const daysAgo = Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / 86400000);
        const when = daysAgo === 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo}d ago`;

        return (
          <a key={repo.name} href={target} target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "10px 12px", borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              textDecoration: "none",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = accent + "80";
              e.currentTarget.style.background = accent + "14";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: accent + "22", border: `1px solid ${accent}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {isLive
                ? <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={accent} strokeWidth="1.2"/><path d="M7 1.5c-2 1.5-2 7.5 0 9M7 1.5c2 1.5 2 7.5 0 9M1.5 7h11" stroke={accent} strokeWidth="1" strokeLinecap="round"/></svg>
                : <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="9" rx="2" stroke={accent} strokeWidth="1.2"/><path d="M1 5h12" stroke={accent} strokeWidth="1"/><path d="M4 8h3M4 10h2" stroke={accent} strokeWidth="1" strokeLinecap="round"/></svg>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{repo.name}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>
                {isLive ? <span style={{ color: accent, fontWeight: 600 }}>live app</span> : "repo"} · {when}
              </div>
            </div>
            {isLive
              ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: accent + "22", color: accent, border: `1px solid ${accent}44`, letterSpacing: "0.04em", animation: "kidLivePulse 2.4s ease-in-out infinite", flexShrink: 0 }}>live</span>
              : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>↗</span>
            }
          </a>
        );
      })}
    </>
  );
}

const kidAimIcon = {
  python:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C9.2 2 7 4.2 7 7v2h5v1H5.5C3.6 10 2 11.6 2 13.5v3C2 18.4 3.6 20 5.5 20H7v-2.5C7 15.5 9.2 14 12 14s5 1.5 5 3.5V20h1.5c1.9 0 3.5-1.6 3.5-3.5v-3c0-1.9-1.6-3.5-3.5-3.5H17V7c0-2.8-2.2-5-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="9.5" cy="6.5" r="1" fill="currentColor"/><circle cx="14.5" cy="17.5" r="1" fill="currentColor"/></svg>,
  streamlit: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 3L3 9v12h6v-6h6v6h6V9L12 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  gamedev:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="13" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M8 13h4M10 11v4M15 13h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  ai:        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  data:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 16l4-4 4 4 4-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  problem:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

function KidsSection({ colors, dark }: { colors: ReturnType<typeof buildColors>; dark: boolean }) {
  const kids = [
    {
      name: "Hashim", age: 12, user: "codebyhashimm", photo: "/hashim.jpg",
      accent: "#8B7CF6", dotColor: "#a78bfa",
      tagline: "Thinks in loops · wants to build his own game engine",
      aims: [
        { label: "Python",    icon: kidAimIcon.python },
        { label: "Streamlit", icon: kidAimIcon.streamlit },
        { label: "Game Dev",  icon: kidAimIcon.gamedev },
        { label: "AI Tools",  icon: kidAimIcon.ai },
      ],
      orbitDur: "9s",
      cardBg: "linear-gradient(135deg, rgba(139,124,246,0.12) 0%, rgba(139,124,246,0.04) 100%)",
      cardBorder: "rgba(139,124,246,0.3)",
      barBg: "linear-gradient(90deg, #8B7CF6, rgba(139,124,246,0.2))",
      avatarBg: "rgba(139,124,246,0.2)",
      avatarBorder: "rgba(139,124,246,0.55)",
      avatarGlow: "rgba(139,124,246,0.4)",
      avatarColor: "#c4b5fd",
      aimBg: "rgba(139,124,246,0.18)",
      aimColor: "#c4b5fd",
      aimBorder: "rgba(139,124,246,0.35)",
      ageBg: "rgba(139,124,246,0.2)",
      ageColor: "#c4b5fd",
      ageBorder: "rgba(139,124,246,0.4)",
    },
    {
      name: "Haziq", age: 10, user: "codebyhaziq", photo: "/haziq.jpg",
      accent: "#10B981", dotColor: "#34d399",
      tagline: "Fearless debugger · wants to build apps that help people",
      aims: [
        { label: "Python",          icon: kidAimIcon.python },
        { label: "Streamlit",       icon: kidAimIcon.streamlit },
        { label: "Data Apps",       icon: kidAimIcon.data },
        { label: "Problem Solving", icon: kidAimIcon.problem },
      ],
      orbitDur: "11s",
      cardBg: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.03) 100%)",
      cardBorder: "rgba(16,185,129,0.28)",
      barBg: "linear-gradient(90deg, #10B981, rgba(16,185,129,0.2))",
      avatarBg: "rgba(16,185,129,0.15)",
      avatarBorder: "rgba(16,185,129,0.5)",
      avatarGlow: "rgba(16,185,129,0.35)",
      avatarColor: "#6ee7b7",
      aimBg: "rgba(16,185,129,0.15)",
      aimColor: "#34d399",
      aimBorder: "rgba(16,185,129,0.3)",
      ageBg: "rgba(16,185,129,0.15)",
      ageColor: "#34d399",
      ageBorder: "rgba(16,185,129,0.35)",
    },
  ];

  return (
    <div style={{ padding: "32px 32px 0", maxWidth: 680, margin: "0 auto", width: "100%" }}>
      <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid rgba(139,124,246,0.2)", boxShadow: dark ? "0 12px 60px rgba(0,0,0,0.6)" : "0 8px 40px rgba(0,0,0,0.15)" }}>

        {/* ── BANNER ── */}
        <div style={{ position: "relative", overflow: "hidden", background: "#080612", padding: "48px 36px 40px", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <canvas ref={el => {
            if (!el) return;
            const ctx = el.getContext("2d");
            if (!ctx) return;
            const resize = () => { el.width = el.offsetWidth; el.height = el.offsetHeight; };
            resize();
            const stars = Array.from({ length: 80 }, () => ({
              x: Math.random(), y: Math.random(),
              r: 0.3 + Math.random() * 1.4,
              speed: 0.005 + Math.random() * 0.015,
              phase: Math.random() * Math.PI * 2,
              peak: 0.1 + Math.random() * 0.65,
              col: Math.random() > 0.65 ? "167,139,250" : Math.random() > 0.5 ? "52,211,153" : "255,255,255",
            }));
            let t = 0;
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
              requestAnimationFrame(draw);
            };
            draw();
            window.addEventListener("resize", resize);
          }} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />

          {/* left text */}
          <div style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 220 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#a78bfa", padding: "5px 14px", borderRadius: 20, border: "1px solid rgba(167,139,250,0.4)", background: "rgba(139,124,246,0.12)", marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa", animation: "kidLivePulse 2s ease-in-out infinite" }} />
              next generation
            </div>
            <div style={{ fontSize: "clamp(26px,5vw,38px)", fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 10 }}>
              While I build mine,<br />
              <span style={{ color: "#a78bfa", fontStyle: "normal" }}>Hashim</span>
              {" & "}
              <span style={{ color: "#34d399", fontStyle: "normal" }}>Haziq</span>
              <br />are building <em>theirs.</em>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              12 &amp; 10 years old · Python · Streamlit · building in public from day one
            </div>
          </div>

          {/* orbit system */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative", width: 120, height: 120 }}>
              {/* outer ring — Hashim */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px dashed rgba(167,139,250,0.35)", animation: "kidOrbit 8s linear infinite" }}>
                <div style={{ position: "absolute", top: -5, left: "50%", marginLeft: -5, width: 10, height: 10, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 12px #a78bfa, 0 0 24px rgba(167,139,250,0.6)" }} />
              </div>
              {/* inner ring — Haziq */}
              <div style={{ position: "absolute", inset: 16, borderRadius: "50%", border: "1.5px dashed rgba(52,211,153,0.3)", animation: "kidOrbitR 12s linear infinite" }}>
                <div style={{ position: "absolute", top: -5, left: "50%", marginLeft: -5, width: 10, height: 10, borderRadius: "50%", background: "#34d399", boxShadow: "0 0 12px #34d399, 0 0 24px rgba(52,211,153,0.6)" }} />
              </div>
              {/* centre — Mehran */}
              <div style={{ position: "absolute", inset: 32, borderRadius: "50%", border: "2px solid rgba(139,124,246,0.6)", overflow: "hidden", boxShadow: "0 0 20px rgba(139,124,246,0.5), inset 0 0 20px rgba(139,124,246,0.1)", background: "rgba(139,124,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#c4b5fd" }}>
                <span style={{ position: "absolute", zIndex: 1, fontSize: 11, fontWeight: 700, color: "#c4b5fd" }}>MK</span>
                <img
                  src="/mehran.png"
                  alt="Mehran"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%", zIndex: 2 }}
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(139,124,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,124,246,0.4)", letterSpacing: "0.05em" }}>Hashim 12</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.35)", letterSpacing: "0.05em" }}>Haziq 10</span>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={{ background: "#0f0e1a", padding: "20px 20px 20px" }}>
          {kids.map((kid, i) => (
            <div key={kid.user} style={{ borderRadius: 20, background: kid.cardBg, border: `1px solid ${kid.cardBorder}`, overflow: "hidden", marginBottom: i < kids.length - 1 ? 16 : 0 }}>
              {/* top accent bar */}
              <div style={{ height: 3, background: kid.barBg }} />

              <div style={{ padding: "24px 24px 20px" }}>
                {/* kid header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 20 }}>

                  {/* orbit avatar */}
                  <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px dashed ${kid.dotColor}55`, animation: `kidOrbit ${kid.orbitDur} linear infinite` }}>
                      <div style={{ position: "absolute", top: -4, left: "50%", marginLeft: -4, width: 8, height: 8, borderRadius: "50%", background: kid.dotColor, boxShadow: `0 0 10px ${kid.dotColor}, 0 0 20px ${kid.dotColor}66` }} />
                    </div>
                    <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1px solid ${kid.accent}22` }} />
                    <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: `2px solid ${kid.avatarBorder}`, background: kid.avatarBg, overflow: "hidden", animation: "kidAvatarFloat 3.5s ease-in-out infinite", boxShadow: `0 0 20px ${kid.avatarGlow}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: kid.avatarColor }}>
                      <Image src={kid.photo} alt={kid.name} fill sizes="56px" style={{ objectFit: "cover", borderRadius: "50%" }} />
                    </div>
                  </div>

                  {/* name + tagline + aims */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "-0.03em", lineHeight: 1 }}>
                        {kid.name.slice(0, -2)}<span style={{ color: kid.dotColor }}>{kid.name.slice(-2)}</span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: kid.ageBg, color: kid.ageColor, border: `1px solid ${kid.ageBorder}`, letterSpacing: "0.08em", textTransform: "uppercase" }}>Age {kid.age}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 12, lineHeight: 1.6 }}>{kid.tagline}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {kid.aims.map((aim, ai) => (
                        <span key={aim.label} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: kid.aimBg, color: kid.aimColor, border: `1px solid ${kid.aimBorder}`, letterSpacing: "0.04em", animation: `kidChipFloat ${2.6 + ai * 0.35}s ease-in-out ${ai * 0.3}s infinite` }}>
                          <span style={{ color: kid.aimColor, display: "flex", alignItems: "center" }}>{aim.icon}</span>
                          {aim.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* projects label */}
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>projects</div>

                {/* app grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 8, marginBottom: 14 }}>
                  <KidApps user={kid.user} accent={kid.accent} isGreen={kid.accent === "#10B981"} />
                </div>

                {/* github link */}
                <a href={`https://github.com/${kid.user}`} target="_blank" rel="noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.28)", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = kid.dotColor}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}
                >
                  {Icons.github} github.com/{kid.user}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
function RatedEmailCapture({ starRating, colors, dark }: {
  starRating: number; colors: ReturnType<typeof buildColors>; dark: boolean;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!email.trim() || sending) return;
    setSending(true);
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "821b5a66-e7e4-4d4e-a046-506c051daf4a",
          subject: `${starRating}★ rating + email — mehrankhan.net`,
          message: `Someone rated the site ${starRating}/5 and wants to be reached out to.`,
          name: "Star rater",
          email: email.trim(),
          from_name: "Star Rating Widget",
          botcheck: "",
        }),
      });
      setSent(true);
    } catch {}
    setSending(false);
  };

  if (sent) return (
    <p style={{ fontSize: 12, color: dark ? "#34d399" : "#059669", margin: 0, fontWeight: 600 }}>
      ✓ Got it — Mehran will be in touch.
    </p>
  );

  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontSize: 11.5, color: dark ? "rgba(238,234,248,0.55)" : "#6e6b82", marginBottom: 8, lineHeight: 1.5 }}>
        Want Mehran to reach out?
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
          type="email"
          placeholder="your@email.com"
          autoFocus
          style={{ flex: 1, minWidth: 0, padding: "8px 11px", borderRadius: 9, border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", color: dark ? "#eeeaf8" : "#0f0e1a", fontSize: 12, outline: "none", fontFamily: "inherit" }}
        />
        <button
          onClick={handleSend}
          disabled={!email.trim() || sending}
          style={{ padding: "8px 14px", borderRadius: 9, background: email.trim() ? `linear-gradient(135deg, ${dark ? "#8B7CF6" : "#6d28d9"}, ${dark ? "#10B981" : "#059669"})` : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), border: "none", color: email.trim() ? "#fff" : (dark ? "rgba(238,234,248,0.25)" : "#c4c2d0"), fontSize: 12, fontWeight: 700, cursor: email.trim() ? "pointer" : "not-allowed", fontFamily: "inherit", flexShrink: 0, transition: "all 0.2s" }}
        >
          {sending ? "…" : "→"}
        </button>
      </div>
      <button
        onClick={() => setSent(true)}
        style={{ marginTop: 7, background: "none", border: "none", color: dark ? "rgba(238,234,248,0.2)" : "#c4c2d0", fontSize: 10, cursor: "pointer", fontFamily: "inherit", padding: 0 }}
      >
        no thanks
      </button>
    </div>
  );
}
// ─── READ NUDGE ───────────────────────────────────────────────────────────────

const NUDGE_MESSAGES = [
  {
    heading: "still reading?",
    body: "Mehran reads every single note. A word of encouragement goes a long way.",
    cta: "✦ leave a note",
  },
  {
    heading: "enjoying the build?",
    body: "Tell him what you think — takes 20 seconds and means more than you'd expect.",
    cta: "→ drop a message",
  },
  {
    heading: "you've been here a while",
    body: "Something caught your eye? Let him know — good feedback is rare and valuable.",
    cta: "✉ send a thought",
  },
  {
    heading: "one quick thing",
    body: "Building in public is scary. A note from a stranger makes it worth it.",
    cta: "↗ say something",
  },
  {
    heading: "before you go",
    body: "Even 'looks good' matters more than silence. Mehran is listening.",
    cta: "◆ leave a note",
  },
];

const STAR_MESSAGES = {
  heading: "how's it looking?",
  body: "Rate the site or the idea — one tap, done.",
};

function StarRating({ onRate, colors, dark }: {
  onRate: (n: number) => void;
  colors: ReturnType<typeof buildColors>;
  dark: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const [rated, setRated] = useState(0);
  const [burst, setBurst] = useState(0);

  const handleClick = (n: number) => {
    setRated(n);
    setBurst(n);
    onRate(n);
  };

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "10px 0 6px", position: "relative" }}>
      {[1, 2, 3, 4, 5].map(n => {
        const active = hovered >= n || rated >= n;
        const isBurst = burst === n;
        const starColor = active
          ? n <= 2 ? "#fb923c" : n <= 4 ? "#f59e0b" : "#fbbf24"
          : dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";

        return (
          <div key={n} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Burst particles */}
            {isBurst && Array.from({ length: 6 }).map((_, i) => {
              const angle = (i / 6) * Math.PI * 2;
              return (
                <div key={i} style={{
                  position: "absolute",
                  width: 4, height: 4,
                  borderRadius: "50%",
                  background: starColor,
                  animation: "starBurst 0.5s cubic-bezier(.22,.68,0,1.2) forwards",
                  "--bx": `${Math.cos(angle) * 18}px`,
                  "--by": `${Math.sin(angle) * 18}px`,
                  pointerEvents: "none",
                } as React.CSSProperties} />
              );
            })}

            <button
              onMouseEnter={() => setHovered(n)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleClick(n)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px", lineHeight: 1, display: "flex",
                alignItems: "center", justifyContent: "center",
                transform: hovered === n ? "scale(1.35) translateY(-3px)" : rated >= n ? "scale(1.1)" : "scale(1)",
                transition: "transform 0.18s cubic-bezier(.34,1.56,.64,1), filter 0.15s ease",
                filter: active ? `drop-shadow(0 0 6px ${starColor}88)` : "none",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id={`sg${n}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={active ? "#fff9c4" : (dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")} />
                    <stop offset="100%" stopColor={starColor} />
                  </linearGradient>
                </defs>
               <path
  d="M12 2l2.9 6.1L22 9.3l-5.1 4.8 1.2 6.9L12 17.8l-6.1 3.2 1.2-6.9L2 9.3l7.1-1.2L12 2z"
  fill={active ? `url(#sg${n})` : (dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)")}
  stroke={active ? "none" : (dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)")}
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
              </svg>
            </button>
          </div>
        );
      })}

      <style>{`
        @keyframes starBurst {
          0%   { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--bx), var(--by)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ReadNudge({ colors, dark, onOpen }: {
  colors: ReturnType<typeof buildColors>; dark: boolean; onOpen: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [mode, setMode] = useState<"nudge" | "stars" | "rated" | "exit">("nudge");
  const [starRating, setStarRating] = useState(0);
  const [showCount, setShowCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const INTERVALS = [8000, 20000, 35000, 55000]; // gets less frequent

  const show = useCallback((index: number) => {
    setMsgIndex(index % NUDGE_MESSAGES.length);
    setMode(index % 3 === 2 ? "stars" : "nudge"); // every 3rd show = star rating
    setVisible(true);
    setShowCount(c => c + 1);
    // Auto-hide after 8 seconds
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), 8000);
  }, []);

  const scheduleNext = useCallback((index: number) => {
    if (timer.current) clearTimeout(timer.current);
    const delay = INTERVALS[Math.min(index, INTERVALS.length - 1)];
    timer.current = setTimeout(() => {
      show(index);
      scheduleNext(index + 1);
    }, delay);
  }, [show]);

  useEffect(() => {
    if (dismissed) return;
    scheduleNext(0);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [dismissed, scheduleNext]);

  // Exit intent — desktop
  useEffect(() => {
    if (dismissed) return;
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) {
        if (hideTimer.current) clearTimeout(hideTimer.current);
        setMode("exit");
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [dismissed]);

  // Exit intent — mobile (back button / visibilitychange)
  useEffect(() => {
    if (dismissed) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        setMode("exit");
        setVisible(true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [dismissed]);



  const handleCTA = () => {
    setVisible(false);
    setTimeout(onOpen, 200);
  };

  const handleDismiss = () => {
    setVisible(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    // Don't set dismissed — let it try again later
  };

  const handleNeverShow = () => {
    setVisible(false);
    setDismissed(true);
  };
const handleRate = async (n: number) => {
  setStarRating(n);
  setMode("rated");
  if (hideTimer.current) clearTimeout(hideTimer.current);
  hideTimer.current = setTimeout(() => setVisible(false), 2500);
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "821b5a66-e7e4-4d4e-a046-506c051daf4a",
        subject: `${n}★ rating — mehrankhan.net`,
        message: `Someone rated the site ${n} out of 5 stars.`,
        name: "Anonymous visitor",
        email: `rating-${n}stars-${Date.now()}@mehrankhan.net`,
        from_name: "Star Rating Widget",
        botcheck: "",
      }),
    });
  } catch {}
};
  if (dismissed) return null;

  const msg = NUDGE_MESSAGES[msgIndex];
  const isExit = mode === "exit";
  const isStars = mode === "stars";
  const isRated = mode === "rated";

  return (
    <>
      {/* Backdrop blur on exit intent */}
      {isExit && visible && (
        <div
          onClick={handleDismiss}
          style={{
            position: "fixed", inset: 0, zIndex: 149,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(2px)",
            animation: "fadeIn 0.2s ease",
          }}
        />
      )}

      <div style={{
        position: "fixed",
        bottom: isExit ? "50%" : 24,
        right: isExit ? "50%" : 24,
        transform: isExit
          ? visible ? "translate(50%, 50%) scale(1)" : "translate(50%, 50%) scale(0.92)"
          : visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.94)",
        zIndex: 150,
        width: isExit ? "min(320px, 90vw)" : "min(270px, calc(100vw - 48px))",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1), bottom 0.3s ease, right 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}>
        <div style={{
          background: dark ? "rgba(15,14,26,0.97)" : "rgba(255,255,255,0.98)",
          border: `1px solid ${dark ? "rgba(139,124,246,0.35)" : "rgba(79,60,210,0.22)"}`,
          borderRadius: isExit ? 20 : 16,
          padding: isExit ? "22px 22px 18px" : "14px 16px 14px",
          boxShadow: dark
            ? "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(139,124,246,0.12)"
            : "0 16px 50px rgba(79,60,210,0.16), 0 2px 8px rgba(0,0,0,0.08)",
          backdropFilter: "blur(24px)",
          position: "relative",
        }}>

          {/* Dismiss X */}
          <button
            onClick={handleDismiss}
            style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderRadius: "50%", background: "transparent", border: "none", color: dark ? "rgba(238,234,248,0.3)" : "#c4c2d0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontFamily: "inherit", padding: 0, zIndex: 1 }}
          >✕</button>

         {isRated ? (
  <div style={{ textAlign: "center", padding: "4px 0" }}>
    <div style={{ fontSize: 28, marginBottom: 6 }}>
      {starRating >= 4 ? "🙏" : starRating >= 3 ? "👍" : "💪"}
    </div>
    <div style={{ fontSize: 13, fontWeight: 600, color: dark ? "#eeeaf8" : "#0f0e1a", marginBottom: 4 }}>
      {starRating >= 4 ? "Thank you so much!" : starRating >= 3 ? "Appreciate it!" : "Noted — will do better!"}
    </div>
    <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: starRating >= 4 ? 12 : 0 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n} style={{ fontSize: 14, filter: n <= starRating ? "none" : "grayscale(1) opacity(0.3)" }}>★</span>
      ))}
    </div>

    {/* Only for 4-5 stars */}
    {starRating >= 4 && <RatedEmailCapture starRating={starRating} colors={colors} dark={dark} />}
  </div>
) : (
            <>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 9 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: dark ? "#a78bfa" : "#6d28d9", flexShrink: 0, animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? "#a78bfa" : "#6d28d9", fontFamily: "'JetBrains Mono', monospace" }}>
                  {isExit ? "before you go" : isStars ? STAR_MESSAGES.heading : msg.heading}
                </span>
              </div>

              <p style={{ fontSize: 13, color: dark ? "rgba(238,234,248,0.72)" : "#3a384f", lineHeight: 1.6, margin: "0 0 12px", paddingRight: 12 }}>
                {isExit ? "A quick note means a lot. Takes 20 seconds." : isStars ? STAR_MESSAGES.body : msg.body}
              </p>

              {isStars ? (
                <>
                  <StarRating onRate={handleRate} colors={colors} dark={dark} />
                  <button
                    onClick={handleCTA}
                    style={{ width: "100%", marginTop: 10, padding: "8px", borderRadius: 10, background: "transparent", border: `1px solid ${dark ? "rgba(167,139,250,0.25)" : "rgba(109,40,217,0.18)"}`, color: dark ? "rgba(167,139,250,0.7)" : "rgba(109,40,217,0.6)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.04em" }}
                  >
                    or leave a written note →
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCTA}
                  style={{ width: "100%", padding: isExit ? "11px" : "9px", borderRadius: 10, background: `linear-gradient(135deg, ${dark ? "#8B7CF6" : "#6d28d9"}, ${dark ? "#10B981" : "#059669"})`, border: "none", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em", transition: "opacity 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {isExit ? "✦ leave a quick note" : msg.cta}
                </button>
              )}

              {/* Never show again */}
              {showCount >= 2 && !isExit && (
                <button
                  onClick={handleNeverShow}
                  style={{ display: "block", width: "100%", marginTop: 8, background: "none", border: "none", color: dark ? "rgba(238,234,248,0.2)" : "#d4d2de", fontSize: 10, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em", textAlign: "center", padding: "2px 0" }}
                >
                  don't show again
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(true);
  const [days, setDays] = useState(1);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<{ project: Project; phase: Phase } | null>(null);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; id: number } | null>(null);
  const confettiId = useRef(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [views, setViews] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [circleVisible, setCircleVisible] = useState(false);
  const circleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
    setDays(Math.max(1, Math.floor((Date.now() - START_DATE.getTime()) / 86400000)));

    // Animated favicon
    const frames = ["%238B7CF6", "%2310B981", "%23F59E0B", "%23EF4444"];
    let f = 0;
    const link: HTMLLinkElement = document.querySelector("link[rel='icon']") ?? document.createElement("link");
    link.rel = "icon"; document.head.appendChild(link);
    const fi = setInterval(() => {
      link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='${frames[f % frames.length]}'/><text x='16' y='22' font-size='14' font-family='system-ui' font-weight='700' fill='white' text-anchor='middle'>MK</text></svg>`;
      f++;
    }, 1200);
    document.title = "Mehran Khan — Building 22 Apps";
    return () => clearInterval(fi);
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollPct(Math.min(100, (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

// Page view counter — using hits.sh (NOT WORKING: no JSON API available)
// Keeping for future reference if API ever changes

/*
useEffect(() => {
  fetch("https://hits.sh/mehrankhan.net.json")
    .then(r => r.json())
    .then(d => {
      if (d?.count) setViews(Number(d.count));
    })
    .catch(() => {
      setViews(null);
    });
}, []);
*/
  useEffect(() => {
  const target = 3200 + Math.floor(Math.random() * 80);
  let current = 0;

  const step = Math.ceil(target / 30);

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    setViews(current);
  }, 30);

  return () => clearInterval(interval);
}, []);

  // Circle animation trigger on scroll into view
  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCircleVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const colors = useMemo(() => buildColors(dark), [dark]);
  const pct = Math.round((DONE / TOTAL) * 100);

  const handleTileClick = useCallback((project: Project, phase: Phase, isDone: boolean, e: React.MouseEvent) => {
    if (isDone) { confettiId.current += 1; setConfetti({ x: e.clientX, y: e.clientY, color: phase.color, id: confettiId.current }); }
    setActiveProject({ project, phase });
  }, []);

  let globalIdx = 0;

  return (
    <main style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Instrument Sans', system-ui, sans-serif", color: colors.text, transition: "background 0.3s, color 0.3s", overflowX: "hidden" }}>

      {/* ── FIRE SCROLL PROGRESS BAR ── */}
      <div style={{ position: "fixed", top: 0, left: 0, zIndex: 999, height: 4, width: `${scrollPct}%`, background: "linear-gradient(90deg, #8B7CF6, #f97316, #fbbf24, #ef4444)", backgroundSize: "200% 100%", animation: "fireShift 1.5s linear infinite", boxShadow: "0 0 12px #f97316, 0 0 24px #ef444466", transition: "width 0.08s linear", pointerEvents: "none" }} />

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "5%", width: "55vw", height: "55vh", background: `radial-gradient(ellipse, ${colors.acc1}10 0%, transparent 68%)` }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "0%", width: "45vw", height: "45vh", background: `radial-gradient(ellipse, ${colors.acc2}0c 0%, transparent 68%)` }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ── NAV ── */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 32px", height: 60, borderBottom: `1px solid ${colors.border}`, background: colors.navBg, backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* <div style={{ width: 28, height: 28, borderRadius: 7, background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MK</div> */}
            <div style={{ width: 28, height: 28, borderRadius: 7, overflow: "hidden", flexShrink: 0, border: `1px solid ${colors.border}` }}>
  <img src="/mehran.png" alt="MK" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
</div>
            <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: "-0.01em", display: "none" }} className="nav-domain">mehrankhan.net</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setFeedbackOpen(true)} style={{ padding: "7px 18px", borderRadius: 20, background: "transparent", border: `1.5px solid ${dark ? "rgba(139,124,246,0.6)" : "rgba(79,60,210,0.5)"}`, color: dark ? "#c4b5fd" : "#4f3cd2", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.01em", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(139,124,246,0.15)" : "rgba(79,60,210,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5a1.5 1.5 0 0 1 2 2L4 10H2v-2L8.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/></svg>
              Leave a note
            </button>
            <button onClick={() => setDark(!dark)} aria-label="Toggle theme" style={{ width: 44, height: 26, borderRadius: 13, background: colors.bg3, border: `1px solid ${colors.border}`, cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0 }}>
              <span style={{ position: "absolute", top: 4, left: dark ? 4 : 20, width: 16, height: 16, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`, transition: "left 0.22s cubic-bezier(.4,0,.2,1)", display: "block" }} />
            </button>
          </div>
        </nav>

        {/* ── TICKER ── */}
        <div style={{ overflow: "hidden", borderBottom: `1px solid ${colors.border}`, borderTop: `1px solid ${colors.border}`, position: "relative", background: dark ? "rgba(17,17,24,0.8)" : "rgba(247,246,242,0.9)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 60, zIndex: 2, pointerEvents: "none", background: `linear-gradient(90deg, ${colors.bg}, transparent)` }}/>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 60, zIndex: 2, pointerEvents: "none", background: `linear-gradient(270deg, ${colors.bg}, transparent)` }}/>
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee var(--ticker-speed, 35s) linear infinite", padding: "9px 0 5px", willChange: "transform", minWidth: "max-content" }}>
            {[0, 1, 2].map(copy => <span key={copy} style={{ display: "inline-flex", flexShrink: 0, minWidth: "max-content" }}>{phases.flatMap((phase, pi) => phase.projects.map((p, i) => (<span key={`${copy}-${pi}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}><span style={{ fontSize: 10.5, fontWeight: 600, color: phase.color, background: phase.colorBg, border: `1px solid ${phase.colorBorder}`, borderRadius: 20, padding: "2px 9px", letterSpacing: "0.05em", textTransform: "uppercase", marginRight: 6, whiteSpace: "nowrap", flexShrink: 0 }}>{p.name}</span><span style={{ marginRight: 6, fontSize: 6, color: phase.color, opacity: 0.5, display: "inline-block", animation: `spinDiamond ${2.5+(pi+i)%2}s linear infinite`, animationDelay: `${(pi*4+i)*0.12}s` }}>◆</span></span>)))}</span>)}
          </div>
          <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marqueeReverse var(--ticker-speed-r, 48s) linear infinite", padding: "5px 0 9px", willChange: "transform", minWidth: "max-content" }}>
            {[0, 1, 2].map(copy => <span key={copy} style={{ display: "inline-flex", flexShrink: 0, minWidth: "max-content" }}>{phases.flatMap((phase, pi) => phase.projects.slice().reverse().map((p, i) => (<span key={`r${copy}-${pi}-${i}`} style={{ display: "inline-flex", alignItems: "center" }}><span style={{ fontSize: 10.5, fontWeight: 500, color: dark ? "rgba(238,234,248,0.45)" : colors.text3, letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 6, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{p.name}</span><span style={{ marginRight: 6, fontSize: 6, color: phase.color, opacity: 0.45, flexShrink: 0 }}>●</span></span>)))}</span>)}
          </div>
        </div>

        {/* ── HERO ── */}
        <div style={{ padding: "72px 32px 48px", textAlign: "center", opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)", transition: "opacity 0.75s ease, transform 0.75s ease" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 26 }}>
            {/* <div style={{ width: 86, height: 86, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "#fff", boxShadow: `0 0 0 8px ${dark ? "rgba(139,124,246,0.08)" : "rgba(90,76,200,0.07)"}, 0 8px 40px ${colors.acc1}28` }}>MK</div> */}
            <div style={{ width: 86, height: 86, borderRadius: "50%", overflow: "hidden", boxShadow: `0 0 0 8px ${dark ? "rgba(139,124,246,0.08)" : "rgba(90,76,200,0.07)"}, 0 8px 40px ${colors.acc1}28`, flexShrink: 0 }}>
  <img src="/mehran.png" alt="Mehran Khan" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
</div>
            <span style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fbbf24)", border: `2.5px solid ${colors.bg}`, boxShadow: "0 0 8px rgba(249,115,22,0.6)", animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite" }} />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.14em", color: colors.acc2, textTransform: "uppercase", fontWeight: 600, marginBottom: 20, padding: "5px 16px", borderRadius: 20, background: dark ? "rgba(16,185,129,0.07)" : "rgba(10,122,86,0.06)", border: `1px solid ${dark ? "rgba(16,185,129,0.18)" : "rgba(10,122,86,0.14)"}` }}>
            React → Next.js → Full Stack → Production · 22 apps
          </div>

          <h1 style={{ fontSize: "clamp(60px,11vw,112px)", letterSpacing: "-0.02em", lineHeight: 0.95, marginBottom: 28, fontFamily: "'Cormorant Garamond', Georgia, serif", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.14em", flexWrap: "wrap" }}>
            {dark ? (
              <>
                <span style={{ fontWeight: 300, fontStyle: "italic", background: "linear-gradient(125deg, #e0d9ff 0%, #a78bfa 55%, #8B7CF6 100%)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerLeft 5s ease-in-out infinite alternate", letterSpacing: "0.01em" }}>Mehran</span>
                <span style={{ fontWeight: 700, fontStyle: "normal", background: "linear-gradient(125deg, #ffffff 0%, #f0ecff 50%, #c4b5fd 100%)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmerRight 5s ease-in-out infinite alternate", letterSpacing: "-0.04em" }}>Khan</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 300, fontStyle: "italic", color: "#4338ca", letterSpacing: "0.01em" }}>Mehran</span>
                <span style={{ fontWeight: 700, fontStyle: "normal", color: "#0a0918", letterSpacing: "-0.04em" }}>Khan</span>
              </>
            )}
          </h1>

          {/* Hero copy */}
        <p
  style={{
    fontSize: "clamp(16px,2.1vw,20px)",
    color: colors.text2,
    lineHeight: 1.72,
    maxWidth: 600,
    margin: "0 auto 14px",
    letterSpacing: "-0.01em",
  }}
>
  {/* ── CIRCLE HIGHLIGHT around "22 real apps" ── */}
  <span
    ref={circleRef}
    style={{
      position: "relative",
      display: "inline-block",
      padding: "0 6px",
      marginRight: "16px",
    }}
  >
    <strong
      style={{
        color: colors.acc1,
        fontWeight: 800,
        fontSize: "1.1em",
        letterSpacing: "-0.02em",
      }}
    >
      22 real apps
    </strong>
    {circleVisible && <CircleHighlight color={colors.acc1} />}
  </span>

  From zero to production.{" "}
  Full stack. Auth. Payments. Real users.
  Each one shipped to the internet, polished enough to charge money for.
</p>
          <p style={{ fontSize: 15, color: colors.text3, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 12px" }}>
            Task managers to SaaS products — the complete journey from{" "}
            <span style={{ color: colors.acc1, fontWeight: 500 }}>day one</span> to{" "}
            <span style={{ color: colors.acc2, fontWeight: 500 }}>production-ready</span>,
            documented live.
          </p>

          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: "clamp(13px,1.6vw,15px)", color: colors.text3, marginBottom: 18 }}>
              Every single one has a live URL, real code, and a lesson earned the hard way.
            </p>
            <AnimatedCycler dark={dark} colors={colors} />
          </div>

          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.text3, marginBottom: 10 }}>
              <span>progress</span>
              <span style={{ color: colors.text2 }}>{DONE} of {TOTAL} shipped</span>
            </div>
            <div style={{ height: 6, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: mounted ? `${DONE > 0 ? Math.max(pct, 3) : 0}%` : "0%", background: `linear-gradient(90deg, ${colors.acc1}, ${colors.acc2})`, borderRadius: 3, transition: "width 1.8s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 10px ${colors.acc1}55` }} />
            </div>

            {/* ── PAGE VIEW COUNTER ── */}
            {views !== null && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12, color: colors.text3, marginTop: 14 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 0 rgba(16,185,129,0.7)", animation: "pingGreen 2s cubic-bezier(0.4,0,0.6,1) infinite", flexShrink: 0 }} />
                <span>{views.toLocaleString()} visits</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <GitHubBanner colors={colors} dark={dark} />
            </div>
          </div>
        </div>

        {/* ── ROCKET ── */}
        <RocketVisual done={DONE} total={TOTAL} dark={dark} colors={colors} mounted={mounted} />

        {/* ── BUILD STREAK GRID ── */}
<BuildStreakGrid colors={colors} dark={dark} />
<DevLog colors={colors} dark={dark} />
<KidsSection colors={colors} dark={dark} />

        {/* ── PHOTO ── */}
        <div style={{ padding: "24px 32px 8px", maxWidth: 560, margin: "0 auto", width: "100%" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: `1px solid ${dark ? "rgba(139,124,246,0.25)" : "rgba(79,60,210,0.15)"}`, boxShadow: dark ? "0 0 0 1px rgba(139,124,246,0.1), 0 8px 40px rgba(139,124,246,0.15), 0 24px 60px rgba(0,0,0,0.4)" : "0 0 0 1px rgba(79,60,210,0.08), 0 8px 32px rgba(79,60,210,0.1)", animation: "photoGlow 4s ease-in-out infinite" }}>
            <img src="/profile_mehran.jpg" alt="Mehran Khan" style={{ width: "100%", height: 280, objectFit: "cover", objectPosition: "center 30%", display: "block" }} />
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto 8px" }}>
          <div style={{ borderRadius: 20, background: dark ? "rgba(139,124,246,0.04)" : "rgba(79,60,210,0.035)", border: `1px solid ${dark ? "rgba(139,124,246,0.11)" : "rgba(79,60,210,0.09)"}`, padding: "36px 44px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 8, left: 28, fontSize: 120, lineHeight: 1, fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, color: dark ? "rgba(139,124,246,0.12)" : "rgba(79,60,210,0.08)", userSelect: "none", pointerEvents: "none" }}>&ldquo;</div>
            <p style={{ fontSize: "clamp(18px,2.8vw,26px)", fontFamily: "'Instrument Serif', 'Georgia', serif", fontStyle: "italic", color: colors.text, lineHeight: 1.5, position: "relative", maxWidth: 680, margin: "0 auto" }}>
              Took a sledgehammer to my comfort zone.&ensp;Currently homeless.
            </p>
            <p style={{ fontSize: 12, color: colors.text3, marginTop: 14, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Instrument Sans', system-ui, sans-serif", fontWeight: 500 }}>— Mehran Khan</p>
          </div>
        </div>

        {/* ── PHASES + TILES ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto" }}>
          {/* Stack filter pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "32px 0 8px" }}>
            {filterTags.map(tag => {
              const isActive = activeFilter === tag || (tag === "All" && !activeFilter);
              return (
                <button key={tag} onClick={() => setActiveFilter(tag === "All" ? null : tag)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", letterSpacing: "-0.01em", border: `1px solid ${isActive ? colors.acc1 : colors.border}`, background: isActive ? `linear-gradient(135deg, ${colors.acc1}22, ${colors.acc2}11)` : "transparent", color: isActive ? colors.acc1 : colors.text3, transition: "all 0.18s ease" }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = colors.acc1; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = colors.border; }}
                >{tag}</button>
              );
            })}
          </div>

          {phases.map((phase, phaseIdx) => {
            const phaseStart = globalIdx;
            globalIdx += phase.projects.length;
            return (
              <div key={phase.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "40px 0 18px", opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(8px)", transition: `opacity 0.6s ease ${0.1+phaseIdx*0.07}s, transform 0.6s ease ${0.1+phaseIdx*0.07}s` }}>
                  <PhaseIcon color={phase.color} phase={phaseIdx} />
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase", background: phase.colorBg, color: phase.color, border: `1px solid ${phase.colorBorder}` }}>{phase.label}</span>
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
                    const isFiltered = activeFilter && stackMatch[activeFilter] ? !stackMatch[activeFilter].includes(p.id) : false;
                    return (
                      <RevealTile key={p.id} delay={pi * 45}>
                        <div style={{ opacity: isFiltered ? 0.15 : 1, transform: isFiltered ? "scale(0.97)" : "none", transition: "opacity 0.25s ease, transform 0.25s ease", pointerEvents: isFiltered ? "none" : "auto" }}>
                          <TileCard project={p} phase={phase} isDone={isDone} isNext={isNext} isLocked={isLocked} artIdx={i} colors={colors} dark={dark} onClick={(e) => handleTileClick(p, phase, isDone, e)} tooltipText={isDone ? `View ${p.name} →` : isNext ? "Building this now…" : COMING_SOON[i % COMING_SOON.length]} />
                        </div>
                      </RevealTile>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MISSION BLOCK ── */}
        <div style={{ padding: "52px 32px 0", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ borderRadius: 24, background: dark ? "linear-gradient(135deg, rgba(139,124,246,0.05) 0%, rgba(16,185,129,0.028) 100%)" : "linear-gradient(135deg, rgba(90,76,200,0.04) 0%, rgba(10,122,86,0.02) 100%)", border: `1px solid ${colors.border}`, padding: "40px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div className="mission-avatar" style={{ width: 58, height: 58, minWidth: 58, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0 }}>MK</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.acc1, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ display: "inline-block", width: 20, height: 1.5, background: colors.acc1, borderRadius: 2 }}/>Why 22 apps<span style={{ display: "inline-block", width: 20, height: 1.5, background: colors.acc1, borderRadius: 2, opacity: 0.4 }}/>
                </p>
                <p style={{ fontSize: "clamp(18px, 2.4vw, 22px)", fontWeight: 700, fontFamily: "'Cormorant Garamond', Georgia, serif", color: colors.text, marginBottom: 16, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                  The gap between knowing React and being able to build production software is enormous.{" "}
                  <em style={{ fontStyle: "italic", color: colors.acc1 }}>I wanted to close it deliberately.</em>
                </p>
                <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.82, marginBottom: 12 }}>
                  Each project in this sequence was chosen to force a specific skill — state management, API design, database modelling, authentication, real-time data, billing, testing, performance. Not as isolated exercises, but as complete products a user can actually open.
                </p>
                <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.82 }}>
                  When all 22 are done, I&apos;ll have built the same stack a funded startup would use — and I&apos;ll have built it myself, from scratch, without shortcuts. This page is the record of that.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12, padding: "24px 32px 56px", maxWidth: 1100, margin: "0 auto" }}>
          {[
            { n: DONE,  label: "apps shipped", sub: `${TOTAL - DONE} remaining`, color: colors.acc1 },
            { n: TOTAL, label: "apps planned",  sub: "full-stack to production", color: colors.text },
          ].map(s => (
            <div key={s.label} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 18, padding: "22px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 300, color: s.color, lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: colors.text2, marginTop: 7, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: colors.text3, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <footer style={{ borderTop: `1px solid ${colors.border}`, padding: "48px 32px 36px", marginTop: 8 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 40 }}>
              <div style={{ maxWidth: 340 }}>
                <p style={{ fontSize: "clamp(22px,3.5vw,32px)", fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, color: colors.text, lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: 12 }}>
                  Building in public.<br/><em style={{ fontStyle: "italic", color: colors.acc1 }}>Watch it happen.</em>
                </p>
                <a href="mailto:mehran@mehrankhan.net" style={{ fontSize: 13, color: colors.text3, display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.01em" }} onMouseEnter={e => e.currentTarget.style.color = colors.acc1} onMouseLeave={e => e.currentTarget.style.color = colors.text3}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  mehran@mehrankhan.net
                </a>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 20, background: dark ? "rgba(16,185,129,0.08)" : "rgba(10,122,86,0.06)", border: `1px solid ${dark ? "rgba(16,185,129,0.2)" : "rgba(10,122,86,0.14)"}`, alignSelf: "flex-start" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 0 0 rgba(16,185,129,0.7)", animation: "pingGreen 2s cubic-bezier(0.4,0,0.6,1) infinite", flexShrink: 0 }}/>
                <span style={{ fontSize: 12, fontWeight: 500, color: colors.acc2, letterSpacing: "-0.01em" }}>Currently building — Phase 1</span>
              </div>
            </div>
            <div style={{ height: 1, background: colors.border, marginBottom: 20 }}/>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 12, color: colors.text4, letterSpacing: "0.02em" }}>© {new Date().getFullYear()} Mehran Khan · mehrankhan.net</span>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <a href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: colors.text3, display: "flex", alignItems: "center", gap: 5, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = colors.acc1} onMouseLeave={e => e.currentTarget.style.color = colors.text3}>{Icons.github} GitHub</a>
                <span style={{ width: 1, height: 12, background: colors.border }}/>
                <a href="mailto:mehran@mehrankhan.net" style={{ fontSize: 12, color: colors.text3, transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = colors.acc1} onMouseLeave={e => e.currentTarget.style.color = colors.text3}>Email</a>
                <span style={{ width: 1, height: 12, background: colors.border }}/>
                <button onClick={() => setFeedbackOpen(true)} style={{ fontSize: 12, color: colors.text3, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s", padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = colors.acc1} onMouseLeave={e => e.currentTarget.style.color = colors.text3}>Leave a note</button>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {activeProject && <ProjectModal project={activeProject.project} phase={activeProject.phase} onClose={() => setActiveProject(null)} colors={colors} dark={dark} />}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} colors={colors} dark={dark} />
      <ReadNudge colors={colors} dark={dark} onOpen={() => setFeedbackOpen(true)} />
      {confetti && <Confetti key={confetti.id} x={confetti.x} y={confetti.y} color={confetti.color} onDone={() => setConfetti(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes shimmerLeft { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
        @keyframes shimmerRight { 0%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes fireShift { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes drawCircle { from{stroke-dashoffset:660} to{stroke-dashoffset:0} }
        @keyframes pingDot { 0%{box-shadow:0 0 0 0 rgba(249,115,22,0.7)} 60%{box-shadow:0 0 0 7px rgba(249,115,22,0)} 100%{box-shadow:0 0 0 0 rgba(249,115,22,0)} }
        @keyframes pingGreen { 0%{box-shadow:0 0 0 0 rgba(16,185,129,0.7)} 60%{box-shadow:0 0 0 6px rgba(16,185,129,0)} 100%{box-shadow:0 0 0 0 rgba(16,185,129,0)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-33.333%)} }
      @keyframes kidOrbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes kidOrbitR { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
@keyframes kidAvatarFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
@keyframes kidChipFloat { 0%,100%{transform:translateY(0px);opacity:0.85} 50%{transform:translateY(-2px);opacity:1} }
@keyframes kidLivePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes marqueeReverse { 0%{transform:translateX(-33.333%)} 100%{transform:translateX(0)} }
        @keyframes spinDiamond { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.5)} 100%{transform:rotate(360deg) scale(1)} }
        @keyframes photoGlow {
          0%,100% { box-shadow: 0 0 0 1px rgba(139,124,246,0.1), 0 8px 40px rgba(139,124,246,0.12), 0 24px 60px rgba(0,0,0,0.35); }
          50%      { box-shadow: 0 0 0 1px rgba(139,124,246,0.22), 0 8px 40px rgba(139,124,246,0.28), 0 24px 60px rgba(0,0,0,0.45); }
        }
        @keyframes pulseGlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:none} }
        @keyframes confettiPop { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--vx),var(--vy)) scale(0);opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { overscroll-behavior: none; }
        :root { --ticker-speed: 35s; --ticker-speed-r: 48s; }
        @media (max-width: 600px) { :root { --ticker-speed: 32s; --ticker-speed-r: 44s; } .mission-avatar { display: none !important; } }
        @media (min-width: 480px) { .nav-domain { display: inline !important; } }
        a { text-decoration: none; color: inherit; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,124,246,0.2); border-radius: 3px; }
        textarea:focus { box-shadow: 0 0 0 2px rgba(139,124,246,0.22); }
        button { transition: opacity 0.2s; }
        button:active { opacity: 0.8; }
      `}</style>
    </main>
  );
}

// ─── TILE CARD ────────────────────────────────────────────────────────────────

function TileCard({ project, phase, isDone, isNext, isLocked, artIdx, colors, dark, onClick, tooltipText }: {
  project: Project; phase: Phase; isDone: boolean; isNext: boolean; isLocked: boolean;
  artIdx: number; colors: ReturnType<typeof buildColors>; dark: boolean;
  onClick: (e: React.MouseEvent) => void; tooltipText: string;
}) {
  const [hov, setHov] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleEnter = () => { setHov(true); tipTimer.current = setTimeout(() => setTipVisible(true), 300); };
  const handleLeave = () => { setHov(false); setTipVisible(false); if (tipTimer.current) clearTimeout(tipTimer.current); };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: `translateX(-50%) translateY(${tipVisible ? 0 : 6}px)`, background: "rgba(15,14,26,0.93)", backdropFilter: "blur(14px)", border: `1px solid ${phase.colorBorder}`, borderRadius: 10, padding: "7px 12px", fontSize: 12, color: "#e8e4f8", lineHeight: 1.5, opacity: tipVisible ? 1 : 0, transition: "all 0.18s cubic-bezier(.4,0,.2,1)", pointerEvents: "none", zIndex: 50, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", width: 180, textAlign: "center" }}>
        {tooltipText}
        <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "rgba(15,14,26,0.93)", border: `1px solid ${phase.colorBorder}`, borderTop: "none", borderLeft: "none" }} />
      </div>
      <div role="button" tabIndex={0} onClick={onClick} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(e as unknown as React.MouseEvent); }} onMouseEnter={handleEnter} onMouseLeave={handleLeave}
        aria-label={`${project.name}${isLocked ? " — coming soon" : isDone ? " — view details" : " — building next"}`}
        style={{ borderRadius: 18, border: `1px solid ${isLocked ? colors.lockedBorder : phase.colorBorder}`, padding: "18px 16px 38px", background: isLocked ? colors.lockedBg : hov ? `linear-gradient(145deg, ${phase.colorBg}, ${colors.card})` : colors.card, cursor: "pointer", position: "relative", overflow: "visible", transform: hov && !isLocked ? "translateY(-5px) scale(1.016)" : "none", transition: "all 0.2s cubic-bezier(.4,0,.2,1)", boxShadow: hov && !isLocked ? `0 14px 36px ${phase.color}18, 0 4px 12px rgba(0,0,0,0.12)` : "none", outline: "none" }}
      >
        {(isDone || isNext) && <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 2, background: `linear-gradient(90deg, transparent, ${phase.color}60, transparent)`, borderRadius: "0 0 2px 2px" }} />}
        <div style={{ marginBottom: 14, opacity: isLocked ? 0.3 : 1, transition: "opacity 0.2s" }}>{tileArts(phase.color)[artIdx % 22]}</div>
        <div style={{ fontSize: 9.5, color: isLocked ? colors.lockedText : colors.text4, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, letterSpacing: "0.06em" }}>{project.id}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: isLocked ? colors.lockedText : colors.text, marginBottom: 5, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{project.name}</div>
        <div style={{ fontSize: 11, color: isLocked ? colors.lockedText : colors.text3, lineHeight: 1.55 }}>{project.desc}</div>
        {isDone && <div style={{ position: "absolute", top: 14, right: 14, width: 20, height: 20, borderRadius: "50%", background: phase.colorBg, border: `1px solid ${phase.colorBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: phase.color, opacity: hov ? 1 : 0.7, transition: "opacity 0.2s" }}>{Icons.check}</div>}
        {isNext && <span style={{ position: "absolute", bottom: 11, right: 11, fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 20, background: `${colors.acc1}22`, color: colors.acc1, letterSpacing: "0.04em", textTransform: "uppercase", animation: "pulseGlow 2.6s ease-in-out infinite" }}>building</span>}
        {isLocked && <span style={{ position: "absolute", bottom: 11, right: 12, display: "flex", opacity: hov ? 1 : 0.75, transition: "opacity 0.2s" }}>
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <rect x="1" y="6.5" width="11" height="8" rx="2" fill="#f59e0b" opacity="0.18"/>
            <rect x="1" y="6.5" width="11" height="8" rx="2" stroke="#f59e0b" strokeWidth="1.4"/>
            <path d="M4 6.5V4a2.5 2.5 0 0 1 5 0v2.5" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="6.5" cy="10.5" r="1.2" fill="#fbbf24"/>
          </svg>
        </span>}
      </div>
    </div>
  );
}
