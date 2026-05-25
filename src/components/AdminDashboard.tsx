"use client";

import { useState } from "react";
import Image from "next/image";

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

interface AdminDashboardProps {
  doctors: Doctor[];
  onUpdateDoctorStatus: (id: string, status: Doctor["availabilityStatus"]) => void;
}

export default function AdminDashboard({ doctors, onUpdateDoctorStatus }: AdminDashboardProps) {
  const [adminRole, setAdminRole] = useState<"receptionist" | "doctor">("receptionist");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [syncNotice, setSyncNotice] = useState<string>("");

  const triggerSyncNotice = (docName: string, newStatus: string) => {
    setSyncNotice(`Synced: ${docName} is now ${newStatus}`);
    setTimeout(() => {
      setSyncNotice("");
    }, 4000);
  };

  const activeDoctor = doctors.find((d) => d.id === selectedDoctorId);

  const getStatusColor = (status: Doctor["availabilityStatus"]) => {
    switch (status) {
      case "Available":
        return "var(--success)";
      case "In Consultation":
        return "var(--warning)";
      case "Emergency":
        return "var(--danger)";
      case "Off Duty":
        return "#94a3b8";
      default:
        return "#94a3b8";
    }
  };

  return (
    <section className="section-padding" style={{ position: "relative", minHeight: "80vh" }}>
      <div className="container reveal active" style={{ textAlign: "center", marginBottom: "32px" }}>
        <span className="badge badge-secondary" style={{ marginBottom: "12px" }}>🔒 Clinic Security Area</span>
        <h2 style={{ fontSize: "2.5rem" }}>Nakade Portal Administration</h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "800px", margin: "10px auto 0" }}>
          Authorized dashboard for receptionist management and doctor self-service check-ins. Updates propagate to patient views instantly.
        </p>
      </div>

      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* Sync Toast Notification */}
        {syncNotice && (
          <div className="glass animate-slide" style={styles.syncToast}>
            <span style={styles.syncIndicator}></span>
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)" }}>{syncNotice}</span>
          </div>
        )}

        {/* Console Selector */}
        <div className="glass" style={styles.roleBar}>
          <button
            onClick={() => setAdminRole("receptionist")}
            style={{
              ...styles.roleTabBtn,
              backgroundColor: adminRole === "receptionist" ? "var(--primary)" : "transparent",
              color: adminRole === "receptionist" ? "var(--text-inverse)" : "var(--text-main)",
            }}
          >
            👩‍💼 Receptionist Desk
          </button>
          <button
            onClick={() => {
              setAdminRole("doctor");
              if (!selectedDoctorId && doctors.length > 0) {
                setSelectedDoctorId(doctors[0].id);
              }
            }}
            style={{
              ...styles.roleTabBtn,
              backgroundColor: adminRole === "doctor" ? "var(--primary)" : "transparent",
              color: adminRole === "doctor" ? "var(--text-inverse)" : "var(--text-main)",
            }}
          >
            🫀 Doctor Console
          </button>
        </div>

        {/* Receptionist View */}
        {adminRole === "receptionist" && (
          <div className="glass animate-slide" style={styles.panelCard}>
            <div style={styles.panelHeader}>
              <h3>Clinic Roster & availability</h3>
              <span className="badge badge-primary">Super-Admin Access</span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "24px" }}>
              As a receptionist, you can edit and overwrite the active status parameters for all medical staff members on duty.
            </p>

            <div style={styles.doctorsGrid}>
              {doctors.map((doc) => (
                <div key={doc.id} style={styles.docRow} className="glass">
                  <div style={styles.docProfile}>
                    <div style={{ position: "relative", width: "48px", height: "48px" }}>
                      <Image
                        src={doc.imgUrl}
                        alt={doc.name}
                        width={48}
                        height={48}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                      <span
                        style={{
                          ...styles.statusBadgeDot,
                          backgroundColor: getStatusColor(doc.availabilityStatus),
                        }}
                      />
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{doc.name}</h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{doc.specialty}</p>
                    </div>
                  </div>

                  <div style={styles.actionControl}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>Set Status:</label>
                    <select
                      value={doc.availabilityStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as Doctor["availabilityStatus"];
                        onUpdateDoctorStatus(doc.id, newStatus);
                        triggerSyncNotice(doc.name, newStatus);
                      }}
                      className="glass"
                      style={{
                        ...styles.statusSelect,
                        borderColor: getStatusColor(doc.availabilityStatus),
                        color: getStatusColor(doc.availabilityStatus),
                      }}
                    >
                      <option value="Available">🟢 Available</option>
                      <option value="In Consultation">🟡 In Consultation</option>
                      <option value="Emergency">🔴 Emergency</option>
                      <option value="Off Duty">⚫ Off Duty</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctor View */}
        {adminRole === "doctor" && (
          <div className="glass animate-slide" style={styles.panelCard}>
            <div style={styles.panelHeader}>
              <h3>Practitioner Check-In</h3>
              <span className="badge badge-secondary">Staff Self-Service</span>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={styles.fieldLabel}>Identify Yourself:</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="glass"
                style={styles.dropdownInput}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            {activeDoctor && (
              <div style={styles.doctorControlBox} className="glass">
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <Image
                    src={activeDoctor.imgUrl}
                    alt={activeDoctor.name}
                    width={64}
                    height={64}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{activeDoctor.name}</h4>
                    <p style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
                      Specialty: {activeDoctor.specialty}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Current Status:</span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          color: getStatusColor(activeDoctor.availabilityStatus),
                        }}
                      >
                        {activeDoctor.availabilityStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <label style={styles.fieldLabel}>Quick Status Check-In:</label>
                <div style={styles.statusButtonsGroup}>
                  {(["Available", "In Consultation", "Emergency", "Off Duty"] as const).map((status) => {
                    const isActive = activeDoctor.availabilityStatus === status;
                    return (
                      <button
                        key={status}
                        onClick={() => {
                          onUpdateDoctorStatus(activeDoctor.id, status);
                          triggerSyncNotice(activeDoctor.name, status);
                        }}
                        style={{
                          ...styles.statusSelectBtn,
                          borderColor: getStatusColor(status),
                          backgroundColor: isActive ? getStatusColor(status) : "transparent",
                          color: isActive ? "var(--text-inverse)" : getStatusColor(status),
                          fontWeight: isActive ? 700 : 500,
                        }}
                      >
                        {status === "Available" && "🟢 Available"}
                        {status === "In Consultation" && "🟡 Consultation"}
                        {status === "Emergency" && "🔴 Emergency"}
                        {status === "Off Duty" && "⚫ Off Duty"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  syncToast: {
    position: "fixed",
    top: "100px",
    right: "24px",
    padding: "14px 20px",
    borderRadius: "var(--radius-sm)",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 9999,
    boxShadow: "var(--shadow-hover)",
    borderLeft: "4px solid var(--primary)",
  },
  syncIndicator: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "var(--primary)",
    boxShadow: "0 0 0 3px var(--primary-light)",
    animation: "pulse-emergency 1.5s ease-in-out infinite",
  },
  roleBar: {
    display: "flex",
    padding: "6px",
    borderRadius: "var(--radius-md)",
    marginBottom: "24px",
  },
  roleTabBtn: {
    flex: 1,
    border: "none",
    padding: "12px 16px",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    borderRadius: "var(--radius-sm)",
    transition: "var(--transition)",
    fontFamily: "var(--font-heading)",
  },
  panelCard: {
    padding: "36px",
    borderRadius: "var(--radius-lg)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "16px",
  },
  doctorsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  docRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "var(--radius-md)",
    flexWrap: "wrap",
    gap: "16px",
  },
  docProfile: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  statusBadgeDot: {
    position: "absolute",
    bottom: "0",
    right: "0",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    border: "2px solid var(--bg-surface)",
  },
  actionControl: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusSelect: {
    padding: "8px 14px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    background: "var(--bg-surface)",
    borderWidth: "1.5px",
    outline: "none",
  },
  fieldLabel: {
    display: "block",
    fontSize: "0.88rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  dropdownInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.95rem",
    color: "var(--text-main)",
    outline: "none",
    border: "1px solid var(--border-glass)",
    background: "var(--bg-surface-glass)",
  },
  doctorControlBox: {
    padding: "24px",
    borderRadius: "var(--radius-md)",
    marginTop: "16px",
  },
  statusButtonsGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
    marginTop: "8px",
  },
  statusSelectBtn: {
    border: "1.5px solid",
    padding: "12px 14px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontFamily: "var(--font-heading)",
    transition: "var(--transition)",
    textAlign: "center",
  },
};
