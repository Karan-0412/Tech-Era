import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "1", name: "Karan Kumar", role: "Lead Developer" }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMember: TeamMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      role: newRole || "Member",
    };
    setMembers([...members, newMember]);
    setNewName("");
    setNewRole("");
    setIsAdding(false);
  };

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
          YOUR <span className="text-primary text-glow-cyan">NODES</span>
        </h2>
      </motion.div>

      <div className="grid gap-4">
        <AnimatePresence mode="popover">
          {members.map((member) => (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass rounded-xl p-4 flex items-center justify-between border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-mono text-primary border border-primary/30">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-foreground">{member.name}</h3>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">{member.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                className="text-muted-foreground hover:text-destructive transition-colors text-xs font-mono"
              >
                [REMOVE]
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {!isAdding ? (
          <motion.button
            layout
            onClick={() => setIsAdding(true)}
            className="glass rounded-xl p-4 border border-dashed border-primary/30 text-primary/60 hover:text-primary hover:border-primary/50 transition-all flex items-center justify-center gap-2 font-mono text-xs"
          >
            <span>+</span> ADD TEAM MEMBER
          </motion.button>
        ) : (
          <motion.form
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={addMember}
            className="glass rounded-xl p-6 border border-primary/40 space-y-4"
          >
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-widest block mb-1">DESIGNATION</label>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
                className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] text-muted-foreground tracking-widest block mb-1">ROLE</label>
              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Developer"
                className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2 rounded font-mono text-[10px] tracking-widest transition-all"
              >
                CONFIRM
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-border rounded font-mono text-[10px] text-muted-foreground hover:text-foreground transition-all"
              >
                CANCEL
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
