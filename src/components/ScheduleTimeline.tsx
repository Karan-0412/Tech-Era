import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { EVENTS } from "@/lib/events";

interface ScheduleItemType {
  time: string;
  title: string;
  desc: string;
  day: string;
}

const ScheduleItem = ({
  item,
  index,
  scheduleLength,
  previousItem
}: {
  item: ScheduleItemType;
  index: number;
  scheduleLength: number;
  previousItem?: ScheduleItemType;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
      className="flex gap-4 items-start"
    >
      {/* Timeline node */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <motion.div
          className="w-3 h-3 rounded-full border-2 border-primary bg-background"
          animate={isInView ? {
            boxShadow: [
              "0 0 0px hsl(183 100% 50% / 0)",
              "0 0 15px hsl(183 100% 50% / 0.6)",
              "0 0 5px hsl(183 100% 50% / 0.3)",
            ]
          } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {index < scheduleLength - 1 && (
          <motion.div
            className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ originY: 0 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="glass rounded-lg p-4 flex-1 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-primary">{item.time}</span>
          {item.day && (index === 0 || (previousItem && previousItem.day !== item.day)) ? (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {item.day}
            </span>
          ) : null}
        </div>
        <h3 className="font-mono text-sm font-bold text-foreground">{item.title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
      </div>
    </motion.div>
  );
};

const ScheduleTimeline = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const glowHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [selectedEventId, setSelectedEventId] = useState<string>(EVENTS[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedEvent = EVENTS.find(e => e.id === selectedEventId) || EVENTS[0];

  return (
    <section className="py-24 px-6" ref={containerRef}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-8"
      >
        <p className="font-mono text-xs text-accent tracking-[0.4em] mb-3">
          // CIRCUIT_BOARD
        </p>
        <h2 className="font-mono text-3xl sm:text-4xl font-bold text-foreground">
          EVENT <span className="text-accent text-glow-green">SCHEDULE</span>
        </h2>
      </motion.div>

      {/* Event Dropdown Menu */}
      <div className="max-w-md mx-auto mb-8 relative">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full glass rounded-lg px-4 py-3 border border-primary/30 hover:border-primary/50 transition-colors flex items-center justify-between font-mono text-sm text-foreground"
          >
            <span>{selectedEvent.name}</span>
            <motion.span
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-primary"
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 glass rounded-lg border border-primary/30 overflow-hidden z-50"
              >
                {EVENTS.map((event, idx) => (
                  <motion.button
                    key={event.id}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 font-mono text-sm text-left border-b border-primary/10 hover:bg-primary/10 transition-colors ${
                      selectedEventId === event.id ? "bg-primary/20 text-accent text-glow-cyan" : "text-foreground"
                    } ${idx === EVENTS.length - 1 ? "border-b-0" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{event.name}</span>
                      <span className="text-[11px] text-muted-foreground">Max: {event.limit}</span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Glowing line behind */}
        <div className="absolute left-[5px] top-0 bottom-0 w-px bg-muted">
          <motion.div
            className="w-full bg-primary"
            style={{ height: glowHeight, boxShadow: "0 0 8px hsl(183 100% 50% / 0.5)" }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEventId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
          >
            {selectedEvent.schedule.map((item, i) => (
              <ScheduleItem
                key={`${item.day}-${item.time}`}
                item={item}
                index={i}
                scheduleLength={selectedEvent.schedule.length}
                previousItem={i > 0 ? selectedEvent.schedule[i - 1] : undefined}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ScheduleTimeline;
