"use client";

import { useState } from "react";

interface Report {
  name: string;
  date: string;
  value: number;
  minNormal: number;
  maxNormal: number;
  unit: string;
  status: "Normal" | "Borderline" | "High" | "Low";
  desc: string;
}

interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillsLeft: number;
  status: "Refill Available" | "Request Pending" | "Expired";
}

export default function PatientPortal() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Dashboard states
  const [activeTab, setActiveTab] = useState<"overview" | "reports" | "prescriptions">("overview");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Mock prescription list
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "rx-1",
      name: "Atorvastatin (Lipitor)",
      dosage: "20 mg",
      frequency: "Once daily at bedtime",
      refillsLeft: 2,
      status: "Refill Available",
    },
    {
      id: "rx-2",
      name: "Lisinopril (Zestril)",
      dosage: "10 mg",
      frequency: "Once daily in the morning",
      refillsLeft: 0,
      status: "Expired",
    },
    {
      id: "rx-3",
      name: "Metformin (Glucophage)",
      dosage: "500 mg",
      frequency: "Twice daily with meals",
      refillsLeft: 4,
      status: "Refill Available",
    },
  ]);

  const reports: Report[] = [
    {
      name: "Cholesterol (Lipid Panel)",
      date: "May 12, 2026",
      value: 215,
      minNormal: 100,
      maxNormal: 200,
      unit: "mg/dL",
      status: "High",
      desc: "Total cholesterol levels above 200 mg/dL are considered borderline/high. Lifestyle improvements or standard statin therapies are recommended.",
    },
    {
      name: "Hemoglobin A1c (HbA1c)",
      date: "May 12, 2026",
      value: 5.4,
      minNormal: 4.0,
      maxNormal: 5.6,
      unit: "%",
      status: "Normal",
      desc: "HbA1c level is within the healthy range. Indicates good glycemic control over the past 3 months.",
    },
    {
      name: "Vitamin D (25-Hydroxy)",
      date: "Mar 10, 2026",
      value: 24,
      minNormal: 30,
      maxNormal: 100,
      unit: "ng/mL",
      status: "Low",
      desc: "Your Vitamin D level is slightly below the normal range. Sun exposure and supplemental oral Vitamin D3 is advised.",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === "patient123" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials. Please use: patient123 / password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setActiveTab("overview");
  };

  const handleRefillRequest = (id: string) => {
    setPrescriptions(
      prescriptions.map((rx) => {
        if (rx.id === id) {
          return {
            ...rx,
            status: "Request Pending" as const,
            refillsLeft: rx.refillsLeft > 0 ? rx.refillsLeft - 1 : 0,
          };
        }
        return rx;
      })
    );
    alert("Refill request sent to Dr. Jenkins! You will be notified when it is ready at the designated pharmacy.");
  };

  return (
    <section className="section-padding" id="portal">
      <div className="container" style={{ maxWidth: "1100px" }}>
        {!isLoggedIn ? (
          /* Login Screen */
          <div className="glass animate-fade" style={styles.loginBox}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <span className="badge badge-primary" style={{ marginBottom: "12px" }}>Secure Access</span>
              <h2 style={{ fontSize: "2rem", marginBottom: "8px" }}>Patient Portal Login</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                Access clinical records, schedule follow-ups, and request refills.
              </p>
            </div>

            {/* Test Credentials Box */}
            <div style={styles.credentialsBox}>
              <p style={{ fontWeight: 700, color: "var(--primary)" }}>🔑 Demo Login Credentials</p>
              <div style={{ display: "flex", gap: "24px", marginTop: "8px", fontSize: "0.9rem" }}>
                <p>Username: <code style={styles.code}>patient123</code></p>
                <p>Password: <code style={styles.code}>password</code></p>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "16px" }}>
                Sign In Securely
              </button>
            </form>
          </div>
        ) : (
          /* Portal Dashboard (LoggedIn) */
          <div className="glass animate-slide" style={styles.dashboardBox}>
            {/* Header */}
            <div style={styles.dashboardHeader}>
              <div>
                <h2 style={{ fontSize: "1.8rem" }}>Patient Dashboard</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                  Welcome back, <strong>Eleanor Vance</strong> (DOB: 12-Sep-1988)
                </p>
              </div>
              <button className="btn btn-outline" style={styles.logoutBtn} onClick={handleLogout}>
                🚪 Log Out
              </button>
            </div>

            {/* Sub-navigation Tabs */}
            <div style={styles.tabsRow}>
              {[
                { id: "overview", label: "Health Overview" },
                { id: "reports", label: "Lab Reports" },
                { id: "prescriptions", label: "Prescriptions" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedReport(null);
                  }}
                  style={{
                    ...styles.tabBtn,
                    borderBottom: activeTab === tab.id ? "3px solid var(--primary)" : "3px solid transparent",
                    color: activeTab === tab.id ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: activeTab === tab.id ? "700" : "500",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Panels */}
            <div style={styles.tabContent}>
              {/* Tab 1: Health Overview */}
              {activeTab === "overview" && (
                <div className="animate-fade">
                  <div style={styles.overviewGrid}>
                    <div className="card glass" style={styles.infoCard}>
                      <h4 style={styles.cardHeaderTitle}>Patient Bio-Profile</h4>
                      <div style={styles.bioGrid}>
                        <div><span style={styles.bioLabel}>Blood Type:</span> <strong style={styles.bioVal}>O Positive (O+)</strong></div>
                        <div><span style={styles.bioLabel}>Allergies:</span> <strong style={{ ...styles.bioVal, color: "var(--danger)" }}>Penicillin</strong></div>
                        <div><span style={styles.bioLabel}>Primary Doctor:</span> <strong style={styles.bioVal}>Dr. Sarah Jenkins</strong></div>
                        <div><span style={styles.bioLabel}>Insurance status:</span> <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>Active</span></div>
                      </div>
                    </div>

                    <div className="card glass" style={styles.infoCard}>
                      <h4 style={styles.cardHeaderTitle}>Upcoming Appts</h4>
                      <div style={styles.apptBox}>
                        <div style={styles.calendarIcon}>
                          <span style={styles.calMonth}>JUN</span>
                          <span style={styles.calDay}>08</span>
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <h5 style={{ fontSize: "1rem", fontWeight: 700 }}>Cardiology Check-up</h5>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Dr. Sarah Jenkins • 10:00 AM</p>
                        </div>
                        <span className="badge badge-primary" style={{ fontSize: "0.65rem" }}>In Person</span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.4rem", margin: "32px 0 16px 0" }}>Recent Diagnostic Signals</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {reports.slice(0, 2).map((rep) => (
                      <div
                        key={rep.name}
                        onClick={() => {
                          setSelectedReport(rep);
                          setActiveTab("reports");
                        }}
                        style={styles.summaryReportRow}
                        className="glass summary-report-row"
                      >
                        <span style={{ fontWeight: 700, flex: 1 }}>{rep.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{rep.date}</span>
                        <div style={{ minWidth: "120px", textAlign: "right" }}>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: rep.status === "High" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                              color: rep.status === "High" ? "var(--danger)" : "var(--success)",
                              border: `1px solid ${rep.status === "High" ? "var(--danger)" : "var(--success)"}`,
                            }}
                          >
                            {rep.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Lab Reports */}
              {activeTab === "reports" && (
                <div className="animate-fade reports-layout">
                  <div style={styles.reportsSidebar}>
                    <h4 style={{ fontSize: "1rem", marginBottom: "12px", color: "var(--text-muted)" }}>Completed Panels</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {reports.map((rep) => (
                        <button
                          key={rep.name}
                          onClick={() => setSelectedReport(rep)}
                          style={{
                            ...styles.reportSidebarBtn,
                            borderColor: selectedReport?.name === rep.name ? "var(--primary)" : "var(--border)",
                            backgroundColor: selectedReport?.name === rep.name ? "var(--primary-light)" : "transparent",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                            <span style={{ fontWeight: 700, textAlign: "left", fontSize: "0.9rem" }}>{rep.name}</span>
                            <span style={{
                              color: rep.status === "High" ? "var(--danger)" : rep.status === "Low" ? "var(--warning)" : "var(--success)",
                              fontWeight: 700,
                              fontSize: "0.85rem",
                            }}>{rep.value}</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-start" }}>{rep.date}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={styles.reportMain}>
                    {selectedReport ? (
                      <div className="card glass animate-fade" style={{ height: "100%", padding: "32px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <h3 style={{ fontSize: "1.4rem" }}>{selectedReport.name}</h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Report Date: {selectedReport.date}</p>
                          </div>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: selectedReport.status === "High" ? "rgba(239, 68, 68, 0.15)" : selectedReport.status === "Low" ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                              color: selectedReport.status === "High" ? "var(--danger)" : selectedReport.status === "Low" ? "var(--warning)" : "var(--success)",
                              border: `1px solid ${selectedReport.status === "High" ? "var(--danger)" : selectedReport.status === "Low" ? "var(--warning)" : "var(--success)"}`,
                            }}
                          >
                            {selectedReport.status}
                          </span>
                        </div>

                        {/* Interactive Chart Progress Bar Widget */}
                        <div style={styles.chartWidget}>
                          <div style={styles.chartValues}>
                            <span>Min Ref: {selectedReport.minNormal}</span>
                            <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)" }}>
                              {selectedReport.value} <span style={{ fontSize: "1rem" }}>{selectedReport.unit}</span>
                            </span>
                            <span>Max Ref: {selectedReport.maxNormal}</span>
                          </div>

                          <div style={styles.progressBarBg}>
                            {/* Normal Range Area overlay */}
                            <div style={styles.chartNormalZone}></div>
                            {/* Current Value Indicator Marker Pin */}
                            <div
                              style={{
                                ...styles.chartPin,
                                left: `${Math.min(100, Math.max(0, (selectedReport.value / (selectedReport.maxNormal * 1.5)) * 100))}%`,
                                backgroundColor: selectedReport.status === "High" ? "var(--danger)" : selectedReport.status === "Low" ? "var(--warning)" : "var(--success)",
                              }}
                            ></div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "8px" }}>
                            <span>0 {selectedReport.unit}</span>
                            <span>Scale limit: {Math.round(selectedReport.maxNormal * 1.5)} {selectedReport.unit}</span>
                          </div>
                        </div>

                        <div style={{ marginTop: "24px" }}>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "8px" }}>Clinical Assessment</h4>
                          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{selectedReport.desc}</p>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.emptyReportBox} className="card glass">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ marginBottom: "12px" }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Select a Lab Report</h4>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Click any report in the left sidebar to view graphical indicators and clinical analyses.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Prescriptions */}
              {activeTab === "prescriptions" && (
                <div className="animate-fade">
                  <h3 style={{ fontSize: "1.4rem", marginBottom: "16px" }}>Active Prescribed Medications</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {prescriptions.map((rx) => (
                      <div key={rx.id} className="card glass" style={styles.rxCard}>
                        <div style={styles.rxHeader}>
                          <div>
                            <h4 style={{ fontSize: "1.2rem", fontWeight: 700 }}>{rx.name}</h4>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2px" }}>Dosage: {rx.dosage} • Frequency: {rx.frequency}</p>
                          </div>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: rx.status === "Refill Available" ? "rgba(16, 185, 129, 0.15)" : rx.status === "Request Pending" ? "rgba(59, 130, 246, 0.15)" : "rgba(239, 68, 68, 0.15)",
                              color: rx.status === "Refill Available" ? "var(--success)" : rx.status === "Request Pending" ? "var(--info)" : "var(--danger)",
                              border: `1px solid ${rx.status === "Refill Available" ? "var(--success)" : rx.status === "Request Pending" ? "var(--info)" : "var(--danger)"}`,
                            }}
                          >
                            {rx.status}
                          </span>
                        </div>

                        <div style={styles.rxActions}>
                          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            Refills Remaining: <strong>{rx.refillsLeft}</strong>
                          </span>
                          <button
                            className="btn btn-primary"
                            disabled={rx.status !== "Refill Available"}
                            onClick={() => handleRefillRequest(rx.id)}
                            style={{
                              padding: "6px 16px",
                              fontSize: "0.8rem",
                              backgroundColor: rx.status !== "Refill Available" ? "var(--border)" : "var(--primary)",
                              cursor: rx.status !== "Refill Available" ? "not-allowed" : "pointer",
                            }}
                          >
                            {rx.status === "Request Pending" ? "Refill Requested" : "Request Refill 💊"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginBox: {
    maxWidth: "550px",
    margin: "0 auto",
    padding: "40px",
    borderRadius: "var(--radius-lg)",
  },
  credentialsBox: {
    backgroundColor: "var(--primary-light)",
    border: "1px solid var(--primary)",
    padding: "16px",
    borderRadius: "var(--radius-sm)",
    marginBottom: "24px",
  },
  code: {
    backgroundColor: "var(--border)",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: 700,
  },
  dashboardBox: {
    padding: "40px",
    borderRadius: "var(--radius-lg)",
  },
  dashboardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "24px",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  logoutBtn: {
    fontSize: "0.85rem",
    padding: "8px 16px",
  },
  tabsRow: {
    display: "flex",
    gap: "16px",
    borderBottom: "2px solid var(--border)",
    marginBottom: "32px",
  },
  tabBtn: {
    background: "none",
    border: "none",
    padding: "12px 4px",
    cursor: "pointer",
    fontSize: "0.95rem",
    transition: "var(--transition)",
    fontFamily: "var(--font-heading)",
  },
  tabContent: {
    minHeight: "300px",
  },
  overviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  infoCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  cardHeaderTitle: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "8px",
  },
  bioGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  bioLabel: {
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    marginRight: "8px",
  },
  bioVal: {
    fontSize: "0.95rem",
  },
  apptBox: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "var(--primary-light)",
    padding: "16px",
    borderRadius: "var(--radius-sm)",
  },
  calendarIcon: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--primary)",
    color: "white",
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    fontFamily: "var(--font-heading)",
    lineHeight: 1.1,
  },
  calMonth: {
    fontSize: "0.65rem",
    fontWeight: 600,
  },
  calDay: {
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  summaryReportRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    border: "1px solid var(--border)",
    transition: "var(--transition)",
  },
  reportsLayout: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "32px",
  },
  reportsSidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  reportSidebarBtn: {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    borderRadius: "var(--radius-sm)",
    border: "2px solid var(--border)",
    background: "none",
    cursor: "pointer",
    transition: "var(--transition)",
    gap: "6px",
    fontFamily: "var(--font-body)",
  },
  reportMain: {
    minHeight: "350px",
  },
  chartWidget: {
    backgroundColor: "var(--primary-light)",
    padding: "24px",
    borderRadius: "var(--radius-sm)",
    margin: "24px 0",
    border: "1px solid var(--border)",
  },
  chartValues: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    marginBottom: "16px",
  },
  progressBarBg: {
    height: "12px",
    backgroundColor: "var(--border)",
    borderRadius: "var(--radius-full)",
    position: "relative",
  },
  chartNormalZone: {
    position: "absolute",
    left: "25%",
    width: "45%",
    height: "100%",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderLeft: "1px solid var(--success)",
    borderRight: "1px solid var(--success)",
  },
  chartPin: {
    position: "absolute",
    top: "-4px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    transform: "translateX(-50%)",
    border: "3px solid white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  emptyReportBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "48px",
    textAlign: "center",
  },
  rxCard: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  rxHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
  },
  rxActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
    paddingTop: "12px",
  },
};
