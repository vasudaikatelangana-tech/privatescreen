// src/app/api/bookings/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdmin } from "@/lib/supabase/server-admin";

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = createAdmin();
    const body = await req.json();
    const { slot_id, occasion_type, guest_count, special_notes, addons } = body;

    if (!slot_id || !occasion_type || !guest_count) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Use a fixed test user — no auth needed for local dev ──
    const testEmail = "test@privatescreen.in";

    let { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", testEmail)
      .single();

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error: userError } = await supabaseAdmin
        .from("users")
        .insert({
          name:  "Test User",
          email: testEmail,
          phone: "9999999999",
        })
        .select("id")
        .single();

      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }
      userId = newUser!.id;
    }

    // ── Call atomic booking function ──
    const { data, error } = await supabaseAdmin.rpc("reserve_slot_atomic", {
      p_slot_id:       slot_id,
      p_user_id:       userId,
      p_occasion_type: occasion_type,
      p_guest_count:   guest_count,
      p_special_notes: special_notes ?? null,
      p_addons:        addons ?? [],
    });

    if (error) {
      const hint = error.hint ?? error.message ?? "";
      const isUnavailable =
        hint.includes("SLOT_UNAVAILABLE") || hint.includes("SLOT_LOCKED");
      return NextResponse.json(
        { error: isUnavailable
            ? "This slot is already booked! Please pick another time."
            : hint },
        { status: isUnavailable ? 409 : 500 }
      );
    }

    return NextResponse.json({
      success:    true,
      booking_id: data.booking_id,
      total:      data.total_amount,
    });

  } catch (err: any) {
    console.error("[create-booking]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}