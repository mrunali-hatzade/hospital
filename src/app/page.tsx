"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Departments from "@/components/Departments";
import DoctorSearch from "@/components/DoctorSearch";
import AppointmentBooking from "@/components/AppointmentBooking";
import PatientPortal from "@/components/PatientPortal";
import SymptomChecker from "@/components/SymptomChecker";
import Footer from "@/components/Footer";
import VitalWaveCanvas from "@/components/VitalWaveCanvas";
import AdminDashboard, { Doctor } from "@/components/AdminDashboard";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  separator?: string;
}

function CountUp({ end, duration = 2000, decimals = 0, suffix = "", separator = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
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
  }, [hasStarted, end, duration]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    if (!separator) return fixed;
    const parts = fixed.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join(".");
  };

  return (
    <span ref={elementRef}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [preSelectedDoctor, setPreSelectedDoctor] = useState("");
  const [isTelehealthOpen, setIsTelehealthOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState<string | null>(null);
  const [showGoToTop, setShowGoToTop] = useState(false);

  // Lifted Doctor Availability State
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "dr-lalit-nakade",
      name: "Dr. Lalit Nakade",
      specialty: "Sonography & Diagnostics",
      rating: 4.9,
      reviewsCount: 124,
      availableToday: true,
      onlineConsult: true,
      imgUrl: "/doctor_1.png",
      bio: "Dr. Lalit Nakade is an experienced physician and diagnostic specialist in Lakhandur, dedicated to providing accurate ultrasound imaging and primary medical care.",
      education: "MBBS - Government Medical College, Advanced Ultrasonography Fellowship",
      languages: ["Marathi", "Hindi", "English"],
      npi: "MCI-52917",
      availabilityStatus: "Available",
    },
    {
      id: "dr-pallavi-nakade",
      name: "Dr. Pallavi Nakade",
      specialty: "Gynecology & Obstetrics",
      rating: 4.8,
      reviewsCount: 98,
      availableToday: true,
      onlineConsult: true,
      imgUrl: "/doctor_2.png",
      bio: "Dr. Pallavi Nakade is a dedicated Obstetrician & Gynecologist specializing in high-risk pregnancies, maternal wellness care, and gynecological checkups in Lakhandur.",
      education: "MBBS, DGO - Gynecology & Obstetrics, Laparoscopic Surgery training",
      languages: ["Marathi", "Hindi", "English"],
      npi: "MCI-61840",
      availabilityStatus: "In Consultation",
    },
    {
      id: "dr-amit",
      name: "Dr. Amit Rahangdale",
      specialty: "General Medical Care",
      rating: 4.7,
      reviewsCount: 86,
      availableToday: false,
      onlineConsult: true,
      imgUrl: "/doctor_1.png",
      bio: "Dr. Amit specializes in primary family medicine, chronic disease management, and emergency clinical triaging.",
      education: "MBBS, MD - General Medicine",
      languages: ["Marathi", "Hindi", "English"],
      npi: "MCI-48371",
      availabilityStatus: "Off Duty",
    },
    {
      id: "dr-sneha",
      name: "Dr. Sneha Tembhurne",
      specialty: "Pediatrics & Child Care",
      rating: 4.85,
      reviewsCount: 72,
      availableToday: true,
      onlineConsult: false,
      imgUrl: "/doctor_2.png",
      bio: "Dr. Sneha is a compassionate pediatric consultant providing child growth tracking, basic immunizations, and general pediatric clinical care.",
      education: "MBBS, DCH - Child Health",
      languages: ["Marathi", "Hindi", "English"],
      npi: "MCI-39283",
      availabilityStatus: "Available",
    },
  ]);

  const handleUpdateDoctorStatus = (id: string, status: Doctor["availabilityStatus"]) => {
    setDoctors((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              availabilityStatus: status,
              availableToday: status === "Available" || status === "In Consultation",
            }
          : doc
      )
    );
  };

  useEffect(() => {
    if (isTelehealthOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isTelehealthOpen]);

  // Trigger Awwwards-style scroll reveal animations
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeTab]);

  // Scroll to Top visibility control
  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 300) {
        setShowGoToTop(true);
      } else {
        setShowGoToTop(false);
      }
    };
    window.addEventListener("scroll", handleScrollVisibility);
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);

  // FAQ Accordion states
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const faqs = [
    {
      q: "How can I prepare for my first appointment?",
      a: "Please arrive 15 minutes early at our check-in kiosk. Bring your insurance details card, physical photo ID, and a list of any current medications you are taking.",
    },
    {
      q: "Does Nakade Nursing Home accept insurance plans?",
      a: "Yes, we accept major insurance plans and corporate covers. Self-pay discount programs are also available for outpatient sonography scans.",
    },
    {
      q: "How does the virtual Telehealth system work?",
      a: "Telehealth consults happen via secure video link inside our Patient Portal. Once booked, you will receive a secure portal code to join your doctor on your smartphone or desktop.",
    },
    {
      q: "How can I request prescription refills?",
      a: "Simply log in to the Patient Portal using your secure credentials, navigate to the 'Prescriptions' tab, and select 'Request Refill' on your active clinical parameters.",
    },
  ];

  // Testimonials State (to allow live additions)
  const [testimonials, setTestimonials] = useState([
    {
      quote: "Highly professional doctors and staff. The sonography room was clean, sterile, and private. Dr. Nakade took the time to explain the scan report in detail. Best ultrasound clinic in Lakhandur.",
      author: "Anjali Sharma",
      rating: 5,
      date: "1 week ago",
    },
    {
      quote: "Excellent maternity care! I visited Nakade Nursing Home for my prenatal scans and gynecological checkups. The doctors and & staff are extremely gentle and reassuring.",
      author: "Priya Patel",
      rating: 5,
      date: "3 weeks ago",
    },
  ]);

  // Feedback Form State
  const [fbName, setFbName] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbMessage, setFbMessage] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState(false);
  const [submittedFeedbackText, setSubmittedFeedbackText] = useState("");
  const [copyFeedbackSuccess, setCopyFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbMessage.trim()) return;

    const msgText = fbMessage.trim();

    // Create a new testimonial
    const newTestimonial = {
      quote: msgText,
      author: fbName.trim(),
      rating: fbRating,
      date: "Just now",
    };

    // Prepend to testimonials state
    setTestimonials((prev) => [newTestimonial, ...prev]);
    setSubmittedFeedbackText(msgText);
    setCopyFeedbackSuccess(false);

    // Reset form & show success
    setFbName("");
    setFbRating(5);
    setFbMessage("");
    setFeedbackStatus(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}>
      {/* Global Interactive Background Canvas */}
      <VitalWaveCanvas />

      {/* Dynamic Header Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Routed Area */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === "home" && (
          <div className="animate-fade">
            {/* Hero Section */}
            <Hero
              setActiveTab={setActiveTab}
              onTelehealthOpen={() => setIsTelehealthOpen(true)}
            />

            {/* Highlights Feature Boxes */}
            <section style={{ padding: "40px 0 20px 0" }}>
              <div className="container" style={styles.featuresGrid}>
                <div className="card glass bouncy-hover" style={{ ...styles.featureCard, borderLeft: "4px solid var(--danger)" }}>
                  <div style={styles.featureIconBox}>🤰</div>
                  <h4 style={styles.featureTitle}>Well Women Clinic</h4>
                  <p style={styles.featureDesc}>Comprehensive gynecological screening, PCOD management, and wellness checks.</p>
                </div>
                <div className="card glass bouncy-hover" style={{ ...styles.featureCard, borderLeft: "4px solid var(--primary)" }}>
                  <div style={styles.featureIconBox}>🔍</div>
                  <h4 style={styles.featureTitle}>Obstetrics &amp; Scans</h4>
                  <p style={styles.featureDesc}>Advanced 3D/4D ultrasound sonography, prenatal health, and fetal screening.</p>
                </div>
                <div className="card glass bouncy-hover" style={{ ...styles.featureCard, borderLeft: "4px solid var(--warning)" }}>
                  <div style={styles.featureIconBox}>🧸</div>
                  <h4 style={styles.featureTitle}>Pediatric Care</h4>
                  <p style={styles.featureDesc}>Gentle checkups, growth monitoring, and newborn immunization schedules.</p>
                </div>
                <div className="card glass bouncy-hover" style={{ ...styles.featureCard, borderLeft: "4px solid var(--info)" }}>
                  <div style={styles.featureIconBox}>🏥</div>
                  <h4 style={styles.featureTitle}>General Medicine</h4>
                  <p style={styles.featureDesc}>Family medicine, seasonal fever care, and 24/7 emergency clinical support.</p>
                </div>
              </div>
            </section>

            {/* About the Doctors Section */}
            <section id="about-doctors" className="section-padding" style={{ backgroundColor: "rgba(var(--primary-hsl), 0.03)", borderTop: "1px solid var(--border-glass)", borderBottom: "1px solid var(--border-glass)" }}>
              <div className="container" style={{ maxWidth: "1200px" }}>
                <div className="reveal active" style={{ textAlign: "center", marginBottom: "48px" }}>
                  <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Our Clinicians</span>
                  <h2 style={{ fontSize: "2.2rem" }}>Meet Our Chief Medical Specialists</h2>
                  <p style={{ color: "var(--text-muted)", maxWidth: "800px", margin: "10px auto 0" }}>
                    Expert medical care led by dedicated professionals specializing in advanced diagnostics, maternity wellness, and family care.
                  </p>
                </div>

                <div style={styles.doctorsSectionGrid}>
                  {/* Doctor 1: Dr. Lalit Nakade */}
                  <div className="card glass reveal active" style={styles.drProfileCard}>
                    <div style={styles.drImageWrapper}>
                      <img src="/doctor_1.png" alt="Dr. Lalit Nakade" style={styles.drProfileImg} />
                      <div style={styles.drBadgeOverlay}>Chief Physician</div>
                    </div>
                    <div style={styles.drProfileContent}>
                      <h3 style={styles.drName}>Dr. Lalit Nakade</h3>
                      <p style={styles.drTitle}>MBBS • Chief of Diagnostics &amp; Sonology</p>
                      <p style={styles.drBio}>
                        Dr. Lalit Nakade has over 15 years of clinical experience. He is highly skilled in advanced ultrasound sonography, prenatal diagnostic checks, and general medical care, providing reassuring guidance to families in Lakhandur.
                      </p>
                      <div style={styles.credentialsList}>
                        <div style={styles.credentialItem}>✔️ MBBS - Government Medical College</div>
                        <div style={styles.credentialItem}>✔️ Fellowship in Advanced Ultrasonography</div>
                        <div style={styles.credentialItem}>✔️ Expert in General OPD &amp; Diagnostics</div>
                        <div style={styles.credentialItem}>✔️ Fluent in Marathi, Hindi, &amp; English</div>
                      </div>
                      <button onClick={() => { setSelectedDepartment("Sonography"); setPreSelectedDoctor("Dr. Lalit Nakade"); setActiveTab("booking"); }} className="btn btn-primary" style={{ marginTop: "16px", width: "100%", justifyContent: "center" }}>
                        Book Appointment &rarr;
                      </button>
                    </div>
                  </div>

                  {/* Doctor 2: Dr. Pallavi Nakade */}
                  <div className="card glass reveal active" style={styles.drProfileCard}>
                    <div style={styles.drImageWrapper}>
                      <img src="/doctor_2.png" alt="Dr. Pallavi Nakade" style={styles.drProfileImg} />
                      <div style={styles.drBadgeOverlay}>Gynecologist</div>
                    </div>
                    <div style={styles.drProfileContent}>
                      <h3 style={styles.drName}>Dr. Pallavi Nakade</h3>
                      <p style={styles.drTitle}>MBBS, DGO • Consultant Gynecologist &amp; Obstetrician</p>
                      <p style={styles.drBio}>
                        Dr. Pallavi Nakade is a dedicated women's health specialist. She is an expert in maternity care, high-risk pregnancy management, normal/painless deliveries, and laparoscopic gynecological care in Lakhandur.
                      </p>
                      <div style={styles.credentialsList}>
                        <div style={styles.credentialItem}>✔️ MBBS &amp; DGO - Gynecology &amp; Obstetrics</div>
                        <div style={styles.credentialItem}>✔️ Specialization in High-Risk Pregnancies</div>
                        <div style={styles.credentialItem}>✔️ Trained in Laparoscopic Surgery</div>
                        <div style={styles.credentialItem}>✔️ Fluent in Marathi, Hindi, &amp; English</div>
                      </div>
                      <button onClick={() => { setSelectedDepartment("Gynecology"); setPreSelectedDoctor("Dr. Pallavi Nakade"); setActiveTab("booking"); }} className="btn btn-primary" style={{ marginTop: "16px", width: "100%", justifyContent: "center" }}>
                        Book Appointment &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Specialties Preview Section */}
            <Departments
              setActiveTab={setActiveTab}
              setSelectedDepartment={setSelectedDepartment}
            />

            {/* Maternity & Diagnostic Services Grid */}
            <section id="maternity-services" className="section-padding" style={{ backgroundColor: "transparent", borderTop: "1px solid var(--border-glass)", borderBottom: "1px solid var(--border-glass)" }}>
              <div className="container" style={{ maxWidth: "1200px" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                  <span className="badge badge-secondary" style={{ marginBottom: "12px" }}>Maternity &amp; Sonography</span>
                  <h2 style={{ fontSize: "2.2rem" }}>Dedicated Maternity &amp; Scan Services</h2>
                  <p style={{ color: "var(--text-muted)", maxWidth: "800px", margin: "10px auto 0" }}>
                    Nakade Hospital provides specialized pathways for healthy mothers, safe deliveries, and precise diagnostic imaging.
                  </p>
                </div>

                <div style={styles.maternityServicesGrid}>
                  <div className="card glass bouncy-hover" style={styles.serviceBoxCard}>
                    <div style={styles.serviceIcon}>🤰</div>
                    <h4 style={styles.serviceTitleText}>High Risk Pregnancy</h4>
                    <p style={styles.serviceDescText}>Specialized care and advanced clinical monitoring for high-risk maternal conditions, ensuring safety for mother and baby.</p>
                    <ul style={styles.serviceBulletList}>
                      <li>• Advanced clinical monitoring</li>
                      <li>• 24/7 care &amp; emergency support</li>
                      <li>• Personalized pregnancy path</li>
                    </ul>
                  </div>

                  <div className="card glass bouncy-hover" style={styles.serviceBoxCard}>
                    <div style={styles.serviceIcon}>👶</div>
                    <h4 style={styles.serviceTitleText}>Normal &amp; Painless Delivery</h4>
                    <p style={styles.serviceDescText}>Supportive normal delivery environment and specialized pain management/epidural anesthesia services by experts.</p>
                    <ul style={styles.serviceBulletList}>
                      <li>• Expert pain management</li>
                      <li>• Dedicated anesthesia care</li>
                      <li>• Comfortable delivery suites</li>
                    </ul>
                  </div>

                  <div className="card glass bouncy-hover" style={styles.serviceBoxCard}>
                    <div style={styles.serviceIcon}>🔍</div>
                    <h4 style={styles.serviceTitleText}>Antenatal &amp; Postnatal Care</h4>
                    <p style={styles.serviceDescText}>Comprehensive pre-birth screening programs, physical health monitoring, diet counseling, and post-birth pediatric recovery support.</p>
                    <ul style={styles.serviceBulletList}>
                      <li>• Routine maternal screenings</li>
                      <li>• Post-birth pediatric checkups</li>
                      <li>• Nutritional counseling</li>
                    </ul>
                  </div>

                  <div className="card glass bouncy-hover" style={styles.serviceBoxCard}>
                    <div style={styles.serviceIcon}>🔬</div>
                    <h4 style={styles.serviceTitleText}>3D/4D Fetal Sonography</h4>
                    <p style={styles.serviceDescText}>High-tech, clear ultrasound scanning showing fetal anomalies, development milestones, and detailed baby growth reports.</p>
                    <ul style={styles.serviceBulletList}>
                      <li>• Detailed fetal anomaly scans</li>
                      <li>• Growth milestone reports</li>
                      <li>• Precision color Doppler scans</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Clinic Gallery Section */}
            <section id="clinic-gallery" className="section-padding" style={{ backgroundColor: "rgba(var(--primary-hsl), 0.03)", borderBottom: "1px solid var(--border-glass)" }}>
              <div className="container" style={{ maxWidth: "1200px" }}>
                <div style={{ textAlign: "center", marginBottom: "48px" }}>
                  <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Facility Gallery</span>
                  <h2 style={{ fontSize: "2.2rem" }}>A Glimpse of Our Hospital &amp; Scanning Clinic</h2>
                  <p style={{ color: "var(--text-muted)", maxWidth: "800px", margin: "10px auto 0" }}>
                    Take a virtual tour of our modern lobby, high-end sonography cabins, and comfortable maternity care facilities in Lakhandur.
                  </p>
                </div>

                <div style={styles.galleryGrid}>
                  {[
                    { src: "/nakade_lobby.png", title: "Clinic Lobby & Reception", desc: "Welcoming reception and check-in lobby." },
                    { src: "/sonography_room.png", title: "Advanced Sonography Room", desc: "Equipped with state-of-the-art ultrasound machines." },
                    { src: "/maternity_care.png", title: "Maternity Recovery Ward", desc: "Safe, sterile, and comfortable recovery room." },
                    { src: "/hero_bg.png", title: "Consulting Cabin", desc: "Private consult area with our medical officers." }
                  ].map((img, idx) => (
                    <div
                      key={idx}
                      className="card glass bouncy-hover"
                      style={styles.galleryCard}
                      onClick={() => setActiveGalleryImage(img.src)}
                    >
                      <div style={styles.galleryImgWrapper}>
                        <img src={img.src} alt={img.title} style={img.src.endsWith(".png") ? styles.galleryImg : { ...styles.galleryImg, objectFit: "cover" }} />
                        <div style={styles.galleryHoverOverlay}>
                          <span style={styles.galleryPlusIcon}>🔍 Zoom In</span>
                        </div>
                      </div>
                      <div style={styles.galleryInfoBox}>
                        <h4 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>{img.title}</h4>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{img.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Clinic Statistics Counter Row */}
            <section style={{ padding: "45px 0", borderBottom: "1px solid var(--border-glass)" }}>
              <div className="container" style={styles.statsGrid}>
                <div className="card glass bouncy-hover" style={styles.statBox}>
                  <h3 style={styles.statValue}>
                    <CountUp end={8000} suffix="+" separator="," />
                  </h3>
                  <p style={styles.statLabel}>Happy Patients Treated</p>
                </div>
                <div className="card glass bouncy-hover" style={styles.statBox}>
                  <h3 style={styles.statValue}>
                    <CountUp end={1200} suffix="+" separator="," />
                  </h3>
                  <p style={styles.statLabel}>Successful Deliveries</p>
                </div>
                <div className="card glass bouncy-hover" style={styles.statBox}>
                  <h3 style={styles.statValue}>
                    <CountUp end={15000} suffix="+" separator="," />
                  </h3>
                  <p style={styles.statLabel}>Ultrasound Scans Completed</p>
                </div>
                <div className="card glass bouncy-hover" style={styles.statBox}>
                  <h3 style={styles.statValue}>
                    <CountUp end={15} suffix="+" />
                  </h3>
                  <p style={styles.statLabel}>Years of Trusted Care</p>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section id="patient-reviews" className="section-padding" style={{ backgroundColor: "transparent" }}>
              <div className="container reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
                <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Patient Reviews</span>
                <h2 style={{ fontSize: "2.2rem" }}>Verified Patient Testimonials</h2>
              </div>
              <div className="container grid-cols-2" style={{ gap: "32px" }}>
                {testimonials.map((test, idx) => (
                  <div key={idx} className={`card glass reveal bouncy-hover reveal-delay-${idx + 1}`} style={styles.testCard}>
                    <div style={styles.starsBox}>
                      {[...Array(test.rating)].map((_, i) => (
                        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                    <p style={styles.quoteText}>&ldquo;{test.quote}&rdquo;</p>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "16px" }}>
                      <span style={{ fontWeight: 700 }}>{test.author}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{test.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Accordion Section */}
            <section id="faq-section" className="section-padding">
              <div className="container reveal" style={{ maxWidth: "1000px" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Help Desk</span>
                  <h2 style={{ fontSize: "2.2rem" }}>Frequently Asked Questions</h2>
                </div>

                <div style={styles.faqList}>
                  {faqs.map((faq, idx) => (
                    <div key={idx} className={`glass reveal reveal-delay-${(idx % 3) + 1}`} style={styles.faqItem}>
                      <button onClick={() => toggleFaq(idx)} style={styles.faqQuestionBtn}>
                        <span style={styles.faqQuestionText}>{faq.q}</span>
                        <span style={{
                          ...styles.faqIcon,
                          transform: openFaqIdx === idx ? "rotate(180deg)" : "rotate(0)",
                        }}>
                          ▼
                        </span>
                      </button>
                      
                      <div
                        style={{
                          ...styles.faqAnswerContainer,
                          maxHeight: openFaqIdx === idx ? "200px" : "0",
                          opacity: openFaqIdx === idx ? 1 : 0,
                          padding: openFaqIdx === idx ? "16px 20px" : "0 20px",
                        }}
                      >
                        <p style={styles.faqAnswerText}>{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Us & Feedback Section */}
            <section className="section-padding" style={{ borderTop: "1px solid var(--border-glass)" }}>
              <div className="container reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
                <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Contact & Feedback</span>
                <h2 style={{ fontSize: "2.2rem" }}>Get in Touch & Share Your Experience</h2>
                <p style={{ color: "var(--text-muted)", maxWidth: "800px", margin: "10px auto 0" }}>
                  Have a question for our clinic or want to leave feedback? Fill out the form below to publish your testimonial instantly!
                </p>
              </div>

              <div className="container grid-cols-2" style={{ gap: "40px", alignItems: "stretch" }}>
                {/* Left Column: Contact details & Mock Map */}
                <div className="glass" style={styles.contactDetailsCard}>
                  <div>
                    <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", color: "var(--primary)", fontWeight: 800 }}>
                      Clinic Information
                    </h3>
                    
                    <div style={styles.contactInfoList}>
                      <div style={styles.contactInfoRow}>
                        <span style={styles.contactIcon}>📍</span>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Our Location</h4>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sakoli Warsa Road, Sai Colony, MSEB Colony, Lakhandur, Maharashtra - 441803</p>
                        </div>
                      </div>

                      <div style={styles.contactInfoRow}>
                        <span style={styles.contactIcon}>📞</span>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Call Center</h4>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Emergency Contact: +91 82753 97699 (24/7)</p>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Reception Desk: 082753 97699</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", textAlign: "left" }}>
                        <span style={styles.contactIcon}>✉️</span>
                        <div>
                          <h4 style={{ fontWeight: 700, fontSize: "1rem" }}>Direct Email</h4>
                          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>nakadenursinghomebhandara@rediffmail.com</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Real Google Map Embed */}
                  <div style={{ ...styles.mockMapContainer, height: "220px", border: "1px solid var(--border-glass)", display: "block" }}>
                    <iframe
                      src="https://maps.google.com/maps?q=Nakade%20Hospital,%20Lakhandur,%20Maharashtra&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Nakade Hospital Lakhandur Map"
                    ></iframe>
                  </div>
                </div>

                {/* Right Column: Feedback Form */}
                <div className="glass" style={styles.feedbackFormCard}>
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "20px", color: "var(--primary)", fontWeight: 800 }}>
                    Patient Feedback Form
                  </h3>

                  {feedbackStatus ? (
                    <div className="animate-fade" style={styles.successFormContainer}>
                      <div style={styles.successCheckmark}>✓</div>
                      <h4 style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)", marginBottom: "4px" }}>
                        Thank You For Your Feedback!
                      </h4>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: "16px" }}>
                        Your review has been uploaded and published live in our testimonials section above!
                      </p>

                      {/* Google Maps Review Integration Segment */}
                      <div style={{
                        border: "1px solid var(--border-glass)",
                        borderRadius: "var(--radius-sm)",
                        padding: "16px",
                        backgroundColor: "var(--bg-surface-glass)",
                        marginBottom: "20px",
                        width: "100%"
                      }}>
                        <h5 style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text-main)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>🌐</span> Help Us Grow on Google Maps
                        </h5>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px", textAlign: "left" }}>
                          To also add your feedback to our official Google Maps reviews section, copy your text below and click the button to open our listing:
                        </p>
                        
                        <div style={{
                          backgroundColor: "rgba(0,0,0,0.15)",
                          padding: "10px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.8rem",
                          color: "var(--text-muted)",
                          fontStyle: "italic",
                          position: "relative",
                          textAlign: "left",
                          marginBottom: "12px",
                          borderLeft: "3px solid var(--primary)",
                          maxHeight: "80px",
                          overflowY: "auto"
                        }}>
                          &ldquo;{submittedFeedbackText}&rdquo;
                        </div>
                        
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(submittedFeedbackText);
                              setCopyFeedbackSuccess(true);
                              setTimeout(() => setCopyFeedbackSuccess(false), 2000);
                            }}
                            className="btn btn-secondary"
                            style={{ flex: 1, fontSize: "0.75rem", padding: "8px 12px", justifyContent: "center" }}
                          >
                            {copyFeedbackSuccess ? "✓ Copied!" : "📋 Copy Text"}
                          </button>
                          
                          <a
                            href="https://maps.app.goo.gl/WumWmMeQ35q7UAQb9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ flex: 1.2, fontSize: "0.75rem", padding: "8px 12px", justifyContent: "center", textDecoration: "none", display: "inline-flex", alignItems: "center" }}
                          >
                            ⭐ Post on Google
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => setFeedbackStatus(false)}
                        className="btn btn-secondary"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Write Another Review
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} style={styles.feedbackForm}>
                      <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>Your Name *</label>
                        <input
                          type="text"
                          required
                          value={fbName}
                          onChange={(e) => setFbName(e.target.value)}
                          placeholder="e.g. mrunali hatzade"
                          className="form-input glass"
                          style={{ border: "1px solid var(--border-glass)", padding: "10px 14px", width: "100%", borderRadius: "var(--radius-sm)", color: "var(--text-main)", background: "var(--bg-surface-glass)" }}
                        />
                      </div>

                      <div className="form-group" style={{ marginBottom: "16px" }}>
                        <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "6px" }}>Rating *</label>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setFbRating(star)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                transition: "transform 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill={star <= fbRating ? "#f59e0b" : "none"}
                                stroke="#f59e0b"
                                strokeWidth="2"
                              >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: "20px" }}>
                        <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 700 }}>Your Message / Review *</label>
                        <textarea
                          required
                          rows={4}
                          value={fbMessage}
                          onChange={(e) => setFbMessage(e.target.value)}
                          placeholder="Tell us about your clinic visit, clinical experience, or general thoughts..."
                          className="form-input glass"
                          style={{ border: "1px solid var(--border-glass)", padding: "10px 14px", width: "100%", borderRadius: "var(--radius-sm)", color: "var(--text-main)", background: "var(--bg-surface-glass)", resize: "vertical", fontFamily: "inherit" }}
                        />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                        Submit Live Feedback &nbsp;&rarr;
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Clinical Specialties */}
        {activeTab === "departments" && (
          <Departments
            setActiveTab={setActiveTab}
            setSelectedDepartment={setSelectedDepartment}
          />
        )}

        {/* Tab 3: Find a Doctor */}
        {activeTab === "doctors" && (
          <DoctorSearch
            setActiveTab={setActiveTab}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            setPreSelectedDoctor={setPreSelectedDoctor}
            doctors={doctors}
          />
        )}

        {/* Tab 4: Book Appointment */}
        {activeTab === "booking" && (
          <AppointmentBooking
            preSelectedDoctor={preSelectedDoctor}
            setPreSelectedDoctor={setPreSelectedDoctor}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            doctors={doctors}
          />
        )}

        {/* Tab 5: Patient Portal */}
        {activeTab === "portal" && <PatientPortal />}

        {/* Tab 6: Admin Portal */}
        {activeTab === "admin" && (
          <AdminDashboard
            doctors={doctors}
            onUpdateDoctorStatus={handleUpdateDoctorStatus}
          />
        )}
      </main>

      {/* Scroll to Top Button */}
      <button
        className={`go-to-top ${showGoToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Scroll to Top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>

      {/* Floating Symptom Chatbot Widget */}
      <SymptomChecker
        setActiveTab={setActiveTab}
        setSelectedDepartment={setSelectedDepartment}
        setPreSelectedDoctor={setPreSelectedDoctor}
      />

      {/* Persistent Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Telehealth Information Modal Dialog */}
      {isTelehealthOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsTelehealthOpen(false)}>
          <div style={styles.modalContent} className="glass animate-slide" onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setIsTelehealthOpen(false)}>
              &times;
            </button>
            <div style={styles.modalHeader}>
              <h2 style={{ fontSize: "1.8rem" }}>💻 Virtual Telehealth System</h2>
            </div>
            
            <p style={styles.modalDesc}>
              Nakade Hospital & Sonography Clinic provides HIPAA-compliant remote diagnostics and real-time medical consults from the comfort of your home.
            </p>

            <div style={styles.modalSteps}>
              <div style={styles.modalStep}>
                <span style={styles.stepNumBubble}>1</span>
                <div>
                  <h4 style={{ fontWeight: 700 }}>Book virtual slot</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Schedule via the standard booking tab, select &apos;Telehealth Ready&apos; doctors.</p>
                </div>
              </div>
              
              <div style={styles.modalStep}>
                <span style={styles.stepNumBubble}>2</span>
                <div>
                  <h4 style={{ fontWeight: 700 }}>Receive secure invitation</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>You will receive an SMS and secure portal invitation code 15 minutes before the session.</p>
                </div>
              </div>

              <div style={styles.modalStep}>
                <span style={styles.stepNumBubble}>3</span>
                <div>
                  <h4 style={{ fontWeight: 700 }}>Connect in one click</h4>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Click the link on your smartphone or browser to initiate secure encrypted video consults.</p>
                </div>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setIsTelehealthOpen(false)}>
                Close Details
              </button>
              <button className="btn btn-primary" onClick={() => {
                setIsTelehealthOpen(false);
                setSelectedDepartment("");
                setPreSelectedDoctor("");
                setActiveTab("booking");
              }}>
                Schedule Virtual Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Lightbox Modal */}
      {activeGalleryImage && (
        <div style={styles.modalOverlay} onClick={() => setActiveGalleryImage(null)}>
          <div style={{ ...styles.modalContent, maxWidth: "800px", padding: "12px", border: "1px solid var(--border-glass)" }} className="glass animate-slide" onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setActiveGalleryImage(null)}>
              &times;
            </button>
            <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={activeGalleryImage}
                alt="Clinic Expanded View"
                style={{ width: "100%", height: "auto", maxHeight: "80vh", objectFit: "contain", borderRadius: "var(--radius-sm)" }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  testCard: {
    padding: "32px",
    borderRadius: "var(--radius-md)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  starsBox: {
    display: "flex",
    gap: "4px",
    marginBottom: "16px",
  },
  quoteText: {
    fontSize: "1.05rem",
    lineHeight: 1.6,
    color: "var(--text-main)",
    fontStyle: "italic",
    marginBottom: "16px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  faqItem: {
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    overflow: "hidden",
    transition: "var(--transition)",
  },
  faqQuestionBtn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "20px 24px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "var(--font-heading)",
  },
  faqQuestionText: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text-main)",
  },
  faqIcon: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    transition: "transform 0.3s ease",
  },
  faqAnswerContainer: {
    overflow: "hidden",
    transition: "all 0.3s ease-out",
  },
  faqAnswerText: {
    fontSize: "0.95rem",
    color: "var(--text-muted)",
    lineHeight: 1.6,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "24px",
  },
  modalContent: {
    width: "100%",
    maxWidth: "750px",
    borderRadius: "var(--radius-lg)",
    padding: "40px",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: "20px",
    right: "24px",
    background: "none",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    color: "var(--text-muted)",
    lineHeight: 1,
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  modalDesc: {
    fontSize: "1rem",
    color: "var(--text-main)",
    marginBottom: "24px",
    lineHeight: 1.6,
  },
  modalSteps: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  modalStep: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
  },
  stepNumBubble: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "0.85rem",
    flexShrink: 0,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid var(--border)",
    paddingTop: "24px",
  },

  // Contact Us Section styles
  contactDetailsCard: {
    padding: "36px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contactInfoList: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginBottom: "24px",
  },
  contactInfoRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    textAlign: "left",
  },
  contactIcon: {
    fontSize: "1.4rem",
    backgroundColor: "var(--primary-light)",
    padding: "8px",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    flexShrink: 0,
  },
  mockMapContainer: {
    height: "150px",
    borderRadius: "var(--radius-md)",
    backgroundColor: "var(--primary-light)",
    border: "1px dashed var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  mockMapText: {
    textAlign: "center",
    zIndex: 2,
  },
  feedbackFormCard: {
    padding: "36px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  feedbackForm: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  successFormContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 0",
  },
  successCheckmark: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "var(--primary-light)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "16px",
    boxShadow: "0 0 0 6px var(--border-glass)",
    animation: "float 3s ease-in-out infinite",
  },

  // Highlights Feature Boxes styles
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureIconBox: {
    fontSize: "2rem",
    marginBottom: "4px",
  },
  featureTitle: {
    fontSize: "1.15rem",
    fontWeight: 800,
    color: "var(--text-main)",
  },
  featureDesc: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },

  // About Doctors section styles
  doctorsSectionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    marginTop: "24px",
  },
  drProfileCard: {
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  drImageWrapper: {
    position: "relative",
    height: "280px",
    width: "100%",
    backgroundColor: "var(--primary-light)",
    overflow: "hidden",
  },
  drProfileImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  drBadgeOverlay: {
    position: "absolute",
    bottom: "16px",
    left: "16px",
    backgroundColor: "var(--primary)",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: "var(--radius-full)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  drProfileContent: {
    padding: "28px",
    textAlign: "left",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  drName: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "var(--text-main)",
    marginBottom: "4px",
  },
  drTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "var(--primary)",
    marginBottom: "16px",
  },
  drBio: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    lineHeight: 1.6,
    marginBottom: "20px",
  },
  credentialsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "auto",
    paddingTop: "16px",
    borderTop: "1px solid var(--border-glass)",
  },
  credentialItem: {
    fontSize: "0.82rem",
    color: "var(--text-main)",
    fontWeight: 500,
  },

  // Maternity & Diagnostic Services styles
  maternityServicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  serviceBoxCard: {
    padding: "32px 24px",
    borderRadius: "var(--radius-md)",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  serviceIcon: {
    fontSize: "2.2rem",
  },
  serviceTitleText: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "var(--text-main)",
  },
  serviceDescText: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },
  serviceBulletList: {
    listStyleType: "none",
    paddingLeft: 0,
    fontSize: "0.8rem",
    color: "var(--primary)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "auto",
    paddingTop: "12px",
    borderTop: "1px dashed var(--border-glass)",
  },

  // Clinic Gallery styles
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },
  galleryCard: {
    borderRadius: "var(--radius-md)",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  galleryImgWrapper: {
    position: "relative",
    height: "180px",
    overflow: "hidden",
    backgroundColor: "var(--border)",
  },
  galleryImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  galleryHoverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,128,128,0.4)",
    opacity: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.3s ease",
  },
  galleryPlusIcon: {
    backgroundColor: "var(--bg-surface)",
    color: "var(--primary)",
    fontWeight: 700,
    fontSize: "0.85rem",
    padding: "8px 16px",
    borderRadius: "var(--radius-sm)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  galleryInfoBox: {
    padding: "16px",
    textAlign: "left",
  },

  // Clinic Statistics styles
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    alignItems: "center",
  },
  statBox: {
    padding: "24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
  },
  statValue: {
    fontSize: "2.4rem",
    fontWeight: 800,
    color: "var(--primary)",
    lineHeight: 1,
    marginBottom: "8px",
    fontFamily: "var(--font-heading)",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 600,
  },
};
