import { useState } from "react";
// src/app/page.tsx
import dynamic from "next/dynamic";
// ── Mock Data ──────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Today's Bookings", value: "24",    delta: "+3 vs yesterday",  up: true,  icon: "🎬" },
  { label: "Revenue Today",    value: "₹68,400", delta: "+12% vs yesterday",up: true,  icon: "₹"  },
  { label: "Screens Active",   value: "31",    delta: "2 under maintenance",up: false, icon: "📺" },
  { label: "Avg Booking Value",value: "₹2,850", delta: "+₹220 this week",  up: true,  icon: "📈" },
];

const BOOKINGS = [
  { id: "PS7X2KA", customer: "Priya Reddy",   phone: "98765 43210", theatre: "Party Flix",      area: "Miyapur",      screen: "Screen 2 — Luxe",  date: "25 Mar 2026", time: "07:00 PM", occasion: "Birthday",    guests: 10, amount: 3298, status: "confirmed", paid: true  },
  { id: "PS8M3LB", customer: "Arjun Sharma",  phone: "91234 56789", theatre: "Luxe Frames",     area: "Jubilee Hills",screen: "Emerald",          date: "25 Mar 2026", time: "04:00 PM", occasion: "Anniversary", guests: 2,  amount: 4298, status: "confirmed", paid: true  },
  { id: "PS4N9QC", customer: "Sana Khan",     phone: "87654 32109", theatre: "The Frame Studio",area: "Madhapur",     screen: "Screen 1",         date: "25 Mar 2026", time: "10:00 AM", occasion: "OTT Movie",   guests: 6,  amount: 1799, status: "confirmed", paid: true  },
  { id: "PS2R5TD", customer: "Rahul Verma",   phone: "99887 76655", theatre: "Starlight Hall",  area: "Kukatpally",   screen: "Screen 3 — Grand", date: "25 Mar 2026", time: "10:00 PM", occasion: "Birthday",    guests: 18, amount: 4997, status: "pending",   paid: false },
  { id: "PS6W1UE", customer: "Divya Nair",    phone: "93456 12345", theatre: "Skybox Screens",  area: "Gachibowli",   screen: "Screen 2 — Luxe",  date: "26 Mar 2026", time: "01:00 PM", occasion: "Corporate",   guests: 12, amount: 2799, status: "confirmed", paid: true  },
  { id: "PS9K7VF", customer: "Kiran Rao",     phone: "90000 11223", theatre: "Party Flix",      area: "Miyapur",      screen: "Screen 5 — Luxe",  date: "26 Mar 2026", time: "07:00 PM", occasion: "Anniversary", guests: 4,  amount: 3398, status: "cancelled",  paid: false },
  { id: "PS3J4WG", customer: "Meena Pillai",  phone: "88776 55443", theatre: "Velvet Room",     area: "Jubilee Hills",screen: "Screen 1 — Mini",  date: "26 Mar 2026", time: "10:00 AM", occasion: "Birthday",    guests: 5,  amount: 1998, status: "confirmed", paid: true  },
  { id: "PS5H8XH", customer: "Suresh Babu",   phone: "97531 86420", theatre: "Pixel Lounge",    area: "Madhapur",     screen: "Screen 2",         date: "27 Mar 2026", time: "04:00 PM", occasion: "Live Cricket",guests: 14, amount: 2499, status: "confirmed", paid: true  },
];

const THEATRES = [
  { id: "th1",  name: "Party Flix",        area: "Miyapur",       screens: 5, activeBookings: 8,  revenue: 18400, status: "active",      hasRestaurant: true  },
  { id: "th4",  name: "Luxe Frames",       area: "Jubilee Hills", screens: 6, activeBookings: 11, revenue: 31200, status: "active",      hasRestaurant: true  },
  { id: "th13", name: "The Frame Studio",  area: "Madhapur",      screens: 6, activeBookings: 9,  revenue: 27600, status: "active",      hasRestaurant: true  },
  { id: "th11", name: "Starlight Hall",    area: "Kukatpally",    screens: 5, activeBookings: 6,  revenue: 14800, status: "active",      hasRestaurant: true  },
  { id: "th9",  name: "Skybox Screens",    area: "Gachibowli",    screens: 3, activeBookings: 4,  revenue: 9600,  status: "active",      hasRestaurant: true  },
  { id: "th7",  name: "Velvet Room",       area: "Jubilee Hills", screens: 2, activeBookings: 3,  revenue: 5200,  status: "active",      hasRestaurant: false },
  { id: "th2",  name: "Cineplex Privé",    area: "Miyapur",       screens: 3, activeBookings: 0,  revenue: 0,     status: "maintenance", hasRestaurant: false },
  { id: "th14", name: "Pixel Lounge",      area: "Madhapur",      screens: 4, activeBookings: 5,  revenue: 11800, status: "active",      hasRestaurant: true  },
];

const SCREENS_DATA = [
  { id: "sc1",  theatre: "Party Flix",       name: "Screen 1 — Mini",  type: "mini",  capacity: 8,  price: 1299, status: "available",   bookingsToday: 3 },
  { id: "sc2",  theatre: "Party Flix",       name: "Screen 2 — Luxe",  type: "luxe",  capacity: 15, price: 2199, status: "booked",      bookingsToday: 4 },
  { id: "sc3",  theatre: "Party Flix",       name: "Screen 3 — Grand", type: "grand", capacity: 25, price: 3499, status: "available",   bookingsToday: 2 },
  { id: "sc4",  theatre: "Party Flix",       name: "Screen 4 — Mini",  type: "mini",  capacity: 10, price: 1399, status: "available",   bookingsToday: 3 },
  { id: "sc5",  theatre: "Party Flix",       name: "Screen 5 — Luxe",  type: "luxe",  capacity: 12, price: 2499, status: "maintenance", bookingsToday: 0 },
  { id: "sc13", theatre: "Luxe Frames",      name: "Sapphire",         type: "mini",  capacity: 8,  price: 1799, status: "booked",      bookingsToday: 5 },
  { id: "sc14", theatre: "Luxe Frames",      name: "Emerald",          type: "luxe",  capacity: 14, price: 2999, status: "available",   bookingsToday: 4 },
  { id: "sc15", theatre: "Luxe Frames",      name: "Ruby",             type: "grand", capacity: 28, price: 4999, status: "booked",      bookingsToday: 3 },
  { id: "sc16", theatre: "Luxe Frames",      name: "Diamond",          type: "ultra", capacity: 6,  price: 7999, status: "available",   bookingsToday: 2 },
];

const REVENUE_CHART = [
  { day: "Mon", amount: 42000 },
  { day: "Tue", amount: 58000 },
  { day: "Wed", amount: 51000 },
  { day: "Thu", amount: 73000 },
  { day: "Fri", amount: 89000 },
  { day: "Sat", amount: 112000 },
  { day: "Sun", amount: 98000 },
];

// ── Styles ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0A0A0F;
    --bg2:     #111118;
    --bg3:     #18181F;
    --bg4:     #1E1E28;
    --border:  rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text:    #E8E6F0;
    --muted:   #6B6880;
    --muted2:  #9994AA;
    --accent:  #7B5CF5;
    --accent2: #9D7FF7;
    --green:   #22C97A;
    --red:     #F05252;
    --amber:   #F5A623;
    --gold:    #C9A84C;
    --radius:  10px;
    --font:    'Syne', sans-serif;
    --mono:    'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font); }

  /* ── Layout ── */
  .admin-wrap { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px; flex-shrink: 0;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
    overflow-y: auto;
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    font-size: 13px; font-weight: 700; letter-spacing: 3px;
    text-transform: uppercase; color: var(--accent2);
  }
  .logo-sub { font-size: 10px; color: var(--muted); letter-spacing: 1px; margin-top: 2px; font-family: var(--mono); }

  .nav-section { padding: 16px 12px 8px; }
  .nav-label { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px;
    font-size: 13px; color: var(--muted2); cursor: pointer;
    transition: all 0.15s; margin-bottom: 2px;
    font-weight: 500;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(123,92,245,0.15); color: var(--accent2); }
  .nav-icon { font-size: 15px; width: 20px; text-align: center; }
  .nav-badge { margin-left: auto; background: var(--accent); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 10px; font-family: var(--mono); }

  .sidebar-footer {
    margin-top: auto; padding: 16px 20px;
    border-top: 1px solid var(--border);
  }
  .admin-user { display: flex; align-items: center; gap: 10px; }
  .avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0; }
  .admin-name { font-size: 12px; font-weight: 500; color: var(--text); }
  .admin-role { font-size: 10px; color: var(--muted); font-family: var(--mono); }

  /* ── Main ── */
  .main { flex: 1; overflow: hidden; }

  .topbar {
    background: var(--bg2); border-bottom: 1px solid var(--border);
    padding: 0 28px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }
  .page-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }
  .topbar-btn {
    padding: 7px 14px; border-radius: 8px;
    border: 1px solid var(--border2); background: transparent;
    color: var(--muted2); font-family: var(--font); font-size: 12px;
    cursor: pointer; transition: all 0.15s; font-weight: 500;
  }
  .topbar-btn:hover { border-color: var(--accent); color: var(--accent2); }
  .topbar-btn.primary { background: var(--accent); border-color: var(--accent); color: #fff; }
  .topbar-btn.primary:hover { background: var(--accent2); }

  /* ── Content ── */
  .content { padding: 24px 28px; }

  /* ── Stats grid ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 24px; }
  .stat-card {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }
  .stat-icon { font-size: 18px; margin-bottom: 12px; display: block; }
  .stat-value { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 4px; font-family: var(--mono); }
  .stat-label { font-size: 11px; color: var(--muted); letter-spacing: 0.5px; margin-bottom: 8px; text-transform: uppercase; }
  .stat-delta { font-size: 11px; font-family: var(--mono); }
  .stat-delta.up   { color: var(--green); }
  .stat-delta.down { color: var(--muted); }

  /* ── Two-col layout ── */
  .two-col { display: grid; grid-template-columns: 1fr 340px; gap: 16px; margin-bottom: 16px; }
  .three-col { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 16px; }

  /* ── Panel ── */
  .panel {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  .panel-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .panel-title { font-size: 13px; font-weight: 600; color: var(--text); }
  .panel-action { font-size: 11px; color: var(--accent2); cursor: pointer; font-family: var(--mono); }
  .panel-action:hover { text-decoration: underline; }

  /* ── Revenue chart ── */
  .chart-wrap { padding: 20px; }
  .chart-bars { display: flex; align-items: flex-end; gap: 10px; height: 120px; }
  .chart-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .chart-bar {
    width: 100%; border-radius: 4px 4px 0 0;
    background: rgba(123,92,245,0.25);
    border-top: 2px solid var(--accent);
    transition: background 0.2s;
    cursor: pointer; position: relative;
  }
  .chart-bar:hover { background: rgba(123,92,245,0.45); }
  .chart-bar.today { background: rgba(123,92,245,0.5); border-top-color: var(--accent2); }
  .chart-bar-label { font-size: 10px; color: var(--muted); font-family: var(--mono); }
  .chart-bar-val { font-size: 9px; color: var(--muted2); font-family: var(--mono); position: absolute; top: -18px; left: 50%; transform: translateX(-50%); white-space: nowrap; }

  /* ── Occupancy mini ── */
  .occ-list { padding: 0 20px 16px; }
  .occ-row { padding: 10px 0; border-bottom: 1px solid var(--border); }
  .occ-row:last-child { border-bottom: none; }
  .occ-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .occ-name { font-size: 12px; color: var(--text); font-weight: 500; }
  .occ-pct { font-size: 11px; color: var(--muted2); font-family: var(--mono); }
  .occ-bar-bg { height: 4px; background: var(--bg4); border-radius: 2px; }
  .occ-bar-fill { height: 4px; border-radius: 2px; background: var(--accent); transition: width 0.4s; }
  .occ-bar-fill.high { background: var(--green); }
  .occ-bar-fill.low  { background: var(--amber); }

  /* ── Bookings table ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  thead tr { border-bottom: 1px solid var(--border); }
  th { padding: 10px 16px; text-align: left; font-size: 10px; font-weight: 600; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; cursor: pointer; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--bg4); }
  td { padding: 12px 16px; color: var(--text); vertical-align: middle; white-space: nowrap; }
  .td-id { font-family: var(--mono); font-size: 11px; color: var(--accent2); }
  .td-muted { color: var(--muted2); font-size: 11px; }
  .td-amount { font-family: var(--mono); font-weight: 500; }

  /* ── Status badges ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 5px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--mono); }
  .badge::before { content: ''; width: 5px; height: 5px; border-radius: 50%; }
  .badge.confirmed { background: rgba(34,201,122,0.1);  color: var(--green); border: 1px solid rgba(34,201,122,0.2); }
  .badge.confirmed::before { background: var(--green); }
  .badge.pending   { background: rgba(245,166,35,0.1);  color: var(--amber); border: 1px solid rgba(245,166,35,0.2); }
  .badge.pending::before   { background: var(--amber); }
  .badge.cancelled { background: rgba(240,82,82,0.1);   color: var(--red);   border: 1px solid rgba(240,82,82,0.2); }
  .badge.cancelled::before { background: var(--red); }
  .badge.active      { background: rgba(34,201,122,0.1);  color: var(--green); border: 1px solid rgba(34,201,122,0.2); }
  .badge.active::before    { background: var(--green); }
  .badge.maintenance { background: rgba(245,166,35,0.1);  color: var(--amber); border: 1px solid rgba(245,166,35,0.2); }
  .badge.maintenance::before { background: var(--amber); }
  .badge.available { background: rgba(34,201,122,0.08); color: var(--green); border: 1px solid rgba(34,201,122,0.15); }
  .badge.available::before { background: var(--green); }
  .badge.booked    { background: rgba(123,92,245,0.1);  color: var(--accent2); border: 1px solid rgba(123,92,245,0.2); }
  .badge.booked::before    { background: var(--accent); }

  /* ── Theatre cards ── */
  .theatre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px,1fr)); gap: 14px; padding: 16px; }
  .th-card {
    background: var(--bg4); border: 1px solid var(--border);
    border-radius: 8px; padding: 16px;
    transition: border-color 0.2s; cursor: pointer;
  }
  .th-card:hover { border-color: var(--border2); }
  .th-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .th-card-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .th-card-area { font-size: 11px; color: var(--muted); font-family: var(--mono); }
  .th-card-stats { display: flex; gap: 16px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border); }
  .th-stat-item { }
  .th-stat-val { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--mono); }
  .th-stat-label { font-size: 9px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .th-revenue { font-size: 13px; font-weight: 600; color: var(--green); font-family: var(--mono); }

  /* ── Screen grid ── */
  .screen-list { padding: 0 16px 16px; display: grid; grid-template-columns: repeat(auto-fill, minmax(210px,1fr)); gap: 10px; }
  .sc-card {
    background: var(--bg4); border: 1px solid var(--border);
    border-radius: 8px; padding: 14px;
    transition: border-color 0.15s; cursor: pointer;
  }
  .sc-card:hover { border-color: var(--border2); }
  .sc-card-name { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 3px; }
  .sc-card-theatre { font-size: 10px; color: var(--muted); font-family: var(--mono); margin-bottom: 10px; }
  .sc-card-row { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .sc-card-price { font-family: var(--mono); font-size: 13px; color: var(--text); font-weight: 500; }
  .sc-bookings { font-size: 10px; color: var(--muted2); font-family: var(--mono); }
  .type-tag { display: inline-block; font-size: 9px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent2); background: rgba(123,92,245,0.1); padding: 2px 7px; border-radius: 4px; margin-bottom: 8px; }

  /* ── Search / filter bar ── */
  .filter-bar { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border); }
  .search-input {
    flex: 1; padding: 8px 12px; background: var(--bg4); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: var(--font); font-size: 12px; outline: none;
    transition: border-color 0.2s;
  }
  .search-input::placeholder { color: var(--muted); }
  .search-input:focus { border-color: var(--accent); }
  .filter-select {
    padding: 8px 12px; background: var(--bg4); border: 1px solid var(--border);
    border-radius: 8px; color: var(--muted2); font-family: var(--font); font-size: 12px;
    outline: none; cursor: pointer;
  }
  .filter-select:focus { border-color: var(--accent); }

  /* ── Action row ── */
  .action-row { display: flex; gap: 6px; }
  .icon-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted2); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .icon-btn:hover { border-color: var(--accent); color: var(--accent2); }

  /* ── Quick actions ── */
  .quick-actions { display: grid; grid-template-columns: repeat(2,1fr); gap: 10px; padding: 16px; }
  .qa-btn {
    padding: 14px 16px; background: var(--bg4); border: 1px solid var(--border);
    border-radius: 8px; cursor: pointer; transition: all 0.2s; text-align: left;
  }
  .qa-btn:hover { border-color: var(--accent); background: rgba(123,92,245,0.08); }
  .qa-icon { font-size: 20px; margin-bottom: 8px; display: block; }
  .qa-label { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .qa-desc { font-size: 10px; color: var(--muted); line-height: 1.4; }

  /* ── Modal overlay ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 14px; width: 100%; max-width: 520px;
    max-height: 80vh; overflow-y: auto;
  }
  .modal-header {
    padding: 20px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-size: 16px; font-weight: 600; color: var(--text); }
  .modal-close { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: transparent; color: var(--muted2); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .modal-close:hover { border-color: var(--red); color: var(--red); }
  .modal-body { padding: 20px 24px; }
  .modal-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .modal-row:last-child { border-bottom: none; }
  .modal-key { color: var(--muted2); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
  .modal-val { color: var(--text); font-weight: 500; }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .modal-btn { padding: 9px 18px; border-radius: 8px; border: 1px solid var(--border2); background: transparent; color: var(--muted2); font-family: var(--font); font-size: 12px; cursor: pointer; transition: all 0.15s; font-weight: 500; }
  .modal-btn:hover { border-color: var(--accent); color: var(--accent2); }
  .modal-btn.danger { border-color: rgba(240,82,82,0.3); color: var(--red); }
  .modal-btn.danger:hover { background: rgba(240,82,82,0.1); }
  .modal-btn.success { background: var(--accent); border-color: var(--accent); color: #fff; }
  .modal-btn.success:hover { background: var(--accent2); }

  /* ── Add form ── */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }
  .form-input {
    width: 100%; padding: 10px 12px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: var(--font); font-size: 13px; outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-select {
    width: 100%; padding: 10px 12px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; color: var(--text); font-family: var(--font); font-size: 13px; outline: none;
  }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  /* ── Tabs ── */
  .tabs { display: flex; gap: 4px; padding: 14px 16px 0; border-bottom: 1px solid var(--border); }
  .tab { padding: 8px 16px; font-size: 12px; font-weight: 500; color: var(--muted2); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent2); border-bottom-color: var(--accent); }

  /* ── Notification dot ── */
  .notif-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--red); display: inline-block; margin-left: 4px; }

  /* ── Empty state ── */
  .empty { padding: 32px; text-align: center; color: var(--muted); font-size: 13px; }

  @media (max-width: 900px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .two-col, .three-col { grid-template-columns: 1fr; }
    .sidebar { display: none; }
  }
`;

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeNav,    setActiveNav]    = useState("overview");
  const [bookingTab,   setBookingTab]   = useState("all");
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRow,  setSelectedRow]  = useState(null);
  const [showAddTheatre, setShowAddTheatre] = useState(false);
  const [showAddScreen,  setShowAddScreen]  = useState(false);
  const [newTheatre,   setNewTheatre]   = useState({ name:"", area:"miyapur", screens:"3", restaurant: false });
  const [newScreen,    setNewScreen]    = useState({ name:"", theatre:"Party Flix", type:"mini", capacity:"10", price:"1299" });

  const maxRevenue = Math.max(...REVENUE_CHART.map(r => r.amount));

  const filteredBookings = BOOKINGS.filter(b => {
    const matchSearch = search === "" ||
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.theatre.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchTab = bookingTab === "all" ||
      (bookingTab === "today"   && b.date === "25 Mar 2026") ||
      (bookingTab === "pending" && b.status === "pending") ||
      (bookingTab === "cancelled" && b.status === "cancelled");
    return matchSearch && matchStatus && matchTab;
  });

  const navItems = [
    { id: "overview",  label: "Overview",   icon: "◈" },
    { id: "bookings",  label: "Bookings",   icon: "📋", badge: "3" },
    { id: "theatres",  label: "Theatres",   icon: "🏛️" },
    { id: "screens",   label: "Screens",    icon: "📺" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="admin-wrap">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">PrivateScreen</div>
            <div className="logo-sub">Admin Console</div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Main</div>
            {navItems.map(n => (
              <div key={n.id} className={`nav-item ${activeNav===n.id?"active":""}`} onClick={()=>setActiveNav(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
                {n.badge && <span className="nav-badge">{n.badge}</span>}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-label">Tools</div>
            <div className="nav-item"><span className="nav-icon">🔧</span>Slot Generator</div>
            <div className="nav-item"><span className="nav-icon">📊</span>Reports</div>
            <div className="nav-item"><span className="nav-icon">⚙️</span>Settings</div>
          </div>

          <div className="sidebar-footer">
            <div className="admin-user">
              <div className="avatar">A</div>
              <div>
                <div className="admin-name">Admin</div>
                <div className="admin-role">Super Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">
          <div className="topbar">
            <div className="page-title">
              {activeNav === "overview"  && "Dashboard Overview"}
              {activeNav === "bookings"  && "Booking Management"}
              {activeNav === "theatres"  && "Theatre Management"}
              {activeNav === "screens"   && "Screen Management"}
            </div>
            <div className="topbar-right">
              <button className="topbar-btn">Export CSV</button>
              {activeNav === "theatres" && <button className="topbar-btn primary" onClick={()=>setShowAddTheatre(true)}>+ Add Theatre</button>}
              {activeNav === "screens"  && <button className="topbar-btn primary" onClick={()=>setShowAddScreen(true)}>+ Add Screen</button>}
            </div>
          </div>

          <div className="content">

            {/* ════════ OVERVIEW ════════ */}
            {activeNav === "overview" && (
              <>
                {/* Stats */}
                <div className="stats-grid">
                  {STATS.map((s,i) => (
                    <div key={i} className="stat-card">
                      <span className="stat-icon">{s.icon}</span>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-value">{s.value}</div>
                      <div className={`stat-delta ${s.up?"up":"down"}`}>
                        {s.up ? "▲" : "▼"} {s.delta}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="two-col">
                  {/* Revenue chart */}
                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Revenue — This Week</span>
                      <span className="panel-action">View full report</span>
                    </div>
                    <div className="chart-wrap">
                      <div className="chart-bars">
                        {REVENUE_CHART.map((r,i) => {
                          const pct = (r.amount / maxRevenue) * 100;
                          return (
                            <div key={i} className="chart-bar-col">
                              <div
                                className={`chart-bar ${i===6?"today":""}`}
                                style={{ height: `${pct}%` }}
                                title={`₹${r.amount.toLocaleString("en-IN")}`}
                              >
                                <span className="chart-bar-val">₹{(r.amount/1000).toFixed(0)}k</span>
                              </div>
                              <span className="chart-bar-label">{r.day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Theatre Occupancy Today</span>
                      <span className="panel-action" onClick={()=>setActiveNav("theatres")}>All theatres →</span>
                    </div>
                    <div className="occ-list">
                      {THEATRES.filter(t=>t.status==="active").slice(0,5).map(th => {
                        const pct = Math.round((th.activeBookings / (th.screens * 5)) * 100);
                        return (
                          <div key={th.id} className="occ-row">
                            <div className="occ-top">
                              <span className="occ-name">{th.name}</span>
                              <span className="occ-pct">{pct}%</span>
                            </div>
                            <div className="occ-bar-bg">
                              <div className={`occ-bar-fill ${pct>70?"high":pct<30?"low":""}`} style={{width:`${pct}%`}}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent bookings + Quick actions */}
                <div className="two-col">
                  <div className="panel">
                    <div className="panel-header">
                      <span className="panel-title">Recent Bookings</span>
                      <span className="panel-action" onClick={()=>setActiveNav("bookings")}>View all →</span>
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr>
                          <th>ID</th><th>Customer</th><th>Theatre</th><th>Amount</th><th>Status</th>
                        </tr></thead>
                        <tbody>
                          {BOOKINGS.slice(0,5).map(b => (
                            <tr key={b.id} onClick={()=>setSelectedRow(b)}>
                              <td className="td-id">{b.id}</td>
                              <td>{b.customer}</td>
                              <td className="td-muted">{b.theatre}</td>
                              <td className="td-amount">₹{b.amount.toLocaleString("en-IN")}</td>
                              <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="panel">
                    <div className="panel-header"><span className="panel-title">Quick Actions</span></div>
                    <div className="quick-actions">
                      <div className="qa-btn" onClick={()=>{setActiveNav("screens");setShowAddScreen(true);}}>
                        <span className="qa-icon">📺</span>
                        <div className="qa-label">Add Screen</div>
                        <div className="qa-desc">Register a new screen to a theatre</div>
                      </div>
                      <div className="qa-btn" onClick={()=>{setActiveNav("theatres");setShowAddTheatre(true);}}>
                        <span className="qa-icon">🏛️</span>
                        <div className="qa-label">Add Theatre</div>
                        <div className="qa-desc">Onboard a new private theatre</div>
                      </div>
                      <div className="qa-btn">
                        <span className="qa-icon">🔧</span>
                        <div className="qa-label">Generate Slots</div>
                        <div className="qa-desc">Bulk-create slots for next 30 days</div>
                      </div>
                      <div className="qa-btn">
                        <span className="qa-icon">📊</span>
                        <div className="qa-label">Revenue Report</div>
                        <div className="qa-desc">Export monthly revenue breakdown</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ════════ BOOKINGS ════════ */}
            {activeNav === "bookings" && (
              <div className="panel">
                <div className="tabs">
                  {["all","today","pending","cancelled"].map(t => (
                    <div key={t} className={`tab ${bookingTab===t?"active":""}`} onClick={()=>setBookingTab(t)}>
                      {t.charAt(0).toUpperCase()+t.slice(1)}
                      {t==="pending" && <span className="notif-dot"/>}
                    </div>
                  ))}
                </div>
                <div className="filter-bar">
                  <input
                    className="search-input"
                    placeholder="Search by name, booking ID or theatre…"
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                  />
                  <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                    <option value="all">All statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Theatre · Screen</th>
                      <th>Date · Time</th>
                      <th>Occasion</th>
                      <th>Guests</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th></th>
                    </tr></thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr><td colSpan={10} className="empty">No bookings found</td></tr>
                      ) : filteredBookings.map(b => (
                        <tr key={b.id} onClick={()=>setSelectedRow(b)}>
                          <td className="td-id">{b.id}</td>
                          <td>
                            <div style={{fontWeight:500}}>{b.customer}</div>
                            <div className="td-muted">{b.phone}</div>
                          </td>
                          <td>
                            <div style={{fontSize:12}}>{b.theatre}</div>
                            <div className="td-muted">{b.screen}</div>
                          </td>
                          <td>
                            <div style={{fontSize:12}}>{b.date}</div>
                            <div className="td-muted">{b.time}</div>
                          </td>
                          <td className="td-muted">{b.occasion}</td>
                          <td style={{textAlign:"center"}}>{b.guests}</td>
                          <td className="td-amount">₹{b.amount.toLocaleString("en-IN")}</td>
                          <td>
                            <span className={`badge ${b.paid?"confirmed":"pending"}`}>
                              {b.paid?"Paid":"Unpaid"}
                            </span>
                          </td>
                          <td><span className={`badge ${b.status}`}>{b.status}</span></td>
                          <td>
                            <div className="action-row">
                              <button className="icon-btn" title="View" onClick={e=>{e.stopPropagation();setSelectedRow(b);}}>👁</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ════════ THEATRES ════════ */}
            {activeNav === "theatres" && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">{THEATRES.length} Theatres Registered</span>
                  <span className="panel-action" onClick={()=>setShowAddTheatre(true)}>+ Add Theatre</span>
                </div>
                <div className="theatre-grid">
                  {THEATRES.map(th => (
                    <div key={th.id} className="th-card">
                      <div className="th-card-top">
                        <div>
                          <div className="th-card-name">{th.name}</div>
                          <div className="th-card-area">{th.area}</div>
                        </div>
                        <span className={`badge ${th.status}`}>{th.status}</span>
                      </div>
                      {th.hasRestaurant && (
                        <span style={{fontSize:10,color:"var(--green)",fontFamily:"var(--mono)"}}>+ In-house dining</span>
                      )}
                      <div className="th-card-stats">
                        <div className="th-stat-item">
                          <div className="th-stat-val">{th.screens}</div>
                          <div className="th-stat-label">Screens</div>
                        </div>
                        <div className="th-stat-item">
                          <div className="th-stat-val">{th.activeBookings}</div>
                          <div className="th-stat-label">Bookings</div>
                        </div>
                        <div style={{marginLeft:"auto",textAlign:"right"}}>
                          <div className="th-revenue">₹{th.revenue.toLocaleString("en-IN")}</div>
                          <div className="th-stat-label">Revenue</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════════ SCREENS ════════ */}
            {activeNav === "screens" && (
              <div className="panel">
                <div className="panel-header">
                  <span className="panel-title">{SCREENS_DATA.length} Screens</span>
                  <span className="panel-action" onClick={()=>setShowAddScreen(true)}>+ Add Screen</span>
                </div>
                <div className="screen-list">
                  {SCREENS_DATA.map(sc => (
                    <div key={sc.id} className="sc-card">
                      <div className="type-tag">{sc.type.toUpperCase()}</div>
                      <div className="sc-card-name">{sc.name}</div>
                      <div className="sc-card-theatre">{sc.theatre}</div>
                      <span className={`badge ${sc.status}`}>{sc.status}</span>
                      <div className="sc-card-row">
                        <div>
                          <div className="sc-card-price">₹{sc.price.toLocaleString("en-IN")}</div>
                          <div className="sc-bookings">{sc.capacity} guests · {sc.bookingsToday} bookings today</div>
                        </div>
                        <div className="action-row">
                          <button className="icon-btn" title="Edit">✏️</button>
                          <button className="icon-btn" title="Block">🔒</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Booking detail modal ── */}
      {selectedRow && (
        <div className="modal-overlay" onClick={()=>setSelectedRow(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Booking Detail</div>
                <div style={{fontSize:11,color:"var(--accent2)",fontFamily:"var(--mono)",marginTop:2}}>{selectedRow.id}</div>
              </div>
              <button className="modal-close" onClick={()=>setSelectedRow(null)}>✕</button>
            </div>
            <div className="modal-body">
              {[
                ["Customer",  selectedRow.customer],
                ["Phone",     selectedRow.phone],
                ["Theatre",   `${selectedRow.theatre} · ${selectedRow.area}`],
                ["Screen",    selectedRow.screen],
                ["Date",      selectedRow.date],
                ["Time",      `${selectedRow.time} (3 hrs)`],
                ["Occasion",  selectedRow.occasion],
                ["Guests",    selectedRow.guests],
                ["Amount",    `₹${selectedRow.amount.toLocaleString("en-IN")}`],
                ["Payment",   selectedRow.paid ? "✅ Paid" : "⏳ Pending"],
                ["Status",    selectedRow.status.toUpperCase()],
              ].map(([k,v]) => (
                <div key={k} className="modal-row">
                  <span className="modal-key">{k}</span>
                  <span className="modal-val">{v}</span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              {selectedRow.status === "pending" && (
                <button className="modal-btn danger">Cancel Booking</button>
              )}
              <button className="modal-btn" onClick={()=>setSelectedRow(null)}>Close</button>
              <button className="modal-btn success">Send Reminder</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Theatre modal ── */}
      {showAddTheatre && (
        <div className="modal-overlay" onClick={()=>setShowAddTheatre(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Theatre</div>
              <button className="modal-close" onClick={()=>setShowAddTheatre(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Theatre Name</label>
                <input className="form-input" placeholder="e.g. Party Flix" value={newTheatre.name} onChange={e=>setNewTheatre({...newTheatre,name:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-input" placeholder="Full address"/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Area</label>
                  <select className="form-select" value={newTheatre.area} onChange={e=>setNewTheatre({...newTheatre,area:e.target.value})}>
                    <option value="miyapur">Miyapur</option>
                    <option value="jubilee">Jubilee Hills</option>
                    <option value="gachibowli">Gachibowli</option>
                    <option value="kukatpally">Kukatpally</option>
                    <option value="madhapur">Madhapur</option>
                    <option value="secunderabad">Secunderabad</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Screens</label>
                  <input className="form-input" type="number" min="1" value={newTheatre.screens} onChange={e=>setNewTheatre({...newTheatre,screens:e.target.value})}/>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Owner Contact</label>
                <input className="form-input" placeholder="Phone number"/>
              </div>
              <div className="form-group" style={{display:"flex",alignItems:"center",gap:10}}>
                <input type="checkbox" id="restaurant" checked={newTheatre.restaurant} onChange={e=>setNewTheatre({...newTheatre,restaurant:e.target.checked})} style={{accentColor:"var(--accent)"}}/>
                <label htmlFor="restaurant" style={{fontSize:13,color:"var(--text)",cursor:"pointer"}}>Has in-house restaurant / food service</label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn" onClick={()=>setShowAddTheatre(false)}>Cancel</button>
              <button className="modal-btn success" onClick={()=>setShowAddTheatre(false)}>Save Theatre</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Screen modal ── */}
      {showAddScreen && (
        <div className="modal-overlay" onClick={()=>setShowAddScreen(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Add New Screen</div>
              <button className="modal-close" onClick={()=>setShowAddScreen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Theatre</label>
                <select className="form-select" value={newScreen.theatre} onChange={e=>setNewScreen({...newScreen,theatre:e.target.value})}>
                  {THEATRES.filter(t=>t.status==="active").map(t=>(
                    <option key={t.id} value={t.name}>{t.name} · {t.area}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Screen Name</label>
                <input className="form-input" placeholder="e.g. Screen 3 — Grand" value={newScreen.name} onChange={e=>setNewScreen({...newScreen,name:e.target.value})}/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Screen Type</label>
                  <select className="form-select" value={newScreen.type} onChange={e=>setNewScreen({...newScreen,type:e.target.value})}>
                    <option value="mini">Mini</option>
                    <option value="luxe">Luxe</option>
                    <option value="grand">Grand</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity (guests)</label>
                  <input className="form-input" type="number" min="2" value={newScreen.capacity} onChange={e=>setNewScreen({...newScreen,capacity:e.target.value})}/>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price per 3hrs (₹)</label>
                  <input className="form-input" type="number" value={newScreen.price} onChange={e=>setNewScreen({...newScreen,price:e.target.value})}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Amenities</label>
                  <input className="form-input" placeholder="4K, Dolby, Recliners…"/>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-btn" onClick={()=>setShowAddScreen(false)}>Cancel</button>
              <button className="modal-btn success" onClick={()=>setShowAddScreen(false)}>Save Screen</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}