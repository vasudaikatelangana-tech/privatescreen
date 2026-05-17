// src/hooks/useBooking.ts
"use client";
import { useState } from "react";

interface AddonItem {
  addon_id:   string;
  quantity:   number;
  unit_price: number;
}

interface BookingPayload {
  slot_id:       string;
  occasion_type: string;
  guest_count:   number;
  special_notes?: string;
  addons:        AddonItem[];
}

interface BookingResult {
  success:    boolean;
  booking_id?: string;
  total?:      number;
  error?:      string;
}

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function createBooking(payload: BookingPayload): Promise<BookingResult> {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings/create", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return { success: false, error: data.error };
      }

      return { success: true, booking_id: data.booking_id, total: data.total };

    } catch (err: any) {
      const msg = "Network error. Please try again.";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  return { createBooking, loading, error };
}