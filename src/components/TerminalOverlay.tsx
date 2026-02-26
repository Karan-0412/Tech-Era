import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { EVENTS } from "@/lib/events";

type Step = "init" | "name" | "email" | "phone" | "event" | "team_name" | "team_leader_uid" | "add_team_members_option" | "team_uid" | "team_member_name" | "team_member_email" | "team_member_phone" | "team_review" | "password" | "submitting" | "success" | "error";

interface TeamMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
}

interface TerminalLine {
  text: string;
  color: "green" | "cyan" | "red" | "dim";
  typing?: boolean;
}

interface TerminalOverlayProps {
  open: boolean;
  onClose: () => void;
}

const AUTO_TYPE_SPEED = 35;

const useAutoType = (text: string, onDone: () => void, active: boolean) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone();
      }
    }, AUTO_TYPE_SPEED);
    return () => clearInterval(interval);
  }, [text, active]);

  return displayed;
};

/* ── Matrix rain effect ─────────────────────────────── */
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "NEXUS01アイウエオカキクケコサシスセソ>_[]{}|/\\";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -100);

    let frameId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "hsl(183, 100%, 50%)";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
      frameId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

/* ── Scanline overlay ───────────────────────────────── */
const Scanlines = () => (
  <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-[0.06]">
    <div
      className="w-full h-[200%] animate-scanline"
      style={{
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--neon-green) / 0.15) 2px, hsl(var(--neon-green) / 0.15) 4px)",
      }}
    />
  </div>
);

/* ── Typing line component ──────────────────────────── */
const TypingLine = ({
  text,
  active,
  onDone,
  color = "green",
}: {
  text: string;
  active: boolean;
  onDone: () => void;
  color?: "green" | "cyan" | "red" | "dim";
}) => {
  const displayed = useAutoType(text, onDone, active);
  const colorClass =
    color === "cyan"
      ? "text-primary text-glow-cyan"
      : color === "red"
      ? "text-destructive"
      : color === "dim"
      ? "text-muted-foreground"
      : "text-accent text-glow-green";

  return (
    <div className={`font-mono text-xs sm:text-sm ${colorClass}`}>
      {displayed}
      {active && displayed.length < text.length && (
        <span className="animate-typing-cursor">▌</span>
      )}
    </div>
  );
};

/* ── Main overlay ───────────────────────────────────── */
const TerminalOverlay = ({ open, onClose }: TerminalOverlayProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("init");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null);
  const [teamName, setTeamName] = useState("");
  const [leaderUid, setLeaderUid] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentMemberData, setCurrentMemberData] = useState({ uid: "", name: "", email: "", phone: "" });
  const [memberFieldStep, setMemberFieldStep] = useState<"uid" | "name" | "email" | "phone">("uid");
  const [shakeInput, setShakeInput] = useState(false);
  const [currentAutoType, setCurrentAutoType] = useState<{
    text: string;
    color: TerminalLine["color"];
  } | null>(null);
  const [autoTypeDone, setAutoTypeDone] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLine = useCallback(
    (text: string, color: TerminalLine["color"] = "green") => {
      setLines((prev) => [...prev, { text, color }]);
    },
    []
  );

  const startAutoType = useCallback(
    (text: string, color: TerminalLine["color"] = "green") => {
      setAutoTypeDone(false);
      setCurrentAutoType({ text, color });
    },
    []
  );

  const handleAutoTypeDone = useCallback(() => {
    if (currentAutoType) {
      addLine(currentAutoType.text, currentAutoType.color);
      setCurrentAutoType(null);
      setAutoTypeDone(true);
    }
  }, [currentAutoType, addLine]);

  // Scroll to bottom on new lines
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, currentAutoType]);

  // Focus input when ready
  useEffect(() => {
    if (autoTypeDone && (step === "name" || step === "email" || step === "phone" || step === "event" || step === "team_name" || step === "team_leader_uid" || step === "add_team_members_option" || step === "team_uid" || step === "team_member_name" || step === "team_member_email" || step === "team_member_phone" || step === "team_review" || step === "password")) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoTypeDone, step]);

  // Init sequence
  useEffect(() => {
    if (!open) return;
    setStep("init");
    setLines([]);
    setInputValue("");
    setName("");
    setEmail("");
    setPhone("");
    setTeamName("");
    setLeaderUid("");
    setSelectedEvent(null);
    setTeamMembers([]);
    setCurrentMemberData({ uid: "", name: "", email: "", phone: "" });
    setMemberFieldStep("uid");
    setCurrentAutoType(null);
    setAutoTypeDone(false);

    const t1 = setTimeout(() => {
      startAutoType("> INITIALIZING SECURE CONNECTION...", "dim");
    }, 400);

    return () => clearTimeout(t1);
  }, [open, startAutoType]);

  // Progress through init → name
  useEffect(() => {
    if (step === "init" && autoTypeDone && !currentAutoType) {
      const t = setTimeout(() => {
        addLine("> CONNECTION ESTABLISHED.", "green");
        const t2 = setTimeout(() => {
          setStep("name");
          startAutoType("> ENTER USER_DESIGNATION (Name):", "green");
        }, 600);
        return () => clearTimeout(t2);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [step, autoTypeDone, currentAutoType, addLine, startAutoType]);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const triggerError = (msg: string) => {
    addLine(`> ERROR: ${msg}`, "red");
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 500);
    setInputValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (step === "name") {
      if (val.length < 2 || val.length > 50) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setName(val);
      setInputValue("");
      setStep("email");
      setTimeout(() => startAutoType("> ENTER COMM_LINK (Email):", "green"), 300);
    } else if (step === "email") {
      if (!validateEmail(val)) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setEmail(val);
      setInputValue("");
      setStep("phone");
      setTimeout(() => startAutoType("> ENTER YOUR PHONE_NUMBER:", "green"), 300);
    } else if (step === "phone") {
      if (val.length < 7) {
        triggerError("INVALID PHONE. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setPhone(val);
      setInputValue("");
      setStep("event");
      addLine("> AVAILABLE EVENTS:", "dim");
      EVENTS.forEach(ev => addLine(`  [${ev.id}] ${ev.name} (Max: ${ev.limit})`, "cyan"));
      setTimeout(() => startAutoType("> SELECT_EVENT_ID:", "green"), 300);
    } else if (step === "event") {
      const ev = EVENTS.find(e => e.id === val);
      if (!ev) {
        triggerError("INVALID EVENT ID. TRY AGAIN.");
        return;
      }
      addLine(`> ${ev.name}`, "green");
      setSelectedEvent(ev);
      setInputValue("");
      if (ev.limit > 1) {
        setStep("team_name");
        setTimeout(() => startAutoType("> ENTER TEAM_NAME:", "green"), 300);
      } else {
        setStep("password");
        setTimeout(() => startAutoType("> ENTER ENCRYPTION_KEY (Password):", "green"), 300);
      }
    } else if (step === "team_name") {
      if (val.length < 2 || val.length > 50) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setTeamName(val);
      setInputValue("");
      setStep("team_leader_uid");
      setTimeout(() => startAutoType("> ENTER LEADER_UID:", "green"), 300);
    } else if (step === "team_leader_uid") {
      if (val.length < 2) {
        triggerError("INVALID UID. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setLeaderUid(val);
      setInputValue("");
      setStep("add_team_members_option");
      setTimeout(() => startAutoType(`> ADD TEAM MEMBERS? (yes/no):`, "green"), 300);
    } else if (step === "add_team_members_option") {
      const normalizedVal = val.toLowerCase().trim();
      if (normalizedVal === "yes" || normalizedVal === "y") {
        addLine("> TEAM MEMBERS MODE ENABLED.", "green");
        setInputValue("");
        setCurrentMemberData({ uid: "", name: "", email: "", phone: "" });
        setMemberFieldStep("uid");
        setStep("team_uid");
        setTimeout(() => startAutoType(`> ADD TEAM MEMBER (1/${(selectedEvent?.limit || 1) - 1}):`, "green"), 300);
        setTimeout(() => startAutoType(`> ENTER MEMBER_UID:`, "green"), 600);
      } else if (normalizedVal === "no" || normalizedVal === "n" || normalizedVal === "skip") {
        addLine("> SKIPPED TEAM MEMBERS.", "green");
        setInputValue("");
        setStep("team_review");
        setTimeout(() => startAutoType("> REVIEW TEAM DETAILS BELOW. TYPE 'CONFIRM' TO PROCEED:", "green"), 300);
      } else {
        triggerError("INVALID RESPONSE. TYPE 'YES' OR 'NO'.");
      }
    } else if (step === "team_uid") {
      if (val.length < 2) {
        triggerError("INVALID UID. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setCurrentMemberData(prev => ({ ...prev, uid: val }));
      setInputValue("");
      setMemberFieldStep("name");
      setStep("team_member_name");
      setTimeout(() => startAutoType("> ENTER MEMBER_NAME:", "green"), 300);
    } else if (step === "team_member_name") {
      if (val.length < 2 || val.length > 50) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setCurrentMemberData(prev => ({ ...prev, name: val }));
      setInputValue("");
      setMemberFieldStep("email");
      setStep("team_member_email");
      setTimeout(() => startAutoType("> ENTER MEMBER_EMAIL:", "green"), 300);
    } else if (step === "team_member_email") {
      if (!validateEmail(val)) {
        triggerError("INVALID EMAIL. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      setCurrentMemberData(prev => ({ ...prev, email: val }));
      setInputValue("");
      setMemberFieldStep("phone");
      setStep("team_member_phone");
      setTimeout(() => startAutoType("> ENTER MEMBER_PHONE:", "green"), 300);
    } else if (step === "team_member_phone") {
      if (val.length < 7) {
        triggerError("INVALID PHONE. TRY AGAIN.");
        return;
      }
      addLine(`> ${val}`, "green");
      const completedMember: TeamMember = { ...currentMemberData, phone: val };
      setTeamMembers(prev => [...prev, completedMember]);
      setInputValue("");

      // Check if we need more members
      if (teamMembers.length + 1 < (selectedEvent?.limit || 1) - 1) {
        setCurrentMemberData({ uid: "", name: "", email: "", phone: "" });
        setMemberFieldStep("uid");
        setStep("team_uid");
        setTimeout(() => startAutoType(`> ADD TEAM MEMBER (${teamMembers.length + 2}/${(selectedEvent?.limit || 1) - 1}):`, "green"), 300);
        setTimeout(() => startAutoType("> ENTER MEMBER_UID:", "green"), 600);
      } else {
        addLine("> TEAM MEMBERS COMPLETE.", "cyan");
        setStep("team_review");
        setTimeout(() => startAutoType("> REVIEW TEAM DETAILS BELOW. TYPE 'MODIFY' TO CHANGE OR 'CONFIRM' TO PROCEED:", "green"), 600);
      }
    } else if (step === "team_review") {
      const normalizedVal = val.toLowerCase();
      if (normalizedVal === "confirm") {
        addLine("> TEAM CONFIRMED.", "green");
        setInputValue("");
        setStep("password");
        setTimeout(() => startAutoType("> ENTER ENCRYPTION_KEY (Password):", "green"), 300);
      } else if (normalizedVal === "modify") {
        addLine("> OPENING MODIFICATION MODE...", "dim");
        setInputValue("");
        // For now, redirect to password. In a real app, you'd reopen editing.
        setStep("password");
        setTimeout(() => startAutoType("> ENTER ENCRYPTION_KEY (Password):", "green"), 1000);
      } else {
        triggerError("INVALID COMMAND. TYPE 'CONFIRM' OR 'MODIFY'.");
      }
    } else if (step === "password") {
      if (val.length < 4) {
        triggerError("OVERRIDE FAILED. TRY AGAIN.");
        return;
      }
      const masked = val.replace(/./g, "💀");
      addLine(`> ${masked}`, "green");
      setInputValue("");
      setStep("submitting");

      addLine("> ENCRYPTING PAYLOAD...", "dim");
      setTimeout(() => {
        addLine("> TRANSMITTING TO MAINFRAME...", "dim");
        setTimeout(() => {
          addLine("> VERIFYING CREDENTIALS...", "dim");
          setTimeout(() => {
            // Success!
            setStep("success");
            addLine("> ACCESS GRANTED. WELCOME TO NEXUS.", "cyan");
            addLine(`> NODE "${name}" REGISTERED SUCCESSFULLY.`, "cyan");
            if (email) {
              addLine(`> EMAIL: ${email}`, "dim");
            }
            if (phone) {
              addLine(`> PHONE: ${phone}`, "dim");
            }
            if (selectedEvent) {
              addLine(`> EVENT: ${selectedEvent.name.toUpperCase()}`, "dim");
            }
            if (teamName) {
              addLine(`> TEAM_NAME: ${teamName.toUpperCase()}`, "dim");
              addLine(`> LEADER_UID: ${leaderUid.toUpperCase()}`, "dim");
            }
            if (teamMembers.length > 0) {
              addLine(`> TEAM_MEMBERS: ${teamMembers.map(m => m.name).join(", ").toUpperCase()}`, "dim");
            } else if (teamName) {
              addLine(`> TEAM_MEMBERS: NONE (SOLO_MODE)`, "dim");
            }

            // Store registration data
            const registrationData = {
              userName: name,
              userEmail: email,
              userPhone: phone,
              selectedEvent: selectedEvent,
              teamName: teamName,
              leaderUid: leaderUid,
              teamMembers: teamMembers,
              registeredAt: new Date().toISOString()
            };
            localStorage.setItem("nexusRegistration", JSON.stringify(registrationData));

            // Show success toast
            const memberCount = teamMembers.length;
            toast({
              title: "Team Registered Successfully",
              description: `Team "${teamName}" (Leader: ${leaderUid}) registered with ${memberCount} member${memberCount !== 1 ? 's' : ''}.`,
              variant: "default",
            });

            // Scroll to hero section after 3 seconds
            setTimeout(() => {
              onClose();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }, 3000);
          }, 800);
        }, 700);
      }, 600);
    }
  };

  const showInput = autoTypeDone && !currentAutoType && ["name", "email", "phone", "event", "team_name", "team_leader_uid", "add_team_members_option", "team_uid", "team_member_name", "team_member_email", "team_member_phone", "team_review", "password"].includes(step);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col bg-background"
        >
          {/* Scanlines */}
          <Scanlines />

          {/* Header bar */}
          <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] text-accent tracking-[0.3em]">
                NEXUS MAINFRAME v2.6.0
              </span>
            </div>
            <button
              onClick={onClose}
              className="font-mono text-xs text-muted-foreground hover:text-destructive transition-colors tracking-wider"
            >
              [ESC] ABORT
            </button>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="relative z-20 flex-1 overflow-y-auto px-4 sm:px-8 py-6 font-mono text-xs sm:text-sm"
          >
            <div className="max-w-2xl mx-auto space-y-1">
              {/* Rendered lines */}
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    line.color === "cyan"
                      ? "text-primary text-glow-cyan"
                      : line.color === "red"
                      ? "text-destructive"
                      : line.color === "dim"
                      ? "text-muted-foreground"
                      : "text-accent text-glow-green"
                  }
                >
                  {line.text}
                </motion.div>
              ))}

              {/* Team review display */}
              {step === "team_review" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 space-y-2 border-l-2 border-primary/30 pl-3"
                >
                  <div className="text-primary text-glow-cyan">// TEAM_DETAILS</div>
                  <div className="text-muted-foreground">TEAM_NAME: {teamName}</div>
                  <div className="text-muted-foreground">LEADER_UID: {leaderUid}</div>
                  {teamMembers.length > 0 ? (
                    <>
                      <div className="text-muted-foreground mt-2">MEMBERS: {teamMembers.length}</div>
                      {teamMembers.map((member, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="text-cyan-400 space-y-1"
                        >
                          <div>  [MEMBER_{idx + 1}]</div>
                          <div className="text-muted-foreground ml-4">UID: {member.uid}</div>
                          <div className="text-muted-foreground ml-4">NAME: {member.name}</div>
                          <div className="text-muted-foreground ml-4">EMAIL: {member.email}</div>
                          <div className="text-muted-foreground ml-4">PHONE: {member.phone}</div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <div className="text-muted-foreground">MEMBERS: NONE (SOLO_MODE)</div>
                  )}
                </motion.div>
              )}

              {/* Currently auto-typing line */}
              {currentAutoType && (
                <TypingLine
                  text={currentAutoType.text}
                  color={currentAutoType.color}
                  active
                  onDone={handleAutoTypeDone}
                />
              )}

              {/* Input line */}
              {showInput && (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={shakeInput ? { x: [-8, 8, -6, 6, -3, 3, 0], opacity: 1 } : { opacity: 1 }}
                  transition={shakeInput ? { duration: 0.4 } : { duration: 0.2 }}
                  className="flex items-center gap-2 mt-2"
                >
                  <span className="text-accent text-glow-green">$</span>
                  <input
                    ref={inputRef}
                    type={step === "password" ? "password" : "text"}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-none outline-none text-accent font-mono text-xs sm:text-sm caret-accent placeholder:text-muted-foreground/40"
                    placeholder={
                      step === "name"
                        ? "type_your_name"
                        : step === "email"
                        ? "your@email.com"
                        : step === "phone"
                        ? "+XX XXXXX-XXXXX"
                        : step === "event"
                        ? "enter_id"
                        : step === "team_name"
                        ? "team_name"
                        : step === "team_leader_uid"
                        ? "NEX-XXX"
                        : step === "add_team_members_option"
                        ? "yes or no"
                        : step === "team_uid"
                        ? "NEX-XXX"
                        : step === "team_member_name"
                        ? "member_name"
                        : step === "team_member_email"
                        ? "member@email.com"
                        : step === "team_member_phone"
                        ? "+XX XXXXX-XXXXX"
                        : step === "team_review"
                        ? "confirm or modify"
                        : "••••••••"
                    }
                    style={
                      step === "password"
                        ? ({ WebkitTextSecurity: "disc" } as React.CSSProperties)
                        : undefined
                    }
                  />
                  <span className="text-accent animate-typing-cursor">▌</span>
                </motion.form>
              )}

              {/* Success close prompt */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6"
                >
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 300);
                    }}
                    className="font-mono text-xs text-accent text-glow-green hover:text-accent transition-colors tracking-wider border border-accent/40 px-4 py-2 rounded hover:bg-accent/10"
                  >
                    {">"} SUBMIT & SAVE
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="relative z-20 px-4 py-2 border-t border-border flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground/50">
              SECURE CHANNEL • AES-256 ENCRYPTED
            </span>
            <span className="font-mono text-[9px] text-accent/40">
              {step === "success" ? "● CONNECTED" : "○ PENDING"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;
