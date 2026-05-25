"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  actions?: { label: string; action: string; payload?: any }[];
}

interface SymptomCheckerProps {
  setActiveTab: (tab: string) => void;
  setSelectedDepartment: (dept: string) => void;
  setPreSelectedDoctor: (docName: string) => void;
}

export default function SymptomChecker({
  setActiveTab,
  setSelectedDepartment,
  setPreSelectedDoctor,
}: SymptomCheckerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "Hello! I'm Nakade AI, your virtual symptom assistant. Please describe what symptoms you are experiencing, or select one of the common concerns below to get guided support:",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions: [
        { label: "🤰 Pregnancy & Maternity", action: "symptom", payload: "pregnancy" },
        { label: "🔍 Sonography / Ultrasound", action: "symptom", payload: "sonography" },
        { label: "🧸 Child Health & Vaccines", action: "symptom", payload: "child_care" },
        { label: "🤒 Fever & General Illness", action: "symptom", payload: "general_illness" },
      ],
    },
  ]);

  // Scroll to bottom when messages list changes or widget opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const addMessage = (sender: "bot" | "user", text: string, actions?: any[]) => {
    const newMsg: Message = {
      id: `msg-${Math.random()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actions,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // User message
    addMessage("user", text);
    setInputVal("");

    // Simulate Bot response after a small delay
    setTimeout(() => {
      processResponse(text.toLowerCase());
    }, 600);
  };

  const processResponse = (query: string) => {
    if (query.includes("pregnancy") || query.includes("pregnant") || query.includes("delivery") || query.includes("gyn") || query.includes("maternity") || query.includes("women")) {
      addMessage(
        "bot",
        "🤰 Gynecology & Obstetrics query detected. For prenatal care, ultrasound scans, maternity consults, or routine female checkups, you can schedule an appointment with Dr. Pallavi Nakade.",
        [
          { label: "📅 Book Gynecology Appointment", action: "book", payload: { dept: "Gynecology", doctor: "Dr. Pallavi Nakade" } },
          { label: "🏥 View Gynecology Specialty", action: "tab", payload: { tab: "departments", dept: "Gynecology" } },
        ]
      );
    } else if (query.includes("scan") || query.includes("ultrasound") || query.includes("sonography") || query.includes("diagnostics")) {
      addMessage(
        "bot",
        "🔍 Sonography & Diagnostics. For prenatal 3D/4D ultrasound, abdominal scans, or diagnostic imaging, our chief specialist Dr. Lalit Nakade is available for scans and reports.",
        [
          { label: "📅 Book Sonography Appointment", action: "book", payload: { dept: "Sonography", doctor: "Dr. Lalit Nakade" } },
          { label: "🏥 View Diagnostics Specialty", action: "tab", payload: { tab: "departments", dept: "Sonography" } },
        ]
      );
    } else if (query.includes("child") || query.includes("baby") || query.includes("kid") || query.includes("pediatr") || query.includes("vaccin")) {
      addMessage(
        "bot",
        "🧸 Pediatrics & Child Care. For newborn checkups, child vaccination schedules, and standard pediatric illness care, you can schedule a checkup with Dr. Sneha Tembhurne.",
        [
          { label: "📅 Book Pediatrics Appointment", action: "book", payload: { dept: "Pediatrics", doctor: "Dr. Sneha Tembhurne" } },
        ]
      );
    } else if (query.includes("cough") || query.includes("fever") || query.includes("cold") || query.includes("flu") || query.includes("pain") || query.includes("head") || query.includes("migraine")) {
      addMessage(
        "bot",
        "🤒 General Medical concerns. For seasonal fever, primary medicine checkups, or general OPD consultation, you can consult with Dr. Amit Rahangdale or Dr. Lalit Nakade.",
        [
          { label: "📅 Book General Medicine", action: "book", payload: { dept: "General", doctor: "Dr. Amit Rahangdale" } },
          { label: "📞 Call Clinic: +91 82753 97699", action: "call", payload: "+918275397699" },
        ]
      );
    } else {
      addMessage(
        "bot",
        "Thank you for describing your concerns. If you would like to schedule a clinical consultation or diagnostic scan, please use our interactive booking wizard or search for a practitioner.",
        [
          { label: "📅 Book Appointment", action: "navigate", payload: "booking" },
          { label: "🔍 Find a Doctor", action: "navigate", payload: "doctors" },
        ]
      );
    }
  };

  const handleActionClick = (action: string, payload: any) => {
    if (action === "symptom") {
      let text = "";
      if (payload === "pregnancy") text = "Pregnancy & Maternity Care";
      else if (payload === "sonography") text = "Sonography / Ultrasound Scan";
      else if (payload === "child_care") text = "Child Health & Vaccinations";
      else if (payload === "general_illness") text = "Fever & General Illness";
      
      handleSend(text);
    } else if (action === "call") {
      window.location.href = "tel:+918275397699";
    } else if (action === "tab") {
      setSelectedDepartment(payload.dept);
      setActiveTab(payload.tab);
      setIsOpen(false);
    } else if (action === "book") {
      setSelectedDepartment(payload.dept);
      setPreSelectedDoctor(payload.doctor);
      setActiveTab("booking");
      setIsOpen(false);
    } else if (action === "navigate") {
      setActiveTab(payload);
      setIsOpen(false);
    }
  };

  return (
    <div style={styles.chatbotWrapper}>
      {/* Floating Toggle Button */}
      <button
        style={{
          ...styles.toggleBtn,
          transform: isOpen ? "rotate(45deg) scale(0.9)" : "rotate(0) scale(1)",
          backgroundColor: isOpen ? "var(--danger)" : "var(--primary)",
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="Open Symptom Assistant"
      >
        {isOpen ? (
          <span style={{ fontSize: "1.6rem", color: "white" }}>&times;</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="chat-window glass animate-slide">
          {/* Header */}
          <div style={styles.chatHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.chatAvatar}>✨</div>
              <div>
                <h4 style={{ fontSize: "0.95rem", color: "white", fontWeight: 700 }}>Nakade AI Assistant</h4>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)" }}>Online • Automated Diagnosis Guidance</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div style={styles.chatBody}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.msgRow,
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {msg.sender === "bot" && <div style={styles.botIconMini}>🤖</div>}
                
                <div style={{ display: "flex", flexDirection: "column", maxWidth: "80%" }}>
                  <div
                    style={{
                      ...styles.msgBubble,
                      backgroundColor: msg.sender === "user" ? "var(--primary)" : "var(--bg-surface)",
                      color: msg.sender === "user" ? "white" : "var(--text-main)",
                      borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    }}
                  >
                    <p style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>{msg.text}</p>

                    {/* Chat Actions/Chips */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div style={styles.actionsBox}>
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act.action, act.payload)}
                            style={styles.actionChip}
                            className="glass"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "var(--text-muted)",
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      marginTop: "4px",
                    }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.chatFooter}>
            <input
              type="text"
              placeholder="Type symptom (e.g. cough, headache)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(inputVal);
              }}
              style={styles.chatInput}
            />
            <button onClick={() => handleSend(inputVal)} style={styles.sendBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  chatbotWrapper: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    zIndex: 999,
  },
  toggleBtn: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0, 128, 128, 0.35)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  chatHeader: {
    backgroundColor: "var(--primary)",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
  },
  chatBody: {
    flexGrow: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    backgroundColor: "rgba(var(--bg-main), 0.3)",
  },
  msgRow: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-start",
  },
  botIconMini: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
  },
  msgBubble: {
    padding: "12px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
  },
  actionsBox: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "12px",
    alignItems: "stretch",
  },
  actionChip: {
    textAlign: "left",
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    color: "var(--primary)",
    padding: "8px 12px",
    borderRadius: "var(--radius-sm)",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "var(--transition)",
    fontFamily: "var(--font-heading)",
  },
  chatFooter: {
    padding: "12px 16px",
    borderTop: "1px solid var(--border)",
    backgroundColor: "var(--bg-surface)",
    display: "flex",
    gap: "10px",
  },
  chatInput: {
    flexGrow: 1,
    border: "2px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 14px",
    outline: "none",
    color: "var(--text-main)",
    backgroundColor: "var(--bg-main)",
    fontSize: "0.85rem",
    fontFamily: "var(--font-body)",
    transition: "var(--transition)",
  },
  sendBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "var(--radius-sm)",
    backgroundColor: "var(--primary)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "var(--transition)",
  },
};
