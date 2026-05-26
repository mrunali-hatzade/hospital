"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
}

function CountUp({ end, duration = 1500, decimals = 0, suffix = "" }: CountUpProps) {
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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  availableToday: boolean;
  onlineConsult: boolean;
  imgUrl: string;
  bio: string;
  education: string;
  languages: string[];
  npi: string;
  availabilityStatus: "Available" | "In Consultation" | "Emergency" | "Off Duty";
}

interface DoctorSearchProps {
  setActiveTab: (tab: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  setPreSelectedDoctor: (docName: string) => void;
  doctors: Doctor[];
}

export default function DoctorSearch({
  setActiveTab,
  selectedDepartment,
  setSelectedDepartment,
  setPreSelectedDoctor,
  doctors,
}: DoctorSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterOnline, setFilterOnline] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "alphabetical">("rating");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (selectedDoctor) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [selectedDoctor]);

  // Filter and sort logic
  const filteredDoctors = doctors
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDepartment === "" || doc.specialty === selectedDepartment;
      const matchesAvailable = !filterAvailable || (doc.availabilityStatus === "Available" || doc.availabilityStatus === "In Consultation");
      const matchesOnline = !filterOnline || doc.onlineConsult;
      
      return matchesSearch && matchesDept && matchesAvailable && matchesOnline;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const handleBookDoctor = (docName: string, dept: string) => {
    setSelectedDepartment(dept);
    setPreSelectedDoctor(docName);
    setActiveTab("booking");
    setSelectedDoctor(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setFilterAvailable(false);
    setFilterOnline(false);
  };

  return (
    <section className="section-padding" id="doctors">
      <div className="container reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Our Specialists</span>
        <h2 style={{ fontSize: "2.4rem", marginBottom: "16px" }}>Meet Our Medical Practitioners</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
          Find, review, and connect with certified practitioners dedicated to clinical excellence and compassionate service.
        </p>
      </div>

      {/* Filter Controls Panel */}
      <div className="container" style={{ marginBottom: "40px" }}>
        <div className="glass" style={styles.filterBar}>
          <div style={styles.searchBox}>
            <svg style={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by name or clinical specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.dropdownsGrid}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={styles.selectInput}
              >
                <option value="">All Specialties</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "rating" | "alphabetical")}
                style={styles.selectInput}
              >
                <option value="rating">Sort by Rating (Highest)</option>
                <option value="alphabetical">Sort Alphabetically (A-Z)</option>
              </select>
            </div>
          </div>

          <div style={styles.checkboxesGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filterAvailable}
                onChange={(e) => setFilterAvailable(e.target.checked)}
                style={styles.checkboxInput}
              />
              Available Today
            </label>

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filterOnline}
                onChange={(e) => setFilterOnline(e.target.checked)}
                style={styles.checkboxInput}
              />
              Telehealth Ready
            </label>

            {(searchQuery || selectedDepartment || filterAvailable || filterOnline) && (
              <button onClick={handleResetFilters} style={styles.resetBtn}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Doctors Profiles Grid */}
      <div className="container grid-cols-2" style={{ gap: "28px" }}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc, idx) => (
            <div key={doc.id} className={`card glass reveal bouncy-hover reveal-delay-${(idx % 3) + 1}`} style={styles.docCard}>
              <div className="doctor-card-header" style={styles.cardHeader}>
                <div style={styles.avatarWrapper}>
                  <Image
                    src={doc.imgUrl}
                    alt={doc.name}
                    width={90}
                    height={90}
                    style={styles.avatar}
                  />
                  <span
                    style={{
                      ...styles.statusIndicator,
                      backgroundColor: doc.availabilityStatus === "Available" ? "var(--success)"
                        : doc.availabilityStatus === "In Consultation" ? "var(--warning)"
                        : doc.availabilityStatus === "Emergency" ? "var(--danger)"
                        : "#94a3b8",
                    }}
                    title={`Current Status: ${doc.availabilityStatus}`}
                  ></span>
                </div>
                <div style={styles.headerInfo}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.3rem" }}>{doc.name}</h3>
                    {doc.onlineConsult && (
                      <span className="badge badge-primary" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                        💻 Virtual
                      </span>
                    )}
                  </div>
                  <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.95rem", marginBottom: "4px" }}>
                    {doc.specialty} Specialist
                  </p>
                  <div style={{ marginBottom: "6px" }}>
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor: doc.availabilityStatus === "Available" ? "rgba(16, 185, 129, 0.1)"
                        : doc.availabilityStatus === "In Consultation" ? "rgba(245, 158, 11, 0.1)"
                        : doc.availabilityStatus === "Emergency" ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(148, 163, 184, 0.1)",
                      color: doc.availabilityStatus === "Available" ? "var(--success)"
                        : doc.availabilityStatus === "In Consultation" ? "var(--warning)"
                        : doc.availabilityStatus === "Emergency" ? "var(--danger)"
                        : "#64748b",
                      border: `1px solid ${
                        doc.availabilityStatus === "Available" ? "var(--success)"
                          : doc.availabilityStatus === "In Consultation" ? "var(--warning)"
                          : doc.availabilityStatus === "Emergency" ? "var(--danger)"
                          : "#94a3b8"
                      }`,
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      <span style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: doc.availabilityStatus === "Available" ? "var(--success)"
                          : doc.availabilityStatus === "In Consultation" ? "var(--warning)"
                          : doc.availabilityStatus === "Emergency" ? "var(--danger)"
                          : "#64748b",
                        display: "inline-block",
                      }} />
                      {doc.availabilityStatus}
                    </span>
                  </div>
                  <div style={styles.ratingBox}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      <CountUp end={doc.rating} decimals={1} />
                    </span>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      (<CountUp end={doc.reviewsCount} /> reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p style={styles.bioExcerpt}>{doc.bio.substring(0, 100)}...</p>

              <div className="doctor-card-actions" style={styles.cardActions}>
                <button className="btn btn-outline" style={styles.cardBtn} onClick={() => setSelectedDoctor(doc)}>
                  View Profile
                </button>
                <button
                  className="btn btn-primary"
                  style={styles.cardBtn}
                  onClick={() => handleBookDoctor(doc.name, doc.specialty)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", padding: "64px 0", textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: "16px" }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
            <h3 style={{ fontSize: "1.4rem", marginBottom: "8px" }}>No Specialists Match Your Filters</h3>
            <p style={{ color: "var(--text-muted)" }}>Try searching another department or clear filters to reset results.</p>
            <button className="btn btn-outline" style={{ marginTop: "16px" }} onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Doctor Detailed Profile Modal */}
      {selectedDoctor && (() => {
        const liveDoc = doctors.find((d) => d.id === selectedDoctor.id) || selectedDoctor;
        return (
          <div style={styles.modalOverlay} onClick={() => setSelectedDoctor(null)}>
            <div style={styles.modalContent} className="glass animate-slide" onClick={(e) => e.stopPropagation()}>
              <button style={styles.closeBtn} onClick={() => setSelectedDoctor(null)}>
                &times;
              </button>

              <div style={styles.modalProfileHeader}>
                <div style={styles.modalAvatarWrapper}>
                  <Image
                    src={liveDoc.imgUrl}
                    alt={liveDoc.name}
                    width={110}
                    height={110}
                    style={styles.modalAvatar}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: "1.8rem" }}>{liveDoc.name}</h2>
                    <span style={{
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      backgroundColor: liveDoc.availabilityStatus === "Available" ? "rgba(16, 185, 129, 0.1)"
                        : liveDoc.availabilityStatus === "In Consultation" ? "rgba(245, 158, 11, 0.1)"
                        : liveDoc.availabilityStatus === "Emergency" ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(148, 163, 184, 0.1)",
                      color: liveDoc.availabilityStatus === "Available" ? "var(--success)"
                        : liveDoc.availabilityStatus === "In Consultation" ? "var(--warning)"
                        : liveDoc.availabilityStatus === "Emergency" ? "var(--danger)"
                        : "#64748b",
                      border: `1px solid ${
                        liveDoc.availabilityStatus === "Available" ? "var(--success)"
                          : liveDoc.availabilityStatus === "In Consultation" ? "var(--warning)"
                          : liveDoc.availabilityStatus === "Emergency" ? "var(--danger)"
                          : "#94a3b8"
                      }`,
                      padding: "4px 10px",
                      borderRadius: "var(--radius-full)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}>
                      <span style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: liveDoc.availabilityStatus === "Available" ? "var(--success)"
                          : liveDoc.availabilityStatus === "In Consultation" ? "var(--warning)"
                          : liveDoc.availabilityStatus === "Emergency" ? "var(--danger)"
                          : "#64748b",
                        display: "inline-block",
                      }} />
                      {liveDoc.availabilityStatus}
                    </span>
                  </div>
                  <p style={{ color: "var(--primary)", fontWeight: 700, fontSize: "1.1rem" }}>
                    Clinical Specialist in {liveDoc.specialty}
                  </p>
                  <div style={{ ...styles.ratingBox, marginTop: "6px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>
                      <CountUp end={liveDoc.rating} decimals={1} />
                    </span>
                    <span style={{ color: "var(--text-muted)" }}>
                      (<CountUp end={liveDoc.reviewsCount} /> patients verified)
                    </span>
                  </div>
                </div>
              </div>

              <div style={styles.modalBody}>
                <div style={{ marginBottom: "24px" }}>
                  <h4 style={styles.detailLabel}>Clinical Biography</h4>
                  <p style={styles.detailText}>{liveDoc.bio}</p>
                </div>

                <div style={styles.specGrid}>
                  <div>
                    <h4 style={styles.detailLabel}>Education & Training</h4>
                    <p style={styles.detailText}>{liveDoc.education}</p>
                  </div>

                  <div>
                    <h4 style={styles.detailLabel}>Languages Spoken</h4>
                    <p style={styles.detailText}>{liveDoc.languages.join(", ")}</p>
                  </div>

                  <div>
                    <h4 style={styles.detailLabel}>National Provider Identifier (NPI)</h4>
                    <p style={styles.detailText}>{liveDoc.npi}</p>
                  </div>
                </div>
              </div>

              <div style={styles.modalActions}>
                <button className="btn btn-outline" onClick={() => setSelectedDoctor(null)}>
                  Close Profile
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleBookDoctor(liveDoc.name, liveDoc.specialty)}
                >
                  Schedule appointment with {liveDoc.name.split(" ").slice(-1)[0]}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  filterBar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "24px",
    borderRadius: "var(--radius-md)",
  },
  searchBox: {
    position: "relative",
    width: "100%",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)",
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    borderRadius: "var(--radius-sm)",
    border: "2px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "var(--transition)",
  },
  dropdownsGrid: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    flexWrap: "wrap",
  },
  selectInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    border: "2px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-main)",
    fontSize: "0.95rem",
    outline: "none",
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    transition: "var(--transition)",
  },
  checkboxesGroup: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  checkboxLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--text-muted)",
  },
  checkboxInput: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "var(--primary)",
  },
  resetBtn: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontWeight: 700,
    fontSize: "0.9rem",
    cursor: "pointer",
    padding: "4px 8px",
    transition: "var(--transition)",
  },
  docCard: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    alignItems: "stretch",
  },
  cardHeader: {
    display: "flex",
    gap: "20px",
    marginBottom: "16px",
  },
  avatarWrapper: {
    position: "relative",
    width: "90px",
    height: "90px",
  },
  avatar: {
    borderRadius: "var(--radius-md)",
    objectFit: "cover",
    border: "2px solid var(--border)",
  },
  statusIndicator: {
    position: "absolute",
    bottom: "-4px",
    right: "-4px",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    border: "3px solid var(--bg-surface)",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "4px",
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  bioExcerpt: {
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    marginBottom: "24px",
    flexGrow: 1,
  },
  cardActions: {
    display: "flex",
    gap: "12px",
  },
  cardBtn: {
    flex: 1,
    fontSize: "0.85rem",
    padding: "10px 16px",
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
    maxWidth: "850px",
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
  modalProfileHeader: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "24px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  modalAvatarWrapper: {
    width: "110px",
    height: "110px",
  },
  modalAvatar: {
    borderRadius: "var(--radius-md)",
    objectFit: "cover",
    border: "3px solid var(--border)",
  },
  modalBody: {
    marginBottom: "32px",
  },
  detailLabel: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
    marginBottom: "6px",
  },
  detailText: {
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  specGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    marginTop: "20px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid var(--border)",
    paddingTop: "24px",
    flexWrap: "wrap",
  },
};
