"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeScrollSection, setActiveScrollSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sync theme on load
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.body.setAttribute("data-theme", "dark");
    }

    // Google Translate Element initialization callback
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,mr,bn,te,ta,gu,kn,ml,pa,ur", // Limit to English + major Indian languages
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load Translate Element script if not already loaded
    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.setAttribute("id", "google-translate-script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== "home") {
      setActiveScrollSection("");
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140; // offset to trigger active state slightly early
      const sections = ["about-doctors", "maternity-services", "clinic-gallery", "patient-reviews", "faq-section"];
      
      let currentSection = "";
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = sectionId;
            break;
          }
        }
      }
      setActiveScrollSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.body.setAttribute("data-theme", nextTheme);
  };

  const navItems = [
    { id: "home", label: "Home", type: "tab" as const },
    { id: "about-doctors", label: "About Doctors", type: "scroll" as const },
    { id: "maternity-services", label: "Services", type: "scroll" as const },
    { id: "departments", label: "Specialties", type: "tab" as const },
    { id: "clinic-gallery", label: "Gallery", type: "scroll" as const },
    { id: "doctors", label: "Find a Doctor", type: "tab" as const },
    { id: "patient-reviews", label: "Reviews", type: "scroll" as const },
    { id: "faq-section", label: "FAQs", type: "scroll" as const },
    { id: "portal", label: "Patient Portal", type: "tab" as const },
    { id: "admin", label: "Admin Portal", type: "tab" as const },
  ];

  const handleNavClick = (itemId: string, itemType: "tab" | "scroll") => {
    if (itemType === "tab") {
      setActiveTab(itemId);
      if (itemId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (activeTab !== "home") {
        setActiveTab("home");
        setTimeout(() => {
          const el = document.getElementById(itemId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      } else {
        const el = document.getElementById(itemId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  return (
    <header style={styles.header}>
      {/* Upper Top Bar Header */}
      <div className="top-bar-custom" style={styles.topBar}>
        <div className="container" style={styles.topBarContainer}>
          {/* Left: Contact Info */}
          <div style={styles.topBarLeft}>
            <a href="tel:+918275397699" style={styles.topBarLink}>
              📞 +91 82753 97699
            </a>
            <span style={styles.topBarSeparator}>|</span>
            <a href="mailto:nakadenursinghomebhandara@rediffmail.com" style={styles.topBarLink}>
              ✉️ nakadenursinghomebhandara@rediffmail.com
            </a>
            <span style={styles.topBarSeparator}>|</span>
            <a
              href="https://maps.app.goo.gl/WumWmMeQ35q7UAQb9"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.topBarLink}
            >
              📍 Lakhandur, MH
            </a>
          </div>

          {/* Right: Emergency, Booking, and Languages */}
          <div style={styles.topBarRight}>
            <a href="tel:+918275397699" style={styles.topEmergencyLink}>
              <span style={styles.topPulseDot}></span>
              🚨 Emergency (24/7)
            </a>
            <span style={styles.topBarSeparator}>|</span>
            <button onClick={() => handleNavClick("booking", "tab")} style={styles.topBookingBtn}>
              📅 Book Appointment
            </button>
            <span style={styles.topBarSeparator}>|</span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>🌐</span>
              <div id="google_translate_element" style={{ display: "flex", alignItems: "center" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar Area */}
      <div className="glass" style={styles.mainNavbar}>
        <div className="container navbar-container" style={styles.container}>
          {/* Left Side: Logo and Title */}
          <div style={styles.leftGroup}>
            <div style={styles.logoArea} onClick={() => handleNavClick("home", "tab")}>
              <div style={styles.logoWrapper}>
                <Image
                  src="/logo.png"
                  alt="Nakade Hospital Logo"
                  width={40}
                  height={40}
                  style={{ objectFit: "contain", borderRadius: "50%" }}
                />
              </div>
              <span className="logo-text-custom" style={styles.logoText}>Nakade<span style={{ color: "var(--secondary)" }}> Hospital</span></span>
            </div>

            <nav className="desktop-nav" style={styles.nav}>
              {navItems.map((item) => {
                const isTabActive = item.type === "tab" && activeTab === item.id;
                const isScrollActive = item.type === "scroll" && activeTab === "home" && activeScrollSection === item.id;
                const isHomeActiveTab = item.id === "home" && activeTab === "home" && !activeScrollSection;
                
                const active = isScrollActive || (item.id === "home" ? isHomeActiveTab : isTabActive);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.type)}
                    style={{
                      ...styles.navLink,
                      color: active ? "var(--primary)" : "var(--text-main)",
                      fontWeight: active ? "700" : "500",
                      borderBottom: active ? "2px solid var(--primary)" : "2px solid transparent",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Side: Theme Toggle */}
          <div style={styles.actions}>
            <button onClick={toggleTheme} style={styles.themeToggle} title="Toggle Theme">
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>

            <button 
              className="mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              style={styles.mobileMenuBtn}
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer glass animate-slide" style={styles.mobileDrawer}>
          <nav style={styles.mobileNav}>
            {navItems.map((item) => {
              const isTabActive = item.type === "tab" && activeTab === item.id;
              const isScrollActive = item.type === "scroll" && activeTab === "home" && activeScrollSection === item.id;
              const isHomeActiveTab = item.id === "home" && activeTab === "home" && !activeScrollSection;
              
              const active = isScrollActive || (item.id === "home" ? isHomeActiveTab : isTabActive);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id, item.type);
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    ...styles.mobileNavLink,
                    color: active ? "var(--primary)" : "var(--text-main)",
                    fontWeight: active ? "700" : "600",
                    backgroundColor: active ? "var(--primary-light)" : "transparent",
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  topBar: {
    backgroundColor: "var(--primary)",
    color: "var(--text-inverse)",
    fontSize: "0.78rem",
    fontWeight: 600,
    height: "36px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
  topBarContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  topBarLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  topBarLink: {
    color: "var(--text-inverse)",
    textDecoration: "none",
    transition: "opacity 0.2s",
  },
  topBarText: {
    color: "rgba(255, 255, 255, 0.85)",
  },
  topBarSeparator: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  topEmergencyLink: {
    color: "#fee2e2",
    textDecoration: "none",
    fontWeight: 750,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.76rem",
  },
  topPulseDot: {
    width: "6px",
    height: "6px",
    backgroundColor: "#f87171",
    borderRadius: "50%",
    display: "inline-block",
    boxShadow: "0 0 8px #f87171",
    animation: "pulse-emergency 2s infinite",
  },
  topBookingBtn: {
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-inverse)",
    padding: "4px 10px",
    fontSize: "0.74rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "var(--font-heading)",
  },
  mainNavbar: {
    width: "100%",
    borderBottom: "1px solid var(--border-glass)",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
  },
  leftGroup: {
    display: "flex",
    alignItems: "center",
    gap: "36px",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  logoWrapper: {
    position: "relative",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(0, 128, 128, 0.2)",
  },
  logoText: {
    fontFamily: "var(--font-heading)",
    fontSize: "1.35rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  nav: {
    display: "flex",
    gap: "16px",
  },
  navLink: {
    background: "none",
    border: "none",
    padding: "8px 2px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    transition: "var(--transition)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  themeToggle: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    color: "var(--text-main)",
    transition: "var(--transition)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--primary-light)",
  },
  mobileMenuBtn: {
    display: "none",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    color: "var(--text-main)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--primary-light)",
    transition: "var(--transition)",
  },
  mobileDrawer: {
    position: "absolute",
    top: "100px",
    left: 0,
    width: "100%",
    padding: "20px 32px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    borderTop: "1px solid var(--border-glass)",
    borderBottom: "1px solid var(--border-glass)",
    zIndex: 999,
  },
  mobileNav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mobileNavLink: {
    background: "none",
    border: "none",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    fontSize: "0.95rem",
    textAlign: "left",
    fontFamily: "var(--font-heading)",
    transition: "var(--transition)",
    width: "100%",
  },
};
