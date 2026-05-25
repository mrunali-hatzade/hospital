"use client";

import { useState, useEffect } from "react";
import { Doctor } from "./AdminDashboard";

interface AppointmentBookingProps {
  preSelectedDoctor: string;
  setPreSelectedDoctor: (docName: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  doctors: Doctor[];
}

export default function AppointmentBooking({
  preSelectedDoctor,
  setPreSelectedDoctor,
  selectedDepartment,
  setSelectedDepartment,
  doctors,
}: AppointmentBookingProps) {
  const [step, setStep] = useState(1);
  const [doctorList, setDoctorList] = useState<string[]>([]);
  const [doctor, setDoctor] = useState("");
  
  // Date and slots state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  
  // Form fields
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [visitReason, setVisitReason] = useState("");
  const [insurance, setInsurance] = useState("Basic Health Plan");

  // Receipt reference
  const [ticketRef, setTicketRef] = useState("");

  // Sync doctor list when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = doctors
        .filter((d) => d.specialty === selectedDepartment)
        .map((d) => d.name);
      setDoctorList(filtered);
      // If preselected doctor matches the department, keep it. Otherwise, clean doctor state.
      if (preSelectedDoctor && filtered.includes(preSelectedDoctor)) {
        setDoctor(preSelectedDoctor);
      } else {
        setDoctor("");
      }
    } else {
      setDoctorList([]);
      setDoctor("");
    }
  }, [selectedDepartment, preSelectedDoctor, doctors]);

  const handleDeptChange = (dept: string) => {
    setSelectedDepartment(dept);
    setPreSelectedDoctor(""); // clear preselection when manually changing
  };

  const getNextDays = () => {
    const days = [];
    const dateNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let count = 0;
    let added = 0;
    
    while (added < 5) {
      const d = new Date();
      d.setDate(d.getDate() + count);
      
      // Skip Sundays
      if (d.getDay() !== 0) {
        days.push({
          raw: d.toISOString().split("T")[0],
          dayName: dateNames[d.getDay()],
          dayNum: d.getDate(),
          month: monthNames[d.getMonth()],
        });
        added++;
      }
      count++;
    }
    return days;
  };

  const slots = [
    { time: "09:00 AM", period: "Morning" },
    { time: "10:00 AM", period: "Morning" },
    { time: "11:30 AM", period: "Morning" },
    { time: "02:00 PM", period: "Afternoon" },
    { time: "03:30 PM", period: "Afternoon" },
    { time: "04:30 PM", period: "Afternoon" },
  ];

  const handleNext = () => {
    if (step === 1 && (!selectedDepartment || !doctor)) {
      alert("Please select both a Clinical Specialty and a Doctor.");
      return;
    }
    if (step === 2 && (!selectedDate || !selectedSlot)) {
      alert("Please select a date and an available time slot.");
      return;
    }
    if (step === 3 && (!patientName || !patientEmail || !patientPhone)) {
      alert("Please fill in all required patient fields.");
      return;
    }

    if (step === 3) {
      // Finalize and generate ticket
      const randomRef = `AH-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketRef(randomRef);
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedDepartment("");
    setPreSelectedDoctor("");
    setDoctor("");
    setSelectedDate("");
    setSelectedSlot("");
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setVisitReason("");
    setInsurance("Basic Health Plan");
    setTicketRef("");
  };

  return (
    <section className="section-padding" id="booking">
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div className="glass" style={styles.bookingBox}>
          {/* Stepper Progress Bar */}
          {step <= 3 && (
            <div style={styles.stepper}>
              {[
                { s: 1, label: "Specialty & Doctor" },
                { s: 2, label: "Date & Time" },
                { s: 3, label: "Patient Info" },
              ].map((item) => (
                <div key={item.s} style={styles.stepIndicator}>
                  <div
                    style={{
                      ...styles.stepNumber,
                      backgroundColor: step === item.s ? "var(--primary)" : step > item.s ? "var(--success)" : "var(--border)",
                      color: "white",
                    }}
                  >
                    {step > item.s ? "✓" : item.s}
                  </div>
                  <span style={{
                    ...styles.stepLabel,
                    color: step === item.s ? "var(--text-main)" : "var(--text-muted)",
                    fontWeight: step === item.s ? "700" : "500",
                  }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Specialty & Doctor */}
          {step === 1 && (
            <div className="animate-fade">
              <h2 style={styles.sectionTitle}>Select Specialty & Specialist</h2>
              <p style={styles.sectionSubtitle}>Choose a medical branch and your preferred doctor.</p>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Clinical Specialty *</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => handleDeptChange(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select a specialty...</option>
                    <option value="Cardiology">Cardiology (Heart Health)</option>
                    <option value="Neurology">Neurology (Brain & Spine)</option>
                    <option value="Pediatrics">Pediatrics (Child Health)</option>
                    <option value="Orthopedics">Orthopedics (Bones & Joints)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor / Specialist *</label>
                  <select
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="form-input"
                    disabled={!selectedDepartment}
                  >
                    <option value="">Choose your specialist...</option>
                    {doctorList.map((docName) => {
                      const docObj = doctors.find((d) => d.name === docName);
                      const statusStr = docObj ? ` (${docObj.availabilityStatus})` : "";
                      return (
                        <option key={docName} value={docName}>
                          {docName} {statusStr}
                        </option>
                      );
                    })}
                  </select>
                  {doctor && (() => {
                    const docObj = doctors.find((d) => d.name === doctor);
                    if (!docObj) return null;
                    if (docObj.availabilityStatus !== "Available") {
                      return (
                        <div style={{
                          marginTop: "8px",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          backgroundColor: docObj.availabilityStatus === "Emergency" ? "rgba(239, 68, 68, 0.08)"
                            : docObj.availabilityStatus === "In Consultation" ? "rgba(245, 158, 11, 0.08)"
                            : "rgba(148, 163, 184, 0.08)",
                          border: `1.5px solid ${
                            docObj.availabilityStatus === "Emergency" ? "var(--danger)"
                              : docObj.availabilityStatus === "In Consultation" ? "var(--warning)"
                              : "#94a3b8"
                          }`,
                          fontSize: "0.82rem",
                          color: docObj.availabilityStatus === "Emergency" ? "var(--danger)"
                            : docObj.availabilityStatus === "In Consultation" ? "var(--warning)"
                            : "var(--text-muted)",
                        }}>
                          <span style={{ fontWeight: 700, marginRight: "4px" }}>
                            {docObj.availabilityStatus === "Emergency" && "⚠️ Emergency Duty:"}
                            {docObj.availabilityStatus === "In Consultation" && "⏳ In Consultation:"}
                            {docObj.availabilityStatus === "Off Duty" && "💤 Off Duty / Sign Out:"}
                          </span>
                          {docObj.name} is currently {docObj.availabilityStatus.toLowerCase()}. Bookings may experience wait times or require rescheduling.
                        </div>
                      );
                    }
                    return (
                      <div style={{
                        marginTop: "8px",
                        fontSize: "0.82rem",
                        color: "var(--success)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--success)" }} />
                        {docObj.name} is available in clinic for immediate appointment slots.
                      </div>
                    );
                  })()}
                  {!selectedDepartment && (
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                      * Please select a specialty first to list practitioners.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Date & Slots */}
          {step === 2 && (
            <div className="animate-fade">
              <h2 style={styles.sectionTitle}>Choose Schedule Slot</h2>
              <p style={styles.sectionSubtitle}>Select an available date and time slot for your appointment.</p>

              {/* Date Cards Grid */}
              <div style={{ marginBottom: "32px" }}>
                <label className="form-label" style={{ marginBottom: "12px" }}>Available Dates</label>
                <div className="date-grid">
                  {getNextDays().map((day) => (
                    <div
                      key={day.raw}
                      onClick={() => setSelectedDate(day.raw)}
                      style={{
                        ...styles.dateCard,
                        borderColor: selectedDate === day.raw ? "var(--primary)" : "var(--border)",
                        backgroundColor: selectedDate === day.raw ? "var(--primary-light)" : "var(--bg-surface)",
                      }}
                    >
                      <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)" }}>{day.dayName}</span>
                      <span style={{ fontSize: "1.6rem", fontWeight: 800, margin: "4px 0", color: selectedDate === day.raw ? "var(--primary)" : "var(--text-main)" }}>{day.dayNum}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{day.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label" style={{ marginBottom: "12px" }}>Available Time Slots</label>
                <div style={styles.slotsGrid}>
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedSlot(slot.time)}
                      style={{
                        ...styles.slotBtn,
                        borderColor: selectedSlot === slot.time ? "var(--primary)" : "var(--border)",
                        backgroundColor: selectedSlot === slot.time ? "var(--primary)" : "var(--bg-surface)",
                        color: selectedSlot === slot.time ? "white" : "var(--text-main)",
                      }}
                    >
                      <span>{slot.time}</span>
                      <span style={{
                        fontSize: "0.7rem",
                        opacity: 0.8,
                        color: selectedSlot === slot.time ? "white" : "var(--text-muted)",
                      }}>{slot.period}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Patient Information */}
          {step === 3 && (
            <div className="animate-fade">
              <h2 style={styles.sectionTitle}>Patient Information</h2>
              <p style={styles.sectionSubtitle}>Please enter basic contact details and visit purpose details.</p>

              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555 0199"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Insurance Provider</label>
                  <select
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="form-input"
                  >
                    <option value="None / Self Pay">None / Self Pay</option>
                    <option value="Basic Health Plan">Basic Health Plan</option>
                    <option value="Premium Shield Plan">Premium Shield Plan</option>
                    <option value="Medicare Advantage">Medicare Advantage</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label className="form-label">Reason for Visit (Brief description)</label>
                  <textarea
                    rows={3}
                    placeholder="Describe symptoms, follow-up request, or consultation goals..."
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    className="form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Appointment Ticket Receipt */}
          {step === 4 && (
            <div className="animate-fade" style={styles.receiptContainer}>
              <div style={styles.successBadge}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "8px" }}>Booking Confirmed!</h2>
              <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>
                Your appointment has been registered in the Nakade Hospital diagnostic system.
              </p>

              {/* High Premium Ticket Card */}
              <div style={styles.ticketCard} className="glass">
                <div style={styles.ticketHeader}>
                  <div>
                    <h3 style={styles.ticketClinic}>Nakade Hospital</h3>
                    <p style={styles.ticketRef}>REF: {ticketRef}</p>
                  </div>
                  <span className="badge badge-success">Scheduled</span>
                </div>

                <div style={styles.ticketDivider}></div>

                <div style={styles.ticketGrid}>
                  <div>
                    <span style={styles.ticketLabel}>Patient</span>
                    <p style={styles.ticketVal}>{patientName}</p>
                  </div>
                  <div>
                    <span style={styles.ticketLabel}>Doctor</span>
                    <p style={styles.ticketVal}>{doctor}</p>
                  </div>
                  <div>
                    <span style={styles.ticketLabel}>Date</span>
                    <p style={styles.ticketVal}>{selectedDate}</p>
                  </div>
                  <div>
                    <span style={styles.ticketLabel}>Time Slot</span>
                    <p style={styles.ticketVal}>{selectedSlot}</p>
                  </div>
                  <div>
                    <span style={styles.ticketLabel}>Department</span>
                    <p style={styles.ticketVal}>{selectedDepartment}</p>
                  </div>
                  <div>
                    <span style={styles.ticketLabel}>Insurance</span>
                    <p style={styles.ticketVal}>{insurance}</p>
                  </div>
                </div>

                <div style={styles.ticketDivider}></div>

                <div style={styles.barcodeArea}>
                  {/* Mock Barcode using SVG lines */}
                  <svg width="240" height="48" style={{ margin: "0 auto" }}>
                    {[...Array(30)].map((_, idx) => {
                      const width = Math.random() > 0.4 ? 4 : 2;
                      const gap = Math.random() > 0.3 ? 6 : 3;
                      return (
                        <rect
                          key={idx}
                          x={idx * 8}
                          y="0"
                          width={width}
                          height="48"
                          fill="var(--text-main)"
                        />
                      );
                    })}
                  </svg>
                  <p style={styles.barcodeSub}>For patient check-in kiosks on arrival</p>
                </div>
              </div>

              <div style={styles.receiptActions}>
                <button className="btn btn-outline" onClick={handleReset}>
                  Book Another Appointment
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    alert("Ticket downloaded successfully! (Demo Action)");
                  }}
                >
                  📥 Download Ticket PDF
                </button>
              </div>
            </div>
          )}

          {/* Bottom Control Buttons */}
          {step <= 3 && (
            <div style={styles.stepControls}>
              {step > 1 ? (
                <button className="btn btn-outline" onClick={handleBack} style={styles.controlBtn}>
                  &larr; Back
                </button>
              ) : (
                <div></div> // empty spacer
              )}

              <button className="btn btn-primary" onClick={handleNext} style={styles.controlBtn}>
                {step === 3 ? "Confirm Appointment 📅" : "Next Step &rarr;"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bookingBox: {
    padding: "40px",
    borderRadius: "var(--radius-lg)",
  },
  stepper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    borderBottom: "1px solid var(--border)",
    paddingBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  stepIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  stepNumber: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.95rem",
    fontWeight: 700,
  },
  stepLabel: {
    fontSize: "0.9rem",
    fontFamily: "var(--font-heading)",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 800,
    marginBottom: "8px",
  },
  sectionSubtitle: {
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    marginBottom: "32px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
  },
  dateCard: {
    padding: "16px 8px",
    border: "2px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "var(--transition)",
  },
  slotsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "12px",
  },
  slotBtn: {
    padding: "12px 8px",
    border: "2px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "0.9rem",
    fontWeight: 700,
    fontFamily: "var(--font-body)",
    transition: "var(--transition)",
  },
  stepControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "40px",
    borderTop: "1px solid var(--border)",
    paddingTop: "24px",
  },
  controlBtn: {
    minWidth: "140px",
  },
  receiptContainer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  successBadge: {
    width: "72px",
    height: "72px",
    backgroundColor: "var(--success)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    boxShadow: "0 8px 24px rgba(16, 185, 129, 0.3)",
  },
  ticketCard: {
    width: "100%",
    maxWidth: "600px",
    borderRadius: "var(--radius-md)",
    padding: "32px",
    border: "2px dashed var(--border)",
    textAlign: "left",
    marginBottom: "32px",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  ticketClinic: {
    fontSize: "1.2rem",
    fontWeight: 800,
  },
  ticketRef: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 700,
    marginTop: "2px",
  },
  ticketDivider: {
    borderTop: "1px dashed var(--border)",
    margin: "24px 0",
  },
  ticketGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  ticketLabel: {
    fontSize: "0.75rem",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    letterSpacing: "0.05em",
    display: "block",
  },
  ticketVal: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--text-main)",
  },
  barcodeArea: {
    textAlign: "center",
  },
  barcodeSub: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    marginTop: "8px",
    letterSpacing: "0.02em",
  },
  receiptActions: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
};
