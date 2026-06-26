import React, { useEffect, useState } from "react";
import { useAppState } from "./hooks/useAppState";
import { TopBar } from "./components/layout/TopBar";
import { DNARail } from "./components/layout/DNARail";
import { ToastSystem } from "./components/layout/ToastSystem";
import { LaunchPad } from "./components/phases/LaunchPad";
import { IntelGathering } from "./components/phases/IntelGathering";
import { StackSelection } from "./components/phases/StackSelection";
import { SRSBuilder } from "./components/phases/SRSBuilder";
import { ExportPhase } from "./components/phases/ExportPhase";
import { ShieldAlert, Play, Sparkles } from "lucide-react";
import { SpeckyDashboard } from "./components/dashboard/SpeckyDashboard";

function App() {
  const {
    phase,
    setPhase,
    xp,
    xpChanges,
    project,
    answers,
    stack,
    srs,
    badges,
    toasts,
    projectId,
    addToast,
    gainXp,
    hasSavedState,
    loadSavedState,
    clearSavedState,
    handleStartMission,
    handleAnswerQuestion,
    handleConfirmStack,
    triggerSRSGeneration,
    updateSectionContent,
    toggleSectionVisibility,
    reorderSection,
    navigateToPhase,
    resetAll,
    handleFastForwardQuestions,
    handleFastForwardSRS
  } = useAppState();

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [savedDetails, setSavedDetails] = useState(null);
  const [view, setView] = useState("wizard"); // "wizard" or "dashboard"

  // Detect and prompt resume if state exists
  useEffect(() => {
    if (hasSavedState) {
      try {
        const saved = localStorage.getItem("specky_project_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSavedDetails(parsed);
          setShowResumeModal(true);
        }
      } catch (e) {
        console.error("Failed to read save preview", e);
      }
    }
  }, [hasSavedState]);

  const handleAcceptResume = () => {
    loadSavedState();
    setShowResumeModal(false);
    const saved = localStorage.getItem("specky_project_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phase === 5) {
          setView("dashboard");
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeclineResume = () => {
    clearSavedState();
    setShowResumeModal(false);
    addToast("Started a new scoping mission.", "info");
  };

  if (view === "dashboard") {
    return (
      <SpeckyDashboard
        project={project}
        srs={srs}
        xp={xp}
        projectId={projectId}
        navigateToWizard={() => setView("wizard")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-midnight text-paper flex flex-col font-body relative overflow-x-hidden selection:bg-aurora/30 selection:text-paper">
      
      {/* Top Header Section */}
      <TopBar
        phase={phase}
        xp={xp}
        xpChanges={xpChanges}
        navigateToPhase={navigateToPhase}
        projectName={project.name}
        resetAll={resetAll}
      />

      {/* Main Scaffold (DNA sidebar + Phase viewport canvas) */}
      <div className="flex flex-grow overflow-hidden">
        <DNARail phase={phase} navigateToPhase={navigateToPhase} />
        
        <main className="flex-grow overflow-y-auto particle-grid px-4 py-2 relative">
          
          {/* Phase Router */}
          {phase === 1 && (
            <LaunchPad onStartMission={handleStartMission} />
          )}
          
          {phase === 2 && (
            <IntelGathering
              answers={answers}
              onAnswerQuestion={handleAnswerQuestion}
              navigateToPhase={navigateToPhase}
              badges={badges}
              onFastForward={handleFastForwardQuestions}
            />
          )}
          
          {phase === 3 && (
            <StackSelection
              answers={answers}
              stack={stack}
              onConfirmStack={handleConfirmStack}
            />
          )}
          
          {phase === 4 && (
            <SRSBuilder
              project={project}
              srs={srs}
              xp={xp}
              projectId={projectId}
              updateSectionContent={updateSectionContent}
              toggleSectionVisibility={toggleSectionVisibility}
              reorderSection={reorderSection}
              triggerSRSGeneration={triggerSRSGeneration}
              gainXp={gainXp}
              addToast={addToast}
              setPhase={setPhase}
              onFastForward={handleFastForwardSRS}
            />
          )}
          
          {phase === 5 && (
            <ExportPhase
              project={project}
              srs={srs}
              xp={xp}
              badges={badges}
              addToast={addToast}
              gainXp={gainXp}
              onEnterDashboard={() => setView("dashboard")}
            />
          )}
        </main>
      </div>

      {/* Global Toast Alerts Drawer */}
      <ToastSystem toasts={toasts} />

      {/* Resume Scoping Voyage Dialogue Popup Modal */}
      {showResumeModal && savedDetails && (
        <div className="fixed inset-0 bg-midnight/90 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel border-2 border-aurora/60 rounded-2xl p-6 shadow-[0_0_30px_rgba(108,99,255,0.25)] relative overflow-hidden animate-slide-up">
            <div className="absolute top-0 right-0 w-20 h-20 bg-aurora/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-3 mb-4">
              <ShieldAlert className="w-8 h-8 text-aurora animate-pulse" />
              <div>
                <h3 className="font-display font-black text-lg text-paper tracking-wide uppercase">
                  Scoping Signal Recovered
                </h3>
                <span className="text-[10px] font-mono text-muted uppercase">Backup Log Found</span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed mb-5">
              We recovered an active project configuration in local storage memory. You can resume your scoping journey or clear records to build a fresh blueprint:
            </p>

            {/* Save details info box */}
            <div className="bg-midnight/70 border border-edge rounded-xl p-3.5 space-y-2 mb-6">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Project Name:</span>
                <span className="font-display font-bold text-pulse">
                  {savedDetails.project?.name || "Unnamed"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Accumulated Score:</span>
                <span className="font-mono font-bold text-aurora">{savedDetails.xp} XP</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted">Phase Reached:</span>
                <span className="font-mono text-paper font-semibold">
                  Step {savedDetails.phase} of 5
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleAcceptResume}
                className="w-full py-3 bg-gradient-to-r from-aurora to-pulse text-midnight font-display font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(108,99,255,0.3)] hover:brightness-110 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-midnight" />
                <span>Resume Scoping Voyage</span>
              </button>
              
              <button
                onClick={handleDeclineResume}
                className="w-full py-3 border border-edge bg-surface/30 hover:border-red-500/50 hover:text-red-400 text-muted font-display font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
              >
                Decline & Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
