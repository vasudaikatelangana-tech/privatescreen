// emails/BookingConfirmation.tsx
import {
    Body, Button, Container, Column, Head, Heading,
    Hr, Html, Img, Preview, Row, Section, Text,
  } from "@react-email/components";
  
  interface BookingConfirmationProps {
    customerName:  string;
    bookingRef:    string;
    theatreName:   string;
    theatreAddress:string;
    screenName:    string;
    date:          string;
    time:          string;
    occasion:      string;
    guestCount:    number;
    addons:        Array<{ name: string; quantity: number; price: number }>;
    screenPrice:   number;
    totalAmount:   number;
  }
  
  const styles = {
    body:       { backgroundColor: "#F5F2ED", fontFamily: "'DM Sans', Helvetica, Arial, sans-serif" },
    container:  { maxWidth: "560px", margin: "0 auto" },
    header:     { backgroundColor: "#0D0D0D", padding: "28px 32px" },
    logo:       { fontSize: "20px", color: "#C9A84C", letterSpacing: "4px", textTransform: "uppercase" as const, fontWeight: 300 },
    logoSpan:   { color: "#ffffff" },
    card:       { backgroundColor: "#ffffff", borderRadius: "12px", overflow: "hidden", margin: "20px 0", border: "1px solid #EDE9E2" },
    refBanner:  { backgroundColor: "#0D0D0D", padding: "20px 32px", textAlign: "center" as const },
    refLabel:   { fontSize: "10px", color: "rgba(255,255,255,0.4)", letterSpacing: "3px", textTransform: "uppercase" as const, margin: "0 0 6px" },
    refCode:    { fontSize: "24px", color: "#C9A84C", letterSpacing: "6px", fontWeight: 600, margin: 0 },
    section:    { padding: "20px 32px", borderBottom: "1px solid #F0EDE8" },
    label:      { fontSize: "10px", color: "#7A7060", letterSpacing: "2px", textTransform: "uppercase" as const, margin: "0 0 4px" },
    value:      { fontSize: "17px", color: "#0D0D0D", margin: "0 0 2px", fontWeight: 500 },
    valueSub:   { fontSize: "12px", color: "#7A7060", margin: 0 },
    lineRow:    { padding: "8px 0", borderBottom: "1px solid #F0EDE8", fontSize: "13px" },
    total:      { fontSize: "22px", color: "#0D0D0D", fontWeight: 700, textAlign: "right" as const },
    btn:        { backgroundColor: "#C9A84C", color: "#0D0D0D", padding: "14px 32px", borderRadius: "10px", fontWeight: 600, fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase" as const, textDecoration: "none", display: "inline-block" },
    footer:     { padding: "24px 32px", textAlign: "center" as const },
    footerText: { fontSize: "11px", color: "#9994AA", margin: "4px 0", lineHeight: "1.6" },
  };
  
  export default function BookingConfirmation({
    customerName  = "Priya Reddy",
    bookingRef    = "PS7X2KA",
    theatreName   = "Party Flix",
    theatreAddress= "Miyapur X Roads, Near Metro",
    screenName    = "Screen 2 — Luxe",
    date          = "26 March 2026",
    time          = "07:00 PM",
    occasion      = "Birthday",
    guestCount    = 10,
    addons        = [{ name: "Chocolate Fudge Cake", quantity: 1, price: 799 }, { name: "Balloon Decoration", quantity: 1, price: 499 }],
    screenPrice   = 2199,
    totalAmount   = 3497,
  }: BookingConfirmationProps) {
  
    const addonTotal = addons.reduce((s, a) => s + a.price * a.quantity, 0);
  
    return (
      <Html>
        <Head />
        <Preview>Your booking at {theatreName} is confirmed — {bookingRef}</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
  
            {/* Header */}
            <Section style={styles.header}>
              <Text style={styles.logo}>
                Private<span style={styles.logoSpan}>Screen</span>
              </Text>
            </Section>
  
            <div style={styles.card}>
              {/* Booking ref banner */}
              <div style={styles.refBanner}>
                <p style={styles.refLabel}>Booking Confirmed</p>
                <p style={styles.refCode}>{bookingRef}</p>
              </div>
  
              {/* Greeting */}
              <Section style={{ padding: "24px 32px 0" }}>
                <Heading style={{ fontSize: "22px", color: "#0D0D0D", fontWeight: 400, margin: "0 0 8px" }}>
                  You're all set, {customerName.split(" ")[0]}! 🎉
                </Heading>
                <Text style={{ fontSize: "14px", color: "#7A7060", margin: 0 }}>
                  Your private theatre experience has been booked and confirmed.
                </Text>
              </Section>
  
              {/* Booking details */}
              <Section style={styles.section}>
                <Row>
                  <Column>
                    <p style={styles.label}>Theatre</p>
                    <p style={styles.value}>{theatreName}</p>
                    <p style={styles.valueSub}>{theatreAddress}</p>
                  </Column>
                  <Column>
                    <p style={styles.label}>Screen</p>
                    <p style={styles.value}>{screenName}</p>
                    <p style={styles.valueSub}>Up to {guestCount} guests</p>
                  </Column>
                </Row>
              </Section>
  
              <Section style={styles.section}>
                <Row>
                  <Column>
                    <p style={styles.label}>Date</p>
                    <p style={styles.value}>{date}</p>
                  </Column>
                  <Column>
                    <p style={styles.label}>Time</p>
                    <p style={styles.value}>{time}</p>
                    <p style={styles.valueSub}>Duration: 3 hours</p>
                  </Column>
                  <Column>
                    <p style={styles.label}>Occasion</p>
                    <p style={styles.value}>{occasion}</p>
                  </Column>
                </Row>
              </Section>
  
              {/* Order summary */}
              <Section style={{ padding: "20px 32px" }}>
                <p style={{ ...styles.label, marginBottom: "12px" }}>Order Summary</p>
  
                <Row style={styles.lineRow}>
                  <Column><Text style={{ margin: 0, color: "#0D0D0D" }}>{screenName}</Text></Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={{ margin: 0, color: "#7A7060" }}>₹{screenPrice.toLocaleString("en-IN")}</Text>
                  </Column>
                </Row>
  
                {addons.map((addon, i) => (
                  <Row key={i} style={styles.lineRow}>
                    <Column>
                      <Text style={{ margin: 0, color: "#0D0D0D" }}>
                        {addon.name} ×{addon.quantity}
                      </Text>
                    </Column>
                    <Column style={{ textAlign: "right" }}>
                      <Text style={{ margin: 0, color: "#7A7060" }}>
                        ₹{(addon.price * addon.quantity).toLocaleString("en-IN")}
                      </Text>
                    </Column>
                  </Row>
                ))}
  
                <Hr style={{ borderColor: "#EDE9E2", margin: "12px 0" }} />
  
                <Row>
                  <Column><Text style={{ margin: 0, fontSize: "13px", color: "#7A7060" }}>Total Paid</Text></Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={{ ...styles.total, margin: 0 }}>
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </Text>
                  </Column>
                </Row>
              </Section>
  
              {/* CTA */}
              <Section style={{ padding: "0 32px 28px", textAlign: "center" }}>
                <Button style={styles.btn} href={`https://privatescreen.in/booking/${bookingRef}`}>
                  View My Booking
                </Button>
              </Section>
            </div>
  
            {/* What to expect */}
            <div style={{ ...styles.card, padding: "20px 32px" }}>
              <Text style={{ ...styles.label, marginBottom: "14px" }}>What to expect</Text>
              {[
                ["🕐", "Arrive 10 mins early", "So the team can set up your add-ons before you enter"],
                ["🎂", "Add-ons will be ready", "Cake, decoration & food will be arranged before your slot"],
                ["📱", "Show this email", "Or your booking ID at the reception for a smooth check-in"],
              ].map(([icon, title, desc]) => (
                <Row key={title} style={{ marginBottom: "14px" }}>
                  <Column style={{ width: "32px" }}>
                    <Text style={{ fontSize: "20px", margin: 0 }}>{icon}</Text>
                  </Column>
                  <Column>
                    <Text style={{ margin: "0 0 2px", fontSize: "13px", color: "#0D0D0D", fontWeight: 500 }}>{title}</Text>
                    <Text style={{ margin: 0, fontSize: "12px", color: "#7A7060" }}>{desc}</Text>
                  </Column>
                </Row>
              ))}
            </div>
  
            {/* Footer */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>Need help? Reply to this email or call us at +91 98765 43210</Text>
              <Text style={styles.footerText}>© 2026 PrivateScreen · Hyderabad</Text>
              <Text style={styles.footerText}>
                <a href="#" style={{ color: "#7A7060" }}>Cancel booking</a> · <a href="#" style={{ color: "#7A7060" }}>Unsubscribe</a>
              </Text>
            </Section>
  
          </Container>
        </Body>
      </Html>
    );
  }