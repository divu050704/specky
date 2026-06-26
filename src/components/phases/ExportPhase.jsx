import React, { useState } from "react";
import { Download, Award, Kanban, LayoutGrid, CheckCircle, ExternalLink, ArrowLeftRight, ChevronLeft, ChevronRight, FileText, Link, FileDown, Copy } from "lucide-react";

export const ExportPhase = ({ project, srs, xp, badges, addToast, gainXp, onEnterDashboard }) => {
  // Mock Sprint Tasks based on functional requirements
  const initialTasks = [
    { id: "task-1", title: "Setup Database Schemas", desc: "Design postgres schemas and database models", hours: 12, prio: "High", col: "s1" },
    { id: "task-2", title: "Configure Auth Broker", desc: "Setup Supabase Auth JWT integration", hours: 8, prio: "High", col: "s1" },
    { id: "task-3", title: "Onboarding Intake Form", desc: "Implement LaunchPad frontend modules", hours: 16, prio: "Medium", col: "s2" },
    { id: "task-4", title: "Decision Q&A Cards", desc: "Build IntelGathering screen transitions", hours: 24, prio: "High", col: "s2" },
    { id: "task-5", title: "Arsenal Configurator", desc: "Setup tech stack selector interface", hours: 14, prio: "Low", col: "s3" },
    { id: "task-6", title: "Rich Document Preview", desc: "Design page layout for SRS output", hours: 20, prio: "Medium", col: "s3" },
    { id: "task-7", title: "Kanban Export Engine", desc: "Connect sprint generation to JSON output", hours: 12, prio: "Low", col: "s4" },
    { id: "task-8", title: "Unit & Integration Tests", desc: "Configure basis path testing sets", hours: 18, prio: "High", col: "s4" },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [activeBoardView, setActiveBoardView] = useState("kanban"); // "kanban" or "summary"

  const columns = [
    { id: "backlog", name: "Project Backlog" },
    { id: "s1", name: "Sprint 1 (Setup)" },
    { id: "s2", name: "Sprint 2 (Core)" },
    { id: "s3", name: "Sprint 3 (UI)" },
    { id: "s4", name: "Sprint 4 (Release)" },
  ];

  // Move task to next or previous column
  const moveTask = (taskId, direction) => {
    const colOrder = ["backlog", "s1", "s2", "s3", "s4"];
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const curIdx = colOrder.indexOf(task.col);
        let nextIdx = direction === "next" ? curIdx + 1 : curIdx - 1;
        if (nextIdx >= 0 && nextIdx < colOrder.length) {
          gainXp(15, "Task rescheduled");
          addToast(`Task moved to ${columns[nextIdx].name}`, "info");
          return { ...task, col: colOrder[nextIdx] };
        }
      }
      return task;
    }));
  };

  // Genuine Markdown Export Trigger
  const triggerMDExport = () => {
    try {
      let markdownText = `# SOFTWARE REQUIREMENTS SPECIFICATION\n\n`;
      markdownText += `**Project:** ${project.name || "Unnamed Scenario"}\n`;
      markdownText += `**Date:** ${new Date().toLocaleDateString()}\n`;
      markdownText += `**Accumulated XP:** ${xp} points\n`;
      markdownText += `=======================================================\n\n`;

      Object.keys(srs.sections).forEach((key) => {
        const sec = srs.sections[key];
        if (sec.visible) {
          // Convert basic HTML sections to standard Markdown format
          let blockContent = sec.content
            .replace(/<h3>(.*?)<\/h3>/g, "### $1\n")
            .replace(/<h4>(.*?)<\/h4>/g, "#### $1\n")
            .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
            .replace(/<ul>/g, "")
            .replace(/<\/ul>/g, "")
            .replace(/<li>(.*?)<\/li>/g, "- $1\n")
            .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
            .replace(/<em>(.*?)<\/em>/g, "*$1*")
            .replace(/<code>(.*?)<\/code>/g, "`$1`")
            .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```javascript\n$1\n```\n\n")
            // Strip any remaining html tags
            .replace(/<[^>]*>/g, "");

          markdownText += `## ${sec.title}\n\n${blockContent}\n\n`;
        }
      });

      const blob = new Blob([markdownText], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${project.name ? project.name.toLowerCase().replace(/\s+/g, "_") : "srs"}_spec.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      gainXp(100, "Markdown Document Exported");
      addToast("🎉 Markdown downloaded successfully!", "success");
    } catch (e) {
      console.error(e);
      addToast("Failed to compile Markdown document", "error");
    }
  };

  // Mock Export triggers with nice feedback
  const triggerMockExport = (format) => {
    addToast(`📥 Assembling documentation pages for ${format} export...`, "info");
    setTimeout(() => {
      gainXp(100, `${format} Document Compiled`);
      addToast(`🎉 ${format} downloaded successfully!`, "success");
    }, 1500);
  };

  const activeSectionsCount = Object.keys(srs.sections).filter(k => srs.sections[k].visible).length;

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 animate-fade-in space-y-8 select-none">
      {/* Achievement Unlocked Header */}
      <div className="glass-panel border-2 border-pulse/40 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-[0_0_30px_rgba(0,229,160,0.15)]">
        <div className="absolute top-0 left-0 w-32 h-32 bg-pulse/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-aurora/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-pulse/15 border border-pulse flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Award className="w-9 h-9 text-pulse" />
        </div>
        
        <h1 className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-paper via-pulse to-aurora tracking-tight mb-2 uppercase">
          Mission Accomplished!
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto">
          You completed all phases of the scoping pipeline. Your Project DNA is finalized and level 5 status is unlocked.
        </p>

        <div className="mt-5 flex justify-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-edge border border-pulse/30 text-pulse font-mono text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,229,160,0.2)]">
            Project Architect — Level 5
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-edge border border-aurora/30 text-aurora font-mono text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(108,99,255,0.2)]">
            {xp} Total XP earned
          </span>
        </div>
      </div>

      {/* Main Grid: Info stats and Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document Stats Overview */}
        <div className="glass-panel border border-edge rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-paper border-b border-edge/60 pb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-pulse" /> Document Blueprint Summary
          </h3>
          
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Total Pages (est.)</span>
              <span className="font-mono text-paper font-semibold">24 pages</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Scope Sections</span>
              <span className="font-mono text-paper font-semibold">{activeSectionsCount} completed</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Functional Requirements</span>
              <span className="font-mono text-paper font-semibold">8 defined</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Identified Risks</span>
              <span className="font-mono text-paper font-semibold">6 mapped</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted">Timeline Sprint Phases</span>
              <span className="font-mono text-paper font-semibold">4 sprints</span>
            </div>
          </div>
        </div>

        {/* Export Card triggers */}
        <div className="md:col-span-2 glass-panel border border-edge rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-paper border-b border-edge/60 pb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-aurora" /> Download Scoping Deliverables
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* PDF */}
            <button 
              onClick={() => triggerMockExport("PDF")}
              className="p-4 rounded-xl bg-midnight/50 border border-edge hover:border-aurora hover:bg-surface/85 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group"
            >
              <FileDown className="w-6 h-6 text-aurora group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-xs text-paper block">Export PDF</span>
              <span className="text-[10px] text-muted block">Styled print sheet</span>
            </button>

            {/* DOCX */}
            <button 
              onClick={() => triggerMockExport("DOCX")}
              className="p-4 rounded-xl bg-midnight/50 border border-edge hover:border-aurora hover:bg-surface/85 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group"
            >
              <FileText className="w-6 h-6 text-aurora group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-xs text-paper block">Export DOCX</span>
              <span className="text-[10px] text-muted block">Word compatibility</span>
            </button>

            {/* MDX (Functional Blob Exporter) */}
            <button 
              onClick={triggerMDExport}
              className="p-4 rounded-xl bg-midnight/50 border border-pulse hover:border-pulse hover:bg-surface/85 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group"
            >
              <FileText className="w-6 h-6 text-pulse group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-xs text-pulse block">Export MDX</span>
              <span className="text-[10px] text-muted block">Obsidian / Markdown</span>
            </button>

            {/* Share Link */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast("Workspace link copied to clipboard", "success");
                gainXp(15, "Link Shared");
              }}
              className="p-4 rounded-xl bg-midnight/50 border border-edge hover:border-aurora hover:bg-surface/85 transition-all text-center flex flex-col items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Copy className="w-6 h-6 text-aurora group-hover:scale-110 transition-transform" />
              <span className="font-display font-bold text-xs text-paper block">Copy Link</span>
              <span className="text-[10px] text-muted block">Share DNA Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPRINT ROADMAP PREVIEW (Kanban Board) */}
      <div className="glass-panel border border-edge rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-edge pb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-aurora/10 border border-aurora text-aurora">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-paper">Auto-Generated Kanban Roadmap</h3>
              <span className="text-xs text-muted block">Sprints organized from functional specifications</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onEnterDashboard}
              className="px-3.5 py-1.5 bg-cobalt text-white hover:bg-[#3B6AE8] font-display font-bold text-xs rounded-lg transition-all flex items-center space-x-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <span>Enter Project Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Kanban Board columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.col === col.id);
            return (
              <div key={col.id} className="min-w-[170px] bg-midnight/60 border border-edge/60 rounded-xl p-3 flex flex-col space-y-3">
                <div className="flex justify-between items-center border-b border-edge pb-2">
                  <span className="font-display font-bold text-xs text-paper truncate">{col.name}</span>
                  <span className="font-mono text-[10px] bg-edge px-1.5 py-0.5 rounded text-muted">
                    {colTasks.length}
                  </span>
                </div>
                
                <div className="flex-grow space-y-2.5 overflow-y-auto max-h-[300px]">
                  {colTasks.length === 0 ? (
                    <div className="text-[10px] text-muted italic text-center py-6">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="bg-surface border border-edge hover:border-aurora/40 rounded-lg p-2.5 space-y-2 text-left relative transition-all group"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-display font-bold text-xs text-paper leading-snug truncate max-w-[110px]" title={task.title}>
                            {task.title}
                          </span>
                          <span className={`text-[8px] px-1 py-0.5 rounded font-mono font-bold leading-none shrink-0 ${
                            task.prio === "High" ? "bg-red-500/10 text-red-400" : task.prio === "Medium" ? "bg-aurora/10 text-aurora" : "bg-pulse/10 text-pulse"
                          }`}>
                            {task.prio}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted leading-relaxed line-clamp-2">
                          {task.desc}
                        </p>
                        <div className="flex justify-between items-center text-[8px] font-mono text-muted pt-1">
                          <span>{task.hours} hrs</span>
                          
                          {/* Task Movements controls */}
                          <div className="opacity-40 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button 
                              onClick={() => moveTask(task.id, "prev")}
                              disabled={col.id === "backlog"}
                              className="hover:text-aurora disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronLeft className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => moveTask(task.id, "next")}
                              disabled={col.id === "s4"}
                              className="hover:text-aurora disabled:opacity-20 cursor-pointer"
                            >
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
