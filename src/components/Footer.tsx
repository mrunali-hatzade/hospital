"use client";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer} className="glass">
      <div className="container" style={styles.footerGrid}>
        {/* Clinic Info */}
        <div style={styles.col}>
          <h3 style={styles.logoText}>Nakade<span style={{ color: "var(--secondary)" }}> Hospital</span></h3>
          <p style={styles.tagline}>
            Providing premium, patient-centric healthcare and diagnostics driven by innovation and clinical excellence.
          </p>
          <div style={styles.trustBadges}>
            <span style={styles.badgeLabel} title="Health Insurance Portability and Accountability Act Compliant">🔒 HIPAA Secured</span>
            <span style={styles.badgeLabel} title="Joint Commission International Certified Quality Care">🎖️ JCI Certified</span>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.col}>
          <h4 style={styles.heading}>Services & Navigation</h4>
          <ul style={styles.list}>
            <li><button onClick={() => setActiveTab("home")} style={styles.linkBtn}>Home Dashboard</button></li>
            <li><button onClick={() => setActiveTab("departments")} style={styles.linkBtn}>Clinical Specialties</button></li>
            <li><button onClick={() => setActiveTab("doctors")} style={styles.linkBtn}>Our Practitioners</button></li>
            <li><button onClick={() => setActiveTab("booking")} style={styles.linkBtn}>Appointment Booking</button></li>
            <li><button onClick={() => setActiveTab("portal")} style={styles.linkBtn}>Patient Portal Login</button></li>
          </ul>
        </div>

        {/* Operating Hours */}
        <div style={styles.col}>
          <h4 style={styles.heading}>Operational Hours</h4>
          <ul style={styles.list}>
            <li style={styles.hoursItem}><span style={{ fontWeight: 600 }}>Emergency:</span> <span style={{ color: "var(--danger)", fontWeight: 700 }}>24/7 Available</span></li>
            <li style={styles.hoursItem}><span>Outpatient Care:</span> <span>Mon - Fri: 8 AM - 6 PM</span></li>
            <li style={styles.hoursItem}><span>Laboratory / Diagnostics:</span> <span>Mon - Sat: 7 AM - 8 PM</span></li>
            <li style={styles.hoursItem}><span>Pharmacy:</span> <span>Daily: 8 AM - 10 PM</span></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={styles.col}>
          <h4 style={styles.heading}>Contact & Locations</h4>
          <p style={styles.address}>
            📍 Sakoli Warsa Road, Sai Colony, MSEB Colony, Lakhandur, Maharashtra - 441803
          </p>
          <p style={styles.phone}>
            📞 Telephone: <a href="tel:+918275397699" style={{ fontWeight: 700, color: "var(--primary)" }}>+91 82753 97699</a>
          </p>
          <p style={styles.email}>
            ✉️ Inquiries: <a href="mailto:nakadenursinghomebhandara@rediffmail.com" style={{ textDecoration: "underline" }}>nakadenursinghomebhandara@rediffmail.com</a>
          </p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div className="container" style={styles.bottomContainer}>
          <p style={styles.copyText}>
            &copy; 2026 Nakade Hospital & Sonography Clinic. All rights reserved. Built by{" "}
            <a
              href="https://mrunali-hatzade.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: 600 }}
            >
              Mrunali Hatzade
            </a>.
          </p>
          <div style={styles.legalLinks}>
            <a href="#" style={styles.legalLink}>Privacy Policy</a>
            <a href="#" style={styles.legalLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid var(--border-glass)",
    paddingTop: "60px",
    marginTop: "auto",
    width: "100%",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "40px",
    paddingBottom: "48px",
  },
  col: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    textAlign: "left",
  },
  logoText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.6rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  tagline: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    lineHeight: 1.6,
  },
  trustBadges: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  badgeLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
    padding: "6px 12px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--primary)",
  },
  heading: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text-main)",
    position: "relative",
    paddingBottom: "8px",
    borderBottom: "2px solid var(--border)",
  },
  list: {
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
    transition: "var(--transition)",
    fontFamily: "var(--font-body)",
  },
  hoursItem: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px dashed var(--border)",
    paddingBottom: "6px",
  },
  address: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },
  phone: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
  },
  email: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
  },
  bottomBar: {
    borderTop: "1px solid var(--border)",
    padding: "24px 0",
    backgroundColor: "transparent",
  },
  bottomContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  copyText: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    maxWidth: "600px",
    lineHeight: 1.4,
  },
  legalLinks: {
    display: "flex",
    gap: "20px",
  },
  legalLink: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textDecoration: "underline",
  },
};
