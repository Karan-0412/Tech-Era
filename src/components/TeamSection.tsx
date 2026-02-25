import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  uid: string;
  email: string;
  phone: string;
}

const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([
    { 
      id: "1", 
      name: "Karan Kumar", 
      uid: "NEX-001", 
      email: "karan@nexus.io", 
      phone: "+91 9876543210" 
    }
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    uid: "",
    email: "",
    phone: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const startEditing = (member: TeamMember) => {
    setFormData({
      name: member.name,
      uid: member.uid,
      email: member.email,
      phone: member.phone
    });
    setEditingId(member.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ name: "", uid: "", email: "", phone: "" });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      setMembers(members.map(m => m.id === editingId ? { ...m, ...formData } : m));
    } else {
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData
      };
      setMembers([...members, newMember]);
    }
    resetForm();
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
              className="glass rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-mono text-primary border border-primary/30">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-mono text-sm font-bold text-foreground">{member.name}</h3>
                      <p className="font-mono text-[10px] text-primary/70 tracking-widest">{member.uid}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditing(member)}
                      className="text-primary/60 hover:text-primary transition-colors text-[10px] font-mono border border-primary/20 px-2 py-1 rounded"
                    >
                      [REVERT/EDIT]
                    </button>
                    <button 
                      onClick={() => setMembers(members.filter(m => m.id !== member.id))}
                      className="text-destructive/60 hover:text-destructive transition-colors text-[10px] font-mono border border-destructive/20 px-2 py-1 rounded"
                    >
                      [REMOVE]
                    </button>
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
            onSubmit={handleSubmit}
            className="glass rounded-xl p-6 border border-primary/40 space-y-4"
          >
            <h3 className="font-mono text-xs font-bold text-primary mb-2">
              {editingId ? "// REVERT_MEMBER_DETAILS" : "// INITIALIZE_NEW_NODE"}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[9px] text-muted-foreground tracking-widest block mb-1">NAME</label>
                <input
                  name="name"
                  autoFocus
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-muted-foreground tracking-widest block mb-1">UID</label>
                <input
                  name="uid"
                  value={formData.uid}
                  onChange={handleInputChange}
                  placeholder="NEX-XXX"
                  className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-[9px] text-muted-foreground tracking-widest block mb-1">EMAIL</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@nexus.io"
                  className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="font-mono text-[9px] text-muted-foreground tracking-widest block mb-1">PHONE</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+XX XXXXX-XXXXX"
                  className="w-full bg-background/50 border border-primary/20 rounded px-3 py-2 font-mono text-xs text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 py-2 rounded font-mono text-[10px] tracking-widest transition-all"
              >
                {editingId ? "UPDATE_NODE" : "CONFIRM_INITIALIZATION"}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
