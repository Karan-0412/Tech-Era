import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  uid: string;
  name: string;
  email: string;
  phone: string;
}

interface RegistrationData {
  userName: string;
  userEmail: string;
  userPhone: string;
  selectedEvent: { id: string; name: string; limit: number } | null;
  teamName: string;
  teamMembers: TeamMember[];
  registeredAt: string;
}

const TeamSection = () => {
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);

  useEffect(() => {
    // Load registration data from localStorage
    const stored = localStorage.getItem("nexusRegistration");
    if (stored) {
      try {
        setRegistrationData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse registration data", e);
      }
    }
  }, []);

  if (!registrationData || !registrationData.teamMembers || registrationData.teamMembers.length === 0) {
    return (
      <section id="team" className="py-24 px-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-mono text-xs text-primary tracking-[0.4em] mb-3">
            // NO_TEAM_DATA
          </p>
          <p className="font-mono text-sm text-muted-foreground">
            Initialize connection to register your team
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="team" className="py-24 px-6 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <p className="font-mono text-xs text-primary tracking-[0.4em] mb-3">
          // TEAM_ROSTER
        </p>
        <h2 className="font-mono text-3xl font-bold text-foreground">
          <span className="text-primary text-glow-cyan">{registrationData.teamName}</span>
        </h2>
        <p className="font-mono text-xs text-muted-foreground mt-2">
          {registrationData.selectedEvent?.name || "No Event"}
        </p>
      </motion.div>

      <div className="grid gap-4">
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-xl p-5 border border-accent/20 hover:border-accent/40 transition-colors bg-accent/5"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center font-mono text-accent border border-accent/30">
                {registrationData.userName.charAt(0)}
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-foreground">{registrationData.userName}</h3>
                <p className="font-mono text-[10px] text-accent/70 tracking-widest">COORDINATOR</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-accent/10">
              <div>
                <p className="font-mono text-[8px] text-muted-foreground tracking-tighter uppercase">Email</p>
                <p className="font-mono text-[10px] text-foreground truncate">{registrationData.userEmail}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] text-muted-foreground tracking-tighter uppercase">Phone</p>
                <p className="font-mono text-[10px] text-foreground">{registrationData.userPhone}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center py-4">
          <p className="font-mono text-[10px] text-muted-foreground/60">// TEAM MEMBERS</p>
        </div>

        <AnimatePresence mode="popover">
          {registrationData.teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-mono text-primary border border-primary/30">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-foreground">{member.name}</h3>
                    <p className="font-mono text-[10px] text-primary/70 tracking-widest">{member.uid}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-primary/10">
                  <div>
                    <p className="font-mono text-[8px] text-muted-foreground tracking-tighter uppercase">Email</p>
                    <p className="font-mono text-[10px] text-foreground truncate">{member.email}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] text-muted-foreground tracking-tighter uppercase">Phone</p>
                    <p className="font-mono text-[10px] text-foreground">{member.phone}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TeamSection;
