"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TOTAL = 22;
const DONE = 0;
const START_DATE = new Date("2026-04-10");
const GITHUB_USER = "mehrankhan"; // ← update to real username
const GITHUB_REPO = "22apps";     // ← update to real repo name

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

// ─── ICONS ────────────────────────────────────────────────────────────────────

const Icons = {
  close: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  external: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8M9 1h4m0 0v4m0-4L6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none">
      <rect x="1" y="5.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M3.5 5.5V3.5a2 2 0 014 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  send: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M14 2L7 9M14 2L9 14l-2-5-5-2 12-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  clock: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  star: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1l1.5 3.2 3.5.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4L2 4.7l3.5-.5L6.5 1z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/>
    </svg>
  ),
  commit: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 6.5h3M9 6.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
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
    bg: "#07070f", bg2: "#0d0d1a", bg3: "#13132b",
    card: "#0d0d1c",
    border: "rgba(255,255,255,0.06)", borderH: "rgba(139,124,246,0.3)",
    text: "#eeeaf8", text2: "rgba(238,234,248,0.72)", text3: "rgba(238,234,248,0.44)", text4: "rgba(238,234,248,0.2)",
    acc1: "#8B7CF6", acc2: "#10B981",
    navBg: "rgba(7,7,15,0.88)",
    lockedBg: "rgba(255,255,255,0.016)", lockedBorder: "rgba(255,255,255,0.048)", lockedText: "rgba(238,234,248,0.26)",
  } : {
    bg: "#f7f6f2", bg2: "#ffffff", bg3: "#ebe9e2",
    card: "#ffffff",
    border: "rgba(0,0,0,0.09)", borderH: "rgba(79,60,210,0.3)",
    text: "#0f0e1a", text2: "#3a384f", text3: "#6e6b82", text4: "#a8a5b8",
    acc1: "#4f3cd2", acc2: "#0a7a56",
    navBg: "rgba(247,246,242,0.92)",
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
      id: i,
      angle: (i / 18) * Math.PI * 2 + Math.random() * 0.4,
      speed: 60 + Math.random() * 80,
      size: 4 + Math.random() * 5,
      color: [color, "#ffffff", color + "aa"][i % 3],
    })), [color]);

  useEffect(() => {
    const t = setTimeout(onDone, 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", pointerEvents: "none", zIndex: 300 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: x, top: y,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: p.color,
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

function ProjectModal({
  project, phase, onClose, colors, dark,
}: {
  project: Project; phase: Phase; onClose: () => void; colors: ReturnType<typeof buildColors>; dark: boolean;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: colors.card,
          border: `1px solid ${phase.colorBorder}`,
          borderRadius: 28,
          width: "100%", maxWidth: 480,
          boxShadow: `0 32px 80px ${phase.color}22, 0 8px 24px rgba(0,0,0,0.3)`,
          position: "relative", overflow: "hidden",
          animation: "slideUp 0.22s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${phase.color}, ${phase.color}44)` }} />

        {/* Header */}
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: phase.colorBg, border: `1px solid ${phase.colorBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tileArts(phase.color)[parseInt(project.id) % 22] ?? tileArts(phase.color)[0]}
              </div>
              <div>
                <div style={{ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: phase.color, fontWeight: 600, marginBottom: 4 }}>
                  {phase.label} · #{project.id}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: colors.text, letterSpacing: "-0.025em", lineHeight: 1.2, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {project.name}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: colors.bg3, border: `1px solid ${colors.border}`,
                color: colors.text3, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "inherit", flexShrink: 0, marginTop: 2,
              }}
            >
              {Icons.close}
            </button>
          </div>

          <p style={{ fontSize: 14.5, color: colors.text2, lineHeight: 1.7, marginBottom: 24 }}>
            {project.desc}
          </p>
        </div>

        {/* Tech stack */}
        <div style={{ padding: "0 28px 22px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.text3, fontWeight: 600, marginBottom: 10 }}>
            Tech stack
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {project.stack.map(s => (
              <span key={s} style={{
                fontSize: 12, padding: "4px 10px", borderRadius: 8,
                background: phase.colorBg, color: phase.color,
                border: `1px solid ${phase.colorBorder}`,
                fontWeight: 500, letterSpacing: "-0.01em",
              }}>{s}</span>
            ))}
          </div>
        </div>

        {/* What I learned */}
        {project.learned && (
          <div style={{
            margin: "0 28px 28px",
            padding: "16px 18px",
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
            borderRadius: 14, border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${phase.color}`,
          }}>
            <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: colors.text3, fontWeight: 600, marginBottom: 7 }}>
              What I learned
            </div>
            <p style={{ fontSize: 13.5, color: colors.text2, lineHeight: 1.65, margin: 0 }}>
              {project.learned}
            </p>
          </div>
        )}

        {/* Live link */}
        {project.live ? (
          <div style={{ padding: "0 28px 28px" }}>
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px", borderRadius: 14,
                background: `linear-gradient(135deg, ${phase.color}, ${phase.color}cc)`,
                color: "#fff", fontWeight: 600, fontSize: 14,
                textDecoration: "none", letterSpacing: "-0.01em",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {Icons.external}
              View live project
            </a>
          </div>
        ) : (
          <div style={{ padding: "0 28px 28px" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "12px", borderRadius: 14,
              background: colors.lockedBg, border: `1px solid ${colors.lockedBorder}`,
              color: colors.lockedText, fontSize: 13, fontWeight: 500,
            }}>
              {Icons.lock}
              Not shipped yet — check back soon
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FEEDBACK MODAL ───────────────────────────────────────────────────────────

function FeedbackModal({
  open, onClose, colors, dark,
}: {
  open: boolean; onClose: () => void; colors: ReturnType<typeof buildColors>; dark: boolean;
}) {
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSend = async () => {
    if (!msg.trim() || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("https://formspree.io/f/xpwdgjzv", {
        // ↑ Replace with your own Formspree endpoint: https://formspree.io
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ message: msg, _subject: "Note from mehrankhan.net" }),
      });
      if (res.ok) {
        setState("sent");
        setTimeout(() => { setState("idle"); setMsg(""); onClose(); }, 2200);
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        animation: "fadeIn 0.15s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: colors.card, border: `1px solid ${colors.border}`,
          borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 420,
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)", position: "relative",
          animation: "slideUp 0.2s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 30, height: 30, borderRadius: "50%",
            background: colors.bg3, border: `1px solid ${colors.border}`,
            color: colors.text3, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}
        >{Icons.close}</button>

        {state === "sent" ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 18px", color: "#10B981",
            }}>{Icons.check}</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 6, letterSpacing: "-0.02em" }}>Thank you!</p>
            <p style={{ fontSize: 13.5, color: colors.text2 }}>Mehran will see this. 🙏</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: colors.acc1, fontWeight: 600, marginBottom: 10 }}>
              Leave a note
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: colors.text, marginBottom: 7, letterSpacing: "-0.025em", fontFamily: "'Playfair Display', Georgia, serif" }}>
              What do you think?
            </p>
            <p style={{ fontSize: 13.5, color: colors.text2, marginBottom: 22, lineHeight: 1.65 }}>
              Encouragement, a question, anything — Mehran reads every message.
            </p>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend(); }}
              placeholder="Type something..."
              rows={4}
              style={{
                width: "100%", background: colors.bg,
                border: `1px solid ${msg ? colors.borderH : colors.border}`,
                borderRadius: 12, padding: "13px 15px", fontSize: 14,
                color: colors.text, resize: "none", outline: "none",
                fontFamily: "inherit", lineHeight: 1.6, marginBottom: 14,
                display: "block", transition: "border-color 0.2s",
              }}
            />
            {state === "error" && (
              <p style={{ fontSize: 12, color: "#EF4444", marginBottom: 10 }}>
                Something went wrong. Try again?
              </p>
            )}
            <button
              onClick={handleSend}
              disabled={!msg.trim() || state === "sending"}
              style={{
                width: "100%", padding: "13px",
                borderRadius: 12,
                background: msg.trim() ? `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})` : colors.bg3,
                border: "none", color: msg.trim() ? "#fff" : colors.text3,
                fontSize: 14, fontWeight: 600,
                cursor: msg.trim() ? "pointer" : "not-allowed",
                letterSpacing: "-0.01em", transition: "all 0.2s",
                fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {Icons.send}
              {state === "sending" ? "Sending…" : "Send message"}
              <span style={{ fontSize: 11, opacity: 0.6 }}>⌘↵</span>
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
      .then(r => r.json())
      .then(commits => {
        if (!Array.isArray(commits) || !commits[0]) return;
        const c = commits[0];
        const rawDate = c.commit?.author?.date ?? "";
        const ago = rawDate ? timeAgo(new Date(rawDate)) : "";
        setData({
          message: c.commit?.message?.split("\n")[0] ?? "",
          sha: c.sha?.slice(0, 7) ?? "",
          date: ago,
        });
      })
      .catch(() => {});
  }, []);

  function timeAgo(d: Date) {
    const s = Math.floor((Date.now() - d.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  }

  if (!data) return null;

  return (
    <a
      href={`https://github.com/${GITHUB_USER}/${GITHUB_REPO}`}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 14px",
        background: dark ? "rgba(139,124,246,0.07)" : "rgba(90,76,200,0.055)",
        border: `1px solid ${dark ? "rgba(139,124,246,0.18)" : "rgba(90,76,200,0.13)"}`,
        borderRadius: 10,
        textDecoration: "none",
        transition: "background 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget.style.background = dark ? "rgba(139,124,246,0.13)" : "rgba(90,76,200,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.background = dark ? "rgba(139,124,246,0.07)" : "rgba(90,76,200,0.055)")}
    >
      <span style={{ color: colors.acc1 }}>{Icons.commit}</span>
      <span style={{ fontSize: 12, color: colors.text3 }}>{Icons.clock}</span>
      <span style={{ fontSize: 12, color: colors.text3 }}>{data.date}</span>
      <span style={{ fontSize: 12, color: colors.text2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {data.message}
      </span>
      <span style={{
        fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
        color: colors.acc1, background: dark ? "rgba(139,124,246,0.12)" : "rgba(90,76,200,0.08)",
        padding: "2px 6px", borderRadius: 5,
      }}>{data.sha}</span>
    </a>
  );
}

// ─── REVEAL TILE WRAPPER ──────────────────────────────────────────────────────

function RevealTile({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
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

// ─── MAIN ──────────────────────────────────────────────────────────────────────

export default function Home() {
  const [dark, setDark] = useState(true);
  const [days, setDays] = useState(1);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeProject, setActiveProject] = useState<{ project: Project; phase: Phase } | null>(null);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; id: number } | null>(null);
  const confettiId = useRef(0);

  useEffect(() => {
    setMounted(true);
    setDays(Math.max(1, Math.floor((Date.now() - START_DATE.getTime()) / 86400000)));
    const link: HTMLLinkElement =
      document.querySelector("link[rel='icon']") ?? document.createElement("link");
    link.rel = "icon";
    link.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%238B7CF6'/><text x='16' y='22' font-size='14' font-family='system-ui' font-weight='700' fill='white' text-anchor='middle'>MK</text></svg>`;
    document.head.appendChild(link);
    document.title = "Mehran Khan — Building 22 Apps";
  }, []);

  const colors = useMemo(() => buildColors(dark), [dark]);
  const pct = Math.round((DONE / TOTAL) * 100);

  const handleTileClick = useCallback((project: Project, phase: Phase, isDone: boolean, e: React.MouseEvent) => {
    if (isDone) {
      // Fire confetti at click position
      confettiId.current += 1;
      setConfetti({ x: e.clientX, y: e.clientY, color: phase.color, id: confettiId.current });
    }
    setActiveProject({ project, phase });
  }, []);

  let globalIdx = 0;

  return (
    <main style={{
      background: colors.bg, minHeight: "100vh",
      fontFamily: "'Instrument Sans', system-ui, sans-serif",
      color: colors.text, transition: "background 0.3s, color 0.3s", overflowX: "hidden",
    }}>

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "5%", width: "55vw", height: "55vh", background: `radial-gradient(ellipse, ${colors.acc1}10 0%, transparent 68%)` }} />
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>MK</div>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em" }}>mehrankhan.net</span>
            {/* Live GitHub status in nav */}
            <div style={{ display: "none" }} className="github-nav">
              <GitHubBanner colors={colors} dark={dark} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setFeedbackOpen(true)}
              style={{
                padding: "6px 15px", borderRadius: 20,
                background: "transparent", border: `1px solid ${colors.border}`,
                color: colors.text3, fontSize: 12, fontWeight: 500,
                cursor: "pointer", fontFamily: "inherit",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.acc1; e.currentTarget.style.color = colors.acc1; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = colors.text3; }}
            >
              Leave a note ✉︎
            </button>
            <button
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: colors.bg3, border: `1px solid ${colors.border}`,
                cursor: "pointer", position: "relative", transition: "background 0.3s", flexShrink: 0,
              }}
            >
              <span style={{
                position: "absolute", top: 4, left: dark ? 4 : 20,
                width: 16, height: 16, borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
                transition: "left 0.22s cubic-bezier(.4,0,.2,1)", display: "block",
              }} />
            </button>
          </div>
        </nav>

        {/* ── TICKER ── */}
        <div style={{
          overflow: "hidden",
          background: dark ? "rgba(139,124,246,0.025)" : "rgba(90,76,200,0.025)",
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
          padding: "72px 32px 48px", textAlign: "center",
          opacity: mounted ? 1 : 0, transform: mounted ? "none" : "translateY(14px)",
          transition: "opacity 0.75s ease, transform 0.75s ease",
        }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 26 }}>
            <div style={{
              width: 86, height: 86, borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, color: "#fff",
              boxShadow: `0 0 0 8px ${dark ? "rgba(139,124,246,0.08)" : "rgba(90,76,200,0.07)"}, 0 8px 40px ${colors.acc1}28`,
            }}>MK</div>
            <span style={{
              position: "absolute", bottom: 4, right: 4,
              width: 14, height: 14, borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              border: `2.5px solid ${colors.bg}`,
              boxShadow: "0 0 8px rgba(249,115,22,0.6)",
              animation: "pingDot 2s cubic-bezier(0.4,0,0.6,1) infinite",
            }} />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, letterSpacing: "0.14em", color: colors.acc2,
            textTransform: "uppercase", fontWeight: 600, marginBottom: 20,
            padding: "5px 16px", borderRadius: 20,
            background: dark ? "rgba(16,185,129,0.07)" : "rgba(10,122,86,0.06)",
            border: `1px solid ${dark ? "rgba(16,185,129,0.18)" : "rgba(10,122,86,0.14)"}`,
          }}>
            {TOTAL} projects · 4 phases · 1 developer
          </div>

          <h1 style={{
            fontSize: "clamp(52px,9.5vw,96px)",
            letterSpacing: "-0.035em", lineHeight: 1.0, marginBottom: 26,
            fontFamily: "'Playfair Display', Georgia, serif",
            display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.18em",
            flexWrap: "wrap",
          }}>
            {dark ? (
              <>
                <span style={{
                  fontWeight: 400, fontStyle: "italic",
                  background: "linear-gradient(120deg, #c4b5fd 0%, #a78bfa 50%, #8B7CF6 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmerLeft 4s ease-in-out infinite alternate",
                }}>Mehran</span>
                <span style={{
                  fontWeight: 700, fontStyle: "normal",
                  background: "linear-gradient(120deg, #ffffff 0%, #e0d9ff 40%, #10B981 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmerRight 4s ease-in-out infinite alternate",
                }}>Khan</span>
              </>
            ) : (
              <>
                <span style={{ fontWeight: 400, fontStyle: "italic", color: "#3730a3" }}>Mehran</span>
                <span style={{ fontWeight: 700, fontStyle: "normal", color: "#0f0e1a" }}>Khan</span>
              </>
            )}
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
          <p style={{ fontSize: 14, color: colors.text3, lineHeight: 1.78, maxWidth: 480, margin: "0 auto 28px" }}>
            This page is the live record of that journey. Watch the tiles light up one by one.
          </p>

          {/* GitHub last commit banner */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <GitHubBanner colors={colors} dark={dark} />
          </div>

          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: colors.text3, marginBottom: 10 }}>
              <span>journey progress</span>
              <span style={{ color: colors.text2 }}>{DONE} of {TOTAL} shipped</span>
            </div>
            <div style={{ height: 6, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden" }}>
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

        {/* ── QUOTE ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto 8px" }}>
          <div style={{
            borderRadius: 20,
            background: dark
              ? "rgba(139,124,246,0.04)"
              : "rgba(79,60,210,0.035)",
            border: `1px solid ${dark ? "rgba(139,124,246,0.11)" : "rgba(79,60,210,0.09)"}`,
            padding: "36px 44px 32px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            {/* Decorative large quote mark */}
            <div style={{
              position: "absolute", top: 8, left: 28,
              fontSize: 120, lineHeight: 1,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              color: dark ? "rgba(139,124,246,0.12)" : "rgba(79,60,210,0.08)",
              userSelect: "none", pointerEvents: "none",
            }}>&ldquo;</div>
            <p style={{
              fontSize: "clamp(18px,2.8vw,26px)",
              fontFamily: "'Instrument Serif', 'Georgia', serif",
              fontStyle: "italic",
              color: colors.text,
              lineHeight: 1.5,
              letterSpacing: "0.005em",
              position: "relative",
              maxWidth: 680,
              margin: "0 auto",
            }}>
              Took a sledgehammer to my comfort zone.&ensp;Currently homeless.
            </p>
            <p style={{
              fontSize: 12, color: colors.text3, marginTop: 14,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "'Instrument Sans', system-ui, sans-serif",
              fontWeight: 500,
            }}>— Mehran Khan</p>
          </div>
        </div>

        {/* ── PHASES + TILES ── */}
        <div style={{ padding: "0 32px", maxWidth: 1100, margin: "0 auto" }}>
          {phases.map((phase, phaseIdx) => {
            const phaseStart = globalIdx;
            globalIdx += phase.projects.length;
            return (
              <div key={phase.label} style={{ marginBottom: 8 }}>
                {/* Phase header */}
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

                {/* Tiles grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 12 }}>
                  {phase.projects.map((p, pi) => {
                    const i = phaseStart + pi;
                    const isDone = i < DONE;
                    const isNext = i === DONE;
                    const isLocked = !isDone && !isNext;

                    return (
                      <RevealTile key={p.id} delay={pi * 45}>
                        <TileCard
                          project={p}
                          phase={phase}
                          isDone={isDone}
                          isNext={isNext}
                          isLocked={isLocked}
                          artIdx={i}
                          colors={colors}
                          onClick={(e) => handleTileClick(p, phase, isDone, e)}
                          tooltipText={
                            isDone ? `View ${p.name} →`
                            : isNext ? "Building this now…"
                            : COMING_SOON[i % COMING_SOON.length]
                          }
                        />
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
          <div style={{
            borderRadius: 24,
            background: dark
              ? "linear-gradient(135deg, rgba(139,124,246,0.05) 0%, rgba(16,185,129,0.028) 100%)"
              : "linear-gradient(135deg, rgba(90,76,200,0.04) 0%, rgba(10,122,86,0.02) 100%)",
            border: `1px solid ${colors.border}`,
            padding: "40px 36px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <div style={{
                width: 58, height: 58, minWidth: 58, borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.acc1}, ${colors.acc2})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 700, color: "#fff", flexShrink: 0,
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
          gap: 12, padding: "24px 32px 56px", maxWidth: 1100, margin: "0 auto",
        }}>
          {[
            { n: DONE,  label: "apps shipped", sub: `out of ${TOTAL}`, color: colors.acc1 },
            { n: days,  label: "days in",       sub: "and still going",  color: colors.acc2 },
            { n: TOTAL, label: "apps planned",  sub: "from scratch",     color: colors.text },
          ].map(s => (
            <div key={s.label} style={{
              background: colors.card, border: `1px solid ${colors.border}`,
              borderRadius: 18, padding: "22px 18px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 300, color: s.color, lineHeight: 1, letterSpacing: "-0.04em", fontFamily: "'Playfair Display', 'Instrument Serif', Georgia, serif" }}>{s.n}</div>
              <div style={{ fontSize: 12, color: colors.text2, marginTop: 7, fontWeight: 500 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: colors.text3, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <footer style={{ padding: "22px 32px", borderTop: `1px solid ${colors.border}`, textAlign: "center", fontSize: 12, color: colors.text4, letterSpacing: "0.04em" }}>
          mehrankhan.net — updated every time something ships
        </footer>
      </div>

      {/* Modals */}
      {activeProject && (
        <ProjectModal
          project={activeProject.project}
          phase={activeProject.phase}
          onClose={() => setActiveProject(null)}
          colors={colors}
          dark={dark}
        />
      )}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} colors={colors} dark={dark} />

      {/* Confetti */}
      {confetti && (
        <Confetti
          key={confetti.id}
          x={confetti.x}
          y={confetti.y}
          color={confetti.color}
          onDone={() => setConfetti(null)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shimmerLeft { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
        @keyframes shimmerRight { 0%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes pingDot {
          0%   { box-shadow: 0 0 0 0 rgba(249,115,22,0.7); }
          60%  { box-shadow: 0 0 0 7px rgba(249,115,22,0); }
          100% { box-shadow: 0 0 0 0 rgba(249,115,22,0); }
        }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulseGlow { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px) scale(0.98)} to{opacity:1;transform:none} }
        @keyframes confettiPop {
          0%  { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--vx), var(--vy)) scale(0); opacity: 0; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
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

// ─── TILE CARD (extracted for cleanliness) ────────────────────────────────────

function TileCard({
  project, phase, isDone, isNext, isLocked, artIdx, colors, onClick, tooltipText,
}: {
  project: Project; phase: Phase;
  isDone: boolean; isNext: boolean; isLocked: boolean;
  artIdx: number; colors: ReturnType<typeof buildColors>;
  onClick: (e: React.MouseEvent) => void;
  tooltipText: string;
}) {
  const [hov, setHov] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    setHov(true);
    tipTimer.current = setTimeout(() => setTipVisible(true), 300);
  };
  const handleLeave = () => {
    setHov(false);
    setTipVisible(false);
    if (tipTimer.current) clearTimeout(tipTimer.current);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Tooltip */}
      <div style={{
        position: "absolute",
        bottom: "calc(100% + 10px)",
        left: "50%",
        transform: `translateX(-50%) translateY(${tipVisible ? 0 : 6}px)`,
        background: colors.bg === "#07070f" ? "rgba(7,7,15,0.97)" : "rgba(15,14,26,0.93)",
        backdropFilter: "blur(14px)",
        border: `1px solid ${phase.colorBorder}`,
        borderRadius: 10,
        padding: "7px 12px",
        fontSize: 12, color: "#e8e4f8", lineHeight: 1.5,
        opacity: tipVisible ? 1 : 0,
        transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
        pointerEvents: "none",
        zIndex: 50,
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        width: 180, textAlign: "center",
      }}>
        {tooltipText}
        <div style={{
          position: "absolute", bottom: -5, left: "50%",
          transform: "translateX(-50%) rotate(45deg)",
          width: 8, height: 8,
          background: colors.bg === "#07070f" ? "rgba(7,7,15,0.97)" : "rgba(15,14,26,0.93)",
          border: `1px solid ${phase.colorBorder}`,
          borderTop: "none", borderLeft: "none",
        }} />
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClick(e as unknown as React.MouseEvent); }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        aria-label={`${project.name}${isLocked ? " — coming soon" : isDone ? " — view details" : " — building next"}`}
        style={{
          borderRadius: 18,
          border: `1px solid ${
            isLocked ? colors.lockedBorder
            : hov ? phase.colorBorder
            : phase.colorBorder
          }`,
          padding: "18px 16px 38px",
          background: isLocked
            ? colors.lockedBg
            : hov
            ? `linear-gradient(145deg, ${phase.colorBg}, ${colors.card})`
            : colors.card,
          cursor: "pointer",
          position: "relative", overflow: "visible",
          transform: hov && !isLocked ? "translateY(-5px) scale(1.016)" : "none",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          boxShadow: hov && !isLocked
            ? `0 14px 36px ${phase.color}18, 0 4px 12px rgba(0,0,0,0.12)`
            : "none",
          outline: "none",
        }}
      >
        {/* Top shimmer on active tiles */}
        {(isDone || isNext) && (
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
            background: `linear-gradient(90deg, transparent, ${phase.color}60, transparent)`,
            borderRadius: "0 0 2px 2px",
          }} />
        )}

        <div style={{ marginBottom: 14, opacity: isLocked ? 0.3 : 1, transition: "opacity 0.2s" }}>
          {tileArts(phase.color)[artIdx % 22]}
        </div>

        <div style={{ fontSize: 9.5, color: isLocked ? colors.lockedText : colors.text4, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, letterSpacing: "0.06em" }}>
          {project.id}
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: isLocked ? colors.lockedText : colors.text, marginBottom: 5, lineHeight: 1.3, letterSpacing: "-0.02em" }}>
          {project.name}
        </div>
        <div style={{ fontSize: 11, color: isLocked ? colors.lockedText : colors.text3, lineHeight: 1.55 }}>
          {project.desc}
        </div>

        {/* Done tick */}
        {isDone && (
          <div style={{
            position: "absolute", top: 14, right: 14,
            width: 20, height: 20, borderRadius: "50%",
            background: phase.colorBg, border: `1px solid ${phase.colorBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: phase.color, opacity: hov ? 1 : 0.7,
            transition: "opacity 0.2s",
          }}>
            {Icons.check}
          </div>
        )}

        {/* Next badge */}
        {isNext && (
          <span style={{
            position: "absolute", bottom: 11, right: 11,
            fontSize: 9, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
            background: `${colors.acc1}22`,
            color: colors.acc1, letterSpacing: "0.04em", textTransform: "uppercase",
            animation: "pulseGlow 2.6s ease-in-out infinite",
          }}>building</span>
        )}

        {/* Lock icon */}
        {isLocked && (
          <span style={{
            position: "absolute", bottom: 12, right: 13,
            color: colors.lockedText, opacity: hov ? 0.5 : 0.22, transition: "opacity 0.2s",
          }}>
            {Icons.lock}
          </span>
        )}
      </div>
    </div>
  );
}
