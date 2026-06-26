import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, ShieldCheck } from "lucide-react";

export const LaunchPad = ({ onStartMission }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isFiring, setIsFiring] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(name.trim().length > 2 && desc.trim().length > 10);
  }, [name, desc]);

  const inspirations = [
    {
      label: "E-commerce Hub",
      name: "ShopNext",
      desc: "A scalable, headless multi-vendor e-commerce platform with real-time analytics and dynamic stripe checkouts."
    },
    {
      label: "SaaS Workspace",
      name: "SyncFlow",
      desc: "An integrated project task manager and team chat canvas supporting Kanban boards and automated Slack syncs."
    },
    {
      label: "HealthTech Portal",
      name: "MedQuery",
      desc: "A patient scheduling assistant and secure telemedicine portal utilizing client-side encryption and medical records lookup."
    }
  ];

  const handleInspirationClick = (insp) => {
    setName(insp.name);
    setDesc(insp.desc);
    setIsFiring(true);
    setTimeout(() => {
      onStartMission(insp.name, insp.desc);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isReady || isFiring) return;

    setIsFiring(true);
    
    // Simulate rocket liftoff delay
    setTimeout(() => {
      onStartMission(name, desc);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center py-10 px-4 min-h-[80vh] animate-fade-in">
      {/* Dynamic Rocket Animation Overlay */}
      {isFiring && (
        <div className="fixed inset-0 z-50 bg-midnight/90 flex flex-col items-center justify-center pointer-events-none">
          <div className="relative animate-bounce duration-300">
            <Rocket className="w-20 h-20 text-pulse fill-pulse transform -rotate-45" />
            {/* Rocket flames */}
            <div className="absolute top-16 right-0 w-8 h-16 bg-gradient-to-t from-transparent via-aurora to-pulse rounded-full blur-sm opacity-80" />
            <div className="absolute top-16 right-4 w-6 h-12 bg-gradient-to-t from-transparent to-pulse rounded-full blur-md animate-pulse" />
          </div>
          <h2 className="mt-8 font-display text-2xl font-bold text-pulse tracking-widest animate-pulse uppercase">
            Initiating Scoping Mission...
          </h2>
          <span className="text-muted font-mono text-sm mt-2">Rocket propulsion firing</span>
        </div>
      )}

      {/* Hero Welcome */}
      <div className="text-center mb-8">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-paper via-aurora to-pulse tracking-tight mb-3">
          Launch Your Project Scope
        </h1>
        <p className="text-muted text-base max-w-md mx-auto">
          Begin a gamified scoping adventure. Translate raw requirements into standard SRS templates and developer sprint boards.
        </p>
      </div>

      {/* Form Container */}
      <div className="w-full glass-panel border border-edge rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-edge/90">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-aurora/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-pulse/10 rounded-full blur-2xl" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="flex items-center space-x-3 border-b border-edge pb-4 mb-4">
            <h2 className="font-display text-xl font-bold text-paper">What are you building?</h2>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-muted uppercase tracking-wider">
              Project Code Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., TaskFlow"
              className="w-full bg-midnight/80 border border-edge text-paper rounded-xl px-4 py-3 text-sm focus:border-aurora"
              maxLength={40}
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-muted uppercase tracking-wider">
              Describe it in one sentence
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g., A collaborative workflow tracking dashboard with kanban boards, Gantt scheduling, and database access logging."
              className="w-full bg-midnight/80 border border-edge text-paper rounded-xl px-4 py-3 text-sm focus:border-aurora min-h-[100px] resize-none overflow-y-auto"
              maxLength={200}
              required
            />
            <div className="flex justify-end text-[10px] font-mono text-muted">
              {desc.length}/200 chars (Min 10)
            </div>
          </div>

          {/* Scout Badge Preview */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-midnight/50 border border-edge/60">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 border ${
                isReady 
                  ? "bg-gradient-to-tr from-aurora/20 to-pulse/20 border-pulse text-pulse shadow-[0_0_12px_rgba(0,229,160,0.3)] animate-pulse" 
                  : "bg-surface border-edge text-muted opacity-40"
              }`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className={`text-xs font-mono font-bold block ${isReady ? "text-pulse" : "text-muted"}`}>
                  {isReady ? "READY FOR LIFT-OFF" : "LOCKED"}
                </span>
                <span className="text-xs text-muted">Project Architect — Level 1</span>
              </div>
            </div>
            {isReady && (
              <span className="text-xs font-mono text-pulse font-bold bg-pulse/10 border border-pulse/30 px-2 py-0.5 rounded">
                +50 XP Pending
              </span>
            )}
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={!isReady || isFiring}
            className={`w-full py-4 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 border cursor-pointer ${
              isReady
                ? "bg-gradient-to-r from-aurora to-[#5346ff] border-aurora text-midnight shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:brightness-110 active:scale-[0.98]"
                : "bg-edge/40 border-edge text-muted opacity-50 cursor-not-allowed"
            }`}
          >
            <span>START MISSION</span>
            <Rocket className="w-4 h-4 transform rotate-45" />
          </button>
        </form>
      </div>

      {/* Inspirations / Demo Fillers */}
      <div className="w-full mt-8">
        <h3 className="text-center text-xs font-mono text-muted uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-aurora" /> Need Inspiration? Select a Demo Preset
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {inspirations.map((insp, index) => (
            <button
              key={index}
              onClick={() => handleInspirationClick(insp)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-edge bg-surface/30 text-paper hover:border-aurora/50 hover:bg-surface/60 transition-all cursor-pointer flex items-center space-x-1"
            >
              <span>{insp.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
