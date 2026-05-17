// src/hooks/useWizardData.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("locations")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => {
        setLocations(data || []);
        setLoading(false);
      });
  }, []);

  return { locations, loading };
}

export function useTheatresByLocation(locationId: string | null) {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!locationId) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("screens")
      .select(`
        id, name, type, capacity, base_price, amenities,
        locations ( id, name, address )
      `)
      .eq("location_id", locationId)
      .eq("is_active", true)
      .order("base_price")
      .then(({ data }) => {
        setTheatres(data || []);
        setLoading(false);
      });
  }, [locationId]);

  return { theatres, loading };
}

export function useAvailableSlots(screenId: string | null, date: string | null) {
  const [slots, setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!screenId || !date) return;
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("slots")
      .select("*")
      .eq("screen_id", screenId)
      .eq("slot_date", date)
      .order("start_time")
      .then(({ data }) => {
        setSlots(data || []);
        setLoading(false);
      });
  }, [screenId, date]);

  return { slots, loading };
}

export function useAddons() {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("addons")
      .select("*")
      .eq("is_available", true)
      .order("sort_order")
      .then(({ data }) => setAddons(data || []));
  }, []);

  return { addons };
}