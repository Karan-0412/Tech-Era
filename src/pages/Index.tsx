import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import BootSequence from "@/components/BootSequence";
import MeshBackground from "@/components/MeshBackground";
import HeroScreen from "@/components/HeroScreen";
import MissionBriefing from "@/components/MissionBriefing";
import AboutSection from "@/components/AboutSection";
import SpeakerCarousel from "@/components/SpeakerCarousel";
import TeamSection from "@/components/TeamSection";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import TerminalFooter from "@/components/TerminalFooter";

const Index = () => {
  const [booted, setBooted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleBootComplete = useCallback(() => setBooted(true), []);
  const handleUnlock = useCallback(() => setUnlocked(true), []);

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {!booted && <BootSequence onComplete={handleBootComplete} />}
      </AnimatePresence>

      {booted && (
        <>
          <MeshBackground />
          <main className="relative z-10">
            {!unlocked && <HeroScreen onUnlock={handleUnlock} />}
            {unlocked && (
              <>
                <MissionBriefing visible={unlocked} />
                <AboutSection />
                <div id="speakers">
                  <SpeakerCarousel />
                </div>
                <TeamSection />
                <div id="schedule">
                  <ScheduleTimeline />
                </div>
                <TerminalFooter />
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
