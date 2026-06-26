import React, { useState, useEffect } from "react";
import { Sparkles, Check, AlertTriangle, Cpu, Calendar, Shield } from "lucide-react";
import { stackArsenal } from "../../utils/srsTemplates";
import * as api from "../../utils/api";

export const StackSelection = ({ answers, stack, onConfirmStack, projectId }) => {
  const [selected, setSelected] = useState({ ...stack });
  const [warnings, setWarnings] = useState([]);
  const [complexity, setComplexity] = useState({ level: "Medium", barWidth: "50%", color: "text-aurora", weeks: "6-8 weeks" });
  
  const [recommendedStack, setRecommendedStack] = useState({
    frontend: "Next.js",
    backend: "Node.js (Express)",
    database: "PostgreSQL",
    hosting: "Vercel",
    auth: "Supabase Auth"
  });
  const [sdlc, setSdlc] = useState("Agile Scrum");
  const [rationale, setRationale] = useState("AI recommended a modern stack tailored to your launch variables. Confirm or override individual elements below.");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [arsenal, setArsenal] = useState(stackArsenal);

  const [backendComplexity, setBackendComplexity] = useState(null);
  const [backendWarnings, setBackendWarnings] = useState(null);

  const loadingMessages = [
    "Analyzing stack selection parameters...",
    "Compiling functional requirement models...",
    "Structuring database transaction schemas...",
    "Validating authentication & security boundaries...",
    "Mapping DFD context coordinates...",
    "Compiling final IEEE-830 SRS blueprint..."
  ];

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (!isSubmitting) {
      setProgress(10);
      return;
    }
    const interval = setInterval(() => {
      setProgress(p => Math.min(95, p + Math.floor(Math.random() * 15) + 5));
    }, 450);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  useEffect(() => {
    if (!isSubmitting) return;

    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[idx]);
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSelect = (category, value) => {
    setSelected((prev) => ({ ...prev, [category]: value }));
  };

  const applyRecommendation = () => {
    setSelected(recommendedStack);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirmStack(selected);
    } catch (err) {
      console.warn("Could not confirm stack", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load preset recommendation based on answers from backend
  useEffect(() => {
    const isMvp = answers.projectType === "Startup MVP" || answers.timeline === "1–3 months";
    const localRecommend = {
      frontend: isMvp ? "Next.js" : "React",
      backend: isMvp ? "Node.js (Express)" : "Django (Python)",
      database: isMvp ? "Supabase DB" : "PostgreSQL",
      hosting: isMvp ? "Vercel" : "AWS EC2/ECS",
      auth: isMvp ? "Supabase Auth" : "Auth0"
    };

    if (!projectId || projectId === "local-project") {
      setRecommendedStack(localRecommend);
      setSelected(localRecommend);
      
      // Prepend local presets to the top of category lists
      setArsenal(prev => {
        const updated = { ...prev };
        Object.keys(localRecommend).forEach(cat => {
          if (updated[cat]) {
            const existingIdx = updated[cat].findIndex(opt => opt.value === localRecommend[cat]);
            if (existingIdx !== -1) {
              const match = updated[cat][existingIdx];
              const remaining = updated[cat].filter((_, idx) => idx !== existingIdx);
              updated[cat] = [
                { ...match, sub: match.sub || "Recommended by AI" },
                ...remaining
              ];
            } else {
              updated[cat] = [
                { value: localRecommend[cat], sub: "Recommended by AI" },
                ...updated[cat]
              ];
            }
          }
        });
        return updated;
      });
      return;
    }

    const fetchStackRecommendation = async () => {
      setLoading(true);
      try {
        const res = await api.recommendStack(projectId, answers);
        const recStack = res.recommendedStack || res.stack;
        if (res.success && recStack) {
          setRecommendedStack(recStack);
          setSelected(recStack);
          
          if (res.sdlcRecommendation) {
            setSdlc(res.sdlcRecommendation);
          } else if (res.compatibilityCheck && res.compatibilityCheck.status) {
            setSdlc(res.compatibilityCheck.status.toUpperCase());
          }
          
          if (res.rationale) {
            setRationale(res.rationale);
          } else if (res.compatibilityCheck && res.compatibilityCheck.warnings) {
            setRationale("AI tech advice generated from project constraints. Select or customize your stack elements below.");
          }

          if (res.complexityIndex) {
            let barWidth = "50%";
            let color = "text-aurora";
            let weeks = "6-8 weeks";
            const level = res.complexityIndex;
            if (level === "Low") {
              barWidth = "25%";
              color = "text-pulse";
              weeks = "3-5 weeks";
            } else if (level === "Moderate" || level === "Medium") {
              barWidth = "50%";
              color = "text-aurora";
              weeks = "6-8 weeks";
            } else if (level === "High") {
              barWidth = "85%";
              color = "text-red-400";
              weeks = "10-14 weeks";
            }
            setBackendComplexity({ level, barWidth, color, weeks });
          }

          if (res.compatibilityCheck && res.compatibilityCheck.warnings) {
            setBackendWarnings(res.compatibilityCheck.warnings);
          }

          // Dynamically position recommended values at the top of stack categories
          setArsenal(prev => {
            const updated = { ...prev };
            Object.keys(recStack).forEach(cat => {
              if (updated[cat]) {
                const existingIdx = updated[cat].findIndex(opt => opt.value === recStack[cat]);
                if (existingIdx !== -1) {
                  const match = updated[cat][existingIdx];
                  const remaining = updated[cat].filter((_, idx) => idx !== existingIdx);
                  updated[cat] = [
                    { ...match, sub: match.sub || "Recommended by AI" },
                    ...remaining
                  ];
                } else {
                  updated[cat] = [
                    { value: recStack[cat], sub: "Recommended by AI" },
                    ...updated[cat]
                  ];
                }
              }
            });
            return updated;
          });
        } else {
          setRecommendedStack(localRecommend);
          setSelected(localRecommend);
        }
      } catch (err) {
        console.warn("API recommendStack offline, using local simulation presets", err);
        setRecommendedStack(localRecommend);
        setSelected(localRecommend);
      } finally {
        setLoading(false);
      }
    };

    fetchStackRecommendation();
  }, [projectId, answers]);

  // Recalculate complexity and check compatibility warnings
  useEffect(() => {
    const isMatchingRecommended = recommendedStack &&
      selected.frontend === recommendedStack.frontend &&
      selected.backend === recommendedStack.backend &&
      selected.database === recommendedStack.database &&
      selected.hosting === recommendedStack.hosting &&
      selected.auth === recommendedStack.auth;

    if (isMatchingRecommended && backendComplexity && backendWarnings) {
      setComplexity(backendComplexity);
      setWarnings(backendWarnings);
      return;
    }

    const newWarnings = [];
    let complexityPoints = 0;

    // Evaluate Frontend
    if (selected.frontend === "Angular") complexityPoints += 3;
    else if (selected.frontend === "Next.js" || selected.frontend === "React") complexityPoints += 1.5;
    else complexityPoints += 1; // Svelte/Vue/React Native, etc.

    // Evaluate Backend
    if (selected.backend === "Spring Boot (Java)") complexityPoints += 4;
    else if (selected.backend === "Django (Python)" || selected.backend === "Laravel (PHP)") complexityPoints += 2.5;
    else complexityPoints += 1.5; // Node/Rails/NestJS

    // Evaluate Database
    if (selected.database === "MongoDB" || selected.database === "PostgreSQL") complexityPoints += 2;
    else complexityPoints += 1; // Supabase DB / Postgres (Supabase)

    // Evaluate Hosting
    if (selected.hosting === "AWS EC2/ECS") complexityPoints += 4;
    else if (selected.hosting === "Google Cloud") complexityPoints += 3;
    else complexityPoints += 1; // Vercel/Railway/Render

    // Evaluate Auth
    if (selected.auth === "Auth0" || selected.auth === "Custom Auth (JWT)") complexityPoints += 3;
    else complexityPoints += 1; // Supabase/Firebase

    // Calculate level
    let level = "Medium";
    let barWidth = "50%";
    let color = "text-aurora";
    let weeks = "6-8 weeks";

    if (complexityPoints <= 7) {
      level = "Low (Serverless)";
      barWidth = "25%";
      color = "text-pulse";
      weeks = "3-5 weeks";
    } else if (complexityPoints > 12) {
      level = "High (Enterprise)";
      barWidth = "85%";
      color = "text-red-400";
      weeks = "10-14 weeks";
    }

    setComplexity({ level, barWidth, color, weeks });

    // Warnings System
    const userTimeline = answers.timeline || "3–6 months";
    const userType = answers.projectType || "Startup MVP";

    if (userTimeline === "1–3 months" && complexityPoints > 11) {
      newWarnings.push(
        `This stack (${selected.frontend} + ${selected.backend} + AWS) is highly complex for your short timeline (${userTimeline}). Consider Next.js + Vercel to ship faster.`
      );
    }

    if (userType === "Startup MVP" && (selected.hosting === "AWS EC2/ECS" || selected.hosting === "Google Cloud") && selected.backend === "Spring Boot (Java)") {
      newWarnings.push(
        "Spring Boot and enterprise cloud hosts may exceed your MVP resource limits. Node.js + Railway or Vercel provides a leaner setup."
      );
    }

    if (selected.frontend === "Angular" && selected.backend === "Ruby on Rails") {
      newWarnings.push(
        "Angular combined with Ruby on Rails has low community support. React or Next.js aligns better with Rails API modes."
      );
    }

    setWarnings(newWarnings);
  }, [selected, answers, recommendedStack, backendComplexity, backendWarnings]);

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in space-y-6">
      {/* Banner Title */}
      <div className="text-center">
        <h1 className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-paper to-aurora tracking-tight mb-2">
          Equip Your Tech Arsenal
        </h1>
        <p className="text-muted text-sm max-w-lg mx-auto">
          {rationale}
        </p>
      </div>

      {/* AI Recommendation Banner */}
      <div className="glass-panel border-2 border-aurora/40 rounded-2xl p-5 shadow-[0_0_20px_rgba(108,99,255,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-aurora/10 rounded-full blur-xl" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
             <div className="w-10 h-10 rounded-lg bg-aurora/15 border border-aurora flex items-center justify-center shrink-0">
               <Cpu className="w-5 h-5 text-aurora" />
             </div>
            <div>
              <h3 className="font-display font-bold text-base text-paper flex items-center gap-1.5">
                AI Tech Advice 
                {loading ? (
                  <span className="w-2.5 h-2.5 rounded-full border border-aurora border-t-transparent animate-spin inline-block" />
                ) : (
                  <span className="text-[10px] bg-aurora/20 text-aurora px-1.5 py-0.5 rounded font-mono font-normal">{sdlc} Recommended</span>
                )}
              </h3>
              <p className="text-muted text-xs mt-0.5">
                Based on: <strong>{answers.projectType || "Startup"}</strong>, <strong>{answers.timeline || "3-6m"}</strong>, and <strong>{answers.teamCapacity || "Small Team"}</strong>.
              </p>
              <span className="text-xs text-pulse font-medium block mt-1">
                Recommend: {recommendedStack.frontend} + {recommendedStack.backend} + {recommendedStack.database} + {recommendedStack.hosting} + {recommendedStack.auth}
              </span>
            </div>
          </div>
          
          <button
            onClick={applyRecommendation}
            className="px-4 py-2 bg-aurora hover:bg-aurora/90 text-midnight font-display font-bold text-xs rounded-xl transition-all shadow-[0_0_12px_rgba(108,99,255,0.3)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Accept Recommendations
          </button>
        </div>
      </div>

      {/* Main Grid Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Loop Categories */}
        {Object.keys(arsenal).map((category) => (
          <div key={category} className="glass-panel border border-edge rounded-2xl p-4 flex flex-col space-y-3.5">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-aurora border-b border-edge/60 pb-2">
              {category}
            </h4>
            <div className="flex-grow flex flex-col space-y-2 overflow-y-auto max-h-[220px] pr-1">
              {arsenal[category].map((opt) => {
                const isSelected = selected[category] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(category, opt.value)}
                    title={opt.sub}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs transition-all relative flex flex-col items-start gap-0.5 cursor-pointer ${
                      isSelected
                        ? "bg-aurora/10 border-aurora text-paper font-semibold shadow-[0_0_10px_rgba(108,99,255,0.15)]"
                        : "bg-midnight/40 border-edge/70 text-muted hover:border-edge hover:bg-surface/60 hover:text-paper"
                    }`}
                  >
                    <span className="truncate w-full">{opt.value}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-pulse absolute top-2 right-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Stack Profile & warnings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Live Preview Summary */}
        <div className="md:col-span-2 glass-panel border border-edge rounded-2xl p-5 space-y-4">
          <h4 className="font-display font-bold text-sm text-paper flex items-center gap-2">
            <Cpu className="w-4 h-4 text-aurora" /> Live Architecture Blueprint
          </h4>
          
          <div className="bg-midnight/80 border border-edge/60 rounded-xl p-3.5 flex flex-wrap gap-2 text-xs font-mono text-paper">
            <span>[</span>
            <span className="text-aurora">{selected.frontend}</span>
            <span>+</span>
            <span className="text-pulse">{selected.backend}</span>
            <span>+</span>
            <span className="text-blue-400">{selected.database}</span>
            <span>+</span>
            <span className="text-amber-400">{selected.hosting}</span>
            <span>+</span>
            <span className="text-red-400">{selected.auth}</span>
            <span>]</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Complexity Indicator */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-muted uppercase">Architecture Complexity</span>
              <div className="flex items-center space-x-2.5">
                <span className={`text-xs font-mono font-bold ${complexity.color}`}>{complexity.level}</span>
              </div>
              <div className="w-full bg-edge/50 h-2 rounded-full overflow-hidden border border-edge/30">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    complexity.level.includes("Low") ? "bg-pulse" : complexity.level.includes("High") ? "bg-red-500" : "bg-aurora"
                  }`} 
                  style={{ width: complexity.barWidth }} 
                />
              </div>
            </div>

            {/* Development Time Estimate */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-muted uppercase block">Estimated Dev Duration</span>
              <div className="flex items-center space-x-2 text-paper">
                <Calendar className="w-4 h-4 text-pulse" />
                <span className="text-sm font-display font-bold">{complexity.weeks}</span>
              </div>
              <span className="text-[10px] text-muted block">Estimated for: {answers.teamCapacity || "Team"}</span>
            </div>
          </div>
        </div>

        {/* Compatibility Alert Sidebar */}
        <div className="glass-panel border border-edge rounded-2xl p-5 flex flex-col justify-center">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-muted mb-3.5">
            Compatibility Shield
          </h4>
          
          <div className="flex-grow space-y-3 overflow-y-auto max-h-[140px] pr-1">
            {warnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-3">
                 <Shield className="w-6 h-6 text-pulse mb-1" />
                <span className="text-xs text-pulse font-medium">Stack Validated</span>
                <span className="text-[10px] text-muted">No conflicting choices identified. Ready to proceed.</span>
              </div>
            ) : (
              warnings.map((warn, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-300 leading-snug flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-aurora to-pulse border border-aurora hover:brightness-110 active:scale-[0.99] text-midnight font-display font-black text-sm tracking-widest uppercase rounded-xl transition-all shadow-[0_0_25px_rgba(108,99,255,0.35)] cursor-pointer flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 rounded-full border-2 border-midnight border-t-transparent animate-spin inline-block" />
        ) : (
          <>
            <span>CONFIRM STACK & COMPILE GENETICS</span>
            <Sparkles className="w-4 h-4 fill-midnight" />
          </>
        )}
      </button>

      {/* Synthesis Scanning Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-midnight/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md glass-panel border border-aurora/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(108,99,255,0.15)] text-center space-y-6 animate-scale-in">
            <div className="flex justify-center">
              <div className="relative w-16 h-16 flex items-center justify-center bg-aurora/10 rounded-full border border-aurora/30">
                <Cpu className="w-8 h-8 text-aurora animate-spin" style={{ animationDuration: "4s" }} />
                <Sparkles className="w-5 h-5 text-pulse absolute top-1 right-1 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-bold text-sm text-paper uppercase tracking-wider">
                Synthesizing Architecture Genetics
              </h3>
              <p className="text-xs text-muted font-mono h-8 flex items-center justify-center">
                {loadingMessage}
              </p>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-edge/40 h-1.5 rounded-full overflow-hidden border border-edge/30">
              <div 
                className="bg-gradient-to-r from-aurora to-pulse h-full rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
