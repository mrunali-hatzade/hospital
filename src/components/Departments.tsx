"use client";

import { useState, useEffect } from "react";

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortDesc: string;
  fullDesc: string;
  chief: string;
  services: string[];
  hours: string;
}

interface DepartmentsProps {
  setActiveTab: (tab: string) => void;
  setSelectedDepartment: (dept: string) => void;
}

export default function Departments({ setActiveTab, setSelectedDepartment }: DepartmentsProps) {
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  useEffect(() => {
    if (selectedDept) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [selectedDept]);

  const departments: Department[] = [
    {
      id: "Gynecology",
      name: "Gynecology & Obstetrics",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--danger)" }}>
          <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 12v10M9 17h6" />
        </svg>
      ),
      shortDesc: "Complete maternity, pregnancy scans, and gynecological care.",
      fullDesc: "Our department offers comprehensive care for women through all stages of life, specializing in prenatal monitoring, maternity support, and advanced gynecological therapeutics.",
      chief: "Dr. Pallavi Nakade, MBBS, DGO",
      services: ["Prenatal Screenings", "Normal & Cesarean Delivery Packages", "Maternity Wellness Care", "Infertility Counseling", "Gynecological Laparoscopic Surgeries"],
      hours: "Mon - Sat: 10:00 AM - 7:00 PM",
    },
    {
      id: "Sonography",
      name: "Sonography & Diagnostics",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      shortDesc: "Advanced ultrasound scans and clinical diagnostic imaging.",
      fullDesc: "Providing state-of-the-art sonography and diagnostic scanning, including 3D/4D fetal scans, pelvic and abdominal imaging, to assist in accurate clinical management.",
      chief: "Dr. Lalit Nakade, MBBS",
      services: ["3D/4D Maternity Sonography", "Abdominal Ultrasound Scans", "Pelvic & Gynaec Imaging", "Fetal Well-being Scans", "Diagnostic Health Screenings"],
      hours: "Mon - Sat: 10:00 AM - 7:00 PM",
    },
    {
      id: "Pediatrics",
      name: "Pediatrics & Child Care",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--warning)" }}>
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
      shortDesc: "Compassionate healthcare and child wellness monitoring.",
      fullDesc: "Dedicated to the physical and developmental well-being of infants, toddlers, and adolescents, providing preventative health scans, immunizations, and general pediatric support.",
      chief: "Pediatric Consultant Staff",
      services: ["Newborn Care & Screenings", "Childhood Vaccination Schedules", "Growth & Development Tracking", "Common Cold & Flu Care", "Pediatric Consultations"],
      hours: "Mon - Sat: 10:00 AM - 7:00 PM",
    },
    {
      id: "General",
      name: "General Medical Care",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--info)" }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
      shortDesc: "Primary healthcare services, checkups, and family medicine.",
      fullDesc: "Providing comprehensive family medicine, outpatient care, and therapeutic consultations for a wide range of acute and chronic general medical conditions.",
      chief: "Dr. Lalit Nakade, MBBS",
      services: ["Routine Physical Checkups", "Chronic Disease Management", "Infectious Disease Care", "General OPD Consultation", "24/7 Emergency Care Desk"],
      hours: "24 Hours Emergency Desk (General Care)",
    },
  ];

  const handleDeptSelect = (dept: Department) => {
    setSelectedDept(dept);
  };

  const handleMeetDoctors = (deptId: string) => {
    setSelectedDepartment(deptId);
    setActiveTab("doctors");
    setSelectedDept(null);
  };

  return (
    <section className="section-padding" id="departments">
      <div className="container reveal" style={{ textAlign: "center", marginBottom: "48px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Our Specialties</span>
        <h2 style={{ fontSize: "2.4rem", marginBottom: "16px" }}>Comprehensive Clinical Departments</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0 auto" }}>
          Offering standard-setting clinical departments driven by patient-first paradigms and medical advancements.
        </p>
      </div>

      <div className="container grid-cols-2" style={{ gap: "24px" }}>
        {departments.map((dept, index) => (
          <div key={dept.id} className={`card glass reveal bouncy-hover reveal-delay-${index + 1}`} style={styles.deptCard} onClick={() => handleDeptSelect(dept)}>
            <div style={styles.iconWrapper}>{dept.icon}</div>
            <h3 style={styles.deptName}>{dept.name}</h3>
            <p style={styles.deptDesc}>{dept.shortDesc}</p>
            <button className="btn btn-outline" style={styles.learnMoreBtn}>
              Learn More &nbsp;&rarr;
            </button>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {selectedDept && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDept(null)}>
          <div style={styles.modalContent} className="glass animate-slide" onClick={(e) => e.stopPropagation()}>
            <button style={styles.closeBtn} onClick={() => setSelectedDept(null)}>
              &times;
            </button>
            <div style={styles.modalHeader}>
              <div style={styles.modalIconWrapper}>{selectedDept.icon}</div>
              <h2 style={{ fontSize: "2rem" }}>{selectedDept.name} Department</h2>
            </div>
            
            <p style={styles.modalDesc}>{selectedDept.fullDesc}</p>

            <div style={styles.infoGrid}>
              <div>
                <h4 style={styles.sectionTitle}>Department Head</h4>
                <p style={styles.sectionInfo}>{selectedDept.chief}</p>

                <h4 style={styles.sectionTitle}>Operating Hours</h4>
                <p style={styles.sectionInfo}>{selectedDept.hours}</p>
              </div>

              <div>
                <h4 style={styles.sectionTitle}>Key Services Provided</h4>
                <ul style={styles.serviceList}>
                  {selectedDept.services.map((service, idx) => (
                    <li key={idx} style={styles.serviceItem}>
                      <span style={styles.bullet}>✦</span> {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={styles.modalActions}>
              <button className="btn btn-outline" onClick={() => setSelectedDept(null)}>
                Close Details
              </button>
              <button className="btn btn-primary" onClick={() => handleMeetDoctors(selectedDept.id)}>
                Meet Specialists
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  deptCard: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    height: "100%",
  },
  iconWrapper: {
    backgroundColor: "var(--primary-light)",
    padding: "16px",
    borderRadius: "var(--radius-sm)",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deptName: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "10px",
  },
  deptDesc: {
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    marginBottom: "24px",
    flexGrow: 1,
  },
  learnMoreBtn: {
    alignSelf: "flex-start",
    fontSize: "0.85rem",
    padding: "8px 16px",
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
    overflowY: "auto",
  },
  modalContent: {
    width: "100%",
    maxWidth: "850px",
    borderRadius: "var(--radius-lg)",
    padding: "40px",
    position: "relative",
    marginBottom: "24px",
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
    marginBottom: "24px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  modalIconWrapper: {
    padding: "12px",
    backgroundColor: "var(--primary-light)",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalDesc: {
    fontSize: "1.05rem",
    color: "var(--text-main)",
    marginBottom: "32px",
    lineHeight: 1.6,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "0.9rem",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
    marginBottom: "6px",
  },
  sectionInfo: {
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: "24px",
  },
  serviceList: {
    listStyleType: "none",
  },
  serviceItem: {
    fontSize: "0.95rem",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  bullet: {
    color: "var(--primary)",
    fontWeight: 700,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    borderTop: "1px solid var(--border)",
    paddingTop: "24px",
  },
};
