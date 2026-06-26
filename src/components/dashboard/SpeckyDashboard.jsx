import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Bell, Kanban, FileText, Settings, Users, 
  CheckSquare, AlertTriangle, TrendingUp, UserCheck, Calendar, 
  ChevronLeft, ChevronRight, Sparkles, LogOut, ArrowLeftRight, Check,
  Target, ShieldAlert, Cpu, BarChart2, CheckCircle2, Sliders, Play
} from "lucide-react";
import * as api from "../../utils/api";

export const SpeckyDashboard = ({ project, srs, xp, projectId, navigateToWizard }) => {
  const [activeTab, setActiveTab] = useState("board");
  const [selectedTaskId, setSelectedTaskId] = useState("task-3");
  const [draggingOverCol, setDraggingOverCol] = useState(null);
  
  // Custom states for Backlog & Risks interactive updates
  const [backlogSearch, setBacklogSearch] = useState("");
  const [newBacklogTitle, setNewBacklogTitle] = useState("");

  // Stateful Developer Roster
  const [developers, setDevelopers] = useState([
    { id: "AK", name: "Alex K.", role: "Lead Developer", specialty: "Database, schemas, models, sql, server", bg: "bg-[#EBF0FF]", text: "text-[#1A4FCC]" },
    { id: "MK", name: "Mila K.", role: "Security Specialist", specialty: "Auth, security, login, credentials, token", bg: "bg-[#EDE9FE]", text: "text-[#5B21B6]" },
    { id: "SR", name: "Sidd R.", role: "UI Designer", specialty: "Intake, frontend, layout, style, canvas", bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" },
    { id: "JW", name: "QA Lead", specialty: "Testing, qa, validation, test, paths", bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    { id: "DL", name: "Cloud Ops", specialty: "Stack, hosting, cloud, vercel, express", bg: "bg-[#FEF3C7]", text: "text-[#92400E]" }
  ]);

  // AI Task Allocation states
  const [isAllocating, setIsAllocating] = useState(false);
  const [showAllocationLogs, setShowAllocationLogs] = useState(false);
  const [allocationLogs, setAllocationLogs] = useState([]);

  // Primary tasks store (stateful for Kanban drag-drop and Backlog additions)
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(`specky_roadmap_tasks_${projectId || "local-project"}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(t => {
          if (t.col === "s1") return { ...t, col: "done" };
          if (t.col === "s2") return { ...t, col: "todo" };
          return t;
        });
      } catch (e) {
        console.error("Error parsing saved tasks", e);
      }
    }
    return [
      { id: "task-1", title: "Setup Database Schemas", desc: "Design postgres schemas and database models", hours: 12, prio: "High", col: "done", user: "AK" },
      { id: "task-2", title: "Configure Auth Broker", desc: "Setup Supabase Auth JWT integration", hours: 8, prio: "High", col: "done", user: "MK" },
      { id: "task-3", title: "Onboarding Intake Form", desc: "Implement LaunchPad frontend modules", hours: 16, prio: "Medium", col: "progress", user: "SR" },
      { id: "task-4", title: "Decision Q&A Cards", desc: "Build IntelGathering screen transitions", hours: 24, prio: "High", col: "progress", user: "JW" },
      { id: "task-5", title: "Arsenal Configurator", desc: "Setup tech stack selector interface", hours: 14, prio: "Low", col: "todo", user: "DL" },
      { id: "task-6", title: "Rich Document Preview", desc: "Design page layout for SRS output", hours: 20, prio: "Medium", col: "review", user: "AK" },
      { id: "task-7", title: "Kanban Export Engine", desc: "Connect sprint generation to JSON output", hours: 12, prio: "Low", col: "todo", user: "SR" },
      { id: "task-8", title: "Unit & Integration Tests", desc: "Configure basis path testing sets", hours: 18, prio: "High", col: "todo", user: "JW" },
    ];
  });

  const [risks, setRisks] = useState([
    { id: "R-01", name: "Authentication Latency from provider APIs", col: "L2-I4", level: "High", badge: "bg-[#FEE2E2] text-[#991B1B]", desc: "JWTS token latency exceeds 200ms thresholds under peak scale.", likelihood: 2, impact: 4 },
    { id: "R-02", name: "Edge Routing Deployment Configurations error", col: "L3-I3", level: "Medium", badge: "bg-[#FEF3C7] text-[#92400E]", desc: "Serverless edge routing paths may conflict on route mapping redirects.", likelihood: 3, impact: 3 },
    { id: "R-03", name: "Scope Creep Deviation on sprint scheduling", col: "L4-I4", level: "High", badge: "bg-[#FEE2E2] text-[#991B1B]", desc: "Adding custom intake modules manually exceeds 2-week cycle targets.", likelihood: 4, impact: 4 },
    { id: "R-04", name: "PostgreSQL Database Connection Pooling Bottlenecks", col: "L1-I4", level: "Low", badge: "bg-[#D1FAE5] text-[#065F46]", desc: "Relational database pool limit depletion under growth levels.", likelihood: 1, impact: 4 }
  ]);

  const [milestones, setMilestones] = useState([
    { id: "m1", name: "Milestone 1: Authentication & Layout Setup", date: "June 01 - June 15", status: "Completed", barWidth: "w-full bg-[#10B981]", progress: 100 },
    { id: "m2", name: "Milestone 2: Scoping Q&A Card Interface", date: "June 15 - June 24", status: "Completed", barWidth: "w-full bg-[#10B981]", progress: 100 },
    { id: "m3", name: "Milestone 3: Live Document Previews (Phase 4)", date: "June 24 - July 08", status: "In Progress", barWidth: "w-[68%] bg-cobalt animate-pulse", progress: 68 },
    { id: "m4", name: "Milestone 4: Exporter & Kanban Boards (Phase 5)", date: "July 08 - July 22", status: "To Do", barWidth: "w-0 bg-border-soft", progress: 0 },
    { id: "m5", name: "Milestone 5: Agiled Dashboard Rollout Integration", date: "July 22 - August 05", status: "To Do", barWidth: "w-0 bg-border-soft", progress: 0 }
  ]);

  // New Developer Form states
  const [newDevName, setNewDevName] = useState("");
  const [newDevRole, setNewDevRole] = useState("");
  const [newDevSpecialty, setNewDevSpecialty] = useState("");

  const devColors = [
    { bg: "bg-[#EBF0FF]", text: "text-[#1A4FCC]" },
    { bg: "bg-[#EDE9FE]", text: "text-[#5B21B6]" },
    { bg: "bg-[#FCE7F3]", text: "text-[#9D174D]" },
    { bg: "bg-[#D1FAE5]", text: "text-[#065F46]" },
    { bg: "bg-[#FEF3C7]", text: "text-[#92400E]" },
    { bg: "bg-[#FFE4E6]", text: "text-[#9F1239]" },
    { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]" },
    { bg: "bg-[#F5F5F4]", text: "text-[#44403C]" }
  ];
  
  // Sidebar categories & screens map
  const columns = [
    { id: "todo", name: "To Do", dotColor: "bg-cobalt" },
    { id: "progress", name: "In Progress", dotColor: "bg-[#10B981]" },
    { id: "review", name: "In Review", dotColor: "bg-[#F59E0B]" },
    { id: "done", name: "Done", dotColor: "bg-[#94A3B8]" }
  ];

  // Synchronize dashboard tasks and developers with backend on mount
  useEffect(() => {
    if (!projectId || projectId === "local-project") return;

    // Load from localStorage first to avoid flash of empty/default state
    const saved = localStorage.getItem(`specky_roadmap_tasks_${projectId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTasks(parsed.map(t => {
          if (t.col === "s1") return { ...t, col: "done" };
          if (t.col === "s2") return { ...t, col: "todo" };
          return t;
        }));
      } catch (e) {
        console.error("Error parsing saved tasks", e);
      }
    }

    const syncWithBackend = async () => {
      try {
        const loadData = await api.fetchTeamLoad(projectId);
        if (loadData && loadData.allocations) {
          const updatedDevs = loadData.allocations.map(alloc => {
            const existing = developers.find(d => d.id === alloc.developerId);
            return {
              id: alloc.developerId,
              name: alloc.name,
              role: existing?.role || "Developer",
              specialty: existing?.specialty || "general",
              bg: existing?.bg || "bg-bg-raised",
              text: existing?.text || "text-text-muted"
            };
          });
          if (updatedDevs.length > 0) {
            setDevelopers(updatedDevs);
          }
        }

        try {
          const riskData = await api.fetchRisks(projectId);
          if (riskData && riskData.risks) {
            setRisks(riskData.risks.map(r => ({
              id: r.id,
              name: r.title || r.name,
              desc: r.desc || r.description || "Active risk record details",
              likelihood: r.likelihood || 1,
              impact: r.impact || 1,
              col: `L${r.likelihood}-I${r.impact}`,
              level: r.likelihood * r.impact >= 12 ? "High" : r.likelihood * r.impact >= 6 ? "Medium" : "Low",
              badge: r.likelihood * r.impact >= 12 ? "bg-[#FEE2E2] text-[#991B1B]" : r.likelihood * r.impact >= 6 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#D1FAE5] text-[#065F46]"
            })));
          }
        } catch (rErr) {
          console.warn("Could not fetch risks from backend", rErr);
        }

        try {
          const roadmapData = await api.fetchRoadmap(projectId);
          if (roadmapData) {
            if (roadmapData.tasks && roadmapData.tasks.length) {
              const mapped = roadmapData.tasks.map(t => {
                if (t.col === "s1") return { ...t, col: "done" };
                if (t.col === "s2") return { ...t, col: "todo" };
                return t;
              });
              setTasks(mapped);
              localStorage.setItem(`specky_roadmap_tasks_${projectId}`, JSON.stringify(mapped));
            }
            if (roadmapData.milestones) {
              setMilestones(roadmapData.milestones.map(m => ({
                id: m.id,
                name: m.title || m.name,
                date: m.date || m.dueDate || "TBD",
                status: m.progress === 100 ? "Completed" : m.progress > 0 ? "In Progress" : "To Do",
                barWidth: m.progress === 100 ? "w-full bg-[#10B981]" : m.progress > 0 ? `w-[${m.progress}%] bg-cobalt animate-pulse` : "w-0 bg-border-soft",
                progress: m.progress || 0
              })));
            }
          }
        } catch (mErr) {
          console.warn("Could not fetch milestones and tasks from roadmap backend", mErr);
        }
      } catch (err) {
        console.warn("Could not sync Specky Dashboard data with backend server on load", err);
      }
    };

    syncWithBackend();
  }, [projectId]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (projectId && projectId !== "local-project" && tasks && tasks.length) {
      localStorage.setItem(`specky_roadmap_tasks_${projectId}`, JSON.stringify(tasks));
    }
  }, [tasks, projectId]);



  // Calculate Developer Capacity Stats dynamically from active tasks state
  const getDevStats = (devId) => {
    const devTasks = tasks.filter(t => t.user === devId);
    const hours = devTasks.reduce((sum, t) => sum + (t.hours || 0), 0);
    const count = devTasks.length;

    let load = "On Track";
    let badge = "bg-[#D1FAE5] text-[#065F46]";

    if (hours >= 70) {
      load = "Overloaded";
      badge = "bg-[#FEE2E2] text-[#991B1B]";
    } else if (hours >= 40) {
      load = "Busy";
      badge = "bg-[#FEF3C7] text-[#92400E]";
    }

    return { hours, tasksCount: count, load, badge };
  };

  const getOverallDevLoadStatus = () => {
    let onTrack = 0;
    let busy = 0;
    let overloaded = 0;

    developers.forEach(dev => {
      const stats = getDevStats(dev.id);
      if (stats.load === "Overloaded") overloaded++;
      else if (stats.load === "Busy") busy++;
      else onTrack++;
    });

    return { onTrack, busy, overloaded };
  };

  // Add Developer handler
  const handleAddDeveloper = async (e) => {
    e.preventDefault();
    if (!newDevName.trim() || !newDevRole.trim()) return;

    const devPayload = {
      name: newDevName.trim(),
      role: newDevRole.trim(),
      specialty: newDevSpecialty.trim() || "General development"
    };

    try {
      const res = await api.onboardDeveloper(projectId || "local-project", devPayload);
      if (res.success && res.developer) {
        setDevelopers(prev => [...prev, res.developer]);
        setNewDevName("");
        setNewDevRole("");
        setNewDevSpecialty("");
        return;
      }
    } catch (err) {
      console.warn("API onboardDeveloper offline, saving locally", err);
    }

    // Generate Initials Fallback
    const parts = newDevName.trim().split(" ");
    let initials = "";
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts[0].length >= 2) {
      initials = parts[0].slice(0, 2).toUpperCase();
    } else {
      initials = parts[0][0].toUpperCase() + "X";
    }

    // Check initials uniqueness
    let finalInitials = initials;
    let index = 1;
    while (developers.some(d => d.id === finalInitials)) {
      finalInitials = initials[0] + String(index++);
    }

    const color = devColors[developers.length % devColors.length];
    const newDev = {
      id: finalInitials,
      name: newDevName.trim(),
      role: newDevRole.trim(),
      specialty: newDevSpecialty.trim() || "General development",
      bg: color.bg,
      text: color.text
    };

    setDevelopers(prev => [...prev, newDev]);
    setNewDevName("");
    setNewDevRole("");
    setNewDevSpecialty("");
  };

  // AI Task Assignment Algorithm matching Specialty Keywords & Load Balances
  const handleAIAutoAssign = async () => {
    setIsAllocating(true);
    setAllocationLogs([]);

    try {
      const res = await api.autoAssignSprint(projectId || "local-project", "sprint-02");
      if (res.success && res.logs) {
        const updatedTasks = tasks.map(task => {
          const match = res.logs.find(l => l.taskId === task.id);
          return match ? { ...task, user: match.devId } : task;
        });
        setTasks(updatedTasks);
        setAllocationLogs(res.logs.map(l => ({
          taskId: l.taskId,
          taskTitle: l.taskTitle,
          devName: l.devName,
          devId: l.devId,
          confidence: l.confidence,
          reason: l.reason
        })));
        setIsAllocating(false);
        setShowAllocationLogs(true);
        return;
      }
    } catch (err) {
      console.warn("API autoAssignSprint offline, running client fallback", err);
    }

    setTimeout(() => {
      const logs = [];
      const updatedTasks = tasks.map(task => {
        let bestDev = null;
        let highestScore = -1;

        developers.forEach(dev => {
          let score = 0;
          const specs = dev.specialty.toLowerCase().split(",").map(s => s.trim());
          const textToScan = `${task.title} ${task.desc}`.toLowerCase();

          specs.forEach(spec => {
            if (spec && textToScan.includes(spec)) {
              score += 3;
            }
          });

          // Role matching as additional weights
          if (dev.role.toLowerCase().includes("lead") && task.prio === "High") {
            score += 1;
          }
          if (dev.role.toLowerCase().includes("qa") && (task.title.toLowerCase().includes("test") || task.desc.toLowerCase().includes("test"))) {
            score += 2;
          }
          if (dev.role.toLowerCase().includes("cloud") && (task.title.toLowerCase().includes("hosting") || task.title.toLowerCase().includes("deploy"))) {
            score += 2;
          }

          if (score > highestScore) {
            highestScore = score;
            bestDev = dev;
          }
        });

        // Fallback: If no match or score is 0, assign to dev with minimum hours so far (load balance)
        if (highestScore <= 0 || !bestDev) {
          let minHoursDev = developers[0];
          let minHours = 999;

          developers.forEach(dev => {
            // Check hours based on task user assignments
            const devTasks = tasks.filter(t => t.user === dev.id);
            const devHours = devTasks.reduce((sum, t) => sum + (t.hours || 0), 0);
            if (devHours < minHours) {
              minHours = devHours;
              minHoursDev = dev;
            }
          });
          bestDev = minHoursDev;
          highestScore = 1;
        }

        const confidence = Math.min(100, 65 + highestScore * 7);
        const devSpecStr = developers.find(d => d.id === bestDev.id)?.specialty || "";
        const matchedSpec = devSpecStr.split(",").find(s => `${task.title} ${task.desc}`.toLowerCase().includes(s.trim())) || "Load Balancing";

        logs.push({
          taskId: task.id,
          taskTitle: task.title,
          devName: bestDev.name,
          devId: bestDev.id,
          confidence,
          reason: highestScore > 1 ? `Specialty matched: "${matchedSpec.trim()}"` : "Load balanced distribution"
        });

        return { ...task, user: bestDev.id };
      });

      setTasks(updatedTasks);
      setAllocationLogs(logs);
      setIsAllocating(false);
      setShowAllocationLogs(true);
    }, 1500);
  };

  const moveTask = async (taskId, newCol) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, col: newCol } : t));
    
    try {
      await api.updateTaskColumn(projectId || "local-project", taskId, newCol);
    } catch (err) {
      console.warn("API updateTaskColumn offline, running locally", err);
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (draggingOverCol !== colId) {
      setDraggingOverCol(colId);
    }
  };

  const handleDragLeave = () => {
    setDraggingOverCol(null);
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      moveTask(taskId, colId);
    }
    setDraggingOverCol(null);
  };

  // Quick Backlog task insertion
  const handleAddBacklogItem = async (e) => {
    e.preventDefault();
    if (!newBacklogTitle.trim()) return;

    const taskPayload = {
      title: newBacklogTitle.trim(),
      desc: "Autogenerated backlog story node - click to specify scope details.",
      hours: 10,
      priority: "Medium",
      user: "AK"
    };

    try {
      const res = await api.addToBacklog(projectId || "local-project", taskPayload);
      if (res.success && res.task) {
        setTasks(prev => [...prev, res.task]);
        setNewBacklogTitle("");
        return;
      }
    } catch (err) {
      console.warn("API addToBacklog offline, saving locally", err);
    }

    const newId = `task-${Date.now()}`;
    const newItem = {
      id: newId,
      title: newBacklogTitle,
      desc: "Autogenerated backlog story node - click to specify scope details.",
      hours: 10,
      prio: "Medium",
      col: "todo",
      user: "AK"
    };

    setTasks(prev => [...prev, newItem]);
    setNewBacklogTitle("");
  };

  const getPriorityStyle = (prio) => {
    switch (prio) {
      case "High": return "bg-[#FEE2E2] text-[#991B1B]";
      case "Medium": return "bg-[#FEF3C7] text-[#92400E]";
      default: return "bg-[#D1FAE5] text-[#065F46]";
    }
  };

  const avatars = {};
  developers.forEach(d => {
    avatars[d.id] = { bg: d.bg, text: d.text, name: d.name };
  });

  const activeSectionsCount = Object.keys(srs.sections).filter(k => srs.sections[k].visible).length;

  return (
    <div className="flex h-screen bg-bg-app text-text-primary overflow-hidden font-body w-full animate-fade-in select-none">
      
      {/* SIDEBAR */}
      <aside className="w-[200px] flex-shrink-0 bg-bg-surface border-r border-border-soft flex flex-col justify-between h-full relative z-20">
        <div className="flex flex-col">
          {/* Logo / Brand Row */}
          <div className="h-12 border-b border-border-soft px-4 flex items-center space-x-2">
            <div className="w-[28px] h-[28px] bg-cobalt rounded-[6px] flex items-center justify-center font-display font-bold text-white text-[13px]">
              S
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-text-primary font-medium text-[13px] tracking-tight uppercase font-display">
                Specky
              </span>
              <span className="text-cobalt font-medium text-[9px] uppercase tracking-wider leading-none">
                Enterprise
              </span>
            </div>
          </div>

          {/* Navigation Category: Workspace */}
          <div className="p-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-2">
              Workspace
            </span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("board")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "board" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Kanban className={`w-3.5 h-3.5 ${activeTab === "board" ? "text-cobalt" : "text-text-muted"}`} />
                  <span>Sprint Board</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === "board" ? "bg-bg-active text-cobalt-text" : "bg-bg-raised text-text-secondary"}`}>
                  {tasks.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab("srs")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === "srs" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <FileText className={`w-3.5 h-3.5 ${activeTab === "srs" ? "text-cobalt" : "text-text-muted"}`} />
                  <span>SRS Document</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-raised text-text-secondary font-mono">
                  {activeSectionsCount}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "settings" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <Settings className={`w-3.5 h-3.5 ${activeTab === "settings" ? "text-cobalt" : "text-text-muted"}`} />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Navigation Category: Team */}
          <div className="p-3 pt-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-2">
              Team
            </span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("dev-load")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "dev-load" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${activeTab === "dev-load" ? "text-cobalt" : "text-text-muted"}`} />
                <span>Developer Load</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("risks")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "risks" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <AlertTriangle className={`w-3.5 h-3.5 ${activeTab === "risks" ? "text-cobalt" : "text-text-muted"}`} />
                <span>Risk Matrix</span>
              </button>
            </nav>
          </div>

          {/* Navigation Category: Project */}
          <div className="p-3 pt-0">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-2">
              Project Plan
            </span>
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab("backlog")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "backlog" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <CheckSquare className={`w-3.5 h-3.5 ${activeTab === "backlog" ? "text-cobalt" : "text-text-muted"}`} />
                <span>Plan Backlog</span>
              </button>
              
              <button 
                onClick={() => setActiveTab("milestones")}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === "milestones" 
                    ? "bg-bg-active text-cobalt-text font-semibold" 
                    : "text-text-secondary hover:bg-bg-raised hover:text-text-primary"
                }`}
              >
                <Target className={`w-3.5 h-3.5 ${activeTab === "milestones" ? "text-cobalt" : "text-text-muted"}`} />
                <span>Roadmap Tracks</span>
              </button>
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-border-soft p-3 bg-bg-surface flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-cobalt-bg border border-border-med flex items-center justify-center font-display text-xs font-bold text-cobalt-text shrink-0">
              AK
            </div>
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="text-[11px] font-bold text-text-primary truncate">Alex K.</span>
              <span className="text-[9px] text-text-muted truncate">Tech Lead</span>
            </div>
          </div>
          
          <button 
            onClick={navigateToWizard}
            className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-raised transition-all cursor-pointer"
            title="Launch Scoping Wizard"
          >
            <Play className="w-3.5 h-3.5 text-cobalt" />
          </button>
        </div>
      </aside>

      {/* WORKSPACE AREA CONTAINER */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-12 border-b border-border-soft bg-bg-surface px-5 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-4">
            <h2 className="font-display text-[14px] font-bold text-text-primary uppercase tracking-wide">
              {activeTab === "board" ? "Sprint Board" : 
               activeTab === "srs" ? "Scoping Document" : 
               activeTab === "settings" ? "Scoping Parameters" :
               activeTab === "dev-load" ? "Resource Load Balancing" :
               activeTab === "risks" ? "Risks Matrix Map" :
               activeTab === "backlog" ? "Plan Backlog Registry" : "Roadmap Milestones"}
            </h2>
            <span className="text-text-muted text-xs">|</span>
            <span className="text-text-secondary text-xs font-medium">Project: {project.name || "MedQuery"}</span>
          </div>

          <div className="flex items-center space-x-3.5">
            <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-raised transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-raised transition-all relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </button>
            
            <button 
              onClick={navigateToWizard}
              className="px-3.5 py-1.5 bg-cobalt text-white rounded-[6px] font-display font-medium text-[11px] uppercase tracking-wider hover:bg-[#3B6AE8] active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Scoping Wizard</span>
            </button>
          </div>
        </header>

        {/* WORKSPACE MULTI-VIEWPORT SCREEN ROUTER */}
        <div className="flex-grow overflow-y-auto p-5 relative">
          
          {/* VIEW: SPRINT BOARD (KANBAN BOARD WITH NATIVE DRAG & DROP) */}
          {activeTab === "board" && (() => {
            const selectedTask = tasks.find(t => t.id === selectedTaskId);
            return (
              <div className="space-y-5 animate-fade-in text-left">
                {/* Active Sprint Header stats */}
                <div className="bg-bg-surface border border-border-soft rounded-[8px] p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5">
                    <span className="bg-bg-active text-cobalt-text text-[10px] font-mono font-bold px-2 py-0.5 rounded-[10px] shrink-0 border border-border-soft">
                      ACTIVE
                    </span>
                    <div className="flex flex-col">
                      <h3 className="text-text-primary font-bold text-xs font-display">
                        Sprint 2: Core Infrastructure Buildout
                      </h3>
                      <span className="text-text-muted text-[10px] font-mono mt-0.5">
                        Jun 24 - Jul 08 (2 Weeks cycles)
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center space-x-3.5 min-w-[200px] sm:min-w-[280px] flex-grow">
                      <span className="text-cobalt font-mono text-[10px] font-bold">68%</span>
                      <div className="flex-grow bg-[#E2E8F0] h-[5px] rounded-full overflow-hidden">
                        <div className="bg-cobalt h-full rounded-full transition-all duration-300" style={{ width: "68%" }} />
                      </div>
                      <span className="text-text-muted text-[10px] shrink-0 font-mono">
                        18/27 pts completed
                      </span>
                    </div>

                    <button
                      onClick={handleAIAutoAssign}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-cobalt to-[#4F46E5] text-white rounded-[6px] font-display font-medium text-[10px] uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center space-x-1 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span>AI Auto-Assign</span>
                    </button>
                  </div>
                </div>

                {/* Board and Task Inspector Split Layout */}
                <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
                  
                  {/* Left side: Kanban Columns grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow w-full">
                    {columns.map(col => {
                      const colTasks = tasks.filter(t => t.col === col.id);
                      const isDraggingOver = draggingOverCol === col.id;

                      return (
                        <div 
                          key={col.id} 
                          onDragOver={(e) => handleDragOver(e, col.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, col.id)}
                          className={`bg-bg-surface border rounded-[8px] p-3 flex flex-col space-y-3.5 transition-all ${
                            isDraggingOver 
                              ? "border-cobalt border-dashed bg-cobalt-bg/20 shadow-md scale-[1.01]" 
                              : "border-border-soft"
                          }`}
                        >
                          {/* Column Header */}
                          <div className="flex items-center justify-between border-b border-border-soft pb-2.5">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                              <span className="text-text-primary font-bold text-xs font-display">{col.name}</span>
                            </div>
                            <span className="text-text-muted text-[10px] font-mono bg-bg-raised px-1.5 py-0.5 rounded">
                              {colTasks.length}
                            </span>
                          </div>

                          {/* Drop Target List Wrapper */}
                          <div className="flex-grow space-y-2.5 min-h-[250px] overflow-y-auto max-h-[450px]">
                            {colTasks.length === 0 ? (
                              <div className="text-[10px] text-text-muted italic text-center py-12 border-2 border-dashed border-border-soft/40 rounded-lg">
                                Drag tasks here
                              </div>
                            ) : (
                              colTasks.map(task => {
                                const userProfile = avatars[task.user] || { bg: "bg-[#E2E8F0]", text: "text-[#64748B]", name: "Unassigned" };
                                const isDone = col.id === "done";
                                const isSelected = selectedTaskId === task.id;

                                return (
                                  <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    onClick={() => setSelectedTaskId(task.id)}
                                    className={`task-card p-3 rounded-[8px] border relative transition-all cursor-grab active:cursor-grabbing ${
                                      isDone ? "opacity-55" : ""
                                    } ${
                                      isSelected 
                                        ? "border-cobalt bg-[#FAFBFF] shadow-xs" 
                                        : "border-border-soft bg-bg-surface"
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <h4 className={`text-text-primary font-bold text-[11px] leading-snug font-display line-clamp-2 ${
                                        isDone ? "line-through text-text-muted" : ""
                                      }`}>
                                        {task.title}
                                      </h4>
                                      
                                      <span className={`text-[8px] px-1.5 py-0.5 rounded-[10px] font-mono font-bold leading-none shrink-0 ${
                                        getPriorityStyle(task.prio)
                                      }`}>
                                        {task.prio}
                                      </span>
                                    </div>

                                    <p className="text-[10px] text-text-secondary leading-relaxed mt-1 line-clamp-2">
                                      {task.desc}
                                    </p>

                                    <div className="flex justify-between items-center text-[9px] font-mono text-text-muted mt-3 pt-1.5 border-t border-border-soft/60">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="w-2.5 h-2.5" />
                                        <span>{task.hours} hrs</span>
                                      </span>

                                      <div className="flex items-center">
                                        <div className={`w-[20px] h-[20px] rounded-full ${userProfile.bg} ${userProfile.text} border-2 border-bg-surface flex items-center justify-center font-display text-[9px] font-bold`} title={userProfile.name}>
                                          {task.user || "?"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right side: Task Inspector Panel */}
                  {selectedTask && (
                    <div className="w-full lg:w-[260px] shrink-0 bg-bg-surface border border-border-soft rounded-xl p-4 space-y-4 animate-slide-left text-left">
                      <div className="flex justify-between items-start border-b border-border-soft pb-2">
                        <div>
                          <span className="text-[9px] font-mono font-bold text-text-muted uppercase block">Task Inspector</span>
                          <h4 className="text-text-primary font-bold text-xs font-display">{selectedTask.title}</h4>
                        </div>
                        <button 
                          onClick={() => setSelectedTaskId(null)}
                          className="text-text-muted hover:text-text-primary p-0.5 hover:bg-bg-raised rounded-md transition-all text-[10px] font-bold"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Developer selection */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-text-muted uppercase block">Developer Assigned</label>
                        <select
                          value={selectedTask.user}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, user: val } : t));
                          }}
                          className="w-full bg-bg-raised border border-border-soft rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:border-cobalt focus:outline-hidden cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {developers.map(dev => (
                            <option key={dev.id} value={dev.id}>{dev.name} ({dev.id})</option>
                          ))}
                        </select>
                      </div>

                      {/* Column status selection */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-text-muted uppercase block">Workflow Column</label>
                        <select
                          value={selectedTask.col}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, col: val } : t));
                          }}
                          className="w-full bg-bg-raised border border-border-soft rounded-lg px-2.5 py-1.5 text-xs text-text-primary focus:border-cobalt focus:outline-hidden cursor-pointer"
                        >
                          {columns.map(col => (
                            <option key={col.id} value={col.id}>{col.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Weight Hours Estimate */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono font-bold text-text-muted uppercase">
                          <span>Hours Estimate</span>
                          <span>{selectedTask.hours} hrs</span>
                        </div>
                        <input 
                          type="range" 
                          min="2" 
                          max="40" 
                          step="2"
                          value={selectedTask.hours} 
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, hours: val } : t));
                          }}
                          className="w-full h-1 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-cobalt" 
                        />
                      </div>

                      {/* Priority Selector */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-text-muted uppercase block">Priority Level</label>
                        <div className="grid grid-cols-3 gap-1">
                          {["Low", "Medium", "High"].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, prio: p } : t))}
                              className={`py-1 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                                selectedTask.prio === p
                                  ? "bg-bg-active border-cobalt text-cobalt-text"
                                  : "bg-bg-raised border-border-soft text-text-secondary hover:bg-bg-active/50"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Description Edit */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-text-muted uppercase block">Story Description</label>
                        <textarea
                          value={selectedTask.desc}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, desc: val } : t));
                          }}
                          rows={3}
                          className="w-full bg-bg-raised border border-border-soft rounded-lg px-2.5 py-1.5 text-[10px] text-text-secondary leading-normal focus:border-cobalt focus:outline-hidden resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* VIEW: SRS SPECIFICATION READER */}
          {activeTab === "srs" && (
            <div className="w-full max-w-4xl mx-auto bg-bg-surface border border-border-soft rounded-xl p-8 shadow-sm doc-page text-slate-800 animate-fade-in space-y-6">
              <div className="text-center border-b-2 border-slate-200 pb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-cobalt font-bold">
                  IEEE-830 SCOPING SPECIFICATION
                </span>
                <h2 className="font-display font-bold text-3xl text-text-primary mt-2">
                  {project.name || "MedQuery Telehealth"} System Blueprint
                </h2>
                <p className="text-xs text-text-muted mt-1 font-mono">
                  Current Version: 1.0.0 | Generated Scope Assets
                </p>
              </div>

              {/* Loop and print visible sections */}
              <div className="space-y-8 divide-y divide-slate-100">
                {Object.keys(srs.sections).map((key) => {
                  const sec = srs.sections[key];
                  if (!sec.visible || sec.status !== "done") return null;

                  return (
                    <div key={key} className="pt-6 first:pt-0 space-y-3">
                      <h3 className="font-display text-base font-bold text-cobalt flex items-center gap-2">
                        {sec.title}
                      </h3>
                      <div 
                        dangerouslySetInnerHTML={{ __html: sec.content }}
                        className="text-xs text-text-secondary leading-relaxed pr-3"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: PROJECT SETTINGS SCREEN */}
          {activeTab === "settings" && (
            <div className="w-full max-w-2xl mx-auto bg-bg-surface border border-border-soft rounded-xl p-6 shadow-sm animate-fade-in space-y-6">
              <div>
                <h3 className="text-text-primary font-bold text-sm font-display uppercase tracking-wide">Project Scope Parameters</h3>
                <span className="text-text-muted text-xs block mt-0.5">Configure intakes parameters and framework selections</span>
              </div>

              <div className="space-y-4 divide-y divide-border-soft">
                {/* Meta details */}
                <div className="space-y-3 pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Project Code Name</label>
                      <input 
                        type="text" 
                        defaultValue={project.name || "MedQuery"} 
                        className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Target Version</label>
                      <input 
                        type="text" 
                        defaultValue="v1.0.0-MVP" 
                        className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Scoping Description</label>
                    <textarea 
                      defaultValue={project.description || "A secure healthcare portal with patient tracking and telemedicine channels."}
                      className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                {/* Integration Details */}
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-cobalt font-display uppercase">Technical Stack Configuration</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between items-center bg-bg-raised p-2.5 rounded-lg border border-border-soft">
                      <span className="text-text-secondary">UI Framework:</span>
                      <span className="font-mono font-bold text-cobalt-text">React (Next.js)</span>
                    </div>
                    <div className="flex justify-between items-center bg-bg-raised p-2.5 rounded-lg border border-border-soft">
                      <span className="text-text-secondary">Back-End Logic:</span>
                      <span className="font-mono font-bold text-cobalt-text">Node (Express)</span>
                    </div>
                    <div className="flex justify-between items-center bg-bg-raised p-2.5 rounded-lg border border-border-soft">
                      <span className="text-text-secondary">Primary Storage:</span>
                      <span className="font-mono font-bold text-cobalt-text">PostgreSQL</span>
                    </div>
                    <div className="flex justify-between items-center bg-bg-raised p-2.5 rounded-lg border border-border-soft">
                      <span className="text-text-secondary">Cloud Hosting:</span>
                      <span className="font-mono font-bold text-cobalt-text">Vercel Edge</span>
                    </div>
                  </div>
                </div>

                {/* Reset triggers */}
                <div className="pt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-primary font-bold block">Reset Workspace Scoping</span>
                    <span className="text-text-muted text-[10px]">Wipes all local storage logs and generated assets</span>
                  </div>
                  <button 
                    onClick={navigateToWizard}
                    className="px-3.5 py-1.5 bg-[#FEE2E2] text-[#991B1B] border border-[#991B1B]/20 rounded-lg hover:bg-red-200 transition-all font-display font-semibold cursor-pointer"
                  >
                    Reset & Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DEVELOPER LOAD BOARD */}
          {activeTab === "dev-load" && (() => {
            const overallStats = getOverallDevLoadStatus();
            return (
              <div className="w-full max-w-3xl mx-auto space-y-5 animate-fade-in text-left">
                
                {/* Add Developer Panel Form */}
                <div className="bg-bg-surface border border-border-soft rounded-xl p-4.5 space-y-3.5">
                  <h4 className="text-text-primary font-bold text-xs font-display flex items-center gap-1.5 uppercase tracking-wider">
                    <Plus className="w-4 h-4 text-cobalt" />
                    <span>Add Developer to Scoping Workspace</span>
                  </h4>
                  
                  <form onSubmit={handleAddDeveloper} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sophia R."
                        value={newDevName}
                        onChange={(e) => setNewDevName(e.target.value)}
                        className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs text-text-primary focus:border-cobalt focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Role / Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Security Lead"
                        value={newDevRole}
                        onChange={(e) => setNewDevRole(e.target.value)}
                        className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs text-text-primary focus:border-cobalt focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold text-text-muted uppercase">Specialty Keywords</label>
                      <input
                        type="text"
                        placeholder="e.g. auth, crypto, token, login"
                        value={newDevSpecialty}
                        onChange={(e) => setNewDevSpecialty(e.target.value)}
                        className="w-full bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs text-text-primary focus:border-cobalt focus:outline-hidden"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-cobalt hover:bg-[#3B6AE8] text-white font-display text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Onboard Developer</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Capacity allocations overview header */}
                <div className="bg-bg-surface border border-border-soft rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-text-primary font-bold text-xs font-display">Sprint Capacity Allocations</h3>
                    <span className="text-text-muted text-[10px] mt-0.5 block">Total capacity targets set at 80 hours per developer sprint cycle</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#D1FAE5] text-[#065F46] rounded-full">
                      {overallStats.onTrack} On Track
                    </span>
                    <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#92400E] rounded-full">
                      {overallStats.busy} Busy
                    </span>
                    <span className="px-3 py-1 text-[10px] font-mono font-bold bg-[#FEE2E2] text-[#991B1B] rounded-full">
                      {overallStats.overloaded} Overloaded
                    </span>

                    <button
                      onClick={handleAIAutoAssign}
                      className="ml-2 px-3 py-1 bg-gradient-to-r from-cobalt to-[#4F46E5] text-white rounded-[6px] font-display font-medium text-[9px] uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-white animate-pulse" />
                      <span>AI Load Balance</span>
                    </button>
                  </div>
                </div>

                {/* Developer Load Details list */}
                <div className="space-y-4">
                  {developers.map(dev => {
                    const devStats = getDevStats(dev.id);
                    const ratioPercent = Math.min(100, (devStats.hours / 80) * 100);
                    
                    return (
                      <div key={dev.id} className="bg-bg-surface border border-border-soft rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Left: Info */}
                        <div className="flex items-center space-x-3.5 min-w-[200px]">
                          <div className={`w-[36px] h-[36px] rounded-full ${dev.bg} ${dev.text} flex items-center justify-center font-display text-sm font-bold shrink-0`}>
                            {dev.id}
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="text-text-primary font-bold text-xs font-display">{dev.name}</span>
                            <span className="text-text-muted text-[10px] mt-0.5">{dev.role}</span>
                            <span className="text-[9px] text-cobalt-text font-mono mt-0.5">Specialties: {dev.specialty}</span>
                          </div>
                        </div>

                        {/* Middle: Load capacity bar */}
                        <div className="flex-grow space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-text-muted">
                            <span>Progress Hours: {devStats.hours} hrs</span>
                            <span>Cap: 80 hrs | {devStats.tasksCount} tasks</span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] h-[6px] rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                devStats.load === "Overloaded" ? "bg-red-500" : devStats.load === "Busy" ? "bg-[#F59E0B]" : "bg-cobalt"
                              }`} 
                              style={{ width: `${ratioPercent}%` }} 
                            />
                          </div>
                        </div>

                        {/* Right: Badge */}
                        <div className="shrink-0 text-right min-w-[100px]">
                          <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${devStats.badge}`}>
                            {devStats.load}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* VIEW: RISK MATRIX MAP (5x5 GRID VISUALIZER) */}
          {activeTab === "risks" && (
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-5 animate-fade-in">
              {/* Left Column: 5x5 Matrix Map */}
              <div className="md:col-span-2 bg-bg-surface border border-border-soft rounded-xl p-4 space-y-3.5 flex flex-col items-center">
                <div className="text-center w-full pb-2 border-b border-border-soft">
                  <h3 className="text-text-primary font-bold text-xs font-display">Likelihood × Impact Grid</h3>
                  <span className="text-text-muted text-[9px] font-mono">5x5 Risk Heat Map Coordinates</span>
                </div>

                {/* 5x5 HTML Grid */}
                <div className="grid grid-cols-5 gap-1.5 w-[200px] h-[200px] relative mt-2">
                  {Array.from({ length: 5 }).map((_, rIdx) => {
                    const rowVal = 5 - rIdx; // Likelihood: 5 down to 1
                    return Array.from({ length: 5 }).map((_, cIdx) => {
                      const colVal = cIdx + 1; // Impact: 1 to 5
                      const score = rowVal * colVal;
                      
                      let cellBg = "bg-green-100/70 border-green-200";
                      if (score >= 12) {
                        cellBg = "bg-red-100/70 border-red-200";
                      } else if (score >= 6) {
                        cellBg = "bg-amber-100/70 border-amber-200";
                      }

                      // Check if any of our risks fall on this coordinate
                      const matchRisk = risks.find(r => r.likelihood === rowVal && r.impact === colVal);

                      return (
                        <div 
                          key={`${rowVal}-${colVal}`} 
                          title={`Likelihood: ${rowVal}, Impact: ${colVal} (Score: ${score})`}
                          className={`w-7.5 h-7.5 rounded-[4px] border flex items-center justify-center text-[8px] font-mono font-bold transition-all relative ${cellBg}`}
                        >
                          {matchRisk && (
                            <span 
                              title={matchRisk.name}
                              className="absolute w-2.5 h-2.5 rounded-full bg-cobalt text-white flex items-center justify-center text-[6px] shadow-sm animate-pulse" 
                            />
                          )}
                        </div>
                      );
                    });
                  })}
                </div>
                
                {/* Labels legend */}
                <div className="flex justify-between w-full text-[9px] font-mono text-text-muted mt-2">
                  <span>← Low Impact</span>
                  <span>High Impact →</span>
                </div>
              </div>

              {/* Right Column: Active Blockers list */}
              <div className="md:col-span-3 bg-bg-surface border border-border-soft rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-border-soft pb-2.5">
                  <h3 className="text-text-primary font-bold text-xs font-display">Active Risk Records</h3>
                  <span className="text-[10px] font-mono bg-bg-raised text-text-secondary px-2 py-0.5 rounded">
                    {risks.length} Tracked
                  </span>
                </div>

                <div className="space-y-3 divide-y divide-border-soft">
                  {risks.map((risk) => (
                    <div key={risk.id} className="pt-3 first:pt-0 space-y-1.5 text-xs text-left">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-text-primary font-display">{risk.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-[10px] shrink-0 ${risk.badge}`}>
                          {risk.level}
                        </span>
                      </div>
                      <p className="text-[10px] text-text-secondary leading-relaxed">{risk.desc}</p>
                      <div className="text-[9px] font-mono text-text-muted flex justify-between items-center pt-0.5">
                        <span>Risk ID: {risk.id}</span>
                        <span>Coordinates: {risk.col}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PROJECT BACKLOG PLAN REGISTRY */}
          {activeTab === "backlog" && (
            <div className="w-full max-w-4xl mx-auto space-y-5 animate-fade-in">
              {/* Backlog Registry Search / Action bar */}
              <div className="bg-bg-surface border border-border-soft rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleAddBacklogItem} className="flex-grow flex items-center space-x-2.5 w-full">
                  <input
                    type="text"
                    value={newBacklogTitle}
                    onChange={(e) => setNewBacklogTitle(e.target.value)}
                    placeholder="⚡ Fast-add new backlog user story..."
                    className="flex-grow bg-bg-raised border border-border-soft rounded-lg px-3 py-2 text-xs placeholder:text-text-muted focus:border-cobalt"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-cobalt hover:bg-[#3B6AE8] text-white font-display text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </form>

                <div className="relative shrink-0 w-full sm:w-[180px]">
                  <input
                    type="text"
                    value={backlogSearch}
                    onChange={(e) => setBacklogSearch(e.target.value)}
                    placeholder="Search backlog..."
                    className="w-full bg-bg-raised border border-border-soft rounded-lg pl-8 pr-3 py-2 text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Backlog Stories list table */}
              <div className="bg-bg-surface border border-border-soft rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-bg-raised border-b border-border-soft flex justify-between items-center text-[10px] font-mono font-bold text-text-muted uppercase">
                  <span>User Story Title & Context</span>
                  <div className="flex space-x-8">
                    <span className="w-20 text-center">Estimation</span>
                    <span className="w-20 text-center">Priority</span>
                  </div>
                </div>

                <div className="divide-y divide-border-soft">
                  {tasks
                    .filter(t => t.title.toLowerCase().includes(backlogSearch.toLowerCase()))
                    .map(task => (
                      <div key={task.id} className="px-4 py-3.5 flex justify-between items-center text-xs hover:bg-bg-raised/40 transition-colors text-left">
                        <div className="space-y-1">
                          <span className="font-bold text-text-primary font-display block leading-snug">{task.title}</span>
                          <span className="text-[10px] text-text-secondary leading-relaxed block">{task.desc}</span>
                        </div>

                        <div className="flex space-x-8 items-center shrink-0">
                          <span className="w-20 font-mono text-center text-text-muted">{task.hours} hrs</span>
                          <span className="w-20 text-center">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-[10px] ${getPriorityStyle(task.prio)}`}>
                              {task.prio}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: ROADMAP MILESTONES TIMELINE */}
          {activeTab === "milestones" && (
            <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
              <div className="bg-bg-surface border border-border-soft rounded-xl p-4">
                <h3 className="text-text-primary font-bold text-xs font-display">Target Roadmap Tracks</h3>
                <span className="text-text-muted text-[10px] mt-0.5 block">Estimated schedule timelines for key platform launch sequences</span>
              </div>

              {/* Milestones timeline track list */}
              <div className="relative border-l border-border-soft pl-6 ml-4 space-y-6">
                {milestones.map((m, idx) => {
                  const isDone = m.status === "Completed";
                  const isProgress = m.status === "In Progress";
                  
                  return (
                    <div key={idx} className="relative space-y-2 text-xs text-left">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[30px] top-1 w-[9px] h-[9px] rounded-full border-2 border-bg-surface ${
                        isDone ? "bg-[#10B981]" : isProgress ? "bg-cobalt animate-pulse" : "bg-border-soft"
                      }`} />

                      <div className="flex justify-between items-center">
                        <span className="font-bold text-text-primary font-display">{m.name}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-[10px] ${
                          isDone ? "bg-[#D1FAE5] text-[#065F46]" : isProgress ? "bg-bg-active text-cobalt-text" : "bg-bg-raised text-text-secondary"
                        }`}>
                          {m.status}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-text-muted">
                        <span>Project Track Duration</span>
                        <span>{m.date}</span>
                      </div>

                      {/* Timeline progress line */}
                      <div className="w-full bg-[#E2E8F0] h-[5px] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${m.barWidth}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* AI Processing Scanning Overlay */}
      {isAllocating && (
        <div className="fixed inset-0 bg-[#0D0F1A]/70 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-bg-surface border border-border-soft rounded-2xl p-6 shadow-2xl relative overflow-hidden text-center space-y-4 animate-scale-in">
            <div className="flex justify-center">
              <div className="relative w-14 h-14 flex items-center justify-center bg-bg-active rounded-full">
                <Cpu className="w-6 h-6 text-cobalt animate-spin" style={{ animationDuration: "3s" }} />
                <Sparkles className="w-4 h-4 text-[#10B981] absolute top-1 right-1 animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-display font-bold text-xs text-text-primary uppercase tracking-wider">
                AI Load Balancer Active
              </h3>
              <p className="text-[10px] text-text-muted animate-pulse">
                Mapping developer specialty matrices to backlog requirement descriptions...
              </p>
            </div>

            <div className="w-full bg-[#E2E8F0] h-[4px] rounded-full overflow-hidden">
              <div className="bg-cobalt h-full rounded-full animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      )}

      {/* AI Allocation Matches Log Modal */}
      {showAllocationLogs && (
        <div className="fixed inset-0 bg-[#0D0F1A]/50 backdrop-blur-xs z-[998] flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-bg-surface border border-border-soft rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh] text-left animate-slide-up">
            
            <div className="flex items-center justify-between border-b border-border-soft pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cobalt" />
                <div>
                  <h3 className="font-display font-bold text-xs text-text-primary uppercase tracking-wider">
                    AI Auto-Assignment Registry
                  </h3>
                  <span className="text-[9px] text-text-muted font-mono uppercase block">Load Balancing Completed</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAllocationLogs(false)}
                className="text-text-muted hover:text-text-primary p-0.5 hover:bg-bg-raised rounded-md transition-all text-[10px] font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-text-secondary leading-relaxed mb-4">
              The scoping engine analyzed backlog node requirements against developer roles and keywords, achieving optimal resource load:
            </p>

            {/* Matching logs table list */}
            <div className="flex-grow overflow-y-auto border border-border-soft rounded-xl divide-y divide-border-soft">
              {allocationLogs.map((log, idx) => {
                const devObj = developers.find(d => d.id === log.devId);
                return (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-bg-raised/20 transition-all">
                    <div className="space-y-0.5 max-w-[60%]">
                      <span className="font-semibold text-text-primary font-display block truncate">
                        {log.taskTitle}
                      </span>
                      <span className="text-[9px] text-text-muted block font-mono italic">
                        {log.reason}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5 shrink-0">
                      <div className="flex items-center space-x-1 bg-bg-raised border border-border-soft px-2 py-0.5 rounded-[6px]">
                        <div className={`w-4 h-4 rounded-full ${devObj?.bg} ${devObj?.text} flex items-center justify-center font-display text-[8px] font-bold`}>
                          {log.devId}
                        </div>
                        <span className="text-[10px] font-bold text-text-secondary font-display">{log.devName}</span>
                      </div>
                      
                      <span className="text-[9px] font-mono font-bold text-cobalt-text bg-bg-active px-1.5 py-0.5 rounded shrink-0">
                        {log.confidence}% match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3.5 mt-3.5 border-t border-border-soft">
              <button
                onClick={() => setShowAllocationLogs(false)}
                className="px-4 py-2 bg-cobalt hover:bg-[#3B6AE8] text-white font-display text-xs font-bold rounded-lg cursor-pointer transition-all"
              >
                Apply Allocations
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
