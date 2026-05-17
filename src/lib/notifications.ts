// lib/notifications.ts
import { Resend } from "resend";
import BookingConfirmation from "@/emails/BookingConfirmation";
import BookingCancellation from "@/emails/BookingCancellation";
import { SMS } from "./sms-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

// SMS via MSG91 (popular in India, supports DLT)
async function sendSMS(phone: string, message: string) {
  const res = await fetch("https://api.msg91.com/api/v5/flow/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "authkey": process.env.MSG91_AUTH_KEY!,
    },
    body: JSON.stringify({
      flow_id:   process.env.MSG91_FLOW_ID_TRANSACTIONAL,
      sender:    "PVTSCR",
      mobiles:   `91${phone.replace(/\s/g, "")}`,
      VAR1:      message,           // map to your DLT-approved template variable
    }),
  });
  return res.ok;
}

// ── Public notification functions ────────────────────────────────────────────

export async function notifyBookingConfirmed(booking: {
  customerName:   string;
  customerEmail:  string;
  customerPhone:  string;
  bookingRef:     string;
  theatreName:    string;
  theatreAddress: string;
  screenName:     string;
  date:           string;
  time:           string;
  occasion:       string;
  guestCount:     number;
  addons:         Array<{ name: string; quantity: number; price: number }>;
  screenPrice:    number;
  totalAmount:    number;
}) {
  // Send email + SMS in parallel
  const [emailResult, smsResult] = await Promise.allSettled([

    resend.emails.send({
      from:    "PrivateScreen <bookings@privatescreen.in>",
      to:      booking.customerEmail,
      subject: `Booking Confirmed — ${booking.bookingRef} · ${booking.theatreName}`,
      react:   BookingConfirmation(booking),
    }),

    sendSMS(
      booking.customerPhone,
      SMS.bookingConfirmed({
        name:    booking.customerName,
        ref:     booking.bookingRef,
        theatre: booking.theatreName,
        date:    booking.date,
        time:    booking.time,
      })
    ),
  ]);

  if (emailResult.status === "rejected") console.error("[notify] Email failed:", emailResult.reason);
  if (smsResult.status  === "rejected") console.error("[notify] SMS failed:",   smsResult.reason);

  return {
    email: emailResult.status === "fulfilled",
    sms:   smsResult.status   === "fulfilled",
  };
}

export async function notifyBookingCancelled(booking: {
  customerName:  string;
  customerEmail: string;
  customerPhone: string;
  bookingRef:    string;
  theatreName:   string;
  date:          string;
  time:          string;
  totalAmount:   number;
  refundDays?:   number;
}) {
  const refundDays = booking.refundDays ?? 5;

  await Promise.allSettled([
    resend.emails.send({
      from:    "PrivateScreen <bookings@privatescreen.in>",
      to:      booking.customerEmail,
      subject: `Booking Cancelled — ${booking.bookingRef}`,
      react:   BookingCancellation({ ...booking, refundDays }),
    }),
    sendSMS(
      booking.customerPhone,
      SMS.bookingCancelled({
        name:   booking.customerName,
        ref:    booking.bookingRef,
        amount: booking.totalAmount,
        days:   refundDays,
      })
    ),
  ]);
}

export async function notifyPaymentPending(booking: {
  customerName:  string;
  customerPhone: string;
  bookingRef:    string;
  totalAmount:   number;
}) {
  await sendSMS(
    booking.customerPhone,
    SMS.paymentPending({
      name:   booking.customerName,
      ref:    booking.bookingRef,
      amount: booking.totalAmount,
    })
  );
}