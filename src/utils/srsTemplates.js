// Dynamic SRS Content Generator tailored to user input
export const generateSRSContent = (projectName, description, answers, stack) => {
  const name = projectName || "Project Intelligence";
  const desc = description || "A modern web application.";
  
  // Extract answers with defaults
  const userScale = answers.scale || "1K–50K users";
  const projectType = answers.projectType || "Startup MVP";
  const teamCapacity = answers.teamCapacity || "Small Team (2–5)";
  const budget = answers.budget || "Bootstrapped";
  const timeline = answers.timeline || "3–6 months";
  const platform = answers.platform || "Web Application";
  const techLead = answers.techLead || "Yes, CTO/Architect";
  const coreProblem = answers.coreProblem || "Lack of automated workflows and structured tracking.";

  const fe = stack.frontend || "React";
  const be = stack.backend || "Node.js";
  const db = stack.database || "PostgreSQL";
  const host = stack.hosting || "Vercel";
  const auth = stack.auth || "Supabase Auth";

  return {
    problem_statement: `
<h3>1.1 Project Background</h3>
<p>In the contemporary digital landscape, projects fail not during development, but during the alignment phase. <strong>${name}</strong> is conceived as a direct solution to the fragmentation, information loss, and misaligned expectations that occur during initial project scoping. The project details are based on: <em>"${desc}"</em>.</p>
<p>By leveraging an opinionated setup framework, the system bridges the gap between raw product requirements and engineering deliverables, establishing a single source of truth early in the development lifecycle.</p>

<h3>1.2 Business Goal</h3>
<p>The primary goal of <strong>${name}</strong> is to reduce time-to-scope by 70%, translating a high-level product concept into a comprehensive Software Requirements Specification (SRS) and an actionable sprint roadmap. For the target platform (<strong>${platform}</strong>), the system will ensure high availability and scalability to accommodate the expected scale of <strong>${userScale}</strong> within the designated timeline of <strong>${timeline}</strong>, working under a <strong>${budget}</strong> budget constraint.</p>
    `,

    process_model: `
<h3>2.1 Recommended Software Development Life Cycle (SDLC)</h3>
<p>Based on the project classification as a <strong>${projectType}</strong> with a timeline of <strong>${timeline}</strong> and a team capacity of <strong>${teamCapacity}</strong>, we recommend the <strong>Agile Scrum Model</strong> with two-week sprint intervals.</p>

<p><strong>Rationale:</strong> An iterative model is essential for a ${projectType}. It allows the team to deliver an MVP, validate core assumptions under the ${budget} budget, and pivot based on early user feedback from the initial ${userScale} user cohort.</p>

<h3>2.2 Model Advantages & Disadvantages</h3>
<table>
  <thead>
    <tr>
      <th>Advantage (Agile Scrum)</th>
      <th>Disadvantage (Agile Scrum)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>High Adaptability:</strong> Easily accommodate changes as requirements mature.</td>
      <td><strong>Scope Creep Risk:</strong> Without strict product management, the project scope can expand indefinitely.</td>
    </tr>
    <tr>
      <td><strong>Early Value Delivery:</strong> Ship a functional MVP in Sprint 1-2.</td>
      <td><strong>Resource Intensive:</strong> Requires active participation from stakeholders and technical leads.</td>
    </tr>
    <tr>
      <td><strong>Continuous Testing:</strong> Bugs are identified and fixed within the sprint cycle.</td>
      <td><strong>Documentation Overhead:</strong> Requires discipline to keep documentation like this SRS synchronized with code.</td>
    </tr>
  </tbody>
</table>
    `,

    dfd: `
<h3>3.1.1 Context Level (Level 0) DFD</h3>
<p>The Level 0 Data Flow Diagram illustrates the boundaries of the <strong>${name}</strong> system, identifying the external entities and the primary data flows between them and the core system.</p>

<div class="my-4 p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center">
  <svg viewBox="0 0 600 200" class="w-full max-w-[500px]">
    <!-- User Entity -->
    <rect x="20" y="70" width="100" height="60" rx="6" fill="#1E2340" stroke="#6C63FF" stroke-width="2"/>
    <text x="70" y="105" fill="#F0EEF8" font-family="Space Grotesk" font-size="14" text-anchor="middle">User / Actor</text>
    
    <!-- Core System -->
    <circle cx="300" cy="100" r="60" fill="#161929" stroke="#00E5A0" stroke-width="3" stroke-dasharray="2"/>
    <text x="300" y="95" fill="#F0EEF8" font-family="Space Grotesk" font-size="14" text-anchor="middle" font-weight="bold">${name}</text>
    <text x="300" y="115" fill="#8B8FA8" font-family="JetBrains Mono" font-size="10" text-anchor="middle">Core Process</text>
    
    <!-- Database Entity -->
    <rect x="480" y="70" width="100" height="60" rx="6" fill="#1E2340" stroke="#6C63FF" stroke-width="2"/>
    <text x="530" y="105" fill="#F0EEF8" font-family="Space Grotesk" font-size="14" text-anchor="middle">${db}</text>
    
    <!-- Arrows -->
    <!-- User to System -->
    <path d="M 120 90 L 235 90" fill="none" stroke="#6C63FF" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="175" y="80" fill="#8B8FA8" font-family="Inter" font-size="9" text-anchor="middle">Input data & commands</text>
    
    <!-- System to User -->
    <path d="M 235 110 L 120 110" fill="none" stroke="#00E5A0" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="175" y="125" fill="#8B8FA8" font-family="Inter" font-size="9" text-anchor="middle">Render UI & Exports</text>
    
    <!-- System to Database -->
    <path d="M 360 90 L 475 90" fill="none" stroke="#6C63FF" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="415" y="80" fill="#8B8FA8" font-family="Inter" font-size="9" text-anchor="middle">Queries / Inserts</text>
    
    <!-- Database to System -->
    <path d="M 475 110 L 360 110" fill="none" stroke="#00E5A0" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="415" y="125" fill="#8B8FA8" font-family="Inter" font-size="9" text-anchor="middle">Datasets</text>
    
    <!-- Marker Definition -->
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#6C63FF" />
      </marker>
    </defs>
  </svg>
</div>

<h3>3.1.2 Level 1 DFD</h3>
<p>The Level 1 diagram breaks down the central system process into its constituent components: Authentication, Project Intelligence Gathering, Stack Recommendation, Document Compilation, and Kanban Export.</p>
    `,

    data_dictionary: `
<h3>3.2 Data Dictionary (Key Entity: Project Configuration)</h3>
<p>The following table defines the metadata structure stored in the <strong>${db}</strong> database to represent the project DNA and SRS structure.</p>

<table>
  <thead>
    <tr>
      <th>Field Name</th>
      <th>Data Type</th>
      <th>Constraint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>project_id</code></td>
      <td>UUID</td>
      <td>PRIMARY KEY</td>
      <td>Unique identifier for the project configuration.</td>
    </tr>
    <tr>
      <td><code>project_name</code></td>
      <td>VARCHAR(100)</td>
      <td>NOT NULL</td>
      <td>The name entered by the user during launch pad.</td>
    </tr>
    <tr>
      <td><code>description</code></td>
      <td>TEXT</td>
      <td>NULLABLE</td>
      <td>Raw sentence describing the project goals.</td>
    </tr>
    <tr>
      <td><code>stack_config</code></td>
      <td>JSONB</td>
      <td>NOT NULL</td>
      <td>Selected technologies: <em>${fe}, ${be}, ${db}, ${host}, ${auth}</em>.</td>
    </tr>
    <tr>
      <td><code>question_answers</code></td>
      <td>JSONB</td>
      <td>NOT NULL</td>
      <td>Key-value pair of all answered questionnaire prompts.</td>
    </tr>
    <tr>
      <td><code>xp_accumulated</code></td>
      <td>INTEGER</td>
      <td>DEFAULT 0</td>
      <td>Current XP earned by the architect on this setup.</td>
    </tr>
  </tbody>
</table>
    `,

    use_cases: `
<h3>3.3 Use Case Modeling</h3>
<p>The central actor is the <strong>Project Architect (User)</strong>. Secondary actors include the <strong>AI Intelligence Engine</strong> and the <strong>Export Broker</strong>.</p>

<table>
  <thead>
    <tr>
      <th>Use Case ID</th>
      <th>Use Case Name</th>
      <th>Primary Actor</th>
      <th>Preconditions</th>
      <th>Postconditions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>UC-101</code></td>
      <td>Initiate Project Scoping</td>
      <td>Project Architect</td>
      <td>None</td>
      <td>Session started, XP initialized (+50)</td>
    </tr>
    <tr>
      <td><code>UC-102</code></td>
      <td>Answer Scoping Questionnaire</td>
      <td>Project Architect</td>
      <td>Session active</td>
      <td>Project DNA mapped, dynamic profile generated</td>
    </tr>
    <tr>
      <td><code>UC-103</code></td>
      <td>Review Tech Arsenal Recommendation</td>
      <td>Project Architect / AI Engine</td>
      <td>Questionnaire complete</td>
      <td>Tech stack validated & locked</td>
    </tr>
    <tr>
      <td><code>UC-104</code></td>
      <td>Inline Edit SRS Section</td>
      <td>Project Architect</td>
      <td>SRS document generated</td>
      <td>Specific blocks updated, changes saved locally</td>
    </tr>
    <tr>
      <td><code>UC-105</code></td>
      <td>Compile and Export Document</td>
      <td>Project Architect / Export Broker</td>
      <td>All mandatory sections generated</td>
      <td>PDF, DOCX, or Markdown downloaded</td>
    </tr>
  </tbody>
</table>
    `,

    srs_overview: `
<h3>4.1 Overall Description</h3>
<p>This document acts as the formal Software Requirements Specification (SRS) for <strong>${name}</strong>. It conforms to IEEE Standard 830-1998 guidelines.</p>

<h3>4.1.1 Product Perspective</h3>
<p>The system operates as an independent client-side Single Page Application utilizing a modern decoupled stack. It connects to <strong>${auth}</strong> for security, utilizes <strong>${fe}</strong> for responsive display, executes calculations on <strong>${be}</strong>, stores states in <strong>${db}</strong>, and deploys globally to <strong>${host}</strong>.</p>

<h3>4.1.2 User Characteristics</h3>
<ul>
  <li><strong>Technical Lead / CTO:</strong> Highly experienced, seeks direct configuration exports, custom architecture control.</li>
  <li><strong>Product Manager:</strong> Focuses on functional requirements, Gantt schedules, and high-level project goals.</li>
  <li><strong>Developer:</strong> Uses the generated markdown and sprint board tasks for immediate implementation.</li>
</ul>

<h3>4.1.3 Assumptions & Dependencies</h3>
<p>The platform assumes continuous access to the selected CDN services. Exporting to PDF assumes standard CSS print drivers exist in the rendering browser viewport. Offline operation is supported through indexDB synchronization.</p>
    `,

    interface_req: `
<h3>4.2 External Interface Requirements</h3>

<h3>4.2.1 User Interface</h3>
<p>The user interface must adhere strictly to the <strong>Specky Midnight Design System</strong>:
<ul>
  <li>Main Canvas background: <code>#0D0F1A</code></li>
  <li>Surfaces, cards, and navigation sidebars: <code>#161929</code></li>
  <li>Interactive borders and dividers: <code>#1E2340</code></li>
  <li>Primary action accents & progress bars: <code>#6C63FF</code></li>
  <li>Success indicators, achievements, & XP alerts: <code>#00E5A0</code></li>
</ul>
Typography is split between <strong>Space Grotesk</strong> (for headers) and <strong>Inter</strong> (for document content). All pages must support responsive flex grids for viewport widths down to 320px.</p>

<h3>4.2.2 Software Interface</h3>
<ul>
  <li><strong>Frontend:</strong> ${fe}</li>
  <li><strong>Backend:</strong> ${be}</li>
  <li><strong>Authentication Broker:</strong> ${auth}</li>
  <li><strong>Database Layer:</strong> ${db} Connection Pool</li>
</ul>
    `,

    functional_req: `
<h3>4.3 Functional Requirements</h3>
<p>Based on your project description, the AI has generated the following core functional modules:</p>

<table>
  <thead>
    <tr>
      <th>Req ID</th>
      <th>Module Name</th>
      <th>Requirement Details</th>
      <th>Priority</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>FR-01</code></td>
      <td>Onboarding Engine</td>
      <td>System must capture the user's project name and description and issue an active Scout Badge (+50 XP).</td>
      <td>High</td>
    </tr>
    <tr>
      <td><code>FR-02</code></td>
      <td>Interactive Decision Cards</td>
      <td>The questionnaire must display one card at a time, calculating and rendering the confidence meter dynamically.</td>
      <td>High</td>
    </tr>
    <tr>
      <td><code>FR-03</code></td>
      <td>Arsenal Configurator</td>
      <td>Provide full override capabilities for Frontend (${fe}), Backend (${be}), and database (${db}) with immediate complexity updates.</td>
      <td>Medium</td>
    </tr>
    <tr>
      <td><code>FR-04</code></td>
      <td>Split-Screen Document Editor</td>
      <td>Render the draft document in a simulated page viewport side-by-side with the section checklist. Support inline rich text editing.</td>
      <td>High</td>
    </tr>
    <tr>
      <td><code>FR-05</code></td>
      <td>Kanban Board Generator</td>
      <td>Transform final functional requirements directly into draggable sprint items grouped by sprint phases.</td>
      <td>Medium</td>
    </tr>
  </tbody>
</table>
    `,

    estimations: `
<h3>5.1 Function Point Analysis</h3>
<p>Applying the standard Albrecht Function Point calculation, we estimate the size of <strong>${name}</strong> based on five complexity parameters: External Inputs (EI), External Outputs (EO), External Inquiries (EQ), Internal Logical Files (ILF), and External Interface Files (EIF).</p>

<table>
  <thead>
    <tr>
      <th>Component Type</th>
      <th>Low</th>
      <th>Average</th>
      <th>High</th>
      <th>Total Points</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>External Inputs (EI)</td>
      <td>3 × 3</td>
      <td>2 × 4</td>
      <td>1 × 6</td>
      <td>23 FP</td>
    </tr>
    <tr>
      <td>External Outputs (EO)</td>
      <td>2 × 4</td>
      <td>1 × 5</td>
      <td>2 × 7</td>
      <td>27 FP</td>
    </tr>
    <tr>
      <td>External Inquiries (EQ)</td>
      <td>4 × 3</td>
      <td>2 × 4</td>
      <td>0 × 6</td>
      <td>20 FP</td>
    </tr>
    <tr>
      <td>Internal Logical Files (ILF)</td>
      <td>1 × 7</td>
      <td>3 × 10</td>
      <td>0 × 15</td>
      <td>37 FP</td>
    </tr>
    <tr>
      <td>External Interface Files (EIF)</td>
      <td>2 × 5</td>
      <td>1 × 7</td>
      <td>0 × 10</td>
      <td>17 FP</td>
    </tr>
    <tr style="font-weight: bold; background: rgba(108, 99, 255, 0.1);">
      <td colspan="4">Total Unadjusted Function Points (UFP)</td>
      <td>124 FP</td>
    </tr>
  </tbody>
</table>

<h3>5.2 Effort & Duration Estimation</h3>
<p>Using the COCOMO II methodology for a semi-detached software project (Effort = 3.0 × (KLOC)<sup>1.12</sup> Person-Months):</p>
<ul>
  <li>Estimated lines of code (KLOC): ~6.5 KLOC</li>
  <li><strong>Calculated Effort:</strong> 24.8 Person-Months</li>
  <li><strong>Recommended Team Size:</strong> ${teamCapacity.includes("Small") ? "3" : teamCapacity.includes("Solo") ? "1" : "5"} Engineers</li>
  <li><strong>Target Timeline:</strong> ${timeline}</li>
</ul>
    `,

    scheduling: `
<h3>6.1 Project Task Scheduling (Gantt Projection)</h3>
<p>The development roadmap is divided into 4 sequential 2-week sprints, matching your overall timeline target.</p>

<div class="my-6 p-4 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
  <div class="min-w-[500px]">
    <!-- Header -->
    <div class="grid grid-cols-5 border-b border-slate-800 pb-2 text-xs font-mono text-[#8B8FA8]">
      <div>Phase / Task</div>
      <div class="text-center">W1-2</div>
      <div class="text-center">W3-4</div>
      <div class="text-center">W5-6</div>
      <div class="text-center">W7-8</div>
    </div>
    
    <!-- Sprint 1 -->
    <div class="grid grid-cols-5 py-2 items-center text-sm">
      <div class="font-semibold text-slate-300">Sprint 1: Core Setup & Auth</div>
      <div class="px-2"><div class="h-6 rounded bg-[#6C63FF] shadow-[0_0_8px_rgba(108,99,255,0.4)]"></div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    
    <!-- Sprint 2 -->
    <div class="grid grid-cols-5 py-2 items-center text-sm">
      <div class="font-semibold text-slate-300">Sprint 2: Q&A Engine & DNA</div>
      <div></div>
      <div class="px-2"><div class="h-6 rounded bg-[#6C63FF]"></div></div>
      <div></div>
      <div></div>
    </div>
    
    <!-- Sprint 3 -->
    <div class="grid grid-cols-5 py-2 items-center text-sm">
      <div class="font-semibold text-slate-300">Sprint 3: Split-Screen Editor</div>
      <div></div>
      <div></div>
      <div class="px-2"><div class="h-6 rounded bg-[#6C63FF]"></div></div>
      <div></div>
    </div>
    
    <!-- Sprint 4 -->
    <div class="grid grid-cols-5 py-2 items-center text-sm">
      <div class="font-semibold text-slate-300">Sprint 4: Exports & Kanban</div>
      <div></div>
      <div></div>
      <div></div>
      <div class="px-2"><div class="h-6 rounded bg-[#00E5A0] shadow-[0_0_8px_rgba(0,229,160,0.4)]"></div></div>
    </div>
  </div>
</div>
    `,

    risk_management: `
<h3>7.1 Risk Analysis Matrix</h3>
<p>The following table captures the critical technical, operational, and financial risks identified by the intelligence model for <strong>${name}</strong>.</p>

<table>
  <thead>
    <tr>
      <th>Risk Description</th>
      <th>Category</th>
      <th>Likelihood</th>
      <th>Impact</th>
      <th>Mitigation Strategy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Authentication Latency:</strong> Slow response times from <em>${auth}</em> during peek load.</td>
      <td>Technical</td>
      <td>Low</td>
      <td>High</td>
      <td>Implement client-side caching of session tokens and token refreshing in the background.</td>
    </tr>
    <tr>
      <td><strong>Deployment Downtime:</strong> Misconfigured Edge routing during deployment to <em>${host}</em>.</td>
      <td>Infrastructure</td>
      <td>Medium</td>
      <td>Medium</td>
      <td>Maintain secondary failover targets and use blue-green pipeline validation.</td>
    </tr>
    <tr>
      <td><strong>Scope Expansion:</strong> Expanding features beyond the initial MVP within the <em>${timeline}</em> limit.</td>
      <td>Project Management</td>
      <td>High</td>
      <td>High</td>
      <td>Strictly lock Sprint Backlog items; defer new inputs to Phase 2 scoping sessions.</td>
    </tr>
  </tbody>
</table>
    `,

    design_section: `
<h3>8.1 System Architectural Design</h3>
<p><strong>${name}</strong> follows a modern decoupled architecture. The frontend components built on <strong>${fe}</strong> communicate via secure RESTful/GraphQL APIs to the <strong>${be}</strong> server, which queries the <strong>${db}</strong> database. Authentication is handled by <strong>${auth}</strong>.</p>

<div class="my-4 p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center">
  <svg viewBox="0 0 600 240" class="w-full max-w-[500px]">
    <!-- Client Layer -->
    <rect x="220" y="10" width="160" height="40" rx="4" fill="#161929" stroke="#6C63FF" stroke-width="2"/>
    <text x="300" y="35" fill="#F0EEF8" font-family="Space Grotesk" font-size="12" text-anchor="middle">Client View (${fe})</text>
    
    <!-- API Gate/Auth -->
    <rect x="50" y="90" width="140" height="40" rx="4" fill="#161929" stroke="#E2E8F0" stroke-width="1"/>
    <text x="120" y="115" fill="#8B8FA8" font-family="Space Grotesk" font-size="11" text-anchor="middle">Security Broker (${auth})</text>
    
    <!-- Logic Layer -->
    <rect x="220" y="90" width="160" height="40" rx="4" fill="#161929" stroke="#6C63FF" stroke-width="2"/>
    <text x="300" y="115" fill="#F0EEF8" font-family="Space Grotesk" font-size="12" text-anchor="middle">Controller / Logic (${be})</text>
    
    <!-- DB Layer -->
    <rect x="220" y="170" width="160" height="40" rx="4" fill="#161929" stroke="#00E5A0" stroke-width="2"/>
    <text x="300" y="195" fill="#F0EEF8" font-family="Space Grotesk" font-size="12" text-anchor="middle">Data Layer (${db})</text>
    
    <!-- Connections -->
    <path d="M 300 50 L 300 90" fill="none" stroke="#6C63FF" stroke-width="2" marker-end="url(#arrow)"/>
    <path d="M 300 130 L 300 170" fill="none" stroke="#00E5A0" stroke-width="2" marker-end="url(#arrow)"/>
    <path d="M 220 30 L 120 30 L 120 90" fill="none" stroke="#8B8FA8" stroke-width="1.5" stroke-dasharray="3" marker-end="url(#arrow)"/>
  </svg>
</div>

<h3>8.2 Structured Pseudo Code: Database Access</h3>
<pre><code>/**
 * Initialize connection to ${db} and query project state
 * @param {string} projectId 
 */
async function fetchProjectDNA(projectId) {
  const client = await DatabasePool.connect();
  try {
    const query = "SELECT stack_config, questions_answers FROM projects WHERE id = $1";
    const result = await client.query(query, [projectId]);
    
    if (result.rows.length === 0) {
      throw new Error("Project not found");
    }
    
    return {
      success: true,
      data: result.rows[0]
    };
  } finally {
    client.release();
  }
}</code></pre>
    `,

    testing: `
<h3>9.1 Test Case Design: Project Initiation</h3>
<p>To verify the core onboarding sequence (FR-01), the following basis path test cases have been defined:</p>

<table>
  <thead>
    <tr>
      <th>TC ID</th>
      <th>Test Scenario</th>
      <th>Input Conditions</th>
      <th>Expected Output</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>TC-1</code></td>
      <td>Submit Form with Empty Name</td>
      <td>Name = "", Desc = "A simple app"</td>
      <td>Submit button disabled; focus remains on name</td>
      <td>Pass</td>
    </tr>
    <tr>
      <td><code>TC-2</code></td>
      <td>Submit Valid Project Information</td>
      <td>Name = "Specky", Desc = "Gamified scoping app"</td>
      <td>Rocket animation fires, XP increments (+50 XP), load Phase 2</td>
      <td>Pass</td>
    </tr>
    <tr>
      <td><code>TC-3</code></td>
      <td>Inspect Responsive Layout Toggle</td>
      <td>Viewport width = 360px</td>
      <td>Navigator collapses, DNA strand displays as top ticker bar</td>
      <td>Pass</td>
    </tr>
  </tbody>
</table>

<h3>9.2 Cyclomatic Complexity (Onboarding Process)</h3>
<p>The Control Flow Graph for the launch pad phase displays:
<ul>
  <li>Number of Nodes (N) = 7</li>
  <li>Number of Edges (E) = 8</li>
  <li>Connected Components (P) = 1</li>
</ul>
Applying McCabe's formula: <strong>V(G) = E - N + 2P = 8 - 7 + 2(1) = 3</strong>. This indicates a low-complexity flow with 3 independent execution paths.</p>
    `
  };
};

export const defaultQuestions = [
  {
    id: "scale",
    text: "How many users do you expect in the first 6 months?",
    type: "scale",
    options: [
      { value: "MVP Scale (< 1K)", sub: "Validating concepts with early testers", xp: 75 },
      { value: "Growth Scale (1K–50K)", sub: "Targeting public beta & startup launch", xp: 75 },
      { value: "Enterprise Scale (50K+)", sub: "Scale-ready architecture from Day 1", xp: 75 }
    ]
  },
  {
    id: "projectType",
    text: "What type of project are you building?",
    type: "multiple_choice",
    options: [
      { value: "Startup MVP", label: "MVP", sub: "Lean, speed is prioritized", xp: 75 },
      { value: "Enterprise App", label: "Enterprise", sub: "Security & stability first", xp: 75 },
      { value: "Client Delivery", label: "Client App", sub: "Fixed scope, formal specs", xp: 75 },
      { value: "Side Project", label: "Side Sandbox", sub: "Experimental, relaxed", xp: 75 }
    ]
  },
  {
    id: "teamCapacity",
    text: "What is your team development capacity?",
    type: "multiple_choice",
    options: [
      { value: "Solo Developer", label: "Solo Dev", sub: "Single engineer building all", xp: 75 },
      { value: "Small Team (2-5)", label: "Small Team", sub: "Tight-knit team, agile sync", xp: 75 },
      { value: "Full Team (5+)", label: "Large Squad", sub: "Structured roles, specialized", xp: 75 },
      { value: "Outsourced", label: "Agency", sub: "External specs, strict deliverables", xp: 75 }
    ]
  },
  {
    id: "budget",
    text: "What is your budget signaling profile?",
    type: "scale",
    options: [
      { value: "Bootstrapped / Low", sub: "Self-funded, strict server cost control", xp: 75 },
      { value: "Funded / Moderate", sub: "Pre-seed/Seed backing, optimized spend", xp: 75 },
      { value: "Enterprise Budget", sub: "Large funding, high reliability priority", xp: 75 }
    ]
  },
  {
    id: "timeline",
    text: "What is the targeted time-to-market?",
    type: "scale",
    options: [
      { value: "1–3 months", sub: "Super rapid prototyping focus", xp: 75 },
      { value: "3–6 months", sub: "Balanced MVP cycle", xp: 75 },
      { value: "6–12 months", sub: "Robust version 1.0 setup", xp: 75 }
    ]
  },
  {
    id: "platform",
    text: "What is your primary deployment target?",
    type: "multiple_choice",
    options: [
      { value: "Web Application", label: "Web", sub: "Accessible from any browser", xp: 75 },
      { value: "Mobile (iOS/Android)", label: "Mobile", sub: "Native app store delivery", xp: 75 },
      { value: "Desktop App", label: "Desktop", sub: "Electron/Tauri application", xp: 75 },
      { value: "API First / Headless", label: "API Headless", sub: "Back-end service, no UI", xp: 75 }
    ]
  },
  {
    id: "techLead",
    text: "Does the team have designated technical leadership?",
    type: "multiple_choice",
    options: [
      { value: "Yes, CTO/Architect", label: "CTO / Lead", sub: "Technical lead active", xp: 75 },
      { value: "Hiring Soon", label: "Recruiting", sub: "Looking for lead architect", xp: 75 },
      { value: "No, Need Guidance", label: "Guided Scopes", sub: "AI will direct architectural layout", xp: 75 }
    ]
  },
  {
    id: "coreProblem",
    text: "What core problem is your project solving?",
    type: "open_text",
    placeholder: "Explain the main pain point (e.g., Teams waste hours compiling reports manually...)",
    xp: 75
  }
];

export const stackArsenal = {
  frontend: [
    { value: "React", sub: "Flexible UI, component-rich library" },
    { value: "Next.js", sub: "Server components, routing, SEO-ready" },
    { value: "Vue.js", sub: "Approachable, lightweight framework" },
    { value: "Angular", sub: "Highly structured, enterprise standard" },
    { value: "Svelte", sub: "No-runtime compiler, lightweight" }
  ],
  backend: [
    { value: "Node.js (Express)", sub: "Javascript everywhere, rapid API dev" },
    { value: "Django (Python)", sub: "Batteries-included backend with ORM" },
    { value: "Laravel (PHP)", sub: "Rich framework, superb documentation" },
    { value: "Spring Boot (Java)", sub: "Enterprise scale, robust typing" },
    { value: "Ruby on Rails", sub: "Convention over configuration MVP engine" }
  ],
  database: [
    { value: "PostgreSQL", sub: "Robust SQL relational data warehousing" },
    { value: "MongoDB", sub: "Flexible document store for rich schemas" },
    { value: "MySQL", sub: "Traditional relational, ubiquitous support" },
    { value: "Supabase DB", sub: "Real-time Postgres as a service" }
  ],
  hosting: [
    { value: "Vercel", sub: "Optimized serverless Edge deployment" },
    { value: "AWS EC2/ECS", sub: "Scalable global cloud orchestration" },
    { value: "Google Cloud", sub: "Robust container & database runner" },
    { value: "Railway", sub: "Rapid dev deployment, instant startup" }
  ],
  auth: [
    { value: "Supabase Auth", sub: "JWT-based Postgres user integration" },
    { value: "Auth0", sub: "Secure, fully managed external identities" },
    { value: "Firebase Auth", sub: "Quick client-side email/social auth" },
    { value: "Custom Auth (JWT)", sub: "Direct secure node-based storage" }
  ]
};
