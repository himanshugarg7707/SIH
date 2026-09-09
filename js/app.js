// RailOptAI - Enterprise Controller & Interactive Application Logic
// Smart India Hackathon 2026 Prototype

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDashboard();
  initMaintenanceTasks();
  initGanttPlanner();
  initDynamicReplanning();
  initTaskBundling();
  initApprovalCenter();
  initAnalyticsCharts();
});

// Global state tracking
const appState = {
  activeTab: "dashboard",
  isDelaySimulated: false,
  isBundleApplied: false,
  isBlockApproved: false,
  tasks: [...RAIL_DATA.maintenanceTasks],
  currentGanttBlock: {
    startHour: 2.0,
    endHour: 5.0,
    title: "BLOCK B-021",
    status: "normal" // 'normal' | 'conflict' | 'shifted'
  }
};

/* ==========================================================================
   Navigation & Tab Routing
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-item a, .step-chip, .quick-tab-link");
  
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetTab = link.getAttribute("data-tab");
      if (!targetTab) return;
      
      e.preventDefault();
      switchTab(targetTab);
    });
  });

  // Top header Quick Delay Button
  const headerDelayBtn = document.getElementById("headerSimulateDelayBtn");
  if (headerDelayBtn) {
    headerDelayBtn.addEventListener("click", () => {
      switchTab("tab-replanning");
      setTimeout(() => {
        triggerDelaySimulation();
      }, 300);
    });
  }
}

function switchTab(tabId) {
  appState.activeTab = tabId;

  // Update Sidebar active state
  document.querySelectorAll(".nav-item a").forEach(a => {
    if (a.getAttribute("data-tab") === tabId) {
      a.classList.add("active");
    } else {
      a.classList.remove("active");
    }
  });

  // Update Evaluator Stepper active state
  document.querySelectorAll(".step-chip").forEach(chip => {
    if (chip.getAttribute("data-tab") === tabId) {
      chip.classList.add("active");
    } else {
      chip.classList.remove("active");
    }
  });

  // Toggle Tab Panes
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.remove("active");
  });

  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add("active");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // If entering analytics, trigger chart draw
  if (tabId === "tab-analytics") {
    renderAssetAvailabilityChart();
  }
}

/* ==========================================================================
   Dashboard KPIs and Previews
   ========================================================================== */
function initDashboard() {
  // Update KPI displays from mock data
  const kpiMap = {
    kpiPending: RAIL_DATA.kpis.pendingMaintenance.value,
    kpiHighPriority: RAIL_DATA.kpis.highPriority.value,
    kpiScheduled: RAIL_DATA.kpis.scheduledTasks.value,
    kpiBlockHours: RAIL_DATA.kpis.availableBlockHours.value,
    kpiAvailability: RAIL_DATA.kpis.assetAvailability.value,
    kpiConflicts: RAIL_DATA.kpis.trainConflicts.value
  };

  for (const [id, val] of Object.entries(kpiMap)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

/* ==========================================================================
   Maintenance Tasks Table & Real-Time Filtering
   ========================================================================== */
function initMaintenanceTasks() {
  const searchInput = document.getElementById("taskSearchInput");
  const filterDept = document.getElementById("filterDept");
  const filterPriority = document.getElementById("filterPriority");
  const filterRisk = document.getElementById("filterRisk");
  const filterSection = document.getElementById("filterSection");
  const filterStatus = document.getElementById("filterStatus");
  const resetBtn = document.getElementById("btnResetFilters");

  function renderRows() {
    const tbody = document.getElementById("tasksTableBody");
    if (!tbody) return;

    const searchTerm = (searchInput?.value || "").toLowerCase().trim();
    const deptVal = filterDept?.value || "all";
    const prioVal = filterPriority?.value || "all";
    const riskVal = filterRisk?.value || "all";
    const secVal = filterSection?.value || "all";
    const statusVal = filterStatus?.value || "all";

    const filtered = appState.tasks.filter(t => {
      const matchSearch = !searchTerm || 
        t.id.toLowerCase().includes(searchTerm) || 
        t.task.toLowerCase().includes(searchTerm) ||
        t.asset.toLowerCase().includes(searchTerm) ||
        t.section.toLowerCase().includes(searchTerm);

      const matchDept = deptVal === "all" || t.department.toLowerCase() === deptVal.toLowerCase();
      const matchPrio = prioVal === "all" || t.priority.toLowerCase() === prioVal.toLowerCase();
      const matchRisk = riskVal === "all" || t.risk.toLowerCase() === riskVal.toLowerCase();
      const matchSec = secVal === "all" || t.section.toLowerCase() === secVal.toLowerCase();
      const matchStatus = statusVal === "all" || t.status.toLowerCase() === statusVal.toLowerCase();

      return matchSearch && matchDept && matchPrio && matchRisk && matchSec && matchStatus;
    });

    tbody.innerHTML = "";

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; padding: 32px; color: var(--text-muted);">
            No maintenance tasks match the selected filter criteria.
          </td>
        </tr>`;
      return;
    }

    filtered.forEach(t => {
      const tr = document.createElement("tr");

      // Department badge class
      const deptClass = t.department === "Track" ? "dept-track" : (t.department === "S&T" ? "dept-st" : "dept-traction");
      const prioClass = t.priority === "High" ? "priority-high" : (t.priority === "Medium" ? "priority-medium" : "priority-low");
      const riskClass = t.risk === "High" ? "risk-high" : (t.risk === "Medium" ? "risk-medium" : "risk-low");
      const statusClass = `status-${t.status.toLowerCase()}`;

      tr.innerHTML = `
        <td><span class="code-mono">${t.id}</span></td>
        <td><span class="dept-pill ${deptClass}">${t.department}</span></td>
        <td><strong>${t.asset}</strong></td>
        <td><span class="code-mono" style="font-size: 11.5px;">${t.section}</span></td>
        <td style="max-width: 260px;">${t.task}</td>
        <td><span class="priority-badge ${prioClass}">${t.priority}</span></td>
        <td><span class="risk-tag ${riskClass}">● ${t.risk}</span></td>
        <td><span class="code-mono">${t.duration}</span></td>
        <td>${t.deadline}</td>
        <td><span class="status-badge ${statusClass}">${t.status}</span></td>
      `;

      tr.style.cursor = "pointer";
      tr.title = "Click to view task details and AI compatibility";
      tr.addEventListener("click", () => openTaskModal(t));

      tbody.appendChild(tr);
    });

    // Update counter
    const countEl = document.getElementById("taskFilteredCount");
    if (countEl) countEl.textContent = `Showing ${filtered.length} of ${appState.tasks.length} tasks`;
  }

  // Attach filter listeners
  [searchInput, filterDept, filterPriority, filterRisk, filterSection, filterStatus].forEach(el => {
    if (el) {
      el.addEventListener("input", renderRows);
      el.addEventListener("change", renderRows);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (filterDept) filterDept.value = "all";
      if (filterPriority) filterPriority.value = "all";
      if (filterRisk) filterRisk.value = "all";
      if (filterSection) filterSection.value = "all";
      if (filterStatus) filterStatus.value = "all";
      renderRows();
      showToast("Filters reset to default view", "info");
    });
  }

  renderRows();
}

function openTaskModal(task) {
  const modal = document.getElementById("taskDetailModal");
  const modalBody = document.getElementById("taskModalBody");
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
      <span class="code-mono" style="font-size: 16px; font-weight: 700;">${task.id} — ${task.asset}</span>
      <span class="status-badge status-${task.status.toLowerCase()}">${task.status}</span>
    </div>
    
    <p style="font-size: 14px; font-weight: 600; color: var(--ir-navy); margin-bottom: 12px;">
      ${task.task}
    </p>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #F8FAFC; padding: 14px; border-radius: 8px; margin-bottom: 16px;">
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">DEPARTMENT</span><br><strong>${task.department}</strong></div>
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">SECTION CODE</span><br><span class="code-mono">${task.section}</span></div>
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">DURATION REQ.</span><br><strong>${task.duration}</strong></div>
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">DEADLINE TARGET</span><br><strong>${task.deadline} (Urgent)</strong></div>
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">ALLOCATED CREW</span><br>${task.teamRequired}</div>
      <div><span style="font-size: 11px; color: var(--text-muted); font-weight: 700;">EQUIPMENT REQ.</span><br>${task.equipmentRequired}</div>
    </div>

    <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
      <h5 style="font-size: 12px; font-weight: 700; color: var(--ir-navy); margin-bottom: 4px;">OPERATIONAL PROTOCOL NOTE</h5>
      <p style="font-size: 12.5px; color: var(--text-secondary);">${task.notes}</p>
    </div>
  `;

  openModal("taskDetailModal");
}

/* ==========================================================================
   Gantt Block Planner Visualizer
   ========================================================================== */
function initGanttPlanner() {
  renderGanttGrid();

  // Control buttons
  const genPlanBtn = document.getElementById("btnGeneratePlan");
  const editBlockBtn = document.getElementById("btnEditBlock");
  const approveBlockBtn = document.getElementById("btnApproveFromPlanner");

  if (genPlanBtn) {
    genPlanBtn.addEventListener("click", () => {
      // Simulate AI generation sequence
      genPlanBtn.innerHTML = `
        <svg class="spin-icon" style="width:14px;height:14px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg> Optimizing Corridor...`;
      genPlanBtn.disabled = true;

      setTimeout(() => {
        genPlanBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Plan Generated (Score: 94/100)`;
        genPlanBtn.disabled = false;
        showToast("AI Block Plan generated for Section CHD-LDH-04! 3 tasks bundled with 0 train conflicts.", "success");
      }, 900);
    });
  }

  if (editBlockBtn) {
    editBlockBtn.addEventListener("click", () => {
      openModal("editBlockModal");
    });
  }

  if (approveBlockBtn) {
    approveBlockBtn.addEventListener("click", () => {
      switchTab("tab-approval");
    });
  }
}

function renderGanttGrid() {
  const container = document.getElementById("ganttRowsContainer");
  if (!container) return;

  // Timeline spans 00:00 to 08:00 (8 hours total = 100% width)
  const totalHours = 8;
  const hourToPercent = (h) => (h / totalHours) * 100;

  // Compute block placement based on state
  const blockStart = appState.currentGanttBlock.startHour;
  const blockEnd = appState.currentGanttBlock.endHour;
  const blockLeftPct = hourToPercent(blockStart);
  const blockWidthPct = hourToPercent(blockEnd - blockStart);

  // Train positions (in hours)
  const train12424Hour = appState.isDelaySimulated ? 3.08 : 2.33; // 03:05 vs 02:20
  const train14631Hour = 3.75; // 03:45
  const train12013Hour = 5.50; // 05:30

  // Block style modifier
  let blockClass = "timeline-block-card";
  let blockStatusText = "Normal Scheduled Possession";
  if (appState.currentGanttBlock.status === "conflict") {
    blockClass += " conflict-block";
    blockStatusText = "⚠️ Conflict: Train 12424 Overlap";
  } else if (appState.currentGanttBlock.status === "shifted") {
    blockClass += " shifted-block";
    blockStatusText = "🟢 Shifted Window (Conflict Free)";
  }

  container.innerHTML = `
    <!-- Track Maintenance Row -->
    <div class="gantt-row">
      <div class="row-label-cell">
        <div class="row-dept">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0284C7" stroke-width="2">
            <line x1="4" y1="4" x2="20" y2="4"></line>
            <line x1="4" y1="20" x2="20" y2="20"></line>
            <line x1="8" y1="4" x2="8" y2="20"></line>
            <line x1="16" y1="4" x2="16" y2="20"></line>
          </svg> Track (Civil)
        </div>
        <div class="row-sub">CHD-LDH Up Line</div>
      </div>
      <div class="row-content-area">
        <!-- Maintenance Block Card -->
        <div class="${blockClass}" style="left: ${blockLeftPct}%; width: ${blockWidthPct}%;" onclick="openBlockDetailsModal()">
          <div class="block-header-mini">
            <span class="block-title-text">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              </svg> ${appState.currentGanttBlock.title}
            </span>
            <span class="block-time-pill">${formatHourTime(blockStart)} — ${formatHourTime(blockEnd)}</span>
          </div>
          <div class="block-tasks-chips">
            <span class="block-chip-tag" title="Rail joint inspection">● Rail Joint (MT-1042)</span>
            <span class="block-chip-tag" title="Track geometry inspection">● Geometry (MT-1044)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- S&T Maintenance Row -->
    <div class="gantt-row">
      <div class="row-label-cell">
        <div class="row-dept">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#7C3AED" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg> S&T (Signaling)
        </div>
        <div class="row-sub">Track Circuit / Axle Counter</div>
      </div>
      <div class="row-content-area">
        <!-- Bundled S&T Window -->
        <div class="${blockClass}" style="left: ${blockLeftPct}%; width: ${blockWidthPct * 0.75}%; opacity: 0.95;" onclick="openBlockDetailsModal()">
          <div class="block-header-mini">
            <span class="block-title-text">S&T Block Slot (Bundled)</span>
            <span class="block-time-pill">${formatHourTime(blockStart)} — ${formatHourTime(blockStart + 2.25)}</span>
          </div>
          <div class="block-tasks-chips">
            <span class="block-chip-tag">● Signal S-204 Check (MT-1048)</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Traction Row -->
    <div class="gantt-row">
      <div class="row-label-cell">
        <div class="row-dept">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D97706" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg> Traction (OHE)
        </div>
        <div class="row-sub">25kV Power Feed</div>
      </div>
      <div class="row-content-area">
        <!-- Power corridor permit -->
        <div style="position: absolute; left: ${hourToPercent(6.0)}%; width: ${hourToPercent(1.5)}%; height: 46px; background: #FEF3C7; border: 1px dashed #F59E0B; border-radius: 6px; padding: 6px 10px; color: #92400E; font-size: 11px; font-weight: 600; display: flex; flex-direction: column; justify-content: center;">
          <span>⚡ Mast 44 Routine Inspection</span>
          <span style="font-family: var(--font-mono); font-size: 10px; color: #B45309;">06:00 — 07:30</span>
        </div>
      </div>
    </div>

    <!-- Train Movement Row -->
    <div class="gantt-row" style="background: #FAFAFA;">
      <div class="row-label-cell" style="background: #F8FAFC;">
        <div class="row-dept">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0F172A" stroke-width="2">
            <rect x="4" y="3" width="16" height="16" rx="2"></rect>
            <path d="M4 11h16"></path>
            <path d="M12 3v8"></path>
            <path d="m8 19-2 3"></path>
            <path d="m16 19 2 3"></path>
          </svg> Train Movement
        </div>
        <div class="row-sub">Line Occupancy / Clearing</div>
      </div>
      <div class="row-content-area" style="position: relative;">
        <!-- Train 12424 Marker -->
        <div class="train-marker ${appState.isDelaySimulated ? 'delayed' : ''}" style="left: ${hourToPercent(train12424Hour)}%;" title="Train 12424 Amritsar Shatabdi">
          <div class="train-marker-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6"></path>
            </svg> Train 12424 → ${formatHourTime(train12424Hour)} ${appState.isDelaySimulated ? '⚠️ (+45m)' : ''}
          </div>
          <div class="train-marker-line"></div>
        </div>

        <!-- Train 14631 Marker -->
        <div class="train-marker" style="left: ${hourToPercent(train14631Hour)}%;" title="Train 14631 Kalka Express">
          <div class="train-marker-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6"></path>
            </svg> Train 14631 → 03:45
          </div>
          <div class="train-marker-line"></div>
        </div>

        <!-- Train 12013 Marker -->
        <div class="train-marker" style="left: ${hourToPercent(train12013Hour)}%;" title="Train 12013 Shatabdi Express">
          <div class="train-marker-badge">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m9 18 6-6-6-6"></path>
            </svg> Train 12013 → 05:30
          </div>
          <div class="train-marker-line"></div>
        </div>
      </div>
    </div>
  `;
}

function formatHourTime(decimalHour) {
  const h = Math.floor(decimalHour);
  const m = Math.round((decimalHour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

window.openBlockDetailsModal = function() {
  const modal = document.getElementById("blockDetailModal");
  if (modal) {
    openModal("blockDetailModal");
  }
};

/* ==========================================================================
   Dynamic Re-Planning Simulation
   ========================================================================== */
function initDynamicReplanning() {
  const delayBtn = document.getElementById("btnTriggerDelaySim");
  const resetBtn = document.getElementById("btnResetDelaySim");

  if (delayBtn) {
    delayBtn.addEventListener("click", () => {
      triggerDelaySimulation();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      resetDelaySimulation();
    });
  }
}

function triggerDelaySimulation() {
  appState.isDelaySimulated = true;

  // Step 1: Show conflict state momentarily on planner and card
  appState.currentGanttBlock.status = "conflict";
  renderGanttGrid();

  const replanningContainer = document.getElementById("replanningDynamicArea");
  if (replanningContainer) {
    replanningContainer.innerHTML = `
      <div class="dynamic-state-boxes">
        <!-- Current Affected Block -->
        <div class="state-box" style="border-color: var(--signal-red);">
          <div class="state-badge-header">
            <span class="state-label">SCHEDULED POSSESSION</span>
            <span class="state-badge" style="background: #FEE2E2; color: #991B1B;">⚠️ CONFLICT DETECTED</span>
          </div>
          <div class="state-block-display" style="color: #991B1B;">02:00 — 05:00</div>
          <p style="font-size: 13px; color: var(--text-secondary);">Section CHD-LDH-04 (Up Main Line)</p>

          <div class="event-alert-bubble">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong>Train 12424 delayed by 45 minutes</strong><br>
              <span style="font-size: 11.5px; font-weight: 500;">New section entry estimated at 03:05. Ongoing 02:00 block halts train.</span>
            </div>
          </div>
        </div>

        <!-- AI Re-planned Window -->
        <div class="state-box active-state" style="border-color: var(--signal-green);">
          <div class="state-badge-header">
            <span class="state-label">AI UPDATED RECOMMENDATION</span>
            <span class="state-badge" style="background: #DCFCE7; color: #166534;">🟢 CONFLICT FREE</span>
          </div>
          <div class="state-block-display" style="color: var(--signal-green);">03:00 — 06:00</div>
          <p style="font-size: 13px; color: var(--text-secondary);">Optimal Shift (+60 min offset)</p>

          <div class="solution-bubble">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <div>
              <strong>Zero Passenger Train Conflicts</strong><br>
              <span style="font-size: 11.5px; font-weight: 500;">Permits Train 12424 to clear at 03:05. Preserves all 3 bundled maintenance tasks without crew idle time.</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // After 700ms, shift the block seamlessly on the timeline to 03:00 - 06:00
  setTimeout(() => {
    appState.currentGanttBlock.startHour = 3.0;
    appState.currentGanttBlock.endHour = 6.0;
    appState.currentGanttBlock.status = "shifted";
    renderGanttGrid();
    showToast("Dynamic Re-Planning: Maintenance Block B-021 shifted to 03:00—06:00. Conflict resolved!", "warning");
  }, 700);

  // Update Train Schedule row for 12424
  const trainStatusEl = document.getElementById("train12424StatusCell");
  const trainDelayEl = document.getElementById("train12424DelayCell");
  if (trainStatusEl) trainStatusEl.innerHTML = `<span class="status-badge" style="background: #FEE2E2; color: #991B1B;">Delayed</span>`;
  if (trainDelayEl) trainDelayEl.innerHTML = `<span style="color: var(--signal-red); font-weight: 700;">45 min</span>`;
}

function resetDelaySimulation() {
  appState.isDelaySimulated = false;
  appState.currentGanttBlock.startHour = 2.0;
  appState.currentGanttBlock.endHour = 5.0;
  appState.currentGanttBlock.status = "normal";
  renderGanttGrid();

  const replanningContainer = document.getElementById("replanningDynamicArea");
  if (replanningContainer) {
    replanningContainer.innerHTML = `
      <div class="dynamic-state-boxes">
        <div class="state-box active-state">
          <div class="state-badge-header">
            <span class="state-label">CURRENT SCHEDULED BLOCK</span>
            <span class="state-badge" style="background: #ECFDF5; color: #047857;">🟢 CONFLICT FREE</span>
          </div>
          <div class="state-block-display">02:00 — 05:00</div>
          <p style="font-size: 13px; color: var(--text-secondary);">Section CHD-LDH-04 • Up Main Line</p>
          <div style="margin-top: 14px; font-size: 12.5px; color: var(--text-secondary);">
            Normal baseline schedule. All passenger trains on-time. Click <strong>"Simulate Train Delay"</strong> above to test dynamic AI re-planning.
          </div>
        </div>

        <div class="state-box" style="opacity: 0.7; border-style: dashed;">
          <div class="state-badge-header">
            <span class="state-label">STANDBY RE-PLANNER</span>
            <span class="state-badge" style="background: #F1F5F9; color: var(--text-muted);">READY</span>
          </div>
          <div class="state-block-display" style="color: var(--text-muted);">--:-- — --:--</div>
          <p style="font-size: 13px; color: var(--text-muted);">Awaiting real-time telemetry or delay event trigger</p>
        </div>
      </div>
    `;
  }

  // Restore Train Schedule row for 12424
  const trainStatusEl = document.getElementById("train12424StatusCell");
  const trainDelayEl = document.getElementById("train12424DelayCell");
  if (trainStatusEl) trainStatusEl.innerHTML = `<span class="status-badge status-scheduled">Running</span>`;
  if (trainDelayEl) trainDelayEl.innerHTML = `—`;

  showToast("Schedule reset to baseline state", "info");
}

/* ==========================================================================
   Smart Task Bundling Action
   ========================================================================== */
function initTaskBundling() {
  const applyBundleBtn = document.getElementById("btnApplyBundle");
  if (applyBundleBtn) {
    applyBundleBtn.addEventListener("click", () => {
      applySmartBundle();
    });
  }
}

function applySmartBundle() {
  appState.isBundleApplied = true;

  // Mark tasks in state as bundled
  appState.tasks.forEach(t => {
    if (["MT-1042", "MT-1044", "MT-1048"].includes(t.id)) {
      t.status = "Bundled";
    }
  });

  const btn = document.getElementById("btnApplyBundle");
  if (btn) {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg> Bundle B-021 Applied & Active`;
    btn.style.background = "var(--signal-green)";
    btn.disabled = true;
  }

  showToast("Bundle B-021 applied! Saved 2h block time & avoided 3 train conflicts.", "success");
}

/* ==========================================================================
   Approval Center Workflow
   ========================================================================== */
function initApprovalCenter() {
  const approveBtn = document.getElementById("btnApproveBlockAction");
  const modifyBtn = document.getElementById("btnModifyBlockAction");
  const rejectBtn = document.getElementById("btnRejectBlockAction");
  const stampEl = document.getElementById("approvalStamp");

  if (approveBtn) {
    approveBtn.addEventListener("click", () => {
      appState.isBlockApproved = true;

      if (stampEl) {
        stampEl.classList.add("stamped");
      }

      const statusBadge = document.getElementById("approvalBlockStatusBadge");
      if (statusBadge) {
        statusBadge.className = "status-badge status-completed";
        statusBadge.innerHTML = `🟢 Approved by Chief Controller (Optg)`;
      }

      approveBtn.disabled = true;
      approveBtn.style.opacity = "0.7";
      approveBtn.innerHTML = `✓ Block Approved`;

      if (modifyBtn) modifyBtn.style.display = "none";
      if (rejectBtn) rejectBtn.style.display = "none";

      // Update KPI
      const kpiPending = document.getElementById("kpiPending");
      if (kpiPending) kpiPending.textContent = "45";

      showToast("Block B-021 Approved! Dispatched to Ambala Section Controller & TPC.", "success");
    });
  }

  if (modifyBtn) {
    modifyBtn.addEventListener("click", () => {
      openModal("editBlockModal");
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      showToast("Block proposal returned to AI Engine for re-generation with altered weights.", "warning");
    });
  }
}

/* ==========================================================================
   Analytics Visuals & SVG Charts
   ========================================================================== */
function initAnalyticsCharts() {
  renderAssetAvailabilityChart();
}

function renderAssetAvailabilityChart() {
  const svg = document.getElementById("availabilityTrendSvg");
  if (!svg) return;

  const data = RAIL_DATA.analytics.monthlyTrend;
  const width = 500;
  const height = 150;
  const padX = 40;
  const padY = 20;

  // Min/max for scaling
  const minVal = 87.0;
  const maxVal = 96.0;

  const points = data.map((d, i) => {
    const x = padX + (i / (data.length - 1)) * (width - padX * 2);
    const y = height - padY - ((d.availability - minVal) / (maxVal - minVal)) * (height - padY * 2);
    return { x, y, val: d.availability, day: d.day };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  let markersHtml = "";
  points.forEach(p => {
    markersHtml += `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" font-size="10" font-weight="700" fill="#0B192C">${p.val}%</text>
      <text x="${p.x}" y="${height - 4}" text-anchor="middle" font-size="9" fill="#94A3B8">${p.day}</text>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0284C7" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0284C7" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    <!-- Baseline grid lines -->
    <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="#E2E8F0" stroke-width="1"/>
    <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="#F1F5F9" stroke-dasharray="3 3"/>
    
    <!-- Gradient Fill Area -->
    <path d="${areaD}" fill="url(#availGrad)"/>
    <!-- Line -->
    <path d="${pathD}" fill="none" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
    <!-- Points & Labels -->
    ${markersHtml}
  `;
}

/* ==========================================================================
   Modals and Toasts
   ========================================================================== */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("open");
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
};

// Close modal on escape key or clicking backdrop
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.open").forEach(m => m.classList.remove("open"));
  }
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("open");
    }
  });
});

window.showToast = function(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    warning: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>`,
    danger: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
  };

  toast.innerHTML = `
    ${iconMap[type] || iconMap.info}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
