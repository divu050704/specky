import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// ---------------------------------------------------------
// 1. Scoping Wizard Endpoints (Phases 1–4)
// ---------------------------------------------------------

/**
 * Phase 1: Initiate a new project scoping entry.
 * @param {string} name - The project name (2-100 characters).
 * @param {string} description - The project description (10-500 characters).
 * @returns {Promise<object>} Project seeding response metadata.
 */
export const initProject = async (name, description) => {
  const response = await apiClient.post("/projects/init", { name, description });
  return response.data;
};

/**
 * Phase 2: Fetch the set of dynamic questionnaire diagnostics.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Questions list and project state.
 */
export const fetchQuestions = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/questions`);
  return response.data;
};

/**
 * Phase 2: Save answer for a question.
 * @param {string} projectId - Target project UUID.
 * @param {string} questionId - Question key.
 * @param {string} value - User answer choice or explanation text.
 * @returns {Promise<object>} Update progress metrics and confidence scores.
 */
export const submitAnswer = async (projectId, questionId, value) => {
  const response = await apiClient.post(`/projects/${projectId}/answers`, { questionId, value });
  return response.data;
};

/**
 * Phase 3: Submit final choices and calculate tech stack recommendations.
 * @param {string} projectId - Target project UUID.
 * @param {object} answers - Optional overrides dictionary.
 * @returns {Promise<object>} Recommended stack details and complexity multiplier.
 */
export const recommendStack = async (projectId, answers = {}) => {
  const response = await apiClient.post(`/projects/${projectId}/stack/recommend`, { answers });
  return response.data;
};

/**
 * Phase 4: Compile all 13 document sections and generate initial dashboard cards.
 * @param {string} projectId - Target project UUID.
 * @param {object} payload - Configuration overrides (name, description, answers, stack).
 * @returns {Promise<object>} Map of generated IEEE-830 specification sections.
 */
export const compileSRS = async (projectId, payload = {}) => {
  const response = await apiClient.post(`/projects/${projectId}/srs/compile`, payload);
  return response.data;
};

/**
 * Phase 4: Re-write selected text inside an active document section.
 * @param {string} projectId - Target project UUID.
 * @param {string} sectionKey - The target IEEE section (e.g. "problem_statement").
 * @param {string} selectedText - Selected substring text block.
 * @param {"formal"|"expand"|"shorten"} mode - Rewrite refactoring instruction.
 * @param {string} [customInstructions] - Custom user constraints.
 * @returns {Promise<object>} The updated rewritten text.
 */
export const rewriteSection = async (projectId, sectionKey, selectedText, mode, customInstructions = "") => {
  const response = await apiClient.post(`/projects/${projectId}/srs/section/rewrite`, {
    sectionKey,
    selectedText,
    mode,
    customInstructions
  });
  return response.data;
};

// ---------------------------------------------------------
// 2. Specky Dashboard Endpoints (Phase 5 Views)
// ---------------------------------------------------------

/**
 * Sprint Board: Fetch current sprint metadata and active task cards.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Active tasks list and board completions.
 */
export const fetchActiveSprint = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/sprints/active`);
  return response.data;
};

/**
 * Sprint Board: Move task workflow column status (Drag-and-Drop).
 * @param {string} projectId - Target project UUID.
 * @param {string} taskId - Target task identifier.
 * @param {string} col - Target workflow column status (todo, progress, review, done).
 * @returns {Promise<object>} Task move confirmations.
 */
export const updateTaskColumn = async (projectId, taskId, col) => {
  const response = await apiClient.patch(`/projects/${projectId}/tasks/${taskId}`, { col });
  return response.data;
};

/**
 * Developer Load: Compute and fetch resource workloads.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Developer roster allocation arrays.
 */
export const fetchTeamLoad = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/team/load`);
  return response.data;
};

/**
 * Risk Matrix: Fetch coordinates of all project risks.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Risks list mapped to 5x5 Likelihood x Impact coordinates.
 */
export const fetchRisks = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/risks`);
  return response.data;
};

/**
 * Backlog: Insert a user story task node.
 * @param {string} projectId - Target project UUID.
 * @param {object} taskData - User story payload (title, desc, hours, priority, user).
 * @returns {Promise<object>} Saved task details.
 */
export const addToBacklog = async (projectId, taskData) => {
  const response = await apiClient.post(`/projects/${projectId}/backlog`, taskData);
  return response.data;
};

/**
 * Milestones: Fetch roadmap milestones.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Milestones timeline track list.
 */
export const fetchRoadmap = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/roadmap`);
  return response.data;
};

/**
 * Save/replace the full sprint roadmap (tasks) for a project.
 * @param {string} projectId - Target project UUID.
 * @param {object} data - Payload containing tasks array.
 * @returns {Promise<object>} Persistence confirmation.
 */
export const saveRoadmap = async (projectId, data) => {
  const response = await apiClient.post(`/projects/${projectId}/roadmap`, data);
  return response.data;
};

/**
 * Developer Load: Onboard a developer dynamically.
 * @param {string} projectId - Target project UUID.
 * @param {object} devData - Developer fields (name, role, specialty).
 * @returns {Promise<object>} Created developer details and initials.
 */
export const onboardDeveloper = async (projectId, devData) => {
  const response = await apiClient.post(`/projects/${projectId}/team/developers`, devData);
  return response.data;
};

/**
 * Sprint Board: Trigger the AI load balancing assignment algorithm.
 * @param {string} projectId - Target project UUID.
 * @param {string} sprintId - Target sprint identifier.
 * @returns {Promise<object>} Auto-assignment results and metrics.
 */
export const autoAssignSprint = async (projectId, sprintId) => {
  const response = await apiClient.post(`/projects/${projectId}/sprints/auto-assign`, { sprintId });
  return response.data;
};

// ---------------------------------------------------------
// 3. Global Synchronization State Endpoint
// ---------------------------------------------------------

/**
 * Fetch full project state for synchronization.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Global project state wrapper.
 */
export const fetchProjectState = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/state`);
  return response.data;
};

// ---------------------------------------------------------
// 4. Export & Roadmap Endpoints
// ---------------------------------------------------------

/**
 * Fetch AI-generated sprint roadmap tasks and document metrics.
 * @param {string} projectId - Target project UUID.
 * @returns {Promise<object>} Metrics summary and tasks.
 */
export const fetchExportSummary = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/export/summary`);
  return response.data;
};

/**
 * Compile and generate download URL/file for the scoping documentation.
 * @param {string} projectId - Target project UUID.
 * @param {"pdf"|"docx"|"mdx"} format - Selected file format.
 * @returns {Promise<object>} Compilation success, fileName, and downloadUrl.
 */
export const downloadExportFile = async (projectId, format) => {
  const response = await apiClient.post(`/projects/${projectId}/export/file`, { format });
  return response.data;
};

/**
 * Reschedule a roadmap task to a different column.
 * @param {string} projectId - Target project UUID.
 * @param {string} taskId - Target task identifier.
 * @param {string} col - Target column (backlog, s1, s2, s3, s4).
 * @returns {Promise<object>} Persistence confirmations.
 */
export const updateRoadmapTaskColumn = async (projectId, taskId, col) => {
  const response = await apiClient.patch(`/projects/${projectId}/roadmap/tasks/${taskId}`, { col });
  return response.data;
};

export default apiClient;
