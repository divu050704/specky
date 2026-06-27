import { useState, useEffect, useCallback } from "react";
import { generateSRSContent } from "../utils/srsTemplates";
import * as api from "../utils/api";

const LOCAL_STORAGE_KEY = "specky_project_state";

const initialSections = {
  problem_statement: { title: "1. Problem Statement", content: "", status: "pending", visible: true },
  process_model: { title: "2. Process Model", content: "", status: "pending", visible: true },
  dfd: { title: "3.1 DFD Diagrams", content: "", status: "pending", visible: true },
  data_dictionary: { title: "3.2 Data Dictionary", content: "", status: "pending", visible: true },
  use_cases: { title: "3.3 Use Case Matrix", content: "", status: "pending", visible: true },
  srs_overview: { title: "4.1 SRS Product Overview", content: "", status: "pending", visible: true },
  interface_req: { title: "4.2 External Interfaces", content: "", status: "pending", visible: true },
  functional_req: { title: "4.3 Functional Requirements", content: "", status: "pending", visible: true },
  estimations: { title: "5. Estimations (FP / Effort)", content: "", status: "pending", visible: true },
  scheduling: { title: "6. Sprint Scheduling", content: "", status: "pending", visible: true },
  risk_management: { title: "7. Risk Analysis Matrix", content: "", status: "pending", visible: true },
  design_section: { title: "8. Design (Architectural)", content: "", status: "pending", visible: true },
  testing: { title: "9. Testing (Path Complexity)", content: "", status: "pending", visible: true }
};

export const useAppState = () => {
  const [phase, setPhase] = useState(1);
  const [xp, setXp] = useState(0);
  const [xpChanges, setXpChanges] = useState([]); // for floating +XP animations
  const [project, setProject] = useState({ name: "", description: "" });
  const [answers, setAnswers] = useState({});
  const [stack, setStack] = useState({
    frontend: "Next.js",
    backend: "Node.js (Express)",
    database: "PostgreSQL",
    hosting: "Vercel",
    auth: "Supabase Auth"
  });
  const [srs, setSrs] = useState({ sections: initialSections });
  const [badges, setBadges] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [hasSavedState, setHasSavedState] = useState(false);
  const [projectId, setProjectId] = useState("local-project");
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Check for saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setHasSavedState(true);
    }
  }, []);

  // Save state when major events change
  const saveState = (currentPhase, currentXp, currentProject, currentAnswers, currentStack, currentSrs, currentBadges, currentProjectId) => {
    const state = {
      phase: currentPhase || phase,
      xp: currentXp ?? xp,
      project: currentProject || project,
      answers: currentAnswers || answers,
      stack: currentStack || stack,
      srs: currentSrs || srs,
      badges: currentBadges || badges,
      projectId: currentProjectId || projectId
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  };

  const loadSavedState = async () => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPhase(parsed.phase);
        setXp(parsed.xp);
        setProject(parsed.project);
        setAnswers(parsed.answers);
        setStack(parsed.stack);
        setSrs(parsed.srs);
        setBadges(parsed.badges || []);
        const activeId = parsed.projectId || "local-project";
        setProjectId(activeId);
        addToast("Mission resumed! Welcome back, Architect.", "success");

        if (activeId !== "local-project") {
          setQuestionsLoading(true);
          try {
            const qRes = await api.fetchQuestions(activeId);
            if (qRes.success && qRes.questions) {
              setQuestions(qRes.questions);
            }
          } catch (qErr) {
            console.warn("Could not fetch questions on resume from server", qErr);
          } finally {
            setQuestionsLoading(false);
          }
        }
      }
    } catch (e) {
      console.error("Error loading state", e);
    }
    setHasSavedState(false);
  };

  const clearSavedState = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setHasSavedState(false);
  }, []);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const gainXp = useCallback((amount, label) => {
    setXp((prev) => prev + amount);
    
    // Add floating XP indicator
    const changeId = Date.now() + Math.random().toString(36).substr(2, 9);
    setXpChanges((prev) => [...prev, { id: changeId, amount }]);
    setTimeout(() => {
      setXpChanges((prev) => prev.filter((c) => c.id !== changeId));
    }, 1200);

    if (label) {
      addToast(`+${amount} XP: ${label}`, "success");
    }
  }, [addToast]);

  const unlockBadge = (badgeName) => {
    if (!badges.includes(badgeName)) {
      const updated = [...badges, badgeName];
      setBadges(updated);
      addToast(`Achievement Unlocked: ${badgeName}!`, "achievement");
      gainXp(150, `Badge: ${badgeName}`);
      saveState(phase, xp + 150, project, answers, stack, srs, updated, projectId);
    }
  };

  const handleStartMission = async (name, description) => {
    const proj = { name, description };
    setProject(proj);
    setPhase(2);
    gainXp(50, "Mission Accepted");
    unlockBadge("Project Architect — Level 1");
    
    let activeId = "local-project";
    setQuestionsLoading(true);
    try {
      const res = await api.initProject(name, description);
      if (res.success && res.projectId) {
        activeId = res.projectId;
        setProjectId(res.projectId);
        addToast("Scoping project initialized on server!", "success");
        try {
          const qRes = await api.fetchQuestions(res.projectId);
          if (qRes.success && qRes.questions) {
            setQuestions(qRes.questions);
          }
        } catch (qErr) {
          console.warn("Could not fetch questions from server", qErr);
        }
      }
    } catch (err) {
      console.warn("Backend initialization offline, using client fallback", err);
    } finally {
      setQuestionsLoading(false);
    }

    saveState(2, xp + 50, proj, answers, stack, srs, ["Project Architect — Level 1"], activeId);
  };

  const handleAnswerQuestion = async (questionId, value, points) => {
    const updatedAnswers = { ...answers, [questionId]: value };
    setAnswers(updatedAnswers);
    gainXp(points || 75, "Intel Captured");

    try {
      await api.submitAnswer(projectId, questionId, value);
    } catch (err) {
      console.warn("API submitAnswer offline, syncing locally", err);
    }

    // Check progress for badges
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(updatedAnswers).length;
    
    if (answeredCount === Math.floor(totalQuestions / 2)) {
      unlockBadge("Halfway There!");
    }
    
    if (answeredCount === totalQuestions) {
      unlockBadge("Intel Gathered");
      setTimeout(() => {
        setPhase(3);
        gainXp(150, "Phase 2 Completed");
        saveState(3, xp + points + 150, project, updatedAnswers, stack, srs, badges, projectId);
      }, 1000);
    } else {
      saveState(phase, xp + points, project, updatedAnswers, stack, srs, badges, projectId);
    }
  };

  const handleConfirmStack = async (customStack) => {
    const newStack = customStack || stack;
    setStack(newStack);
    setPhase(4);
    gainXp(150, "Arsenal Confirmed");
    
    try {
      await api.recommendStack(projectId, newStack);
      addToast("Technical stack registered on server!", "success");
    } catch (err) {
      console.warn("API recommendStack offline, running locally", err);
    }

    // Initialize SRS content based on stack and answers
    const content = generateSRSContent(project.name, project.description, answers, newStack);
    const updatedSections = {};
    Object.keys(srs.sections).forEach((key) => {
      updatedSections[key] = {
        ...srs.sections[key],
        content: content[key] || `<p>Drafting ${key}...</p>`,
        status: "pending"
      };
    });
    
    const newSrs = { sections: updatedSections };
    setSrs(newSrs);
    saveState(4, xp + 150, project, answers, newStack, newSrs, badges, projectId);
  };

  const handleFastForwardQuestions = () => {
    const dummyAnswers = {
      scale: "Growth Scale (1K–50K)",
      projectType: "Startup MVP",
      teamCapacity: "Small Team (2-5)",
      budget: "Funded / Moderate",
      timeline: "3–6 months",
      platform: "Web Application",
      techLead: "Yes, CTO/Architect",
      coreProblem: "Medical centers lose patient session history, making Telehealth appointments disorganized and compliance reporting slow."
    };
    
    setAnswers(dummyAnswers);
    gainXp(600, "All Intel Autofilled");
    
    const updatedBadges = [...badges, "Halfway There!", "Intel Gathered"];
    setBadges(updatedBadges);
    
    setTimeout(() => {
      setPhase(3);
      gainXp(150, "Phase 2 Completed");
      saveState(3, xp + 750, project, dummyAnswers, stack, srs, updatedBadges, projectId);
    }, 1000);
  };

  const handleFastForwardSRS = () => {
    addToast("Fast-forwarding documentation generation...", "success");
    const content = generateSRSContent(project.name, project.description, answers, stack);
    
    const updatedSections = {};
    Object.keys(srs.sections).forEach((key) => {
      updatedSections[key] = {
        ...srs.sections[key],
        content: content[key] || `<p>Drafting ${key}...</p>`,
        status: "done"
      };
    });
    
    const newSrs = { sections: updatedSections };
    setSrs(newSrs);
    gainXp(1300, "Scoping Fast-Forwarded");
    
    const updatedBadges = [...badges, "Project Architect — Level 5"];
    setBadges(updatedBadges);
    
    saveState(4, xp + 1300, project, answers, stack, newSrs, updatedBadges, projectId);
    addToast("Full SRS completed instantly!", "success");
  };

  const triggerSRSGeneration = async () => {
    // Try to compile SRS dynamically via backend API
    try {
      const res = await api.compileSRS(projectId, {
        projectName: project.name,
        description: project.description,
        answers,
        stack
      });
      if (res.success && res.sections) {
        const updatedSections = {};
        Object.keys(srs.sections).forEach((key) => {
          updatedSections[key] = {
            ...srs.sections[key],
            content: res.sections[key]?.content || srs.sections[key].content,
            status: "done"
          };
        });
        const newSrs = { sections: updatedSections };
        setSrs(newSrs);
        gainXp(1300, "Full SRS Compilation Completed");
        unlockBadge("Project Architect — Level 5");
        saveState(4, xp + 1300, project, answers, stack, newSrs, [...badges, "Project Architect — Level 5"], projectId);
        addToast("Full SRS document compiled by server!", "success");
        return;
      }
    } catch (err) {
      console.warn("API compileSRS offline, falling back to local simulation", err);
    }

    const keys = Object.keys(srs.sections);
    let index = 0;
    
    const generateNext = () => {
      if (index >= keys.length) {
        unlockBadge("Project Architect — Level 5");
        addToast("Full SRS Scoped and generated successfully!", "success");
        return;
      }

      const key = keys[index];
      
      setSrs((prev) => {
        const nextSections = {
          ...prev.sections,
          [key]: { ...prev.sections[key], status: "generating" }
        };
        return { sections: nextSections };
      });
      
      addToast(`Drafting ${srs.sections[key]?.title || key}...`, "info");

      setTimeout(() => {
        setSrs((prev) => {
          const nextSections = {
            ...prev.sections,
            [key]: { ...prev.sections[key], status: "done" }
          };
          const newSrs = { sections: nextSections };
          saveState(4, null, project, answers, stack, newSrs, badges, projectId);
          return newSrs;
        });

        gainXp(100, `${keys[index]} compiled`);
        index++;
        setTimeout(generateNext, 2000);
      }, 1500);
    };

    generateNext();
  };

  const updateSectionContent = (key, content) => {
    setSrs((prev) => {
      const nextSections = {
        ...prev.sections,
        [key]: { ...prev.sections[key], content, lastEdited: new Date().toLocaleTimeString() }
      };
      const newSrs = { sections: nextSections };
      saveState(phase, xp, project, answers, stack, newSrs, badges, projectId);
      return newSrs;
    });
    addToast("Changes saved locally", "info");
  };

  const toggleSectionVisibility = (key) => {
    setSrs((prev) => {
      const nextSections = {
        ...prev.sections,
        [key]: { ...prev.sections[key], visible: !prev.sections[key].visible }
      };
      const newSrs = { sections: nextSections };
      saveState(phase, xp, project, answers, stack, newSrs, badges, projectId);
      return newSrs;
    });
  };

  const reorderSection = (key, direction) => {
    setSrs((prev) => {
      const keys = Object.keys(prev.sections);
      const index = keys.indexOf(key);
      if (index === -1) return prev;
      
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= keys.length) return prev;
      
      const newKeys = [...keys];
      newKeys.splice(index, 1);
      newKeys.splice(newIndex, 0, key);
      
      const nextSections = {};
      newKeys.forEach((k) => {
        nextSections[k] = prev.sections[k];
      });
      
      const newSrs = { sections: nextSections };
      saveState(phase, xp, project, answers, stack, newSrs, badges, projectId);
      return newSrs;
    });
  };

  const navigateToPhase = (targetPhase) => {
    if (targetPhase < phase) {
      setPhase(targetPhase);
      saveState(targetPhase, xp, project, answers, stack, srs, badges, projectId);
    }
  };

  const resetAll = () => {
    setPhase(1);
    setXp(0);
    setProject({ name: "", description: "" });
    setAnswers({});
    setStack({
      frontend: "Next.js",
      backend: "Node.js (Express)",
      database: "PostgreSQL",
      hosting: "Vercel",
      auth: "Supabase Auth"
    });
    setSrs({ sections: initialSections });
    setBadges([]);
    setProjectId("local-project");
    clearSavedState();
    addToast("Mission restarted. Build from scratch!", "info");
  };

  return {
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
    unlockBadge,
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
    handleFastForwardSRS,
    questions,
    setQuestions,
    questionsLoading
  };
};
