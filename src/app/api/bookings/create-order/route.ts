// app/api/bookings/create-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      slot_id,
      occasion_type,
      guest_count,
      special_notes,
      addons,
    } = body;

    // Basic validation
    if (!slot_id || !occasion_type || !guest_count) {
      return NextResponse.json(
        { error: 'Missing required fields: slot_id, occasion_type, guest_count' },
        { status: 400 }
      );
    }

    // 1. Reserve the slot atomically via Postgres RPC
    const { data: reservation, error: reserveError } = await supabase.rpc(
      'reserve_slot_atomic',
      {
        p_slot_id:       slot_id,
        p_user_id:       user.id,
        p_occasion_type: occasion_type,
        p_guest_count:   guest_count,
        p_special_notes: special_notes ?? null,
        p_addons:        addons ?? [],
      }
    );

    if (reserveError) {
      const hint = reserveError.hint ?? reserveError.message;
      const isUnavailable =
        hint.includes('SLOT_UNAVAILABLE') || hint.includes('SLOT_LOCKED');

      return NextResponse.json(
        { error: isUnavailable ? hint : 'Booking failed. Please try again.' },
        { status: isUnavailable ? 409 : 500 }
      );
    }

    const { booking_id, total_amount } = reservation;

    // 2. Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount:          Math.round(total_amount * 100),
      currency:        'INR',
      receipt:         `booking_${booking_id}`,
      notes: {
        booking_id,
        user_id: user.id,
      },
    });

    // 3. Save Razorpay order ID against the booking
    await supabase
      .from('bookings')
      .update({ razorpay_order_id: order.id })
      .eq('id', booking_id);

    return NextResponse.json({
      booking_id,
      order_id:    order.id,
      amount:      order.amount,
      currency:    order.currency,
      key_id:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });

  } catch (err: any) {
    console.error('[create-order]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}