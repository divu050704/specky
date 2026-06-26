import React, { useState, useEffect, useRef } from "react";
import { 
  Play, RotateCcw, FileText, Download, Eye, EyeOff, 
  ArrowUp, ArrowDown, Sparkles, Bold, Italic, 
  Heading1, Heading2, List, Edit3, ZoomIn, ZoomOut 
} from "lucide-react";
import * as api from "../../utils/api";

export const SRSBuilder = ({ 
  project, srs, xp, projectId, updateSectionContent, toggleSectionVisibility, 
  reorderSection, triggerSRSGeneration, gainXp, addToast, setPhase,
  onFastForward
}) => {
  const [zoom, setZoom] = useState(100);
  const [activeSection, setActiveSection] = useState(null);
  const [editMode, setEditMode] = useState(true); // true = edit mode, false = preview mode
  
  // States for text editing and AI rewrite toolbar
  const [selectedText, setSelectedText] = useState("");
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0, visible: false });
  const [editingBlockId, setEditingBlockId] = useState(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  
  const docContainerRef = useRef(null);
  const toolbarRef = useRef(null);

  // Trigger initial generation if all sections are pending
  useEffect(() => {
    const allPending = Object.values(srs.sections).every(sec => sec.status === "pending");
    if (allPending) {
      setTimeout(() => {
        triggerSRSGeneration();
      }, 1000);
    }
  }, []);

  // Monitor text selections to display floating formatting / AI Rewrite toolbar
  const handleTextSelection = (e, sectionKey) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 3) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const parentRect = docContainerRef.current.getBoundingClientRect();
      
      setToolbarPosition({
        top: rect.top - parentRect.top - 50 + docContainerRef.current.scrollTop,
        left: rect.left - parentRect.left + (rect.width / 2) - 100,
        visible: true
      });
      setSelectedText(text);
      setEditingBlockId(sectionKey);
    } else {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
    }
  };

  const handleDocumentClick = (e) => {
    // Hide toolbar if clicking outside
    if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
      setToolbarPosition(prev => ({ ...prev, visible: false }));
    }
  };

  // Formatting operations
  const formatText = (command) => {
    document.execCommand(command, false, null);
    gainXp(10, "Format applied");
  };

  // AI Rewrite API and Simulator Fallback
  const handleAIRewrite = async (instruction) => {
    if (!selectedText || !editingBlockId) return;
    setRewriteLoading(true);
    setToolbarPosition(prev => ({ ...prev, visible: false }));
    
    addToast(`AI is rewriting text: "${instruction}"...`, "info");
    
    try {
      const res = await api.rewriteSection(projectId || "local-project", editingBlockId, selectedText, instruction);
      if (res.success && res.rewrittenText) {
        const section = srs.sections[editingBlockId];
        if (section) {
          const newContent = section.content.replace(selectedText, res.rewrittenText);
          updateSectionContent(editingBlockId, newContent);
          gainXp(res.xpAwarded || 50, `AI Rewritten (${instruction})`);
        }
        setRewriteLoading(false);
        setSelectedText("");
        return;
      }
    } catch (err) {
      console.warn("API rewrite request offline, running client fallback simulation", err);
    }
    
    setTimeout(() => {
      let replacement = selectedText;
      if (instruction === "formal") {
        replacement = `Pursuant to the defined architectural layout, the system executes an automated logic cycle to ensure '${selectedText.toLowerCase()}' coordinates with the backend parameters.`;
      } else if (instruction === "expand") {
        replacement = `In order to provide a reliable implementation structure, we expand '${selectedText}' to establish clear concurrency handlers, robust safety controls, and decoupled routing queues, ensuring scalability.`;
      } else if (instruction === "shorten") {
        replacement = `Streamlined implementation: ${selectedText.split(" ").slice(0, 5).join(" ")}... optimized for direct response modules.`;
      }

      // Replace in the current section HTML
      const section = srs.sections[editingBlockId];
      if (section) {
        const newContent = section.content.replace(selectedText, replacement);
        updateSectionContent(editingBlockId, newContent);
        gainXp(50, `AI Rewritten (${instruction})`);
      }
      
      setRewriteLoading(false);
      setSelectedText("");
    }, 1200);
  };

  // Regenerate Diagram Animation
  const handleRegenerateDiagram = (sectionKey) => {
    addToast("Regenerating diagram layout...", "info");
    setTimeout(() => {
      gainXp(40, "Diagram redrawn");
      addToast("SVG Diagram re-rendered dynamically", "success");
    }, 1000);
  };

  const activeSectionKeys = Object.keys(srs.sections).filter(k => srs.sections[k].visible);

  return (
    <div className="w-full py-4 px-3 flex flex-col md:flex-row gap-5 animate-fade-in h-[85vh] select-none" onClick={handleDocumentClick}>
      {/* LEFT PANEL: Section Navigator */}
      <div className="w-full md:w-80 flex flex-col justify-between bg-surface border border-edge rounded-2xl p-4 shrink-0 shadow-xl max-h-[85vh] overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-edge pb-3">
            <div>
              <h3 className="font-display font-bold text-sm text-paper">SRS Scoping Checklist</h3>
              <span className="text-[10px] text-muted font-mono">{activeSectionKeys.length} Sections Active</span>
            </div>
            <button 
              onClick={triggerSRSGeneration}
              className="p-1.5 rounded-lg border border-edge hover:border-aurora hover:text-aurora transition-all cursor-pointer text-xs flex items-center space-x-1"
              title="Regenerate All Sections"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fast-Forward SRS compile */}
          {Object.values(srs.sections).some(sec => sec.status !== "done") && (
            <button
              onClick={onFastForward}
              className="w-full py-2.5 bg-gradient-to-r from-aurora to-pulse text-midnight hover:brightness-110 font-display text-xs font-bold rounded-xl transition-all shadow-[0_0_8px_rgba(92,84,230,0.15)] flex items-center justify-center gap-1.5 cursor-pointer border border-aurora"
            >
              <Sparkles className="w-3.5 h-3.5 fill-midnight text-midnight" />
              <span>⚡ Fast-Forward Scoping (+1000 XP)</span>
            </button>
          )}

          {/* Section List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1.5">
            {Object.keys(srs.sections).map((key) => {
              const sec = srs.sections[key];
              const isGen = sec.status === "generating";
              const isDone = sec.status === "done";
              const isActive = activeSection === key;

              return (
                <div 
                  key={key}
                  onClick={() => isDone && setActiveSection(key)}
                  className={`group rounded-xl border p-2.5 transition-all relative flex items-center justify-between gap-2 ${
                    isActive 
                      ? "bg-aurora/10 border-aurora text-paper shadow-[0_0_8px_rgba(108,99,255,0.15)]" 
                      : isDone 
                      ? "bg-midnight/50 border-edge/60 text-muted hover:border-edge hover:bg-midnight/80 cursor-pointer" 
                      : "bg-midnight/20 border-edge/30 text-muted/40 opacity-55"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {/* Status Circle */}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isDone 
                        ? "bg-pulse text-midnight font-bold" 
                        : isGen 
                        ? "bg-aurora text-midnight animate-pulse-glow" 
                        : "bg-edge text-muted"
                    }`}>
                      {isDone ? "✓" : isGen ? "•" : "○"}
                    </div>
                    
                    <span className="font-display text-xs font-medium truncate">
                      {sec.title}
                    </span>
                  </div>

                  {/* Micro-Controls Hover Overlay */}
                  {isDone && (
                    <div className="hidden group-hover:flex items-center space-x-1.5 shrink-0 bg-surface/90 px-1 py-0.5 rounded-lg border border-edge">
                      <button 
                        onClick={(e) => { e.stopPropagation(); triggerSRSGeneration(); }}
                        className="p-1 rounded text-muted hover:text-aurora hover:bg-edge/40"
                        title="Regenerate Section"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleSectionVisibility(key); }}
                        className="p-1 rounded text-muted hover:text-aurora hover:bg-edge/40"
                        title={sec.visible ? "Hide in Export" : "Show in Export"}
                      >
                        {sec.visible ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); reorderSection(key, "up"); }}
                        className="p-1 rounded text-muted hover:text-aurora hover:bg-edge/40"
                        title="Move Section Up"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); reorderSection(key, "down"); }}
                        className="p-1 rounded text-muted hover:text-aurora hover:bg-edge/40"
                        title="Move Section Down"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase Navigation and Actions */}
        <div className="space-y-3 pt-3 border-t border-edge/60 mt-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-display font-semibold">
            <button 
              onClick={() => setEditMode(true)}
              className={`py-2 rounded-lg border transition-all cursor-pointer ${
                editMode ? "bg-aurora text-midnight border-aurora" : "bg-midnight/40 border-edge text-muted hover:text-paper"
              }`}
            >
              Edit Mode
            </button>
            <button 
              onClick={() => setEditMode(false)}
              className={`py-2 rounded-lg border transition-all cursor-pointer ${
                !editMode ? "bg-aurora text-midnight border-aurora" : "bg-midnight/40 border-edge text-muted hover:text-paper"
              }`}
            >
              Preview Mode
            </button>
          </div>

          <button
            onClick={() => setPhase(5)}
            className="w-full py-3 bg-gradient-to-r from-pulse to-aurora text-midnight font-display font-bold text-xs tracking-widest uppercase rounded-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,229,160,0.2)] cursor-pointer"
          >
            <span>Proceed to Export</span>
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Live Document Preview */}
      <div className="flex-grow flex flex-col bg-surface border border-edge rounded-2xl overflow-hidden shadow-xl max-h-[85vh]">
        {/* Document Header Controls */}
        <div className="px-5 py-3 border-b border-edge bg-midnight/30 flex items-center justify-between text-xs text-muted font-mono select-none">
          <div className="flex items-center space-x-3.5">
            <span className="text-pulse font-bold animate-pulse">● LIVE EDITOR</span>
            <span>Project: {project.name || "Draft"}</span>
            {rewriteLoading && <span className="text-aurora animate-pulse">🧠 AI rewriting...</span>}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-2.5 bg-edge/50 px-2 py-1 rounded-lg">
            <button onClick={() => setZoom(prev => Math.max(75, prev - 12.5))} className="hover:text-aurora cursor-pointer">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(prev => Math.min(125, prev + 12.5))} className="hover:text-aurora cursor-pointer">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Paper Container Canvas */}
        <div 
          ref={docContainerRef}
          className="flex-grow overflow-y-auto p-6 bg-midnight/80 relative"
          style={{ scrollBehavior: "smooth" }}
        >
          {/* Simulated Paper Sheets */}
          <div 
            className="mx-auto bg-paper text-slate-800 p-8 sm:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.5)] rounded-md doc-page max-w-[850px] relative transition-transform duration-200"
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: "top center",
              minHeight: "1000px"
            }}
          >
            {/* Floating Formatter / AI Rewrite Toolbar */}
            {toolbarPosition.visible && (
              <div 
                ref={toolbarRef}
                style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
                className="absolute z-40 bg-midnight border border-edge rounded-lg shadow-2xl p-1.5 flex items-center space-x-1.5 text-paper scale-[0.9] origin-bottom animate-slide-up select-none"
              >
                <button onClick={() => formatText("bold")} className="p-1 rounded hover:bg-edge text-muted hover:text-paper" title="Bold">
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => formatText("italic")} className="p-1 rounded hover:bg-edge text-muted hover:text-paper" title="Italic">
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-[1px] h-4 bg-edge" />
                
                {/* AI Rewrite dropdown options */}
                <button 
                  onClick={() => handleAIRewrite("formal")}
                  className="px-2 py-1 rounded hover:bg-aurora hover:text-midnight text-[10px] font-display font-bold flex items-center space-x-0.5"
                  title="Make formal using AI"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Formalize</span>
                </button>
                <button 
                  onClick={() => handleAIRewrite("expand")}
                  className="px-2 py-1 rounded hover:bg-aurora hover:text-midnight text-[10px] font-display font-bold flex items-center space-x-0.5"
                  title="Expand detail using AI"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Expand</span>
                </button>
                <button 
                  onClick={() => handleAIRewrite("shorten")}
                  className="px-2 py-1 rounded hover:bg-aurora hover:text-midnight text-[10px] font-display font-bold flex items-center space-x-0.5"
                  title="Shorten text using AI"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Shorten</span>
                </button>
              </div>
            )}

            {/* Document Cover Page */}
            <div className="text-center border-b-2 border-slate-300 pb-8 mb-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#6C63FF]">
                SOFTWARE REQUIREMENTS SPECIFICATION
              </span>
              <h1 className="font-display font-bold text-4xl mt-3 text-slate-900 uppercase">
                {project.name || "UNNAMED SCENARIO"}
              </h1>
              <p className="text-sm text-slate-500 mt-2 font-mono">
                Generated: {new Date().toLocaleDateString()} | System Architecture Blueprint
              </p>
            </div>

            {/* Render active sections */}
            {Object.keys(srs.sections).map((key, index) => {
              const sec = srs.sections[key];
              if (!sec.visible) return null;

              const isGenerating = sec.status === "generating";
              const isPending = sec.status === "pending";

              return (
                <div 
                  key={key} 
                  id={key}
                  className={`relative my-8 pb-6 border-b border-slate-200/60 transition-all duration-300 ${
                    activeSection === key ? "ring-2 ring-[#6C63FF]/30 p-4 rounded-xl" : ""
                  }`}
                >
                  {/* Section Title Header */}
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display text-lg font-bold text-[#6C63FF] m-0">
                      {sec.title}
                    </h2>
                    
                    {sec.lastEdited && (
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Edited: {sec.lastEdited}
                      </span>
                    )}
                  </div>

                  {/* Section Content Block */}
                  {isGenerating ? (
                    <div className="space-y-3 py-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded" />
                      <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                  ) : isPending ? (
                    <div className="text-slate-400 italic text-sm">
                      Awaiting compiler pipeline execution...
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Diagram Controls */}
                      {(key === "dfd" || key === "design_section" || key === "scheduling") && (
                        <button
                          onClick={() => handleRegenerateDiagram(key)}
                          className="absolute top-2 right-2 z-10 px-2 py-1 bg-[#1E2340] border border-[#6C63FF]/20 text-white rounded text-[10px] font-display hover:border-[#6C63FF] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Redraw Diagram</span>
                        </button>
                      )}

                      {/* Content editable zone */}
                      <div
                        contentEditable={editMode}
                        suppressContentEditableWarning
                        onMouseUp={(e) => handleTextSelection(e, key)}
                        onBlur={(e) => updateSectionContent(key, e.target.innerHTML)}
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                        className={`outline-none pr-3 ${
                          editMode ? "hover:bg-slate-100/60 focus:bg-white focus:ring-1 focus:ring-[#6C63FF] rounded-lg p-2 transition-all cursor-text" : ""
                        }`}
                      />
                    </div>
                  )}

                  {/* Simulated Page Break Indicator at fixed block spacing */}
                  {index > 0 && index % 3 === 0 && (
                    <div className="page-break" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
