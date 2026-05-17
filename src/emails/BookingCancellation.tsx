// emails/BookingCancellation.tsx
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Hr } from "@react-email/components";

export default function BookingCancellation({
  customerName = "Priya Reddy",
  bookingRef   = "PS7X2KA",
  theatreName  = "Party Flix",
  date         = "26 March 2026",
  time         = "07:00 PM",
  totalAmount  = 3497,
  refundDays   = 5,
}) {
  return (
    <Html>
      <Head />
      <Preview>Your booking {bookingRef} has been cancelled</Preview>
      <Body style={{ backgroundColor: "#F5F2ED", fontFamily: "DM Sans, Helvetica, sans-serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto" }}>
          <Section style={{ backgroundColor: "#0D0D0D", padding: "28px 32px" }}>
            <Text style={{ fontSize: "20px", color: "#C9A84C", letterSpacing: "4px", textTransform: "uppercase", fontWeight: 300 }}>
              Private<span style={{ color: "#fff" }}>Screen</span>
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "32px", margin: "20px 0", border: "1px solid #EDE9E2" }}>
            <Heading style={{ fontSize: "22px", color: "#0D0D0D", fontWeight: 400 }}>
              Booking Cancelled
            </Heading>
            <Text style={{ color: "#7A7060", fontSize: "14px" }}>
              Hi {customerName.split(" ")[0]}, your booking <strong>{bookingRef}</strong> at {theatreName} on {date} at {time} has been cancelled.
            </Text>

            <Hr style={{ borderColor: "#EDE9E2" }} />

            <Section style={{ backgroundColor: "#FFFCF3", borderRadius: "8px", padding: "16px 20px", border: "1px solid #EDE9E2" }}>
              <Text style={{ fontSize: "12px", color: "#7A7060", margin: "0 0 4px" }}>REFUND AMOUNT</Text>
              <Text style={{ fontSize: "28px", color: "#27AE60", fontWeight: 700, margin: 0 }}>
                ₹{totalAmount.toLocaleString("en-IN")}
              </Text>
              <Text style={{ fontSize: "12px", color: "#7A7060", margin: "6px 0 0" }}>
                Will be credited to your original payment method within {refundDays} business days
              </Text>
            </Section>

            <Text style={{ fontSize: "13px", color: "#7A7060", marginTop: "20px" }}>
              Questions? Contact us at support@privatescreen.in or call +91 98765 43210
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}