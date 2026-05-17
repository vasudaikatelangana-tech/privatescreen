import { useState } from "react";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const USER = {
  name:      "Priya Reddy",
  email:     "priya.reddy@gmail.com",
  phone:     "+91 98765 43210",
  joined:    "January 2025",
  avatar:    "PR",
  totalBookings: 12,
  totalSpent:    38450,
  favouriteOccasion: "Birthday",
  favouriteTheatre:  "Party Flix, Miyapur",
};

const BOOKINGS = [
  {
    id: "PS7X2KA", status: "completed", paid: true,
    theatre: "Party Flix",     area: "Miyapur",
    screen:  "Screen 2 — Luxe", screenType: "luxe",
    date: "25 Mar 2026", time: "07:00 PM", duration: "3 hrs",
    occasion: "Birthday 🎂",   guests: 10,
    amount: 3298, screenPrice: 2199,
    addons: [
      { name: "Chocolate Fudge Cake", qty: 1, price: 799 },
      { name: "Balloon Decoration",   qty: 1, price: 300 },
    ],
    canRebook: true, canReview: true,
  },
  {
    id: "PS4N9QC", status: "upcoming", paid: true,
    theatre: "The Frame Studio", area: "Madhapur",
    screen:  "Screen 1 — Mini",  screenType: "mini",
    date: "02 Apr 2026", time: "07:00 PM", duration: "3 hrs",
    occasion: "OTT Movie 🎬",  guests: 4,
    amount: 1799, screenPrice: 1799,
    addons: [],
    canRebook: false, canReview: false,
  },
  {
    id: "PS2R5TD", status: "upcoming", paid: false,
    theatre: "Starlight Hall", area: "Kukatpally",
    screen:  "Screen 3 — Grand", screenType: "grand",
    date: "05 Apr 2026", time: "10:00 PM", duration: "3 hrs",
    occasion: "Birthday 🎂",  guests: 18,
    amount: 4997, screenPrice: 3499,
    addons: [
      { name: "Red Velvet Cake",         qty: 1, price: 699 },
      { name: "Premium Floral Decor",    qty: 1, price: 799 },
    ],
    canRebook: false, canReview: false,
    paymentPending: true,
  },
  {
    id: "PS8M3LB", status: "completed", paid: true,
    theatre: "Luxe Frames",  area: "Jubilee Hills",
    screen:  "Emerald",       screenType: "luxe",
    date: "14 Feb 2026", time: "07:00 PM", duration: "3 hrs",
    occasion: "Anniversary 💑", guests: 2,
    amount: 4298, screenPrice: 2999,
    addons: [
      { name: "Couple Bundle", qty: 1, price: 1299 },
    ],
    canRebook: true, canReview: false, reviewed: true,
  },
  {
    id: "PS9K7VF", status: "cancelled", paid: false,
    theatre: "Party Flix",   area: "Miyapur",
    screen:  "Screen 5 — Luxe", screenType: "luxe",
    date: "10 Jan 2026", time: "04:00 PM", duration: "3 hrs",
    occasion: "Anniversary 💑", guests: 4,
    amount: 3398, screenPrice: 2499,
    addons: [{ name: "Premium Drinks", qty: 1, price: 899 }],
    canRebook: true, canReview: false,
    refunded: true,
  },
  {
    id: "PS3J4WG", status: "completed", paid: true,
    theatre: "Velvet Room",  area: "Jubilee Hills",
    screen:  "Screen 1 — Mini", screenType: "mini",
    date: "25 Dec 2025", time: "06:00 PM", duration: "3 hrs",
    occasion: "OTT Movie 🎬", guests: 3,
    amount: 1799, screenPrice: 1799,
    addons: [],
    canRebook: true, canReview: true,
  },
];

const OCCASIONS_STAT = [
  { label: "Birthday",    count: 5, pct: 42 },
  { label: "Anniversary", count: 3, pct: 25 },
  { label: "OTT Movie",   count: 3, pct: 25 },
  { label: "Others",      count: 1, pct: 8  },
];

// ── Styles ─────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream:   #FAF8F4;
    --cream2:  #F3EFE8;
    --cream3:  #EBE5DC;
    --ink:     #1C1917;
    --ink2:    #292524;
    --muted:   #78716C;
    --muted2:  #A8A29E;
    --gold:    #B8860B;
    --gold2:   #D4A017;
    --gold3:   #F5E6C3;
    --green:   #15803D;
    --green2:  #DCFCE7;
    --red:     #B91C1C;
    --red2:    #FEE2E2;
    --amber:   #B45309;
    --amber2:  #FEF3C7;
    --blue:    #1D4ED8;
    --blue2:   #DBEAFE;
    --radius:  14px;
    --shadow:  0 2px 20px rgba(28,25,23,0.08);
  }

  body { background: var(--cream); font-family: 'Outfit', sans-serif; color: var(--ink); }

  /* ── Page wrapper ── */
  .profile-page { min-height: 100vh; background: var(--cream); }

  /* ── Top nav ── */
  .top-nav {
    background: var(--ink); padding: 16px 32px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 400; color: var(--gold2); letter-spacing: 1px; }
  .nav-logo span { color: #fff; }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-link { font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; transition: color 0.15s; }
  .nav-link:hover { color: #fff; }
  .nav-new-booking {
    padding: 8px 18px; background: var(--gold2); color: var(--ink);
    border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;
    border: none; font-family: 'Outfit', sans-serif; transition: all 0.15s;
  }
  .nav-new-booking:hover { background: #E8B420; transform: translateY(-1px); }

  /* ── Layout ── */
  .page-body { max-width: 900px; margin: 0 auto; padding: 32px 20px 60px; }

  /* ── Hero profile card ── */
  .profile-hero {
    background: var(--ink2);
    border-radius: var(--radius);
    padding: 32px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .profile-hero::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(212,160,23,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-top { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 28px; }
  .hero-avatar {
    width: 64px; height: 64px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; font-weight: 700; color: var(--ink); flex-shrink: 0;
    font-family: 'Playfair Display', serif;
  }
  .hero-info { flex: 1; }
  .hero-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 500; color: #fff; margin-bottom: 4px; }
  .hero-meta { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.7; }
  .hero-edit {
    padding: 8px 16px; background: transparent; color: rgba(255,255,255,0.4);
    border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
    font-family: 'Outfit', sans-serif; font-size: 12px; cursor: pointer;
    transition: all 0.15s; white-space: nowrap;
  }
  .hero-edit:hover { border-color: var(--gold2); color: var(--gold2); }

  .hero-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; }
  .hero-stat { padding: 16px 20px; background: rgba(255,255,255,0.03); text-align: center; }
  .hero-stat-val { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--gold2); margin-bottom: 3px; }
  .hero-stat-label { font-size: 10px; color: rgba(255,255,255,0.35); letter-spacing: 1.5px; text-transform: uppercase; }

  /* ── Section heading ── */
  .section-heading {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 400;
    color: var(--ink); margin-bottom: 16px;
  }

  /* ── Stats row ── */
  .stats-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 28px; }
  .stat-mini {
    background: #fff; border: 1px solid var(--cream3);
    border-radius: 12px; padding: 18px 20px;
    box-shadow: var(--shadow);
  }
  .stat-mini-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); margin-bottom: 6px; }
  .stat-mini-val { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--ink); margin-bottom: 2px; }
  .stat-mini-sub { font-size: 11px; color: var(--muted2); }

  /* ── Occasion chart ── */
  .occasion-chart { background: #fff; border: 1px solid var(--cream3); border-radius: 12px; padding: 20px; box-shadow: var(--shadow); margin-bottom: 28px; }
  .occ-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .occ-row:last-child { margin-bottom: 0; }
  .occ-label-col { width: 90px; font-size: 12px; color: var(--muted); }
  .occ-bar-wrap { flex: 1; height: 8px; background: var(--cream2); border-radius: 4px; overflow: hidden; }
  .occ-bar { height: 100%; border-radius: 4px; background: var(--gold2); transition: width 0.6s ease; }
  .occ-count { font-size: 11px; color: var(--muted2); min-width: 30px; text-align: right; }

  /* ── Tabs ── */
  .tab-row { display: flex; gap: 4px; margin-bottom: 16px; border-bottom: 1px solid var(--cream3); padding-bottom: 0; }
  .tab-btn {
    padding: 10px 18px; font-size: 13px; font-weight: 500;
    color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: all 0.15s; background: transparent; border-top: none; border-left: none; border-right: none;
    font-family: 'Outfit', sans-serif;
  }
  .tab-btn:hover { color: var(--ink); }
  .tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
  .tab-count { display: inline-block; background: var(--cream2); color: var(--muted); font-size: 10px; padding: 1px 6px; border-radius: 10px; margin-left: 5px; }
  .tab-btn.active .tab-count { background: var(--gold3); color: var(--gold); }

  /* ── Booking cards ── */
  .bookings-list { display: flex; flex-direction: column; gap: 14px; }

  .booking-card {
    background: #fff; border: 1px solid var(--cream3);
    border-radius: var(--radius); overflow: hidden;
    box-shadow: var(--shadow); transition: box-shadow 0.2s;
    cursor: pointer;
  }
  .booking-card:hover { box-shadow: 0 4px 32px rgba(28,25,23,0.12); }
  .booking-card.upcoming { border-left: 3px solid var(--gold2); }
  .booking-card.completed { border-left: 3px solid var(--green); }
  .booking-card.cancelled { border-left: 3px solid var(--muted2); opacity: 0.75; }

  .bc-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--cream2);
  }
  .bc-ref { font-size: 11px; color: var(--gold); font-weight: 600; letter-spacing: 1.5px; font-family: 'Outfit', sans-serif; }
  .bc-status-row { display: flex; align-items: center; gap: 8px; }

  .bc-body { padding: 16px 20px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .bc-field-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); margin-bottom: 3px; }
  .bc-field-val { font-size: 14px; font-weight: 500; color: var(--ink); }
  .bc-field-sub { font-size: 11px; color: var(--muted2); margin-top: 1px; }

  .bc-footer {
    padding: 12px 20px; border-top: 1px solid var(--cream2);
    display: flex; align-items: center; justify-content: space-between;
    background: var(--cream);
  }
  .bc-amount { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink); }
  .bc-amount-label { font-size: 10px; color: var(--muted2); margin-bottom: 1px; }
  .bc-actions { display: flex; gap: 8px; }

  /* ── Addons inline ── */
  .bc-addons { padding: 0 20px 14px; display: flex; gap: 6px; flex-wrap: wrap; }
  .addon-pill { font-size: 11px; background: var(--cream2); color: var(--muted); padding: 3px 10px; border-radius: 12px; }

  /* ── Badges ── */
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge.upcoming  { background: var(--amber2);  color: var(--amber); }
  .badge.completed { background: var(--green2);  color: var(--green); }
  .badge.cancelled { background: var(--cream3);  color: var(--muted); }
  .badge.paid      { background: var(--green2);  color: var(--green); }
  .badge.unpaid    { background: var(--amber2);  color: var(--amber); }
  .badge.refunded  { background: var(--blue2);   color: var(--blue);  }

  /* ── Buttons ── */
  .btn-ghost {
    padding: 8px 16px; border-radius: 8px;
    border: 1px solid var(--cream3); background: transparent;
    color: var(--muted); font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif;
  }
  .btn-ghost:hover { border-color: var(--gold2); color: var(--gold); }
  .btn-solid {
    padding: 8px 16px; border-radius: 8px;
    border: none; background: var(--ink);
    color: var(--gold2); font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif;
  }
  .btn-solid:hover { background: var(--ink2); }
  .btn-danger {
    padding: 8px 16px; border-radius: 8px;
    border: 1px solid #FECACA; background: transparent;
    color: var(--red); font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif;
  }
  .btn-danger:hover { background: var(--red2); }
  .btn-pay {
    padding: 8px 16px; border-radius: 8px;
    border: none; background: var(--gold2);
    color: var(--ink); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.15s; font-family: 'Outfit', sans-serif;
    animation: pulse-pay 2s ease-in-out infinite;
  }
  .btn-pay:hover { background: #E8B420; }

  @keyframes pulse-pay {
    0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
    50%      { box-shadow: 0 0 0 6px rgba(212,160,23,0); }
  }

  /* ── Modal ── */
  .modal-overlay { position: fixed; inset: 0; background: rgba(28,25,23,0.55); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .modal { background: #fff; border-radius: var(--radius); width: 100%; max-width: 480px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(28,25,23,0.2); }
  .modal-header { padding: 22px 24px 18px; border-bottom: 1px solid var(--cream3); display: flex; align-items: flex-start; justify-content: space-between; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--ink); }
  .modal-ref { font-size: 11px; color: var(--gold); font-weight: 600; letter-spacing: 1.5px; margin-top: 3px; }
  .modal-close { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--cream3); background: transparent; font-size: 16px; color: var(--muted2); cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .modal-close:hover { border-color: var(--red); color: var(--red); }
  .modal-body { padding: 20px 24px; }
  .modal-section { margin-bottom: 20px; }
  .modal-section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted2); margin-bottom: 10px; font-weight: 600; }
  .modal-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid var(--cream2); font-size: 13px; }
  .modal-row:last-child { border-bottom: none; }
  .modal-key { color: var(--muted); }
  .modal-val { font-weight: 500; color: var(--ink); }
  .modal-total-row { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0 0; }
  .modal-total-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .modal-total-val { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--ink); }
  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--cream3); display: flex; gap: 10px; justify-content: flex-end; }

  /* ── Review modal ── */
  .stars { display: flex; gap: 6px; margin-bottom: 14px; }
  .star { font-size: 28px; cursor: pointer; transition: transform 0.1s; filter: grayscale(1); }
  .star.active { filter: grayscale(0); transform: scale(1.1); }
  .review-input { width: 100%; padding: 12px 14px; border: 1px solid var(--cream3); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 13px; color: var(--ink); resize: none; outline: none; background: var(--cream); min-height: 80px; transition: border-color 0.2s; }
  .review-input:focus { border-color: var(--gold2); }

  /* ── Edit profile ── */
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted2); margin-bottom: 6px; display: block; }
  .form-input { width: 100%; padding: 10px 14px; border: 1px solid var(--cream3); border-radius: 10px; font-family: 'Outfit', sans-serif; font-size: 14px; color: var(--ink); background: var(--cream); outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--gold2); }

  /* ── Empty state ── */
  .empty-state { text-align: center; padding: 48px 20px; color: var(--muted2); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; display: block; filter: grayscale(0.5); }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--muted); margin-bottom: 6px; }
  .empty-sub { font-size: 13px; }

  /* ── Payment pending banner ── */
  .pay-banner {
    background: var(--amber2); border: 1px solid #FDE68A;
    border-radius: 10px; padding: 12px 16px; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .pay-banner-text { font-size: 13px; color: var(--amber); font-weight: 500; }
  .pay-banner-sub { font-size: 11px; color: #92400E; margin-top: 2px; }

  @media (max-width: 640px) {
    .hero-stats { grid-template-columns: repeat(2,1fr); }
    .stats-row  { grid-template-columns: 1fr 1fr; }
    .bc-body    { grid-template-columns: 1fr 1fr; }
    .top-nav    { padding: 14px 16px; }
    .page-body  { padding: 20px 14px 60px; }
  }
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function StatusBadge({ status, refunded, paymentPending }) {
  if (refunded)       return <span className="badge refunded">Refunded</span>;
  if (paymentPending) return <span className="badge unpaid">Payment Due</span>;
  return <span className={`badge ${status}`}>{status}</span>;
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function CustomerProfile() {
  const [activeTab,    setActiveTab]    = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEdit,     setShowEdit]     = useState(false);
  const [showReview,   setShowReview]   = useState(null);
  const [starRating,   setStarRating]   = useState(0);
  const [starHover,    setStarHover]    = useState(0);
  const [reviewText,   setReviewText]   = useState("");
  const [editForm,     setEditForm]     = useState({ name: USER.name, email: USER.email, phone: USER.phone });

  const tabs = [
    { id: "all",       label: "All",       count: BOOKINGS.length },
    { id: "upcoming",  label: "Upcoming",  count: BOOKINGS.filter(b=>b.status==="upcoming").length },
    { id: "completed", label: "Completed", count: BOOKINGS.filter(b=>b.status==="completed").length },
    { id: "cancelled", label: "Cancelled", count: BOOKINGS.filter(b=>b.status==="cancelled").length },
  ];

  const filtered = activeTab === "all"
    ? BOOKINGS
    : BOOKINGS.filter(b => b.status === activeTab);

  const pendingPayments = BOOKINGS.filter(b => b.paymentPending);

  return (
    <>
      <style>{css}</style>
      <div className="profile-page">

        {/* Nav */}
        <nav className="top-nav">
          <div className="nav-logo">Private<span>Screen</span></div>
          <div className="nav-right">
            <span className="nav-link">Home</span>
            <span className="nav-link">Browse Theatres</span>
            <button className="nav-new-booking">+ New Booking</button>
          </div>
        </nav>

        <div className="page-body">

          {/* ── Hero card ── */}
          <div className="profile-hero">
            <div className="hero-top">
              <div className="hero-avatar">{USER.avatar}</div>
              <div className="hero-info">
                <div className="hero-name">{USER.name}</div>
                <div className="hero-meta">
                  {USER.email}<br/>
                  {USER.phone} · Member since {USER.joined}
                </div>
              </div>
              <button className="hero-edit" onClick={()=>setShowEdit(true)}>Edit Profile</button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-val">{USER.totalBookings}</div>
                <div className="hero-stat-label">Total Bookings</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val">₹{(USER.totalSpent/1000).toFixed(1)}k</div>
                <div className="hero-stat-label">Total Spent</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val">{USER.favouriteOccasion}</div>
                <div className="hero-stat-label">Top Occasion</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-val" style={{fontSize:14,paddingTop:4}}>{USER.favouriteTheatre}</div>
                <div className="hero-stat-label">Favourite Theatre</div>
              </div>
            </div>
          </div>

          {/* ── Mini stats ── */}
          <div className="stats-row">
            <div className="stat-mini">
              <div className="stat-mini-label">Upcoming</div>
              <div className="stat-mini-val">{BOOKINGS.filter(b=>b.status==="upcoming").length}</div>
              <div className="stat-mini-sub">sessions scheduled</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini-label">Avg spend</div>
              <div className="stat-mini-val">₹{Math.round(USER.totalSpent/USER.totalBookings).toLocaleString("en-IN")}</div>
              <div className="stat-mini-sub">per booking</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini-label">Occasions</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
                {OCCASIONS_STAT.map(o=>(
                  <div key={o.label} className="occ-row" style={{margin:0}}>
                    <div className="occ-label-col">{o.label}</div>
                    <div className="occ-bar-wrap"><div className="occ-bar" style={{width:`${o.pct}%`}}/></div>
                    <div className="occ-count">{o.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Payment pending banners ── */}
          {pendingPayments.map(b=>(
            <div key={b.id} className="pay-banner">
              <div>
                <div className="pay-banner-text">⚠️ Payment pending for {b.theatre} · {b.date}</div>
                <div className="pay-banner-sub">Booking {b.id} · ₹{b.amount.toLocaleString("en-IN")} due — slot held for 15 mins</div>
              </div>
              <button className="btn-pay">Complete Payment</button>
            </div>
          ))}

          {/* ── Bookings ── */}
          <h2 className="section-heading">My Bookings</h2>

          <div className="tab-row">
            {tabs.map(t=>(
              <button key={t.id} className={`tab-btn ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
                {t.label}
                <span className="tab-count">{t.count}</span>
              </button>
            ))}
          </div>

          <div className="bookings-list">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎬</span>
                <div className="empty-title">No bookings here</div>
                <div className="empty-sub">Your {activeTab} bookings will appear here</div>
              </div>
            ) : filtered.map(b=>(
              <div key={b.id} className={`booking-card ${b.status}`} onClick={()=>setSelectedBook(b)}>

                {/* Header */}
                <div className="bc-header">
                  <div>
                    <div className="bc-ref">{b.id}</div>
                  </div>
                  <div className="bc-status-row">
                    <StatusBadge status={b.status} refunded={b.refunded} paymentPending={b.paymentPending}/>
                    {b.paid && !b.paymentPending && <span className="badge paid">Paid</span>}
                  </div>
                </div>

                {/* Body */}
                <div className="bc-body">
                  <div>
                    <div className="bc-field-label">Theatre</div>
                    <div className="bc-field-val">{b.theatre}</div>
                    <div className="bc-field-sub">{b.area} · {b.screen}</div>
                  </div>
                  <div>
                    <div className="bc-field-label">Date & Time</div>
                    <div className="bc-field-val">{b.date}</div>
                    <div className="bc-field-sub">{b.time} · {b.duration}</div>
                  </div>
                  <div>
                    <div className="bc-field-label">Occasion</div>
                    <div className="bc-field-val">{b.occasion}</div>
                    <div className="bc-field-sub">{b.guests} guests</div>
                  </div>
                </div>

                {/* Add-ons */}
                {b.addons.length > 0 && (
                  <div className="bc-addons">
                    {b.addons.map(a=>(
                      <span key={a.name} className="addon-pill">{a.name} ×{a.qty}</span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="bc-footer">
                  <div>
                    <div className="bc-amount-label">Total</div>
                    <div className="bc-amount">₹{b.amount.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="bc-actions" onClick={e=>e.stopPropagation()}>
                    {b.paymentPending && (
                      <button className="btn-pay">Pay Now</button>
                    )}
                    {b.status==="upcoming" && !b.paymentPending && (
                      <button className="btn-danger">Cancel</button>
                    )}
                    {b.canReview && (
                      <button className="btn-ghost" onClick={e=>{e.stopPropagation();setShowReview(b);}}>
                        ★ Review
                      </button>
                    )}
                    {b.reviewed && (
                      <span style={{fontSize:11,color:"var(--green)",fontWeight:500}}>★ Reviewed</span>
                    )}
                    {b.canRebook && (
                      <button className="btn-solid">Rebook</button>
                    )}
                    <button className="btn-ghost" onClick={e=>{e.stopPropagation();setSelectedBook(b);}}>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Booking detail modal ── */}
      {selectedBook && (
        <div className="modal-overlay" onClick={()=>setSelectedBook(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Booking Details</div>
                <div className="modal-ref">{selectedBook.id}</div>
              </div>
              <button className="modal-close" onClick={()=>setSelectedBook(null)}>✕</button>
            </div>
            <div className="modal-body">

              <div className="modal-section">
                <div className="modal-section-title">Venue & Screen</div>
                {[
                  ["Theatre",  selectedBook.theatre],
                  ["Area",     selectedBook.area],
                  ["Screen",   selectedBook.screen],
                  ["Type",     selectedBook.screenType.toUpperCase()],
                ].map(([k,v])=>(
                  <div key={k} className="modal-row">
                    <span className="modal-key">{k}</span>
                    <span className="modal-val">{v}</span>
                  </div>
                ))}
              </div>

              <div className="modal-section">
                <div className="modal-section-title">Session</div>
                {[
                  ["Date",     selectedBook.date],
                  ["Time",     selectedBook.time],
                  ["Duration", selectedBook.duration],
                  ["Occasion", selectedBook.occasion],
                  ["Guests",   selectedBook.guests],
                ].map(([k,v])=>(
                  <div key={k} className="modal-row">
                    <span className="modal-key">{k}</span>
                    <span className="modal-val">{v}</span>
                  </div>
                ))}
              </div>

              <div className="modal-section">
                <div className="modal-section-title">Payment Breakdown</div>
                <div className="modal-row">
                  <span className="modal-key">{selectedBook.screen}</span>
                  <span className="modal-val">₹{selectedBook.screenPrice.toLocaleString("en-IN")}</span>
                </div>
                {selectedBook.addons.map(a=>(
                  <div key={a.name} className="modal-row">
                    <span className="modal-key">{a.name} ×{a.qty}</span>
                    <span className="modal-val">₹{(a.price*a.qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="modal-total-row">
                  <span className="modal-total-label">Total</span>
                  <span className="modal-total-val">₹{selectedBook.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

            </div>
            <div className="modal-footer">
              {selectedBook.canReview && (
                <button className="btn-ghost" onClick={()=>{setSelectedBook(null);setShowReview(selectedBook);}}>★ Write Review</button>
              )}
              {selectedBook.canRebook && (
                <button className="btn-solid">Rebook This</button>
              )}
              {selectedBook.status==="upcoming" && !selectedBook.paymentPending && (
                <button className="btn-danger">Cancel Booking</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Review modal ── */}
      {showReview && (
        <div className="modal-overlay" onClick={()=>setShowReview(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Rate Your Experience</div>
                <div className="modal-ref">{showReview.theatre} · {showReview.date}</div>
              </div>
              <button className="modal-close" onClick={()=>setShowReview(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{marginBottom:8,fontSize:13,color:"var(--muted)"}}>How was your experience?</div>
              <div className="stars">
                {[1,2,3,4,5].map(s=>(
                  <span
                    key={s}
                    className={`star ${(starHover||starRating)>=s?"active":""}`}
                    onMouseEnter={()=>setStarHover(s)}
                    onMouseLeave={()=>setStarHover(0)}
                    onClick={()=>setStarRating(s)}
                  >⭐</span>
                ))}
              </div>
              <div style={{fontSize:12,color:"var(--gold)",marginBottom:14,minHeight:18,fontWeight:500}}>
                {starRating===5?"Absolutely loved it!"
                :starRating===4?"Great experience!"
                :starRating===3?"It was okay"
                :starRating===2?"Could be better"
                :starRating===1?"Disappointing"
                :"Tap a star to rate"}
              </div>
              <div className="form-group">
                <label className="form-label">Tell us more (optional)</label>
                <textarea
                  className="review-input"
                  placeholder="What did you enjoy? Any suggestions for improvement?"
                  value={reviewText}
                  onChange={e=>setReviewText(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={()=>setShowReview(null)}>Skip</button>
              <button
                className="btn-solid"
                disabled={starRating===0}
                style={{opacity:starRating===0?0.4:1}}
                onClick={()=>setShowReview(null)}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit profile modal ── */}
      {showEdit && (
        <div className="modal-overlay" onClick={()=>setShowEdit(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit Profile</div>
              <button className="modal-close" onClick={()=>setShowEdit(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={editForm.name} onChange={e=>setEditForm({...editForm,name:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">New Password (optional)</label>
                <input className="form-input" type="password" placeholder="Leave blank to keep current"/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={()=>setShowEdit(false)}>Cancel</button>
              <button className="btn-solid" onClick={()=>setShowEdit(false)}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}