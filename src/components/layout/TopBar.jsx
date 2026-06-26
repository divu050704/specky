import React from "react";
import { Zap, RefreshCw, Award } from "lucide-react";

export const TopBar = ({ phase, xp, xpChanges, navigateToPhase, projectName, resetAll }) => {
  const steps = [
    { id: 1, name: "Launch Pad" },
    { id: 2, name: "Intel Gathering" },
    { id: 3, name: "Stack Selection" },
    { id: 4, name: "SRS Builder" },
    { id: 5, name: "Export Phase" }
  ];

  // Derive avatar initials
  const getInitials = () => {
    if (!projectName) return "PA";
    return projectName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-edge px-6 py-4 flex items-center justify-between text-paper">
      {/* Logo Area */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateToPhase(1)}>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-aurora to-pulse flex items-center justify-center font-display font-bold text-midnight text-xl shadow-[0_0_15px_rgba(108,99,255,0.4)]">
          ⬡
        </div>
        <span className="font-display font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-paper to-muted hover:from-aurora hover:to-pulse transition-all">
          SPECKY
        </span>
      </div>

      {/* Progress Timeline */}
      <nav className="hidden md:flex items-center space-x-2 text-sm font-display font-medium">
        {steps.map((step, idx) => {
          const isActive = phase === step.id;
          const isCompleted = phase > step.id;
          const isLocked = phase < step.id;

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <div className={`w-6 h-[1.5px] ${isCompleted ? "bg-pulse" : "bg-edge"}`} />
              )}
              <button
                disabled={isLocked}
                onClick={() => navigateToPhase(step.id)}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-2 relative ${
                  isActive
                    ? "bg-aurora text-midnight font-bold shadow-[0_0_12px_rgba(108,99,255,0.3)]"
                    : isCompleted
                    ? "text-pulse border border-pulse/20 hover:bg-pulse/5 cursor-pointer"
                    : "text-muted border border-transparent opacity-50 cursor-not-allowed"
                }`}
              >
                <span>{step.id}. {step.name}</span>
                {isCompleted && <span className="text-xs">✓</span>}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Stats Counter & User Profile */}
      <div className="flex items-center space-x-4">
        {/* XP Counter Box */}
        <div className="relative px-3.5 py-1.5 rounded-full bg-edge border border-edge/60 flex items-center space-x-2 font-mono text-pulse text-sm font-semibold select-none shadow-[inset_0_0_6px_rgba(0,229,160,0.1)]">
          <Zap className="w-4 h-4 fill-pulse text-pulse animate-pulse" />
          <span aria-live="polite">{xp} XP</span>

          {/* Floating XP Gain Animations */}
          {xpChanges.map((change) => (
            <div
              key={change.id}
              className="absolute -top-6 left-1/2 -translate-x-1/2 text-pulse font-mono font-bold text-base xp-float-anim pointer-events-none drop-shadow-[0_0_4px_rgba(0,229,160,0.6)]"
            >
              +{change.amount} XP
            </div>
          ))}
        </div>

        {/* Reset Trigger */}
        <button
          onClick={resetAll}
          title="Reset Scoping State"
          className="p-2 rounded-lg border border-edge bg-surface/30 hover:border-aurora hover:text-aurora transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Avatar Profile */}
        <div 
          className="w-9 h-9 rounded-full bg-edge border-2 border-aurora flex items-center justify-center font-display text-sm font-bold text-aurora shadow-[0_0_10px_rgba(108,99,255,0.2)] select-none hover:border-pulse hover:text-pulse transition-all"
          title={projectName ? `Scouting for: ${projectName}` : "Architect Profile"}
        >
          {getInitials()}
        </div>
      </div>
    </header>
  );
};
