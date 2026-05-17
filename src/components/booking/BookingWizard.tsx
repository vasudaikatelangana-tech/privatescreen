"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// ── Static Data ───────────────────────────────────────────────────────────────
const OCCASIONS = [
  { id: "birthday",     label: "Birthday",     emoji: "🎂", color: "#FF6B6B" },
  { id: "anniversary",  label: "Anniversary",  emoji: "💑", color: "#FF8B94" },
  { id: "ott_movie",    label: "OTT Movie",    emoji: "🎬", color: "#4ECDC4" },
  { id: "live_cricket", label: "Live Cricket", emoji: "🏏", color: "#A8E6CF" },
  { id: "corporate",    label: "Corporate",    emoji: "💼", color: "#B4A7D6" },
  { id: "other",        label: "Just Vibes",   emoji: "🎉", color: "#FFD93D" },
];

const ADDON_COLORS: Record<string, string> = {
  cake:       "#FF6B6B",
  decoration: "#FFD93D",
  food:       "#4ECDC4",
  beverage:   "#B4A7D6",
  bundle:     "#FF8B94",
};

const THEATRE_COLORS = [
  "#FF6B6B","#4ECDC4","#FFD93D","#B4A7D6","#A8E6CF","#FF8B94","#6C5CE7","#00B894",
];

function getDates() {
  const out = [];
  const now    = new Date();
  const days   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      id:        i,
      day:       days[d.getDay()],
      date:      d.getDate(),
      month:     months[d.getMonth()],
      full:      `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
      isoDate:   d.toISOString().split("T")[0],
      isToday:   i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  return out;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour  = h % 12 || 12;
  return `${hour}:${String(m).padStart(2,"0")} ${ampm}`;
}

function slotEmoji(t: string) {
  const h = parseInt(t.split(":")[0]);
  if (h < 12) return "☀️";
  if (h < 16) return "🌤️";
  if (h < 19) return "🌇";
  if (h < 22) return "🌙";
  return "🌃";
}

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --coral:#FF6B6B; --yellow:#FFD93D; --teal:#4ECDC4; --lavender:#B4A7D6;
  --mint:#A8E6CF; --pink:#FF8B94; --bg:#FFF9F0; --ink:#2D2D2D; --muted:#8B8B8B;
  --radius:20px;
}
body { background:var(--bg); font-family:'Nunito',sans-serif; color:var(--ink); min-height:100vh; }

.wiz-bg { min-height:100vh; position:relative; overflow-x:hidden; background:#FFF9F0; }
.wiz-bg::before { content:''; position:fixed; top:-120px; right:-120px; width:420px; height:420px; background:radial-gradient(circle,rgba(255,107,107,0.15) 0%,transparent 70%); border-radius:50%; pointer-events:none; z-index:0; animation:blob1 8s ease-in-out infinite alternate; }
.wiz-bg::after  { content:''; position:fixed; bottom:-100px; left:-100px; width:380px; height:380px; background:radial-gradient(circle,rgba(78,205,196,0.12) 0%,transparent 70%); border-radius:50%; pointer-events:none; z-index:0; animation:blob2 10s ease-in-out infinite alternate; }
@keyframes blob1 { from{transform:scale(1)} to{transform:scale(1.1) translate(-20px,15px)} }
@keyframes blob2 { from{transform:scale(1)} to{transform:scale(1.12) translate(15px,-20px)} }

/* Header */
.wiz-header { position:sticky; top:0; z-index:100; background:rgba(255,249,240,0.9); backdrop-filter:blur(12px); padding:14px 28px; display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid rgba(255,107,107,0.1); }
.logo { font-family:'Fredoka One',cursive; font-size:24px; background:linear-gradient(135deg,var(--coral),var(--yellow)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

/* Step pills */
.step-pills { display:flex; align-items:center; gap:4px; }
.step-pill { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); border:2.5px solid transparent; }
.step-pill.done   { background:var(--coral); color:#fff; cursor:pointer; box-shadow:0 4px 12px rgba(255,107,107,0.4); }
.step-pill.done:hover { transform:scale(1.1); }
.step-pill.active { background:#fff; color:var(--coral); border-color:var(--coral); transform:scale(1.15); box-shadow:0 4px 16px rgba(255,107,107,0.3); }
.step-pill.future { background:#fff; color:#ccc; border-color:#E8E8E8; }
.step-connector { width:20px; height:2px; background:#E8E8E8; border-radius:2px; transition:background 0.3s; }
.step-connector.done { background:var(--coral); }

/* Body */
.wiz-body { max-width:860px; margin:0 auto; padding:32px 20px 100px; position:relative; z-index:1; }
.step-head { margin-bottom:28px; }
.step-emoji { font-size:40px; display:block; margin-bottom:8px; animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes popIn { from{transform:scale(0) rotate(-10deg);opacity:0} to{transform:scale(1) rotate(0);opacity:1} }
.step-title { font-family:'Fredoka One',cursive; font-size:32px; color:var(--ink); line-height:1.1; margin-bottom:6px; }
.step-sub { font-size:14px; color:var(--muted); font-weight:500; }

/* Area chips */
.area-wrap { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:32px; }
.area-chip { padding:12px 22px; border-radius:50px; background:#fff; border:2.5px solid #F0F0F0; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); display:flex; align-items:center; gap:8px; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
.area-chip:hover { transform:translateY(-3px); box-shadow:0 6px 20px rgba(0,0,0,0.1); border-color:var(--coral); }
.area-chip.selected { background:var(--coral); border-color:var(--coral); color:#fff; transform:translateY(-3px) scale(1.05); box-shadow:0 8px 24px rgba(255,107,107,0.4); }

/* Theatre cards */
.theatre-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }
.theatre-card { background:#fff; border-radius:var(--radius); overflow:hidden; cursor:pointer; border:3px solid #F0F0F0; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 16px rgba(0,0,0,0.06); position:relative; }
.theatre-card:hover   { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,0.12); }
.theatre-card.selected{ border-color:var(--tc-color,var(--coral)); transform:translateY(-4px); box-shadow:0 12px 32px rgba(255,107,107,0.2); }
.tc-banner { height:8px; width:100%; }
.tc-body   { padding:20px; }
.tc-check  { position:absolute; top:16px; right:16px; width:28px; height:28px; border-radius:50%; background:var(--tc-color,var(--coral)); color:#fff; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.tc-emoji   { font-size:32px; display:block; margin-bottom:10px; }
.tc-name    { font-family:'Fredoka One',cursive; font-size:20px; color:var(--ink); margin-bottom:4px; }
.tc-address { font-size:12px; color:var(--muted); margin-bottom:12px; font-weight:600; }
.tc-meta    { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.tc-rating  { font-size:13px; font-weight:800; color:var(--ink); }
.tc-screens { font-size:11px; color:var(--muted); font-weight:600; background:#F5F5F5; padding:3px 8px; border-radius:8px; }
.tc-dining  { font-size:10px; background:#E8F8F0; color:#00B894; padding:3px 8px; border-radius:8px; font-weight:700; }

/* Screen cards */
.screen-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
.screen-card { border-radius:var(--radius); overflow:hidden; border:3px solid #F0F0F0; cursor:pointer; transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 4px 16px rgba(0,0,0,0.06); background:#fff; }
.screen-card:hover    { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,0.12); border-color:var(--lavender); }
.screen-card.selected { border-color:var(--lavender); transform:translateY(-4px); box-shadow:0 12px 32px rgba(180,167,214,0.5); }
.sc-top { background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); padding:20px 18px; }
.screen-card.selected .sc-top { background:linear-gradient(135deg,#B4A7D6 0%,#9B59B6 100%); }
.sc-emoji { font-size:30px; display:block; margin-bottom:8px; }
.sc-type  { font-size:9px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.7); font-weight:800; margin-bottom:4px; }
.sc-name  { font-family:'Fredoka One',cursive; font-size:18px; color:#fff; margin-bottom:2px; }
.sc-cap   { font-size:11px; color:rgba(255,255,255,0.65); }
.sc-body  { padding:14px 16px; }
.sc-tags  { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px; }
.sc-tag   { font-size:10px; font-weight:700; background:#F8F4FF; color:var(--lavender); padding:3px 8px; border-radius:8px; }
.sc-price-row { display:flex; align-items:baseline; justify-content:space-between; }
.sc-price     { font-family:'Fredoka One',cursive; font-size:22px; color:var(--ink); }
.sc-price-sub { font-size:10px; color:var(--muted); }
.sc-pick { font-size:11px; font-weight:800; padding:6px 14px; border-radius:10px; border:2px solid #E8E0FF; background:transparent; color:var(--lavender); cursor:pointer; font-family:'Nunito',sans-serif; transition:all 0.15s; }
.screen-card.selected .sc-pick { background:var(--lavender); color:#fff; border-color:var(--lavender); }

/* Date strip */
.date-strip { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:28px; scrollbar-width:none; }
.date-strip::-webkit-scrollbar { display:none; }
.date-chip { flex-shrink:0; width:64px; padding:12px 0; border-radius:16px; text-align:center; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); background:#fff; border:2.5px solid #F0F0F0; box-shadow:0 2px 8px rgba(0,0,0,0.05); position:relative; }
.date-chip:hover { transform:translateY(-4px); border-color:var(--coral); }
.date-chip.selected { background:var(--coral); border-color:var(--coral); transform:translateY(-4px); box-shadow:0 8px 20px rgba(255,107,107,0.35); }
.date-chip.weekend:not(.selected) { border-color:var(--yellow); }
.dc-day { font-size:9px; font-weight:800; color:var(--muted); letter-spacing:1px; text-transform:uppercase; }
.dc-num { font-family:'Fredoka One',cursive; font-size:22px; color:var(--ink); line-height:1.1; }
.dc-mon { font-size:9px; font-weight:700; color:var(--muted); }
.date-chip.selected .dc-day,.date-chip.selected .dc-num,.date-chip.selected .dc-mon { color:#fff; }
.date-chip.selected .dc-day,.date-chip.selected .dc-mon { color:rgba(255,255,255,0.7); }
.today-dot { position:absolute; top:6px; left:50%; transform:translateX(-50%); width:5px; height:5px; border-radius:50%; background:var(--coral); }
.date-chip.selected .today-dot { background:#fff; }

/* Slots */
.slots-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px; margin-bottom:28px; }
.slot-card { padding:16px 14px; border-radius:16px; border:2.5px solid #F0F0F0; background:#fff; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); text-align:center; box-shadow:0 2px 8px rgba(0,0,0,0.05); position:relative; }
.slot-card:hover:not(.booked) { transform:translateY(-4px); border-color:var(--teal); box-shadow:0 8px 24px rgba(78,205,196,0.25); }
.slot-card.selected { background:var(--teal); border-color:var(--teal); transform:translateY(-4px); box-shadow:0 8px 24px rgba(78,205,196,0.4); }
.slot-card.booked   { opacity:0.4; cursor:not-allowed; }
.slot-emoji { font-size:22px; display:block; margin-bottom:6px; }
.slot-time  { font-weight:800; font-size:13px; color:var(--ink); margin-bottom:2px; }
.slot-label { font-size:11px; color:var(--muted); font-weight:600; }
.slot-card.selected .slot-time,.slot-card.selected .slot-label { color:#fff; }
.booked-tag { position:absolute; top:-8px; right:-8px; background:#FF4757; color:#fff; font-size:8px; font-weight:800; padding:3px 6px; border-radius:8px; text-transform:uppercase; }

/* Occasion */
.occasion-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:28px; }
.occ-card { padding:16px 12px; border-radius:16px; border:2.5px solid #F0F0F0; background:#fff; text-align:center; cursor:pointer; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 2px 8px rgba(0,0,0,0.05); }
.occ-card:hover { transform:translateY(-4px); }
.occ-card.selected { border-color:var(--oc-color,var(--coral)); background:var(--oc-color,var(--coral)); transform:translateY(-4px); }
.occ-emoji { font-size:24px; display:block; margin-bottom:6px; }
.occ-label { font-size:12px; font-weight:800; color:var(--ink); }
.occ-card.selected .occ-label { color:#fff; }

/* Addons */
.cat-pills { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
.cat-pill { padding:8px 18px; border-radius:50px; border:2.5px solid #F0F0F0; background:#fff; font-size:12px; font-weight:800; cursor:pointer; transition:all 0.2s; }
.cat-pill:hover { transform:translateY(-2px); border-color:var(--yellow); }
.cat-pill.active { background:var(--yellow); border-color:var(--yellow); color:var(--ink); transform:translateY(-2px); box-shadow:0 6px 16px rgba(255,217,61,0.4); }
.addon-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(170px,1fr)); gap:14px; }
.addon-card { background:#fff; border-radius:18px; padding:18px 16px; border:2.5px solid #F0F0F0; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); position:relative; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
.addon-card:hover { transform:translateY(-4px); box-shadow:0 10px 28px rgba(0,0,0,0.1); }
.addon-card.selected { border-color:var(--ac-color,var(--coral)); transform:translateY(-4px); box-shadow:0 10px 28px rgba(255,107,107,0.2); }
.addon-emoji { font-size:28px; display:block; margin-bottom:8px; }
.addon-name  { font-size:13px; font-weight:800; color:var(--ink); margin-bottom:3px; }
.addon-desc  { font-size:11px; color:var(--muted); margin-bottom:12px; line-height:1.4; }
.addon-footer { display:flex; align-items:center; justify-content:space-between; }
.addon-price  { font-family:'Fredoka One',cursive; font-size:17px; color:var(--ink); }
.qty-row { display:flex; align-items:center; gap:8px; }
.qty-btn { width:26px; height:26px; border-radius:50%; border:2px solid #E8E8E8; background:#fff; font-size:16px; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.15s; color:var(--ink); font-weight:800; }
.qty-btn:hover { border-color:var(--coral); background:var(--coral); color:#fff; transform:scale(1.1); }
.qty-num { font-size:14px; font-weight:800; min-width:16px; text-align:center; }

/* Summary */
.summary-layout { display:grid; grid-template-columns:1fr 300px; gap:20px; align-items:start; }
.summary-card { background:#fff; border-radius:var(--radius); border:2.5px solid #F0F0F0; overflow:hidden; margin-bottom:16px; box-shadow:0 4px 16px rgba(0,0,0,0.06); }
.sum-sec { padding:16px 20px; border-bottom:2px dashed #F0F0F0; }
.sum-sec:last-child { border-bottom:none; }
.sum-lbl { font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:5px; }
.sum-val { font-family:'Fredoka One',cursive; font-size:17px; color:var(--ink); }
.sum-sub { font-size:12px; color:var(--muted); margin-top:2px; font-weight:600; }
.sum-addon-row { display:flex; justify-content:space-between; padding:7px 0; border-bottom:1px dashed #F0F0F0; font-size:13px; font-weight:600; }
.sum-addon-row:last-child { border-bottom:none; }

.order-box { background:linear-gradient(145deg,#2D2D2D,#1A1A1A); border-radius:var(--radius); padding:24px 22px; position:sticky; top:80px; box-shadow:0 8px 32px rgba(0,0,0,0.2); }
.order-box-title { font-family:'Fredoka One',cursive; font-size:16px; color:rgba(255,255,255,0.5); margin-bottom:16px; }
.order-line { display:flex; justify-content:space-between; font-size:13px; color:rgba(255,255,255,0.5); margin-bottom:8px; font-weight:600; }
.order-line.main { color:#fff; font-size:14px; }
.order-hr { border:none; border-top:1px dashed rgba(255,255,255,0.15); margin:14px 0; }
.order-total { display:flex; justify-content:space-between; align-items:baseline; margin-bottom:20px; }
.order-total-lbl { font-size:11px; color:rgba(255,255,255,0.35); letter-spacing:1px; text-transform:uppercase; }
.order-total-amt { font-family:'Fredoka One',cursive; font-size:32px; color:var(--yellow); }

.field-group { margin-bottom:14px; }
.field-lbl   { font-size:10px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); margin-bottom:6px; display:block; }
.field-input { width:100%; padding:11px 14px; border:2.5px solid #F0F0F0; border-radius:12px; font-family:'Nunito',sans-serif; font-size:14px; font-weight:600; color:var(--ink); background:var(--bg); outline:none; transition:border-color 0.2s; }
.field-input:focus { border-color:var(--coral); }

.btn-primary { width:100%; padding:15px 24px; background:linear-gradient(135deg,var(--coral),#FF8E53); color:#fff; border:none; border-radius:16px; font-family:'Fredoka One',cursive; font-size:18px; cursor:pointer; transition:all 0.2s; box-shadow:0 6px 20px rgba(255,107,107,0.4); }
.btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(255,107,107,0.5); }
.btn-primary:disabled { opacity:0.5; cursor:not-allowed; }
.nav-row { display:flex; justify-content:space-between; align-items:center; margin-top:32px; padding-top:24px; border-top:2px dashed #E8E8E8; }
.btn-back { padding:12px 24px; background:#fff; color:var(--muted); border:2.5px solid #E8E8E8; border-radius:14px; font-family:'Nunito',sans-serif; font-size:14px; font-weight:800; cursor:pointer; transition:all 0.15s; }
.btn-back:hover { border-color:var(--muted); color:var(--ink); }
.btn-next { padding:12px 28px; background:var(--ink); color:var(--yellow); border:none; border-radius:14px; font-family:'Fredoka One',cursive; font-size:16px; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 14px rgba(0,0,0,0.2); }
.btn-next:hover { transform:translateY(-2px); }
.btn-next:disabled { opacity:0.3; cursor:not-allowed; transform:none; }

.sticky-foot { position:fixed; bottom:0; left:0; right:0; background:rgba(255,249,240,0.96); backdrop-filter:blur(10px); border-top:2px solid rgba(255,107,107,0.12); padding:14px 24px; display:flex; align-items:center; justify-content:space-between; z-index:50; box-shadow:0 -4px 24px rgba(0,0,0,0.08); }
.foot-total-lbl { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; color:var(--muted); }
.foot-total-amt { font-family:'Fredoka One',cursive; font-size:24px; color:var(--ink); }

.confetti-wrap { text-align:center; padding:52px 20px; }
.conf-burst { font-size:60px; display:block; margin-bottom:16px; animation:burst 0.6s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes burst { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
.conf-title { font-family:'Fredoka One',cursive; font-size:42px; color:var(--ink); margin-bottom:6px; }
.conf-sub   { font-size:16px; color:var(--muted); font-weight:600; margin-bottom:28px; }
.conf-ref   { display:inline-block; background:var(--ink); color:var(--yellow); font-family:'Fredoka One',cursive; font-size:22px; letter-spacing:4px; padding:14px 32px; border-radius:16px; margin-bottom:28px; }
.conf-details { background:#fff; border-radius:var(--radius); border:2.5px solid #F0F0F0; padding:22px; max-width:420px; margin:0 auto 28px; text-align:left; }
.cd-row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:2px dashed #F5F5F5; font-size:14px; }
.cd-row:last-child { border-bottom:none; }
.cd-key { color:var(--muted); font-weight:600; }
.cd-val { font-weight:800; color:var(--ink); }

.loading-spinner { display:flex; align-items:center; justify-content:center; padding:48px; font-size:14px; color:var(--muted); gap:10px; font-weight:600; }
.spinner { width:22px; height:22px; border:2.5px solid #F0F0F0; border-top-color:var(--coral); border-radius:50%; animation:spin 0.7s linear infinite; flex-shrink:0; }
@keyframes spin { to{transform:rotate(360deg)} }
.error-msg { background:#FFF0F0; border:2px solid #FFD0D0; border-radius:12px; padding:12px 16px; font-size:13px; color:#D63031; font-weight:600; margin-top:10px; text-align:center; }
.empty-msg { text-align:center; padding:40px; color:var(--muted); font-size:14px; font-weight:600; }

.float-emoji { position:fixed; font-size:22px; pointer-events:none; animation:floatUp 6s ease-in-out infinite; opacity:0.4; z-index:0; }
@keyframes floatUp { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-18px) rotate(8deg)} }

@media (max-width:640px) {
  .summary-layout { grid-template-columns:1fr; }
  .wiz-header { padding:12px 16px; }
  .step-pills  { display:none; }
  .occasion-grid { grid-template-columns:repeat(2,1fr); }
  .step-title  { font-size:26px; }
  .theatre-grid { grid-template-columns:1fr; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingWizard() {
  const supabase = createClient();
  const dates    = getDates();

  // ── Step: 0=Area, 1=Theatre, 2=Screen, 3=Date&Slot, 4=Addons, 5=Summary, 6=Confirm
  const [step,     setStep]     = useState(0);
  const [addonCat, setAddonCat] = useState("all");
  const [guests,   setGuests]   = useState(2);
  const [notes,    setNotes]    = useState("");
  const [bookingRef,      setBookingRef]      = useState("");
  const [bookingLoading,  setBookingLoading]  = useState(false);
  const [bookingError,    setBookingError]    = useState("");

  // ── Selection state ──
  const [area,     setArea]     = useState<any>(null);
  const [theatre,  setTheatre]  = useState<any>(null);
  const [screen,   setScreen]   = useState<any>(null);
  const [dateIdx,  setDateIdx]  = useState(0);
  const [slot,     setSlot]     = useState<any>(null);
  const [occasion, setOccasion] = useState<any>(null);
  const [addonQty, setAddonQty] = useState<Record<string,number>>({});

  // ── Data from Supabase ──
  const [locations,       setLocations]       = useState<any[]>([]);
  const [theatres,        setTheatres]        = useState<any[]>([]);
  const [screens,         setScreens]         = useState<any[]>([]);
  const [slots,           setSlots]           = useState<any[]>([]);
  const [addons,          setAddons]          = useState<any[]>([]);
  const [loadingLoc,      setLoadingLoc]      = useState(true);
  const [loadingTheatres, setLoadingTheatres] = useState(false);
  const [loadingScreens,  setLoadingScreens]  = useState(false);
  const [loadingSlots,    setLoadingSlots]    = useState(false);

  // ── Fetch locations (areas only) on mount ──
  useEffect(() => {
    supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .in("id", [
        "11111111-0000-0000-0000-000000000001",
        "11111111-0000-0000-0000-000000000002",
        "11111111-0000-0000-0000-000000000003",
        "11111111-0000-0000-0000-000000000004",
        "11111111-0000-0000-0000-000000000005",
        "11111111-0000-0000-0000-000000000006",
      ])
      .order("name")
      .then(({ data }) => { setLocations(data || []); setLoadingLoc(false); });
  }, []);

  // ── Fetch addons on mount ──
  useEffect(() => {
    supabase
      .from("addons")
      .select("*")
      .eq("is_available", true)
      .order("sort_order")
      .then(({ data }) => setAddons(data || []));
  }, []);

  // ── Fetch theatres when area selected ──
  // Since we don't have a separate theatres table yet, we group screens by theatre name
  // using the locations table itself filtered by area
  useEffect(() => {
    if (!area) return;
    setLoadingTheatres(true);
    setTheatre(null);
    setScreen(null);
    setSlot(null);

    // Fetch screens grouped — we use distinct location names as "theatres"
    // For now, fetch all screens under this area and group by name prefix
    supabase
    .from("theatres")
    .select("*")
    .eq("location_id", area.id)
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error("Theatre fetch error:", error.message, error.code);
      }
      console.log("Theatres loaded:", data?.length, data);
      setTheatres(data || []);
      setLoadingTheatres(false);
    });
}, [area]);

  // ── Fetch screens when theatre selected ──
  // ── Fetch screens when theatre selected ──
// ── REPLACE SCREENS FETCH WITH THIS ──
useEffect(() => {
  if (!theatre) return;
  setLoadingScreens(true);
  setScreen(null);
  setSlot(null);

  console.log("Fetching screens for theatre_id:", theatre.id);

  supabase
    .from("screens")
    .select("*")
    .eq("theatre_id", theatre.id)
    .eq("is_active", true)
    .order("base_price")
    .then(({ data, error }) => {
      if (error) {
        console.error("Screen error:", error.message, error.code, error.hint);
      }
      console.log("Screens loaded:", data?.length, data);
      setScreens(data || []);
      setLoadingScreens(false);
    });
}, [theatre]);

  // ── Fetch theatres when area selected ──
useEffect(() => {
  if (!area) return;
  setLoadingTheatres(true);
  setTheatre(null);
  setScreen(null);
  setSlot(null);

  supabase
    .from("theatres")               // ← now fetching from real theatres table
    .select("*")
    .eq("location_id", area.id)
    .eq("is_active", true)
    .order("rating", { ascending: false })
    .then(({ data, error }) => {
      if (error) console.error("Theatre fetch error:", error);
      setTheatres(data || []);
      setLoadingTheatres(false);
    });
}, [area]);

// ── Fetch screens when theatre selected ──
// ── Fetch screens when theatre selected ──
useEffect(() => {
  if (!theatre) return;
  setLoadingScreens(true);
  setScreen(null);
  setSlot(null);

  console.log("Theatre selected:", JSON.stringify(theatre, null, 2));

  // Try theatre_id first, fall back to location_id
  supabase
    .from("screens")
    .select("*")
    .eq("theatre_id", theatre.id)
    .eq("is_active", true)
    .order("base_price")
    .then(({ data, error }) => {
      if (error || !data || data.length === 0) {
        console.warn("theatre_id fetch failed, trying location_id fallback...");
        // Fallback: fetch by location_id
        supabase
          .from("screens")
          .select("*")
          .eq("location_id", theatre.location_id)
          .eq("is_active", true)
          .order("base_price")
          .then(({ data: fallbackData, error: fallbackError }) => {
            if (fallbackError) {
              console.error("Fallback error:", fallbackError.message);
            }
            console.log("Screens via fallback:", fallbackData?.length, fallbackData);
            setScreens(fallbackData || []);
            setLoadingScreens(false);
          });
      } else {
        console.log("Screens via theatre_id:", data?.length, data);
        setScreens(data || []);
        setLoadingScreens(false);
      }
    });
}, [theatre]);


{theatres.map((th: any, idx: number) => {
  const color = THEATRE_COLORS[idx % THEATRE_COLORS.length];
  return (
    <div
      key={th.id}
      className={`theatre-card ${theatre?.id === th.id ? "selected" : ""}`}
      style={{ "--tc-color": color } as React.CSSProperties}
      onClick={() => setTheatre(th)}
    >
      {theatre?.id === th.id && (
        <div className="tc-check" style={{ background: color }}>✓</div>
      )}
      <div className="tc-banner" style={{ background: color }} />
      <div className="tc-body">
        <span className="tc-emoji">🎭</span>
        <div className="tc-name">{th.name}</div>
        <div className="tc-address">{th.address}</div>
        <div className="tc-meta">
          <span className="tc-rating">⭐ {th.rating}</span>
          <span className="tc-screens">{th.screen_count} screens</span>
          {th.has_restaurant && <span className="tc-dining">🍽️ Dining</span>}
        </div>
      </div>
    </div>
  );
})}

  // ── Fetch slots when screen + date changes ──
  useEffect(() => {
    if (!screen) return;
    setLoadingSlots(true);
    setSlot(null);
    supabase
      .from("slots")
      .select("*")
      .eq("screen_id", screen.id)
      .eq("slot_date", dates[dateIdx].isoDate)
      .order("start_time")
      .then(({ data }) => { setSlots(data || []); setLoadingSlots(false); });
  }, [screen, dateIdx]);

  // ── Computed ──
  const selAddons  = addons.filter(a => (addonQty[a.id] || 0) > 0);
  const addonTotal = selAddons.reduce((s, a) => s + a.price * (addonQty[a.id] || 0), 0);
  const grandTotal = (screen?.base_price || 0) + addonTotal;
  const filtAddons = addonCat === "all" ? addons : addons.filter(a => a.category === addonCat);

  // Steps: 0=Area, 1=Theatre, 2=Screen, 3=Date&Slot, 4=Addons, 5=Summary
  const STEPS   = ["Area","Theatre","Screen","Date & Time","Add-ons","Summary"];
  const canNext = [!!area, !!theatre, !!screen, !!(slot && occasion), true, true];

  function goNext() {
    if (step < STEPS.length - 1 && canNext[step]) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0 });
    }
  }
  function goBack() {
    if (step > 0) setStep(s => s - 1);
  }
  function setQty(id: string, delta: number) {
    setAddonQty(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));
  }

  // ── Handle confirm booking ──
  async function handleConfirm() {
    if (!slot || !occasion) return;
    setBookingLoading(true);
    setBookingError("");

    const addonPayload = selAddons.map(a => ({
      addon_id:   a.id,
      quantity:   addonQty[a.id],
      unit_price: a.price,
    }));

    try {
      const res = await fetch("/api/bookings/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot_id:       slot.id,
          occasion_type: occasion.id,
          guest_count:   guests,
          special_notes: notes || null,
          addons:        addonPayload,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || "Booking failed. Please try again.");
        return;
      }

      setBookingRef(data.booking_id.slice(0, 8).toUpperCase());
      setStep(6);
      window.scrollTo({ top: 0 });

    } catch {
      setBookingError("Network error. Please check your connection.");
    } finally {
      setBookingLoading(false);
    }
  }

  const stepEmojis = ["📍","🏛️","📺","📅","🎁","✅"];
  const stepTitles = [
    "Where are you?",
    `Theatres in ${area?.name || "your area"}`,
    `Screens at ${theatre?.name || "the theatre"}`,
    "Pick a date & time",
    "Make it special",
    "Almost there!",
  ];
  const stepSubs = [
    "Choose your neighbourhood",
    `${theatres.length} private theatre${theatres.length !== 1 ? "s" : ""} found`,
    `${screens.length} screen${screens.length !== 1 ? "s" : ""} available · pick your perfect one`,
    `${screen?.name || ""} · All sessions are 3 hours`,
    "Cakes 🎂 · Decor 🎈 · Food 🍿 · Drinks 🥂",
    "Review your booking before payment",
  ];

  return (
    <>
      <style>{css}</style>
      <div className="wiz-bg">

        {/* Floating decorations */}
        {["🎬","🎂","🎈","⭐","🎉"].map((e, i) => (
          <div key={i} className="float-emoji" style={{
            left: `${8 + i * 20}%`, top: `${15 + i * 14}%`,
            animationDelay: `${i * 1.3}s`, animationDuration: `${5 + i}s`,
          }}>{e}</div>
        ))}

        {/* Header */}
        <header className="wiz-header">
          <div className="logo">🎬 PrivateScreen</div>
          {step < 6 && (
            <div className="step-pills">
              {STEPS.map((_, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`step-pill ${i < step ? "done" : i === step ? "active" : "future"}`}
                    onClick={() => i < step && setStep(i)}
                    title={STEPS[i]}
                  >
                    {i < step ? "✓" : i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-connector ${i < step ? "done" : ""}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </header>

        <div className="wiz-body">

          {/* Step heading */}
          {step < 6 && (
            <div className="step-head">
              <span className="step-emoji">{stepEmojis[step]}</span>
              <div className="step-title">{stepTitles[step]}</div>
              <div className="step-sub">{stepSubs[step]}</div>
            </div>
          )}

          {/* ── Step 0: Area ── */}
          {step === 0 && (
            <>
              {loadingLoc ? (
                <div className="loading-spinner"><div className="spinner" /> Loading areas…</div>
              ) : (
                <div className="area-wrap">
                  {locations.map((loc: any) => (
                    <div
                      key={loc.id}
                      className={`area-chip ${area?.id === loc.id ? "selected" : ""}`}
                      onClick={() => setArea(loc)}
                    >
                      <span>📍</span>
                      <span>{loc.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="nav-row">
                <div />
                <button className="btn-next" onClick={goNext} disabled={!canNext[0]}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* ── Step 1: Theatre ── */}
          {step === 1 && (
            <>
             {loadingTheatres ? (
      <div className="loading-spinner"><div className="spinner" /> Finding theatres…</div>
    ) : theatres.length === 0 ? (
      <div className="empty-msg">😕 No theatres found in {area?.name}.</div>
    ) : (
                <div className="theatre-grid">
                  {theatres.map((th: any, idx: number) => {
                    const color = THEATRE_COLORS[idx % THEATRE_COLORS.length];
                    return (
                      <div
                      key={th.id}
                      className={`theatre-card ${theatre?.id === th.id ? "selected" : ""}`}
                      style={{ "--tc-color": color } as React.CSSProperties}
                      onClick={() => setTheatre(th)}
                    >
                      {theatre?.id === th.id && (
                        <div className="tc-check" style={{ background: color }}>✓</div>
                      )}
                      <div className="tc-banner" style={{ background: color }} />
                      <div className="tc-body">
                        <span className="tc-emoji">🎭</span>
                        <div className="tc-name">{th.name}</div>
                        <div className="tc-address">{th.address}</div>
                        <div className="tc-meta">
                          <span className="tc-rating">⭐ {th.rating}</span>
                          {/* ✅ Use DB column names: screen_count and has_restaurant */}
                          <span className="tc-screens">{th.screen_count} screens</span>
                          {th.has_restaurant && <span className="tc-dining">🍽️ Dining</span>}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
              <div className="nav-row">
      ``````````<button className="btn-back" onClick={goBack}>← Back</button>
      ``````````<button className="btn-next" onClick={goNext} disabled={!canNext[1]}>Next →</button>
    ````````` </div>
            </>
          )}

          {/* ── Step 2: Screen ── */}
          {step === 2 && (
            <>
              {loadingScreens ? (
                <div className="loading-spinner"><div className="spinner" /> Loading screens…</div>
              ) : screens.length === 0 ? (
                <div className="empty-msg">😕 No screens found.</div>
              ) : (
                <div className="screen-grid">
                  {screens.map((sc: any) => (
                    <div
                      key={sc.id}
                      className={`screen-card ${screen?.id === sc.id ? "selected" : ""}`}
                      onClick={() => setScreen(sc)}
                    >
                      <div className="sc-top">
                        <span className="sc-emoji">📺</span>
                        <div className="sc-type">{sc.type?.toUpperCase()}</div>
                        <div className="sc-name">{sc.name}</div>
                        <div className="sc-cap">Up to {sc.capacity} guests</div>
                      </div>
                      <div className="sc-body">
                        <div className="sc-tags">
                          {(sc.amenities || []).map((a: string) => (
                            <span key={a} className="sc-tag">{a}</span>
                          ))}
                        </div>
                        <div className="sc-price-row">
                          <div>
                            <div className="sc-price">₹{sc.base_price?.toLocaleString("en-IN")}</div>
                            <div className="sc-price-sub">per 3 hr session</div>
                          </div>
                          <button className="sc-pick">
                            {screen?.id === sc.id ? "Picked ✓" : "Pick"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="nav-row">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canNext[2]}>Next →</button>
              </div>
            </>
          )}

          {/* ── Step 3: Date & Slot ── */}
          {step === 3 && (
            <>
              <div className="date-strip">
                {dates.map((d, i) => (
                  <div
                    key={i}
                    className={`date-chip ${dateIdx === i ? "selected" : ""} ${d.isWeekend && dateIdx !== i ? "weekend" : ""}`}
                    onClick={() => { setDateIdx(i); setSlot(null); }}
                  >
                    {d.isToday && <div className="today-dot" />}
                    <div className="dc-day">{d.isToday ? "Today" : d.day}</div>
                    <div className="dc-num">{d.date}</div>
                    <div className="dc-mon">{d.month}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize:13, fontWeight:800, color:"var(--muted)", letterSpacing:1, textTransform:"uppercase", marginBottom:14 }}>
                Available time slots
              </div>

              {loadingSlots ? (
                <div className="loading-spinner"><div className="spinner" /> Checking availability…</div>
              ) : slots.length === 0 ? (
                <div className="empty-msg">😕 No slots on this date. Try another day!</div>
              ) : (
                <div className="slots-grid">
                  {slots.map((ts: any) => {
                    const isBooked = ts.status !== "available";
                    return (
                      <div
                        key={ts.id}
                        className={`slot-card ${isBooked ? "booked" : ""} ${slot?.id === ts.id ? "selected" : ""}`}
                        onClick={() => !isBooked && setSlot(ts)}
                      >
                        {isBooked && <span className="booked-tag">Full</span>}
                        <span className="slot-emoji">{slotEmoji(ts.start_time)}</span>
                        <div className="slot-time">{formatTime(ts.start_time)}</div>
                        <div className="slot-label">{isBooked ? "Booked" : "Available"}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ fontSize:13, fontWeight:800, color:"var(--muted)", letterSpacing:1, textTransform:"uppercase", marginBottom:14, marginTop:8 }}>
                What's the occasion? 🎉
              </div>
              <div className="occasion-grid">
                {OCCASIONS.map(occ => (
                  <div
                    key={occ.id}
                    className={`occ-card ${occasion?.id === occ.id ? "selected" : ""}`}
                    style={{ "--oc-color": occ.color } as React.CSSProperties}
                    onClick={() => setOccasion(occ)}
                  >
                    <span className="occ-emoji">{occ.emoji}</span>
                    <div className="occ-label">{occ.label}</div>
                  </div>
                ))}
              </div>

              <div className="nav-row">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext} disabled={!canNext[3]}>Next →</button>
              </div>
            </>
          )}

          {/* ── Step 4: Add-ons ── */}
          {step === 4 && (
            <>
              <div className="cat-pills">
                {[
                  { id:"all",        label:"🎊 All"     },
                  { id:"cake",       label:"🎂 Cakes"   },
                  { id:"decoration", label:"🎈 Decor"   },
                  { id:"food",       label:"🍿 Food"    },
                  { id:"beverage",   label:"🥂 Drinks"  },
                  { id:"bundle",     label:"❤️ Bundles" },
                ].map(c => (
                  <div
                    key={c.id}
                    className={`cat-pill ${addonCat === c.id ? "active" : ""}`}
                    onClick={() => setAddonCat(c.id)}
                  >
                    {c.label}
                  </div>
                ))}
              </div>

              {addons.length === 0 ? (
                <div className="loading-spinner"><div className="spinner" /> Loading add-ons…</div>
              ) : (
                <div className="addon-grid">
                  {filtAddons.map((addon: any) => {
                    const color = ADDON_COLORS[addon.category] || "#FF6B6B";
                    return (
                      <div
                        key={addon.id}
                        className={`addon-card ${(addonQty[addon.id] || 0) > 0 ? "selected" : ""}`}
                        style={{ "--ac-color": color } as React.CSSProperties}
                      >
                        <span className="addon-emoji">
                          {addon.category === "cake"       ? "🎂"
                          : addon.category === "decoration" ? "🎈"
                          : addon.category === "food"       ? "🍿"
                          : addon.category === "beverage"   ? "🥂" : "❤️"}
                        </span>
                        <div className="addon-name">{addon.name}</div>
                        <div className="addon-desc">{addon.description}</div>
                        <div className="addon-footer">
                          <div className="addon-price">₹{addon.price?.toLocaleString("en-IN")}</div>
                          <div className="qty-row">
                            <button className="qty-btn" onClick={() => setQty(addon.id, -1)}>−</button>
                            <span className="qty-num">{addonQty[addon.id] || 0}</span>
                            <button className="qty-btn" onClick={() => setQty(addon.id, +1)}>+</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="nav-row">
                <button className="btn-back" onClick={goBack}>← Back</button>
                <button className="btn-next" onClick={goNext}>Next →</button>
              </div>
            </>
          )}

          {/* ── Step 5: Summary ── */}
          {step === 5 && (
            <>
              <div className="summary-layout">
                <div>
                  <div className="summary-card">
                    <div className="sum-sec">
                      <div className="sum-lbl">📍 Area</div>
                      <div className="sum-val">{area?.name}</div>
                    </div>
                    <div className="sum-sec">
                      <div className="sum-lbl">🏛️ Theatre</div>
                      <div className="sum-val">{theatre?.name}</div>
                      <div className="sum-sub">{theatre?.address}</div>
                    </div>
                    <div className="sum-sec">
                      <div className="sum-lbl">📺 Screen</div>
                      <div className="sum-val">{screen?.name}</div>
                      <div className="sum-sub">Up to {screen?.capacity} guests · {screen?.type}</div>
                    </div>
                    <div className="sum-sec">
                      <div className="sum-lbl">📅 Date & Time</div>
                      <div className="sum-val">{dates[dateIdx]?.full}</div>
                      <div className="sum-sub">{slot && formatTime(slot.start_time)} · 3 hours</div>
                    </div>
                    <div className="sum-sec">
                      <div className="sum-lbl">🎉 Occasion</div>
                      <div className="sum-val">{occasion?.emoji} {occasion?.label}</div>
                    </div>
                  </div>

                  {selAddons.length > 0 && (
                    <div className="summary-card">
                      <div className="sum-sec">
                        <div className="sum-lbl">🎁 Add-ons</div>
                        {selAddons.map((a: any) => (
                          <div key={a.id} className="sum-addon-row">
                            <span>{a.name} ×{addonQty[a.id]}</span>
                            <span style={{ color:"var(--muted)" }}>
                              ₹{(a.price * addonQty[a.id]).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="summary-card">
                    <div className="sum-sec">
                      <div className="sum-lbl">👥 Guest details</div>
                      <div className="field-group" style={{ marginBottom:12 }}>
                        <label className="field-lbl">Number of guests</label>
                        <input
                          className="field-input" type="number"
                          min={1} max={screen?.capacity}
                          value={guests}
                          onChange={e => setGuests(Number(e.target.value))}
                        />
                      </div>
                      <div className="field-group" style={{ marginBottom:0 }}>
                        <label className="field-lbl">Special notes (optional)</label>
                        <input
                          className="field-input"
                          placeholder="e.g. Veg food only, surprise entry…"
                          value={notes}
                          onChange={e => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order box */}
                <div className="order-box">
                  <div className="order-box-title">Your Order 🧾</div>
                  <div className="order-line main">
                    <span>{screen?.name}</span>
                    <span>₹{(screen?.base_price || 0).toLocaleString("en-IN")}</span>
                  </div>
                  {selAddons.map((a: any) => (
                    <div key={a.id} className="order-line">
                      <span>{a.name} ×{addonQty[a.id]}</span>
                      <span>₹{(a.price * addonQty[a.id]).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  <hr className="order-hr" />
                  <div className="order-total">
                    <span className="order-total-lbl">Total</span>
                    <span className="order-total-amt">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={handleConfirm}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? "⏳ Saving booking…" : "🎉 Confirm & Pay"}
                  </button>
                  {bookingError && <div className="error-msg">⚠️ {bookingError}</div>}
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.22)", textAlign:"center", marginTop:10, fontWeight:600 }}>
                    Secured by Razorpay
                  </p>
                </div>
              </div>
              <div className="nav-row">
                <button className="btn-back" onClick={goBack}>← Back</button>
              </div>
            </>
          )}

          {/* ── Confirmation ── */}
          {step === 6 && (
            <div className="confetti-wrap">
              <span className="conf-burst">🎊</span>
              <div className="conf-title">You're booked!</div>
              <p className="conf-sub">Your private theatre is all set 🍿</p>
              <div className="conf-ref">{bookingRef}</div>
              <div className="conf-details">
                <div className="cd-row"><span className="cd-key">📍 Area</span>      <span className="cd-val">{area?.name}</span></div>
                <div className="cd-row"><span className="cd-key">🏛️ Theatre</span>  <span className="cd-val">{theatre?.name}</span></div>
                <div className="cd-row"><span className="cd-key">📺 Screen</span>    <span className="cd-val">{screen?.name}</span></div>
                <div className="cd-row"><span className="cd-key">📅 Date</span>      <span className="cd-val">{dates[dateIdx]?.full}</span></div>
                <div className="cd-row"><span className="cd-key">🕐 Time</span>      <span className="cd-val">{slot && formatTime(slot.start_time)} (3 hrs)</span></div>
                <div className="cd-row"><span className="cd-key">🎉 Occasion</span>  <span className="cd-val">{occasion?.emoji} {occasion?.label}</span></div>
                <div className="cd-row"><span className="cd-key">👥 Guests</span>    <span className="cd-val">{guests}</span></div>
                <div className="cd-row"><span className="cd-key">💰 Total</span>     <span className="cd-val" style={{ color:"#27AE60" }}>₹{grandTotal.toLocaleString("en-IN")}</span></div>
              </div>
              <p style={{ fontSize:14, color:"var(--muted)", marginBottom:24, fontWeight:600 }}>
                Confirmation sent to your email & phone 📱
              </p>
              <button
                className="btn-primary"
                style={{ maxWidth:260, margin:"0 auto", display:"block" }}
                onClick={() => {
                  setStep(0); setArea(null); setTheatre(null); setScreen(null);
                  setSlot(null); setAddonQty({}); setOccasion(null);
                  setBookingRef(""); setBookingError("");
                }}
              >
                🎬 Book Another!
              </button>
            </div>
          )}
        </div>

        {/* Sticky footer (steps 2 & 4) */}
        {(step === 2 || step === 4) && (
          <div className="sticky-foot">
            <div>
              <div className="foot-total-lbl">Running total</div>
              <div className="foot-total-amt">₹{grandTotal.toLocaleString("en-IN")}</div>
            </div>
            <button
              className="btn-next"
              onClick={goNext}
              disabled={!canNext[step]}
              style={{ width:"auto" }}
            >
              {step === 4 ? "Review Order 🧾" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}