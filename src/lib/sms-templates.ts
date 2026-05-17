// lib/sms-templates.ts

export const SMS = {

    bookingConfirmed: (p: {
      name:      string;
      ref:       string;
      theatre:   string;
      date:      string;
      time:      string;
    }) =>
      `Hi ${p.name.split(" ")[0]}! Your PrivateScreen booking is CONFIRMED.\n` +
      `Ref: ${p.ref}\n` +
      `${p.theatre} | ${p.date} | ${p.time}\n` +
      `Show this SMS at reception. Enjoy your experience!\n` +
      `Details: https://privatescreen.in/b/${p.ref}`,
  
    paymentPending: (p: { name: string; ref: string; amount: number }) =>
      `Hi ${p.name.split(" ")[0]}, your PrivateScreen booking ${p.ref} is PENDING payment of ` +
      `Rs.${p.amount.toLocaleString("en-IN")}. Complete payment: https://privatescreen.in/pay/${p.ref}`,
  
    bookingCancelled: (p: { name: string; ref: string; amount: number; days: number }) =>
      `Hi ${p.name.split(" ")[0]}, your booking ${p.ref} has been cancelled. ` +
      `Refund of Rs.${p.amount.toLocaleString("en-IN")} will reflect in ${p.days} business days. ` +
      `Help: +91 98765 43210`,
  
    dayBeforeReminder: (p: { name: string; theatre: string; time: string; ref: string }) =>
      `Reminder: Your private theatre experience is TOMORROW! ` +
      `${p.theatre} | ${p.time} | Arrive 10 mins early. Ref: ${p.ref} - PrivateScreen`,
  
    twoHourReminder: (p: { name: string; theatre: string; address: string; time: string }) =>
      `Your show starts in 2 hours! ${p.theatre}, ${p.address} at ${p.time}. ` +
      `Show your booking ID at reception. See you soon! - PrivateScreen`,
  
    otpVerification: (p: { otp: string }) =>
      `${p.otp} is your PrivateScreen OTP. Valid for 10 minutes. Do NOT share with anyone. - PrivateScreen`,
  };