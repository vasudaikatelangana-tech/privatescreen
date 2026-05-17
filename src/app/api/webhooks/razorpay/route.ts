// app/api/webhooks/razorpay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server-admin'; // uses service role key

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

function verifySignature(body: string, signature: string): boolean {
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  // 1. Verify the webhook is genuinely from Razorpay
  if (!verifySignature(rawBody, signature)) {
    console.warn('[webhook] Invalid signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const supabase = createClient(); // service role — bypasses RLS

  switch (event.event) {

    case 'payment.captured': {
      const payment = event.payload.payment.entity;
      const bookingId = payment.notes?.booking_id;

      if (!bookingId) break;

      await supabase
        .from('bookings')
        .update({
          payment_status:      'paid',
          booking_status:      'confirmed',
          razorpay_payment_id: payment.id,
        })
        .eq('id', bookingId);

      // TODO: trigger confirmation email/SMS here
      break;
    }

    case 'payment.failed': {
      const payment = event.payload.payment.entity;
      const bookingId = payment.notes?.booking_id;

      if (!bookingId) break;

      // Mark booking failed and free the slot back up
      await supabase
        .from('bookings')
        .update({ payment_status: 'failed', booking_status: 'cancelled' })
        .eq('id', bookingId);

      // Re-open the slot so other users can book it
      const { data: booking } = await supabase
        .from('bookings')
        .select('slot_id')
        .eq('id', bookingId)
        .single();

      if (booking) {
        await supabase
          .from('slots')
          .update({ status: 'available' })
          .eq('id', booking.slot_id);
      }
      break;
    }

    case 'refund.created': {
      const refund   = event.payload.refund.entity;
      const orderId  = refund.payment_id; // Razorpay uses payment_id in refund entity

      await supabase
        .from('bookings')
        .update({ payment_status: 'refunded', booking_status: 'cancelled' })
        .eq('razorpay_payment_id', orderId);
      break;
    }

    default:
      // Unhandled event — log and return 200 so Razorpay stops retrying
      console.log('[webhook] Unhandled event:', event.event);
  }

  return NextResponse.json({ received: true });
}