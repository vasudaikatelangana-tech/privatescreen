
"use client";  // ← ADD THIS AS VERY FIRST LINE

import { useState, useEffect } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const AREAS = [
  { id: "miyapur",      name: "Miyapur",       emoji: "🎪", count: 3 },
  { id: "jubilee",      name: "Jubilee Hills",  emoji: "✨", count: 4 },
  { id: "gachibowli",   name: "Gachibowli",    emoji: "🚀", count: 2 },
  { id: "kukatpally",   name: "Kukatpally",    emoji: "🎡", count: 3 },
  { id: "madhapur",     name: "Madhapur",      emoji: "🌟", count: 5 },
  { id: "secunderabad", name: "Secunderabad",  emoji: "🎠", count: 2 },
];

const THEATRES = {
  miyapur: [
    { id: "th1", name: "Party Flix",      address: "Miyapur X Roads", rating: 4.8, screens: 5, dining: true,  color: "#FF6B6B", emoji: "🎭" },
    { id: "th2", name: "Cineplex Privé",  address: "Miyapur Main Rd", rating: 4.5, screens: 3, dining: false, color: "#4ECDC4", emoji: "🎬" },
    { id: "th3", name: "The Screen Room", address: "Chandanagar",     rating: 4.6, screens: 4, dining: true,  color: "#FFE66D", emoji: "🎪" },
  ],
  jubilee: [
    { id: "th4", name: "Luxe Frames",  address: "Road No. 36",    rating: 4.9, screens: 6, dining: true,  color: "#A8E6CF", emoji: "✨" },
    { id: "th5", name: "Reel & Dine", address: "Film Nagar",      rating: 4.7, screens: 4, dining: true,  color: "#FF8B94", emoji: "🍽️" },
    { id: "th6", name: "Noir Theatre", address: "Banjara Link Rd", rating: 4.4, screens: 3, dining: false, color: "#B4A7D6", emoji: "🎥" },
    { id: "th7", name: "Velvet Room",  address: "Rd No. 12",       rating: 4.6, screens: 2, dining: false, color: "#FFD93D", emoji: "❤️" },
  ],
  gachibowli: [
    { id: "th8", name: "TechPlex",     address: "DLF Cyber City",  rating: 4.5, screens: 5, dining: true,  color: "#4ECDC4", emoji: "🖥️" },
    { id: "th9", name: "Skybox",       address: "Nanakramguda",    rating: 4.7, screens: 3, dining: true,  color: "#FF6B6B", emoji: "🌆" },
  ],
  kukatpally: [
    { id: "th10", name: "Cinebox",        address: "KPHB Phase 1", rating: 4.3, screens: 4, dining: false, color: "#A8E6CF", emoji: "📦" },
    { id: "th11", name: "Starlight Hall", address: "Moosapet",     rating: 4.6, screens: 5, dining: true,  color: "#FFD93D", emoji: "⭐" },
    { id: "th12", name: "Mini Marvel",    address: "JNTU Rd",      rating: 4.4, screens: 2, dining: false, color: "#FF8B94", emoji: "🎯" },
  ],
  madhapur: [
    { id: "th13", name: "The Frame Studio", address: "HiTech City",   rating: 4.9, screens: 6, dining: true,  color: "#FF6B6B", emoji: "🏆" },
    { id: "th14", name: "Pixel Lounge",     address: "Whitefields",   rating: 4.7, screens: 4, dining: true,  color: "#4ECDC4", emoji: "🍹" },
    { id: "th15", name: "Premiere Box",     address: "Kondapur",      rating: 4.5, screens: 3, dining: false, color: "#B4A7D6", emoji: "🎞️" },
    { id: "th16", name: "Cine Nest",        address: "Gafoor Nagar",  rating: 4.4, screens: 2, dining: false, color: "#FFD93D", emoji: "🪺" },
    { id: "th17", name: "Grand Reel",       address: "Inorbit Mall Rd",rating: 4.6, screens: 5, dining: true, color: "#A8E6CF", emoji: "🎬" },
  ],
  secunderabad: [
    { id: "th18", name: "Classic Frames", address: "SD Road",        rating: 4.3, screens: 3, dining: false, color: "#FF8B94", emoji: "🎦" },
    { id: "th19", name: "The Vault",      address: "Trimulgherry",    rating: 4.7, screens: 4, dining: true,  color: "#4ECDC4", emoji: "🔐" },
  ],
};

const SCREENS_DATA = {
  th1: [
    { id:"sc1", name:"Mini Cozy",  type:"mini",  cap:8,  price:1299, emoji:"🛋️",  amenities:["4K","Dolby","Bean Bags"] },
    { id:"sc2", name:"Luxe Suite", type:"luxe",  cap:15, price:2199, emoji:"🛋️✨", amenities:["OLED","Atmos","Recliners","Bar"] },
    { id:"sc3", name:"Grand Hall", type:"grand", cap:25, price:3499, emoji:"🏟️",  amenities:["180° Screen","Surround","VIP Sofas"] },
    { id:"sc4", name:"Mini Duo",   type:"mini",  cap:10, price:1399, emoji:"🎬",   amenities:["4K","Stereo","Recliners"] },
    { id:"sc5", name:"Luxe Plus",  type:"luxe",  cap:12, price:2499, emoji:"💎",   amenities:["OLED","Atmos","Recliners","Minibar"] },
  ],
  th4: [
    { id:"sc13", name:"Sapphire", type:"mini",  cap:8,  price:1799, emoji:"💎",  amenities:["4K Laser","Dolby","Velvet"] },
    { id:"sc14", name:"Emerald",  type:"luxe",  cap:14, price:2999, emoji:"💚",  amenities:["OLED","Atmos","Recliners","Bar"] },
    { id:"sc15", name:"Ruby",     type:"grand", cap:28, price:4999, emoji:"❤️",  amenities:["200\" Screen","Surround","VIP Dining"] },
    { id:"sc16", name:"Diamond",  type:"ultra", cap:6,  price:7999, emoji:"🔮",  amenities:["8K Laser","360°","Massage Chairs"] },
  ],
};

function getScreens(theatreId) {
  if (SCREENS_DATA[theatreId]) return SCREENS_DATA[theatreId];
  return [
    { id:`${theatreId}-s1`, name:"Mini Cozy",  type:"mini",  cap:8,  price:1299, emoji:"🛋️", amenities:["4K","Dolby","Recliners"] },
    { id:`${theatreId}-s2`, name:"Luxe Suite", type:"luxe",  cap:15, price:2299, emoji:"💫", amenities:["OLED","Atmos","Recliners","Bar"] },
    { id:`${theatreId}-s3`, name:"Grand Hall", type:"grand", cap:25, price:3499, emoji:"🏟️", amenities:["Giant Screen","Surround","VIP Seating"] },
  ];
}

// ✅ CORRECT — using real Supabase slots
{slots.map((ts: any) => {
  const isBooked = ts.status !== "available";
  return (
    <div
      key={ts.id}           // ← real UUID from Supabase
      className={`slot-card ${isBooked ? "booked" : ""} ${slot?.id === ts.id ? "selected" : ""}`}
      onClick={() => !isBooked && setSlot(ts)}  // ← ts has real UUID
    >
      {isBooked && <span className="booked-tag">Full</span>}
      <span className="slot-emoji">{slotEmoji(ts.start_time)}</span>
      <div className="slot-time">{formatTime(ts.start_time)}</div>
      <div className="slot-label">{isBooked ? "Booked" : "Available"}</div>
    </div>
  );
})}

const OCCASIONS = [
  { id:"birthday",     label:"Birthday",     emoji:"🎂", color:"#FF6B6B" },
  { id:"anniversary",  label:"Anniversary",  emoji:"💑", color:"#FF8B94" },
  { id:"ott_movie",    label:"OTT Movie",    emoji:"🎬", color:"#4ECDC4" },
  { id:"live_cricket", label:"Live Cricket", emoji:"🏏", color:"#A8E6CF" },
  { id:"corporate",    label:"Corporate",    emoji:"💼", color:"#B4A7D6" },
  { id:"other",        label:"Just Vibes",   emoji:"🎉", color:"#FFD93D" },
];

const ADDONS = [
  { id:"a1", name:"Choco Fudge Cake",    cat:"cake",   price:799,  emoji:"🎂", desc:"1kg · custom message", color:"#FF6B6B", badge:null },
  { id:"a2", name:"Red Velvet Cake",     cat:"cake",   price:699,  emoji:"🍰", desc:"1kg · custom message", color:"#FF8B94", badge:null },
  { id:"a3", name:"Balloon Party",       cat:"decor",  price:499,  emoji:"🎈", desc:"50 balloons + banner",  color:"#FFD93D", badge:null },
  { id:"a4", name:"Floral Wonderland",   cat:"decor",  price:1299, emoji:"💐", desc:"Fresh flowers + drapes",color:"#A8E6CF", badge:null },
  { id:"a5", name:"Popcorn Fiesta",      cat:"food",   price:399,  emoji:"🍿", desc:"For 2 · nachos + drink",color:"#FFE66D", badge:null },
  { id:"a6", name:"Dinner Experience",   cat:"food",   price:899,  emoji:"🍽️", desc:"Starter + main + dessert",color:"#4ECDC4",badge:null },
  { id:"a7", name:"Bubbly Package",      cat:"drinks", price:599,  emoji:"🥂", desc:"Mocktails + soft drinks",color:"#B4A7D6", badge:null },
  { id:"a8", name:"Romance Bundle",      cat:"bundle", price:1799, emoji:"❤️", desc:"Petals + candles + arch", color:"#FF6B6B", badge:"🔥 Best Value" },
];

function getDates() {
  const out = [];
  const now = new Date();
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push({
      id: i,
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      full: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
      isToday: i === 0,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  return out;
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --coral:    #FF6B6B;
  --yellow:   #FFD93D;
  --teal:     #4ECDC4;
  --lavender: #B4A7D6;
  --mint:     #A8E6CF;
  --pink:     #FF8B94;
  --bg:       #FFF9F0;
  --card:     #FFFFFF;
  --ink:      #2D2D2D;
  --muted:    #8B8B8B;
  --radius:   20px;
  --radius-sm:12px;
}

body {
  background: var(--bg);
  font-family: 'Nunito', sans-serif;
  color: var(--ink);
  min-height: 100vh;
}

/* ── Blob background ── */
.wiz-bg {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: #FFF9F0;
}
.wiz-bg::before {
  content: '';
  position: fixed; top: -120px; right: -120px;
  width: 420px; height: 420px;
  background: radial-gradient(circle, rgba(255,107,107,0.18) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none; z-index: 0;
  animation: blob1 8s ease-in-out infinite alternate;
}
.wiz-bg::after {
  content: '';
  position: fixed; bottom: -100px; left: -100px;
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(78,205,196,0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none; z-index: 0;
  animation: blob2 10s ease-in-out infinite alternate;
}
@keyframes blob1 { from { transform: scale(1) translate(0,0); } to { transform: scale(1.1) translate(-30px,20px); } }
@keyframes blob2 { from { transform: scale(1) translate(0,0); } to { transform: scale(1.15) translate(20px,-30px); } }

/* ── Header ── */
.wiz-header {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,249,240,0.88);
  backdrop-filter: blur(12px);
  padding: 14px 28px;
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 2px solid rgba(255,107,107,0.12);
}
.logo {
  font-family: 'Fredoka One', cursive;
  font-size: 24px;
  background: linear-gradient(135deg, var(--coral), var(--yellow));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

/* ── Step pills progress ── */
.step-pills {
  display: flex; align-items: center; gap: 4px;
}
.step-pill {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  cursor: default;
  border: 2.5px solid transparent;
}
.step-pill.done {
  background: var(--coral); color: #fff;
  transform: scale(1);
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(255,107,107,0.4);
}
.step-pill.done:hover { transform: scale(1.1); }
.step-pill.active {
  background: #fff; color: var(--coral);
  border-color: var(--coral);
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(255,107,107,0.3);
}
.step-pill.future {
  background: #fff; color: #ccc;
  border-color: #E8E8E8;
}
.step-connector {
  width: 20px; height: 2px;
  background: #E8E8E8; border-radius: 2px;
  transition: background 0.3s;
}
.step-connector.done { background: var(--coral); }

/* ── Body ── */
.wiz-body {
  max-width: 820px; margin: 0 auto;
  padding: 32px 20px 100px;
  position: relative; z-index: 1;
}

/* ── Step header ── */
.step-head { margin-bottom: 28px; }
.step-emoji {
  font-size: 40px; display: block; margin-bottom: 8px;
  animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes popIn {
  from { transform: scale(0) rotate(-10deg); opacity: 0; }
  to   { transform: scale(1) rotate(0deg);  opacity: 1; }
}
.step-title {
  font-family: 'Fredoka One', cursive;
  font-size: 32px; color: var(--ink);
  line-height: 1.1; margin-bottom: 6px;
}
.step-sub { font-size: 14px; color: var(--muted); font-weight: 500; }

/* ── Area chips ── */
.area-wrap { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 32px; }
.area-chip {
  padding: 12px 22px; border-radius: 50px;
  background: #fff; border: 2.5px solid #F0F0F0;
  font-size: 15px; font-weight: 700; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.area-chip:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); border-color: var(--coral); }
.area-chip.selected {
  background: var(--coral); border-color: var(--coral);
  color: #fff; transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(255,107,107,0.4);
}
.area-chip-count { font-size: 11px; opacity: 0.7; font-weight: 600; }

/* ── Theatre cards ── */
.theatre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 16px; }
.theatre-card {
  background: #fff; border-radius: var(--radius);
  padding: 20px; cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  position: relative; overflow: hidden;
}
.theatre-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 6px;
  background: var(--tc-color, var(--coral));
  border-radius: 0 0 6px 6px;
  transition: height 0.25s;
}
.theatre-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); border-color: var(--tc-color, var(--coral)); }
.theatre-card:hover::before { height: 100%; opacity: 0.06; }
.theatre-card.selected { border-color: var(--tc-color, var(--coral)); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
.tc-emoji { font-size: 32px; margin-bottom: 10px; display: block; }
.tc-check {
  position: absolute; top: 12px; right: 12px;
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--tc-color, var(--coral)); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800;
  animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
}
.tc-name { font-family: 'Fredoka One', cursive; font-size: 18px; color: var(--ink); margin-bottom: 3px; }
.tc-address { font-size: 12px; color: var(--muted); margin-bottom: 10px; }
.tc-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tc-rating { font-size: 12px; font-weight: 800; color: var(--ink); }
.tc-screens { font-size: 11px; color: var(--muted); font-weight: 600; }
.tc-dining { font-size: 10px; background: #E8F8F5; color: #2ECC71; padding: 2px 8px; border-radius: 10px; font-weight: 700; }

/* ── Date strip ── */
.date-strip { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 28px; scrollbar-width: none; }
.date-strip::-webkit-scrollbar { display: none; }
.date-chip {
  flex-shrink: 0; width: 64px; padding: 12px 0;
  border-radius: 16px; text-align: center;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  background: #fff; border: 2.5px solid #F0F0F0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
}
.date-chip:hover { transform: translateY(-4px); border-color: var(--coral); }
.date-chip.selected {
  background: var(--coral); border-color: var(--coral);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255,107,107,0.35);
}
.date-chip.weekend:not(.selected) { border-color: var(--yellow); }
.dc-day { font-size: 9px; font-weight: 800; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; }
.dc-num { font-family: 'Fredoka One', cursive; font-size: 22px; color: var(--ink); line-height: 1.1; }
.dc-mon { font-size: 9px; font-weight: 700; color: var(--muted); }
.date-chip.selected .dc-day,
.date-chip.selected .dc-num,
.date-chip.selected .dc-mon { color: #fff; }
.date-chip.selected .dc-day,
.date-chip.selected .dc-mon { color: rgba(255,255,255,0.7); }
.today-dot {
  position: absolute; top: 6px; left: 50%; transform: translateX(-50%);
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--coral);
}
.date-chip.selected .today-dot { background: #fff; }

/* ── Slot cards ── */
.slots-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: 12px; margin-bottom: 28px; }
.slot-card {
  padding: 16px 14px; border-radius: 16px;
  border: 2.5px solid #F0F0F0; background: #fff;
  cursor: pointer; transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: relative;
}
.slot-card:hover:not(.booked) { transform: translateY(-4px); border-color: var(--teal); box-shadow: 0 8px 24px rgba(78,205,196,0.25); }
.slot-card.selected { background: var(--teal); border-color: var(--teal); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(78,205,196,0.4); }
.slot-card.booked { opacity: 0.4; cursor: not-allowed; }
.slot-emoji { font-size: 22px; display: block; margin-bottom: 6px; }
.slot-time { font-weight: 800; font-size: 13px; color: var(--ink); margin-bottom: 2px; }
.slot-label { font-size: 11px; color: var(--muted); font-weight: 600; }
.slot-card.selected .slot-time,
.slot-card.selected .slot-label { color: #fff; }
.booked-tag {
  position: absolute; top: -8px; right: -8px;
  background: #FF4757; color: #fff;
  font-size: 8px; font-weight: 800; padding: 3px 6px;
  border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;
}

/* ── Occasion pills ── */
.occasion-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 28px; }
.occ-card {
  padding: 16px 12px; border-radius: 16px;
  border: 2.5px solid #F0F0F0; background: #fff;
  text-align: center; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.occ-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
.occ-card.selected { border-color: var(--oc-color, var(--coral)); background: var(--oc-color, var(--coral)); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.occ-emoji { font-size: 24px; display: block; margin-bottom: 6px; }
.occ-label { font-size: 12px; font-weight: 800; color: var(--ink); }
.occ-card.selected .occ-label { color: #fff; }

/* ── Screen cards ── */
.screen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px,1fr)); gap: 16px; }
.screen-card {
  border-radius: var(--radius); overflow: hidden;
  border: 3px solid #F0F0F0; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  background: #fff;
}
.screen-card:hover { transform: translateY(-6px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); border-color: var(--lavender); }
.screen-card.selected { border-color: var(--lavender); transform: translateY(-4px); box-shadow: 0 12px 32px rgba(180,167,214,0.5); }
.sc-top {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 18px; position: relative;
}
.screen-card.selected .sc-top { background: linear-gradient(135deg, #B4A7D6 0%, #9B59B6 100%); }
.sc-emoji { font-size: 30px; display: block; margin-bottom: 8px; }
.sc-type { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.7); font-weight: 800; margin-bottom: 4px; }
.sc-name { font-family: 'Fredoka One', cursive; font-size: 18px; color: #fff; margin-bottom: 2px; }
.sc-cap { font-size: 11px; color: rgba(255,255,255,0.65); }
.sc-body { padding: 14px 16px; }
.sc-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
.sc-tag { font-size: 10px; font-weight: 700; background: #F8F4FF; color: var(--lavender); padding: 3px 8px; border-radius: 8px; }
.sc-price-row { display: flex; align-items: baseline; justify-content: space-between; }
.sc-price { font-family: 'Fredoka One', cursive; font-size: 22px; color: var(--ink); }
.sc-price-sub { font-size: 10px; color: var(--muted); }
.sc-pick {
  font-size: 11px; font-weight: 800; padding: 6px 14px;
  border-radius: 10px; border: 2px solid #E8E0FF;
  background: transparent; color: var(--lavender); cursor: pointer;
  font-family: 'Nunito', sans-serif; transition: all 0.15s;
}
.screen-card.selected .sc-pick { background: var(--lavender); color: #fff; border-color: var(--lavender); }

/* ── Add-on cards ── */
.cat-pills { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.cat-pill {
  padding: 8px 18px; border-radius: 50px;
  border: 2.5px solid #F0F0F0; background: #fff;
  font-size: 12px; font-weight: 800; cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.cat-pill:hover { transform: translateY(-2px); border-color: var(--yellow); }
.cat-pill.active { background: var(--yellow); border-color: var(--yellow); color: var(--ink); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255,217,61,0.4); }

.addon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px,1fr)); gap: 14px; }
.addon-card {
  background: #fff; border-radius: 18px;
  padding: 18px 16px; border: 2.5px solid #F0F0F0;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.addon-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(0,0,0,0.1); }
.addon-card.selected { border-color: var(--ac-color, var(--coral)); background: linear-gradient(145deg, #fff, rgba(var(--ac-rgb,255,107,107),0.04)); transform: translateY(-4px); box-shadow: 0 10px 28px rgba(var(--ac-rgb,255,107,107),0.2); }
.addon-best {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  background: var(--coral); color: #fff;
  font-size: 9px; font-weight: 800; padding: 4px 10px;
  border-radius: 10px; white-space: nowrap; letter-spacing: 0.5px;
}
.addon-emoji { font-size: 28px; display: block; margin-bottom: 8px; }
.addon-name { font-size: 13px; font-weight: 800; color: var(--ink); margin-bottom: 3px; line-height: 1.3; }
.addon-desc { font-size: 11px; color: var(--muted); margin-bottom: 12px; line-height: 1.4; font-weight: 500; }
.addon-footer { display: flex; align-items: center; justify-content: space-between; }
.addon-price { font-family: 'Fredoka One', cursive; font-size: 17px; color: var(--ink); }
.qty-row { display: flex; align-items: center; gap: 8px; }
.qty-btn {
  width: 26px; height: 26px; border-radius: 50%;
  border: 2px solid #E8E8E8; background: #fff;
  font-size: 16px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.15s; line-height: 1; color: var(--ink);
  font-family: 'Nunito', sans-serif; font-weight: 800;
}
.qty-btn:hover { border-color: var(--coral); background: var(--coral); color: #fff; transform: scale(1.1); }
.qty-num { font-size: 14px; font-weight: 800; min-width: 16px; text-align: center; }

/* ── Summary ── */
.summary-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
.summary-card { background: #fff; border-radius: var(--radius); border: 2.5px solid #F0F0F0; overflow: hidden; margin-bottom: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.sum-sec { padding: 16px 20px; border-bottom: 2px dashed #F0F0F0; }
.sum-sec:last-child { border-bottom: none; }
.sum-lbl { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 5px; }
.sum-val { font-family: 'Fredoka One', cursive; font-size: 17px; color: var(--ink); }
.sum-sub { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 600; }
.sum-addon-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dashed #F0F0F0; font-size: 13px; font-weight: 600; }
.sum-addon-row:last-child { border-bottom: none; }

.order-box {
  background: linear-gradient(145deg, #2D2D2D, #1A1A1A);
  border-radius: var(--radius); padding: 24px 22px;
  position: sticky; top: 80px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
.order-box-title { font-family: 'Fredoka One', cursive; font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 16px; }
.order-line { display: flex; justify-content: space-between; font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; font-weight: 600; }
.order-line.main { color: #fff; font-size: 14px; }
.order-hr { border: none; border-top: 1px dashed rgba(255,255,255,0.15); margin: 14px 0; }
.order-total { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
.order-total-lbl { font-size: 11px; color: rgba(255,255,255,0.35); letter-spacing: 1px; text-transform: uppercase; font-weight: 700; }
.order-total-amt { font-family: 'Fredoka One', cursive; font-size: 32px; color: var(--yellow); }

/* ── Fields ── */
.field-group { margin-bottom: 14px; }
.field-lbl { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }
.field-input { width: 100%; padding: 11px 14px; border: 2.5px solid #F0F0F0; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink); background: var(--bg); outline: none; transition: border-color 0.2s; }
.field-input:focus { border-color: var(--coral); }

/* ── Buttons ── */
.btn-primary {
  width: 100%; padding: 15px 24px;
  background: linear-gradient(135deg, var(--coral), #FF8E53);
  color: #fff; border: none; border-radius: 16px;
  font-family: 'Fredoka One', cursive; font-size: 18px;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 6px 20px rgba(255,107,107,0.4);
  letter-spacing: 0.5px;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(255,107,107,0.5); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

.nav-row { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 2px dashed #E8E8E8; }
.btn-back {
  padding: 12px 24px; background: #fff; color: var(--muted);
  border: 2.5px solid #E8E8E8; border-radius: 14px;
  font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
  cursor: pointer; transition: all 0.15s;
}
.btn-back:hover { border-color: var(--muted); color: var(--ink); }
.btn-next {
  padding: 12px 28px; background: var(--ink); color: var(--yellow);
  border: none; border-radius: 14px;
  font-family: 'Fredoka One', cursive; font-size: 16px;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(0,0,0,0.2);
}
.btn-next:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.25); }
.btn-next:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

/* ── Sticky footer ── */
.sticky-foot {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(255,249,240,0.95); backdrop-filter: blur(10px);
  border-top: 2px solid rgba(255,107,107,0.12);
  padding: 14px 24px;
  display: flex; align-items: center; justify-content: space-between;
  z-index: 50;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
}
.foot-total-lbl { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); }
.foot-total-amt { font-family: 'Fredoka One', cursive; font-size: 24px; color: var(--ink); }

/* ── Confirmation ── */
.confetti-wrap { text-align: center; padding: 52px 20px; position: relative; }
.conf-burst { font-size: 60px; display: block; margin-bottom: 16px; animation: burst 0.6s cubic-bezier(0.34,1.56,0.64,1); }
@keyframes burst { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
.conf-title { font-family: 'Fredoka One', cursive; font-size: 42px; color: var(--ink); margin-bottom: 6px; }
.conf-sub { font-size: 16px; color: var(--muted); font-weight: 600; margin-bottom: 28px; }
.conf-ref {
  display: inline-block;
  background: var(--ink); color: var(--yellow);
  font-family: 'Fredoka One', cursive; font-size: 22px;
  letter-spacing: 4px; padding: 14px 32px; border-radius: 16px;
  margin-bottom: 28px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.conf-details {
  background: #fff; border-radius: var(--radius);
  border: 2.5px solid #F0F0F0;
  padding: 22px; max-width: 380px; margin: 0 auto 28px;
  text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.cd-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 2px dashed #F5F5F5; font-size: 14px; }
.cd-row:last-child { border-bottom: none; }
.cd-key { color: var(--muted); font-weight: 600; }
.cd-val { font-weight: 800; color: var(--ink); }

/* ── Floating emoji decorations ── */
.float-emoji {
  position: fixed; font-size: 24px; pointer-events: none;
  animation: floatUp 6s ease-in-out infinite;
  opacity: 0.6; z-index: 0;
}
@keyframes floatUp {
  0%   { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50%  { transform: translateY(-20px) rotate(10deg); opacity: 0.9; }
  100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
}

@media (max-width: 640px) {
  .summary-layout { grid-template-columns: 1fr; }
  .wiz-header { padding: 12px 16px; }
  .step-pills { display: none; }
  .occasion-grid { grid-template-columns: repeat(2,1fr); }
  .step-title { font-size: 26px; }
  .theatre-grid { grid-template-columns: 1fr 1fr; }
}
`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingWizard() {
  const [step,       setStep]       = useState(0);
  const [area,       setArea]       = useState(null);
  const [theatre,    setTheatre]    = useState(null);
  const [dateIdx,    setDateIdx]    = useState(0);
  const [slot,       setSlot]       = useState(null);
  const [occasion,   setOccasion]   = useState(null);
  const [screen,     setScreen]     = useState(null);
  const [addonQty,   setAddonQty]   = useState({});
  const [addonCat,   setAddonCat]   = useState("all");
  const [guests,     setGuests]     = useState(2);
  const [notes,      setNotes]      = useState("");
  const [bookingRef] = useState("PS" + Math.random().toString(36).substr(2,7).toUpperCase());
  const [animate,    setAnimate]    = useState(true);

  const dates        = getDates();
  const theatreList  = area    ? (THEATRES[area.id] || []) : [];
  const screenList   = theatre ? getScreens(theatre.id)    : [];
  const selAddons    = ADDONS.filter(a => (addonQty[a.id]||0) > 0);
  const addonTotal   = selAddons.reduce((s,a) => s + a.price*(addonQty[a.id]||0), 0);
  const grandTotal   = (screen?.price||0) + addonTotal;
  const filtAddons   = addonCat === "all" ? ADDONS : ADDONS.filter(a => a.cat === addonCat);

  const STEPS = ["Area","Theatre","Date & Time","Screen","Add-ons","Summary"];
  const canNext = [!!area, !!theatre, !!(slot&&occasion), !!screen, true, true];

  function goNext() {
    if (step < STEPS.length-1 && canNext[step]) { setAnimate(false); setTimeout(()=>{ setStep(s=>s+1); setAnimate(true); window.scrollTo({top:0}); },50); }
    else if (step === STEPS.length-1)            { setStep(6); window.scrollTo({top:0}); }
  }
  function goBack() { if(step>0){ setAnimate(false); setTimeout(()=>{ setStep(s=>s-1); setAnimate(true); },50); } }
  function setQty(id, delta) { setAddonQty(p => ({...p,[id]:Math.max(0,(p[id]||0)+delta)})); }

  const stepEmojis = ["📍","🏛️","📅","📺","🎁","✅"];
  const stepTitles = ["Where are you?","Pick a theatre","Date & time","Your screen","Make it special","Almost there!"];
  const stepSubs   = [
    "Choose your neighbourhood",
    `${theatreList.length} private theatres in ${area?.name||"your area"}`,
    `${theatre?.name||"Your theatre"} · All sessions are 3 hours`,
    `${screenList.length} screens at ${theatre?.name||"this theatre"} · ${dates[dateIdx]?.full||""}`,
    "Cakes 🎂 · Decor 🎈 · Food 🍿 · Drinks 🥂",
    "Review your booking before payment",
  ];

  return (
    <>
      <style>{css}</style>
      <div className="wiz-bg">

        {/* Floating background emojis */}
        {["🎬","🎂","🎈","⭐","🎉"].map((e,i) => (
          <div key={i} className="float-emoji" style={{
            left:`${10+i*18}%`, top:`${20+i*12}%`,
            animationDelay:`${i*1.2}s`, animationDuration:`${5+i}s`,
          }}>{e}</div>
        ))}

        {/* Header */}
        <header className="wiz-header">
          <div className="logo">🎬 PrivateScreen</div>
          {step < 6 && (
            <div className="step-pills">
              {STEPS.map((_, i) => (
                <>
                  <div
                    key={i}
                    className={`step-pill ${i<step?"done":i===step?"active":"future"}`}
                    onClick={() => i<step && setStep(i)}
                    title={STEPS[i]}
                  >
                    {i < step ? "✓" : i+1}
                  </div>
                  {i < STEPS.length-1 && <div key={`c${i}`} className={`step-connector ${i<step?"done":""}`}/>}
                </>
              ))}
            </div>
          )}
        </header>

        <div className="wiz-body">

          {/* Step header */}
          {step < 6 && (
            <div className="step-head">
              <span className="step-emoji">{stepEmojis[step]}</span>
              <div className="step-title">{stepTitles[step]}</div>
              <div className="step-sub">{stepSubs[step]}</div>
            </div>
          )}

          {/* ── Step 0: Area ── */}
          {step===0 && (
            <>
              <div className="area-wrap">
                {AREAS.map(a=>(
                  <div key={a.id} className={`area-chip ${area?.id===a.id?"selected":""}`} onClick={()=>setArea(a)}>
                    <span>{a.emoji}</span>
                    <span>{a.name}</span>
                    <span className="area-chip-count">{a.count} theatres</span>
                  </div>
                ))}
              </div>
              <div className="nav-row"><div/><button className="btn-next" onClick={goNext} disabled={!canNext[0]}>Next →</button></div>
            </>
          )}

          {/* ── Step 1: Theatre ── */}
          {step===1 && (
            <>
              <div className="theatre-grid">
                {theatreList.map(th=>(
                  <div
                    key={th.id}
                    className={`theatre-card ${theatre?.id===th.id?"selected":""}`}
                    style={{"--tc-color":th.color}}
                    onClick={()=>{setTheatre(th);setScreen(null);}}
                  >
                    {theatre?.id===th.id && <div className="tc-check">✓</div>}
                    <span className="tc-emoji">{th.emoji}</span>
                    <div className="tc-name">{th.name}</div>
                    <div className="tc-address">{th.address}</div>
                    <div className="tc-meta">
                      <span className="tc-rating">⭐ {th.rating}</span>
                      <span className="tc-screens">{th.screens} screens</span>
                      {th.dining && <span className="tc-dining">🍽️ Dining</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="nav-row"><button className="btn-back" onClick={goBack}>← Back</button><button className="btn-next" onClick={goNext} disabled={!canNext[1]}>Next →</button></div>
            </>
          )}

          {/* ── Step 2: Date & Slot ── */}
          {step===2 && (
            <>
              {/* Date strip */}
              <div className="date-strip">
                {dates.map((d,i)=>(
                  <div key={i} className={`date-chip ${dateIdx===i?"selected":""} ${d.isWeekend&&dateIdx!==i?"weekend":""}`} onClick={()=>{setDateIdx(i);setSlot(null);}}>
                    {d.isToday && <div className="today-dot"/>}
                    <div className="dc-day">{d.isToday?"Today":d.day}</div>
                    <div className="dc-num">{d.date}</div>
                    <div className="dc-mon">{d.month}</div>
                  </div>
                ))}
              </div>

              <div style={{fontSize:13,fontWeight:800,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Pick a time slot</div>
              <div className="slots-grid">
                {TIME_SLOTS.map(ts=>(
                  <div key={ts.id} className={`slot-card ${!ts.available?"booked":""} ${slot?.id===ts.id?"selected":""}`} onClick={()=>ts.available&&setSlot(ts)}>
                    {!ts.available && <span className="booked-tag">Full</span>}
                    <span className="slot-emoji">{ts.emoji}</span>
                    <div className="slot-time">{ts.time}</div>
                    <div className="slot-label">{ts.label}</div>
                  </div>
                ))}
              </div>

              <div style={{fontSize:13,fontWeight:800,color:"var(--muted)",letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>What's the occasion? 🎉</div>
              <div className="occasion-grid">
                {OCCASIONS.map(occ=>(
                  <div key={occ.id} className={`occ-card ${occasion?.id===occ.id?"selected":""}`} style={{"--oc-color":occ.color}} onClick={()=>setOccasion(occ)}>
                    <span className="occ-emoji">{occ.emoji}</span>
                    <div className="occ-label">{occ.label}</div>
                  </div>
                ))}
              </div>
              <div className="nav-row"><button className="btn-back" onClick={goBack}>← Back</button><button className="btn-next" onClick={goNext} disabled={!canNext[2]}>Next →</button></div>
            </>
          )}

          {/* ── Step 3: Screen ── */}
          {step===3 && (
            <>
              <div className="screen-grid">
                {screenList.map(sc=>(
                  <div key={sc.id} className={`screen-card ${screen?.id===sc.id?"selected":""}`} onClick={()=>setScreen(sc)}>
                    <div className="sc-top">
                      <span className="sc-emoji">{sc.emoji}</span>
                      <div className="sc-type">{sc.type.toUpperCase()}</div>
                      <div className="sc-name">{sc.name}</div>
                      <div className="sc-cap">Up to {sc.cap} guests</div>
                    </div>
                    <div className="sc-body">
                      <div className="sc-tags">{sc.amenities.map(a=><span key={a} className="sc-tag">{a}</span>)}</div>
                      <div className="sc-price-row">
                        <div>
                          <div className="sc-price">₹{sc.price.toLocaleString("en-IN")}</div>
                          <div className="sc-price-sub">per 3 hr session</div>
                        </div>
                        <button className="sc-pick">{screen?.id===sc.id?"Picked! ✓":"Pick"}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nav-row"><button className="btn-back" onClick={goBack}>← Back</button><button className="btn-next" onClick={goNext} disabled={!canNext[3]}>Next →</button></div>
            </>
          )}

          {/* ── Step 4: Add-ons ── */}
          {step===4 && (
            <>
              <div className="cat-pills">
                {[{id:"all",label:"🎊 All"},{id:"cake",label:"🎂 Cakes"},{id:"decor",label:"🎈 Decor"},{id:"food",label:"🍿 Food"},{id:"drinks",label:"🥂 Drinks"},{id:"bundle",label:"❤️ Bundles"}].map(c=>(
                  <div key={c.id} className={`cat-pill ${addonCat===c.id?"active":""}`} onClick={()=>setAddonCat(c.id)}>{c.label}</div>
                ))}
              </div>
              <div className="addon-grid">
                {filtAddons.map(addon=>(
                  <div
                    key={addon.id}
                    className={`addon-card ${(addonQty[addon.id]||0)>0?"selected":""}`}
                    style={{"--ac-color":addon.color,"--ac-rgb":addon.color.replace("#","").match(/.{2}/g)?.map(h=>parseInt(h,16)).join(",")}}
                  >
                    {addon.badge && <div className="addon-best">{addon.badge}</div>}
                    <span className="addon-emoji">{addon.emoji}</span>
                    <div className="addon-name">{addon.name}</div>
                    <div className="addon-desc">{addon.desc}</div>
                    <div className="addon-footer">
                      <div className="addon-price">₹{addon.price.toLocaleString("en-IN")}</div>
                      <div className="qty-row">
                        <button className="qty-btn" onClick={()=>setQty(addon.id,-1)}>−</button>
                        <span className="qty-num">{addonQty[addon.id]||0}</span>
                        <button className="qty-btn" onClick={()=>setQty(addon.id,+1)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nav-row"><button className="btn-back" onClick={goBack}>← Back</button><button className="btn-next" onClick={goNext}>Next →</button></div>
            </>
          )}

          {/* ── Step 5: Summary ── */}
          {step===5 && (
            <>
              <div className="summary-layout">
                <div>
                  <div className="summary-card">
                    <div className="sum-sec"><div className="sum-lbl">Theatre</div><div className="sum-val">{theatre?.name}</div><div className="sum-sub">{theatre?.address} · {area?.name}</div></div>
                    <div className="sum-sec"><div className="sum-lbl">Date & Time</div><div className="sum-val">{dates[dateIdx]?.full}</div><div className="sum-sub">{slot?.time} · 3 hours · {slot?.label}</div></div>
                    <div className="sum-sec"><div className="sum-lbl">Screen</div><div className="sum-val">{screen?.name}</div><div className="sum-sub">Up to {screen?.cap} guests · {screen?.type}</div></div>
                    <div className="sum-sec"><div className="sum-lbl">Occasion</div><div className="sum-val">{occasion?.emoji} {occasion?.label}</div></div>
                  </div>
                  {selAddons.length>0 && (
                    <div className="summary-card">
                      <div className="sum-sec">
                        <div className="sum-lbl">🎁 Add-ons</div>
                        {selAddons.map(a=>(
                          <div key={a.id} className="sum-addon-row">
                            <span>{a.emoji} {a.name} ×{addonQty[a.id]}</span>
                            <span style={{color:"var(--muted)"}}>₹{(a.price*addonQty[a.id]).toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="summary-card">
                    <div className="sum-sec">
                      <div className="sum-lbl">Guest details</div>
                      <div className="field-group" style={{marginBottom:12}}>
                        <label className="field-lbl">Number of guests</label>
                        <input className="field-input" type="number" min={1} max={screen?.cap} value={guests} onChange={e=>setGuests(Number(e.target.value))}/>
                      </div>
                      <div className="field-group" style={{marginBottom:0}}>
                        <label className="field-lbl">Special notes</label>
                        <input className="field-input" placeholder="e.g. Veg food only, surprise entry…" value={notes} onChange={e=>setNotes(e.target.value)}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order box */}
                <div className="order-box">
                  <div className="order-box-title">Your Order 🧾</div>
                  <div className="order-line main"><span>{screen?.name}</span><span>₹{(screen?.price||0).toLocaleString("en-IN")}</span></div>
                  {selAddons.map(a=>(
                    <div key={a.id} className="order-line"><span>{a.emoji} {a.name} ×{addonQty[a.id]}</span><span>₹{(a.price*addonQty[a.id]).toLocaleString("en-IN")}</span></div>
                  ))}
                  <hr className="order-hr"/>
                  <div className="order-total">
                    <span className="order-total-lbl">Total</span>
                    <span className="order-total-amt">₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button className="btn-primary" onClick={goNext}>🎉 Confirm & Pay</button>
                  <p style={{fontSize:11,color:"rgba(255,255,255,0.25)",textAlign:"center",marginTop:10,fontWeight:600}}>Secured by Razorpay</p>
                </div>
              </div>
              <div className="nav-row"><button className="btn-back" onClick={goBack}>← Back</button></div>
            </>
          )}

          {/* ── Confirmation ── */}
          {step===6 && (
            <div className="confetti-wrap">
              <span className="conf-burst">🎊</span>
              <div className="conf-title">You're booked!</div>
              <p className="conf-sub">Your private theatre experience is all set 🍿</p>
              <div className="conf-ref">{bookingRef}</div>
              <div className="conf-details">
                <div className="cd-row"><span className="cd-key">🏛️ Theatre</span><span className="cd-val">{theatre?.name}</span></div>
                <div className="cd-row"><span className="cd-key">📍 Area</span><span className="cd-val">{area?.name}</span></div>
                <div className="cd-row"><span className="cd-key">📅 Date</span><span className="cd-val">{dates[dateIdx]?.full}</span></div>
                <div className="cd-row"><span className="cd-key">🕐 Time</span><span className="cd-val">{slot?.time} (3 hrs)</span></div>
                <div className="cd-row"><span className="cd-key">📺 Screen</span><span className="cd-val">{screen?.name}</span></div>
                <div className="cd-row"><span className="cd-key">👥 Guests</span><span className="cd-val">{guests}</span></div>
                <div className="cd-row"><span className="cd-key">💰 Paid</span><span className="cd-val" style={{color:"#2ECC71"}}>₹{grandTotal.toLocaleString("en-IN")}</span></div>
              </div>
              <p style={{fontSize:14,color:"var(--muted)",marginBottom:24,fontWeight:600}}>Confirmation sent to your email & phone 📱</p>
              <button
                className="btn-primary"
                style={{maxWidth:260,margin:"0 auto",display:"block"}}
                onClick={()=>{setStep(0);setArea(null);setTheatre(null);setScreen(null);setSlot(null);setAddonQty({});setOccasion(null);}}
              >
                🎬 Book Another!
              </button>
            </div>
          )}
        </div>

        {/* Sticky total footer (steps 3 & 4) */}
        {step>=3 && step<=4 && (
          <div className="sticky-foot">
            <div>
              <div className="foot-total-lbl">Running total</div>
              <div className="foot-total-amt">₹{grandTotal.toLocaleString("en-IN")}</div>
            </div>
            <button className="btn-next" onClick={goNext} disabled={!canNext[step]} style={{width:"auto"}}>
              {step===4?"Review Order 🧾":"Next →"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}