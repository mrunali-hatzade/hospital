"use client";

import { useState, useEffect, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

function CountUp({ end, duration = 2000, decimals = 0, suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentCount = progress * end;
      setCount(currentCount);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return (
    <span>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

interface HeroProps {
  setActiveTab: (tab: string) => void;
  onTelehealthOpen: () => void;
}

export default function Hero({ setActiveTab, onTelehealthOpen }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      bgImage: "/hero_bg.png",
      badge: "🏥 Gynecology & Obstetrics",
      title: (
        <>
          Your Journey to{" "}
          <span style={{ color: "var(--primary)" }}>Wellness</span>
          <br />Starts Here
        </>
      ),
      description:
        "Compassionate prenatal, maternity, and gynecological care led by expert specialists in a safe, welcoming environment.",
    },
    {
      bgImage: "/hero_bg_cardiology.png",
      badge: "🔍 Sonography & Ultrasound",
      title: (
        <>
          Precision Imaging for{" "}
          <span style={{ color: "var(--primary)" }}>Clear &amp; Accurate</span>
          <br />Health Insights
        </>
      ),
      description:
        "Equipped with modern ultrasound machines to deliver reliable, detailed prenatal scans and clinical imaging.",
    },
    {
      bgImage: "/hero_bg_pediatrics.png",
      badge: "🧸 Pediatrics &amp; Child Care",
      title: (
        <>
          Bright Futures{" "}
          <span style={{ color: "var(--primary)" }}>Begin With</span>
          <br />Healthy Smiles
        </>
      ),
      description:
        "Gentle pediatric checkups, basic immunization schedules, and childhood wellness care in a friendly, supportive setting.",
    },
  ];

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const stats = [
    { end: 45, decimals: 0, suffix: "+", label: "Expert Specialists" },
    { end: 24, decimals: 0, suffix: "/7", label: "Emergency Care" },
    { end: 99.2, decimals: 1, suffix: "%", label: "Patient Satisfaction" },
    { end: 15, decimals: 0, suffix: "+", label: "Years of Trust" },
  ];

  const activeSlide = slides[currentSlide];

  return (
    <section style={styles.heroSection}>
      {/* Background video loop backdrop */}
      <video
        src="/vdo.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Gradient overlay — makes left side readable, right side shows through */}
      <div style={styles.heroOverlay} />

      {/* Content card — left side */}
      <div className="container" style={styles.heroContainer}>
        <div style={styles.contentCard} className="glass">
          {/* We key the inside div by currentSlide so the slideUp animation restarts on change */}
          <div key={currentSlide} className="animate-slide" style={{ display: "flex", flexDirection: "column" }}>
            <span style={styles.eyebrow} className="badge badge-primary">
              {activeSlide.badge}
            </span>
            <h1 style={styles.title}>
              {activeSlide.title}
            </h1>
            <p style={styles.description}>
              {activeSlide.description}
            </p>
          </div>

          {/* Live ECG pulse badge */}
          <div style={styles.liveBadge}>
            <span style={styles.liveDot} />
            <span style={styles.liveLabel}>Live Patient Monitoring Active</span>
          </div>

          <div style={styles.ctaGroup}>
            <button
              onClick={() => setActiveTab("booking")}
              className="btn btn-primary"
              style={styles.ctaBtn}
            >
              📅 Book Appointment
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button onClick={() => setActiveTab("doctors")} className="btn btn-outline" style={styles.ctaBtn}>
              🔍 Find a Specialist
            </button>
            <button onClick={onTelehealthOpen} className="btn btn-secondary" style={styles.ctaBtn}>
              💻 Telehealth
            </button>
          </div>

          {/* Interactive slider indicator dots */}
          <div style={styles.dotsContainer}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  resetTimer();
                }}
                style={{
                  ...styles.dot,
                  width: currentSlide === idx ? "24px" : "8px",
                  opacity: currentSlide === idx ? 1 : 0.4,
                  backgroundColor: currentSlide === idx ? "var(--primary)" : "var(--text-muted)",
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats floating bar */}
      <div className="container" style={styles.statsContainer}>
        <div className="stats-grid glass" style={styles.statsBox}>
          {stats.map((stat, idx) => (
            <div key={idx} style={styles.statItem}>
              <h3 style={styles.statValue}>
                <CountUp end={stat.end} decimals={stat.decimals} suffix={stat.suffix} />
              </h3>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  heroSection: {
    position: "relative",
    overflow: "hidden",
    minHeight: "88vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingTop: "80px",
    paddingBottom: "120px",
  },

  heroBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center right",
    zIndex: 0,
  },

  // Gradient: left-heavy to keep text readable, right transparent to show doctor+bg
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "var(--hero-overlay)",
    zIndex: 1,
  },

  heroContainer: {
    position: "relative",
    zIndex: 3,
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  // Glassmorphic content card — uses existing .glass styles
  contentCard: {
    maxWidth: "680px",
    padding: "44px 40px",
    borderRadius: "var(--radius-lg)",
    textAlign: "left",
  },

  eyebrow: {
    marginBottom: "18px",
    fontSize: "0.78rem",
    padding: "6px 14px",
    display: "inline-block",
    alignSelf: "flex-start",
  },

  title: {
    fontSize: "3.0rem",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    marginBottom: "16px",
    lineHeight: 1.15,
    color: "var(--text-main)",
  },

  description: {
    fontSize: "1.02rem",
    color: "var(--text-muted)",
    marginBottom: "20px",
    lineHeight: 1.7,
  },

  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--primary-light)",
    border: "1px solid var(--primary)",
    borderRadius: "var(--radius-full)",
    padding: "5px 14px",
    marginBottom: "24px",
    marginTop: "16px",
  },

  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--primary)",
    boxShadow: "0 0 0 3px var(--primary-light)",
    animation: "pulse-emergency 1.5s ease-in-out infinite",
    display: "inline-block",
    flexShrink: 0,
  },

  liveLabel: {
    fontSize: "0.76rem",
    fontWeight: 600,
    color: "var(--primary)",
    letterSpacing: "0.03em",
  },

  ctaGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  ctaBtn: {
    fontSize: "0.9rem",
  },

  dotsContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "24px",
    alignItems: "center",
  },

  dot: {
    height: "8px",
    borderRadius: "var(--radius-full)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: 0,
  },

  statsContainer: {
    position: "relative",
    zIndex: 4,
    marginTop: "-40px",
    paddingBottom: "20px",
  },

  statsBox: {
    padding: "28px 32px",
    borderRadius: "var(--radius-md)",
    textAlign: "center",
  },

  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  statValue: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "var(--primary)",
    marginBottom: "4px",
  },

  statLabel: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "var(--text-muted)",
  },
};
