// src/app/login/page.tsx
"use client";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router   = useRouter();

  const [phone,   setPhone]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [step,    setStep]    = useState<"phone"|"otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  // Step 1 — Send OTP
  async function sendOtp() {
    if (!phone || phone.length < 10) {
      setError("Enter a valid 10-digit phone number"); return;
    }
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone.replace(/\s/g,"")}`,
    });
    if (error) { setError(error.message); }
    else       { setStep("otp"); }
    setLoading(false);
  }

  // Step 2 — Verify OTP
  async function verifyOtp() {
    if (!otp || otp.length < 6) {
      setError("Enter the 6-digit OTP"); return;
    }
    setLoading(true); setError("");
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone.replace(/\s/g,"")}`,
      token: otp,
      type:  "sms",
    });
    if (error) { setError(error.message); }
    else       { router.push("/"); router.refresh(); }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight:"100vh", background:"#FFF9F0",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Nunito',sans-serif", padding:"20px",
    }}>
      <div style={{
        background:"#fff", borderRadius:20, padding:"40px 36px",
        width:"100%", maxWidth:400,
        boxShadow:"0 8px 40px rgba(0,0,0,0.1)",
        border:"2.5px solid #F0F0F0",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily:"'Fredoka One',cursive", fontSize:28,
          background:"linear-gradient(135deg,#FF6B6B,#FFD93D)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          marginBottom:8, textAlign:"center",
        }}>
          🎬 PrivateScreen
        </div>
        <p style={{ textAlign:"center", color:"#8B8B8B", fontSize:14, marginBottom:32, fontWeight:600 }}>
          {step === "phone" ? "Sign in to book your private theatre" : `OTP sent to +91 ${phone}`}
        </p>

        {step === "phone" ? (
          <>
            <label style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", color:"#8B8B8B", display:"block", marginBottom:6 }}>
              Mobile Number
            </label>
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              <div style={{ padding:"11px 14px", background:"#F5F5F5", borderRadius:12, fontSize:14, fontWeight:700, border:"2.5px solid #F0F0F0" }}>
                +91
              </div>
              <input
                style={{ flex:1, padding:"11px 14px", border:"2.5px solid #F0F0F0", borderRadius:12, fontSize:14, fontWeight:600, outline:"none", fontFamily:"'Nunito',sans-serif" }}
                placeholder="98765 43210"
                value={phone}
                maxLength={10}
                onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
                onKeyDown={e => e.key === "Enter" && sendOtp()}
              />
            </div>
            <button
              onClick={sendOtp}
              disabled={loading}
              style={{
                width:"100%", padding:"14px", borderRadius:14,
                background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",
                color:"#fff", border:"none", fontSize:16,
                fontFamily:"'Fredoka One',cursive", cursor:"pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Sending OTP…" : "Send OTP →"}
            </button>
          </>
        ) : (
          <>
            <label style={{ fontSize:10, fontWeight:800, letterSpacing:1.5, textTransform:"uppercase", color:"#8B8B8B", display:"block", marginBottom:6 }}>
              Enter OTP
            </label>
            <input
              style={{ width:"100%", padding:"14px", border:"2.5px solid #F0F0F0", borderRadius:12, fontSize:22, fontWeight:800, outline:"none", textAlign:"center", letterSpacing:8, marginBottom:20, fontFamily:"'Nunito',sans-serif" }}
              placeholder="••••••"
              value={otp}
              maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
              onKeyDown={e => e.key === "Enter" && verifyOtp()}
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              style={{
                width:"100%", padding:"14px", borderRadius:14,
                background:"linear-gradient(135deg,#FF6B6B,#FF8E53)",
                color:"#fff", border:"none", fontSize:16,
                fontFamily:"'Fredoka One',cursive", cursor:"pointer",
                opacity: loading ? 0.6 : 1, marginBottom:12,
              }}
            >
              {loading ? "Verifying…" : "Verify & Continue 🎉"}
            </button>
            <button
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
              style={{ width:"100%", padding:"10px", borderRadius:12, background:"transparent", border:"2.5px solid #F0F0F0", color:"#8B8B8B", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif" }}
            >
              ← Change number
            </button>
          </>
        )}

        {error && (
          <div style={{ marginTop:14, background:"#FFF0F0", border:"2px solid #FFD0D0", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#D63031", fontWeight:600 }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}