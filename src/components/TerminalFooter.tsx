import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { EVENTS, type Event } from "@/lib/events";

const TerminalFooter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [selectedEvent, setSelectedEvent] = useState<Event>(EVENTS[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let i = 0;
    const textToType = `> LOADING PROTOCOL: ${selectedEvent.name.toUpperCase()}\n\n${selectedEvent.description}\n\n[EVENT_STATUS]: ACTIVE\n[CAPACITY]: MAX_${selectedEvent.limit}_NODES`;
    setDisplayedText("");
    setIsTyping(true);
    
    const interval = setInterval(() => {
      setDisplayedText(textToType.slice(0, i + 1));
      i++;
      if (i >= textToType.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);
    
    return () => clearInterval(interval);
  }, [selectedEvent]);

  return (
    <footer className="py-24 px-6" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ type: "spring", stiffness: 80 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <p className="font-mono text-xs text-primary tracking-[0.4em] mb-2 uppercase">
              // EVENT_DIRECTORY
            </p>
            <h2 className="font-mono text-2xl font-bold text-foreground">
              MISSION <span className="text-primary text-glow-cyan">PROTOCOLS</span>
            </h2>
          </div>

          {/* Event Selector Dropdown */}
          <div className="relative w-full sm:w-64">
            <select
              value={selectedEvent.id}
              onChange={(e) => {
                const ev = EVENTS.find((ev) => ev.id === e.target.value);
                if (ev) setSelectedEvent(ev);
              }}
              className="w-full bg-card/50 border border-primary/30 rounded-lg px-4 py-2.5 font-mono text-sm text-foreground appearance-none focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer hover:border-primary/50"
            >
              {EVENTS.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-void">
                  {ev.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden border border-primary/20 bg-black/40 shadow-2xl backdrop-blur-sm">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-primary/10 bg-primary/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            </div>
            <span className="ml-3 font-mono text-[10px] text-muted-foreground tracking-[0.2em] uppercase">
              protocol_viewer.exe — {selectedEvent.id}
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-8 font-mono min-h-[220px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-primary/90 text-sm sm:text-lg leading-relaxed whitespace-pre-wrap"
              >
                {displayedText}
                {isTyping && <span className="inline-block w-2 h-4 bg-primary ml-1 animate-typing-cursor" />}
              </motion.div>
            </AnimatePresence>
            
            {/* Background grid/scanline for terminal feel */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                 style={{ backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          </div>
        </div>

        {/* Footer info/links */}
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col items-center gap-6">
          <div className="flex gap-8">
            {["TWITTER", "DISCORD", "GITHUB"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors tracking-[0.3em] font-medium"
              >
                {link}
              </a>
            ))}
          </div>
          <p className="font-mono text-[10px] text-muted-foreground/40 tracking-widest uppercase text-center">
            © TECH ERA 3.0 • POWERED BY APEX TECHNO WARRIORS • SYSTEM_STABLE
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default TerminalFooter;
