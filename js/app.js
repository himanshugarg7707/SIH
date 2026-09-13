// RailOptAI - Enterprise Controller & Interactive Application Logic
// Indian Railways Operations Platform

document.addEventListener("DOMContentLoaded", () => {
  // ── Authentication Guard ───────────────────────────────────────────────
  if (!AUTH.requireAuth()) return;

  // ── Initialize Session UI & Strict RBAC ────────────────────────────────
  initSessionUI();
  initRBAC();

  // ── Core Modules ───────────────────────────────────────────────────────
  initNavigation();
  initDashboard();
  initMaintenanceTasks();
  initGanttPlanner();
  initDynamicReplanning();
  initTaskBundling();
  initApprovalCenter();
  initAnalyticsCharts();
  initNetworkMap();
  initUserDropdown();
  initResponsiveSidebar();
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
   Session UI — Populate header, sidebar with logged-in user data
   ========================================================================== */
function initSessionUI() {
  const session = AUTH.getSession();
  if (!session) return;
  const isPanIndia = AUTH.isPanIndia();

  const safeName = session.name || "Shri A.K. Sharma";
  const safeRole = session.roleCode || (session.roleTitle ? session.roleTitle.split(' ')[0] : "SSE");
  const safeZone = session.zone || "NR";

  // Header user profile
  const nameEl = document.getElementById("headerUserName");
  const roleEl = document.getElementById("headerUserRole");
  const avatarEl = document.getElementById("userAvatarInitial");
  const zoneLabel = document.getElementById("dropdownZoneLabel");
  const sidebarSwitch = document.getElementById("sidebarSwitchZoneLink");
  const dropdownSwitch = document.getElementById("dropdownSwitchZoneLink");

  if (nameEl) nameEl.textContent = safeName;
  if (roleEl) roleEl.textContent = `${safeRole} • ${safeZone}`;
  if (avatarEl) {
    const parts = safeName.trim().split(' ');
    avatarEl.textContent = parts[parts.length - 1].charAt(0) || 'R';
  }
  if (zoneLabel) zoneLabel.textContent = `${session.zoneName} (${isPanIndia ? 'Pan-India' : 'Active Zone'})`;

  if (sidebarSwitch) {
    if (isPanIndia) {
      sidebarSwitch.innerHTML = '🌐 View Zonal Operations →';
      sidebarSwitch.title = 'Pan-India Zonal Network Operations';
      sidebarSwitch.href = 'zone-dashboard.html';
      sidebarSwitch.style.opacity = '1';
      sidebarSwitch.style.cursor = 'pointer';
    } else {
      sidebarSwitch.innerHTML = `🔒 ${session.zone} Jurisdiction Only`;
      sidebarSwitch.title = `Jurisdiction strictly locked to ${session.zoneName} (${session.zone})`;
      sidebarSwitch.href = 'zone-dashboard.html';
      sidebarSwitch.style.opacity = '0.85';
    }
  }

  if (dropdownSwitch) {
    if (isPanIndia) {
      dropdownSwitch.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        <span>Switch Active Zone (Pan-India)</span>
      `;
      dropdownSwitch.href = "zone-dashboard.html";
    } else {
      dropdownSwitch.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>Jurisdiction: ${session.zone} (Locked)</span>
      `;
      dropdownSwitch.href = "zone-dashboard.html";
      dropdownSwitch.title = `Jurisdiction strictly restricted to ${session.zoneName}`;
    }
  }

  // Sidebar operational jurisdiction card (Tamper-Proof Authenticated Base)
  const sidebarCode = document.getElementById("sidebarZoneCode");
  const sidebarName = document.getElementById("sidebarZoneName");
  const sidebarDivName = document.getElementById("sidebarDivisionName");
  const sidebarSectionTag = document.getElementById("sidebarSectionTag");
  const sidebarRoleBadge = document.getElementById("sidebarRoleBadge");
  const sidebarSecurityBadge = document.getElementById("sidebarSecurityBadge");
  const headerCorridorBadge = document.querySelector(".section-selector-badge span");

  const divisionCorridors = {
    "Ambala": "Corridor: UMB-SIR-01 (Up Main Line)",
    "Delhi": "Corridor: RE-GGN-DLI (Up Main Line)",
    "Firozpur": "Corridor: FZR-JAT-03 (Down Main Line)",
    "Lucknow": "Corridor: LKO-CNB-02 (Up Main Line)",
    "Moradabad": "Corridor: MB-SRE-05 (Main Line)"
  };

  if (sidebarCode) sidebarCode.textContent = session.zone;
  if (sidebarName) sidebarName.textContent = session.zoneName;
  if (sidebarDivName) sidebarDivName.textContent = `${session.division} Division (${session.zone})`;
  
  if (sidebarSectionTag) {
    const corridor = divisionCorridors[session.division] || `Corridor: ${session.division} Operational Sub-Section`;
    sidebarSectionTag.innerHTML = `<span>${corridor}</span>`;
    if (headerCorridorBadge) headerCorridorBadge.textContent = corridor;
  }

  if (sidebarRoleBadge) {
    sidebarRoleBadge.textContent = `${session.roleTitle || session.roleCode} (${session.roleCode})`;
  }

  if (sidebarSecurityBadge) {
    sidebarSecurityBadge.textContent = isPanIndia 
      ? "🌐 Pan-India Clearance • Apex HQ" 
      : `🔒 Jurisdiction Locked • ${session.zone} Division ${session.division}`;
  }

  // Wire level switch buttons in duty section
  document.querySelectorAll(".level-switch-btn").forEach(btn => {
    btn.onclick = () => {
      const targetRole = btn.getAttribute("data-role");
      if (targetRole) switchActiveRole(targetRole);
    };
  });
}

/* ==========================================================================
   Responsive Sidebar & Mobile Drawer Controller
   ========================================================================== */
function initResponsiveSidebar() {
  const toggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.getElementById("appSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const appContainer = document.querySelector(".app-container");

  if (!toggleBtn || !sidebar || !appContainer) return;

  const toggleSidebar = () => {
    const isSmall = window.innerWidth <= 1100;
    if (isSmall) {
      const isOpen = sidebar.classList.toggle("drawer-open");
      if (backdrop) backdrop.classList.toggle("active", isOpen);
    } else {
      appContainer.classList.toggle("sidebar-collapsed");
    }

    // Trigger Leaflet map resize smoothly
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.RAIL_MAP && window.RAIL_MAP.map) {
        window.RAIL_MAP.map.invalidateSize();
      }
    }, 250);
  };

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("drawer-open");
      backdrop.classList.remove("active");
    });
  }

  // Close drawer when a nav link is clicked on small screen
  document.querySelectorAll(".sidebar-nav a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1100) {
        sidebar.classList.remove("drawer-open");
        if (backdrop) backdrop.classList.remove("active");
      }
    });
  });

  // Window resize handler: auto clean up drawer states
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) {
      sidebar.classList.remove("drawer-open");
      if (backdrop) backdrop.classList.remove("active");
    }
  });
}

/**
 * Switch operational role / rank cleanly across all components
 */
function switchActiveRole(roleCode) {
  const roleProfiles = {
    SSE: {
      empId: "NR-AMB-SSE-4521",
      name: "Shri A.K. Sharma",
      role: "SSE",
      title: "Senior Section Engineer",
      level: 4,
      zone: "NR",
      zoneName: "Northern Railway",
      division: "Ambala",
      isPanIndia: false
    },
    CC: {
      empId: "NR-AMB-CC-2002",
      name: "Shri V.K. Jain",
      role: "CC",
      title: "Chief Controller",
      level: 3,
      zone: "NR",
      zoneName: "Northern Railway",
      division: "Ambala",
      isPanIndia: false
    },
    DRM: {
      empId: "NR-AMB-DRM-1001",
      name: "Shri A.K. Mittal",
      role: "DRM",
      title: "Divisional Railway Manager",
      level: 2,
      zone: "NR",
      zoneName: "Northern Railway",
      division: "Ambala",
      isPanIndia: false
    },
    CRB: {
      empId: "RB-NDLS-CRB-0001",
      name: "Shri Satish Kumar",
      role: "CRB",
      title: "Chairman & CEO, Railway Board",
      level: 0,
      zone: "NR",
      zoneName: "Northern Railway",
      division: "Rail Bhavan (Apex HQ)",
      isPanIndia: true
    }
  };

  const profile = roleProfiles[roleCode] || roleProfiles.SSE;
  const currentSession = AUTH.getSession() || {};

  const updatedSession = {
    ...currentSession,
    empId: profile.empId,
    name: profile.name,
    roleCode: profile.role,
    roleTitle: profile.title,
    roleLevel: profile.level,
    zone: profile.zone,
    zoneName: profile.zoneName,
    authorizedZone: profile.zone,
    authorizedZoneName: profile.zoneName,
    division: profile.division,
    isPanIndia: profile.isPanIndia,
    permissions: ZONES_DATA.permissions[profile.role] || {}
  };

  AUTH.setSession(updatedSession);
  initSessionUI();
  initRBAC();

  if (typeof RailMap !== "undefined" && RailMap.currentData) {
    RailMap.fetchCorridorTelemetry();
  }

  if (typeof showToast === "function") {
    showToast(`Operational Clearance Switched: ${profile.title} (${profile.role}) active.`);
  }
}

/* ==========================================================================
   RBAC & Navigation Visibility
   All enterprise features remain permanently visible and accessible
   ========================================================================== */
function initRBAC() {
  const session = AUTH.getSession();
  if (!session) return;

  // Keep all navigation items and sections fully accessible
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.style.display = '';
  });
  document.querySelectorAll('.sidebar-nav .nav-group').forEach(group => {
    group.style.display = '';
  });

  // Header quick delay simulation button: always available for senior operational evaluation
  const headerDelayBtn = document.getElementById('headerSimulateDelayBtn');
  if (headerDelayBtn) {
    headerDelayBtn.style.display = 'inline-flex';
  }

  // Update active states on level switch buttons
  document.querySelectorAll('.level-switch-btn').forEach(btn => {
    if (btn.getAttribute('data-role') === session.roleCode) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const sidebarRoleBadge = document.getElementById('sidebarRoleBadge');
  if (sidebarRoleBadge) {
    sidebarRoleBadge.textContent = `${session.roleTitle || session.roleCode} (${session.roleCode})`;
  }

  // Render straightforward level-wise operational work orders
  renderLevelWiseWork(session);
}

/* ==========================================================================
   Level-Wise Operational Work Orders & Real-Time State Renderer
   Provides straightforward "What To Do Now" instructions & live telemetry
   ========================================================================== */
function renderLevelWiseWork(session) {
  const badgeTextEl = document.getElementById("levelBadgeText");
  const titleEl = document.getElementById("levelDutyTitle");
  const subtitleEl = document.getElementById("levelDutySubtitle");
  const countEl = document.getElementById("actionOrdersCount");
  const listEl = document.getElementById("whatToDoNowList");
  const howListEl = document.getElementById("howItIsWorkingList");

  if (!listEl || !howListEl) return;

  const roleCode = session.roleCode || "SSE";
  const roleLevel = session.roleLevel !== undefined ? session.roleLevel : 4;
  const currentDiv = session.division || "Ambala";
  const currentZone = session.zone || "NR";

  let badgeText = "SSE / Engineering Level Duties";
  let sectionTitle = "Daily Operational Work Orders — What To Do Now";
  let sectionSubtitle = `Direct action directives for your jurisdiction shift and real-time execution state in ${currentZone}.`;
  let orders = [];
  let telemetry = [];

  if (roleLevel >= 4) {
    // ── Level 4 & 5: Field & Sectional Engineers (SSE, JE, PWI, IOW) ───────
    badgeText = `${session.roleTitle} (Field Engineering Level)`;
    sectionTitle = `Track Maintenance & Block Execution Queue — What To Do Now`;
    sectionSubtitle = `Actionable field orders for ${currentDiv} Division (Section CHD-LDH-04 Up Main) & live safety status.`;

    orders = [
      {
        id: "IR-ENG-042",
        loc: "Km 142/4–8 Up Main (CHD-LDH-04)",
        priority: "urgent",
        priorityText: "Action Required Now",
        deadline: "Possession window: 02:00 – 05:00",
        desc: "Deploy Track Gang T-01 with ultrasonic rail flaw detector. Install emergency joggled fishplates on weld defect MT-1042 before machine tamping entry.",
        btnText: "Mark Gang Mobilized",
        successText: "✓ Gang T-01 Deployed at Km 142"
      },
      {
        id: "IR-ENG-043",
        loc: "Neutral Section Km 144 (CHD-LDH-04)",
        priority: "ready",
        priorityText: "Permit Ready",
        deadline: "TPC Permit #OHE-982 valid from 02:00",
        desc: "Coordinate with Traction Power Controller (TPC) Ambala for 25kV OHE power de-energization. Supervise placement of safety discharge earthing rods.",
        btnText: "Verify Earthing Rods",
        successText: "✓ Earthing Rods Grounded"
      },
      {
        id: "IR-ENG-044",
        loc: "Track Section Km 148/2–9",
        priority: "scheduled",
        priorityText: "Scheduled (03:30)",
        deadline: "Target completion: 04:45 hrs",
        desc: "Supervise BCM-82 ballast tamping over 1,200m track segment. Perform post-block cross-level measurement and issue track fitness speed certificate.",
        btnText: "Generate Safety Memo",
        successText: "✓ Fitness Memo CMS-2026/88 Issued"
      }
    ];

    telemetry = [
      {
        title: "Track Possession Window",
        tag: "02:00 – 05:00 hrs",
        desc: "Line CHD-LDH-04 Up Main scheduled for 3-hour consolidated shadow possession. S&T and Electrical teams bundled concurrently."
      },
      {
        title: "Single Line Working (SLW)",
        tag: "Down Main Active",
        desc: "Down Main operational for bi-directional moves at 100 km/h under Station Master Sirhind slot interlocking."
      },
      {
        title: "Gang & Machine Readiness",
        tag: "Standby at Siding 3",
        desc: "Track Gang T-01 (18 gangmen) and S&T Gang S-03 equipped with torque wrenches and ultrasonic test kits stabled at Sirhind yard."
      },
      {
        title: "Interlocking & Caution Status",
        tag: "Signals Slotted",
        desc: "Station Master Rajpura has slotted Signal 142-U to Stop. Speed restriction caution memo (30 km/h) registered in Crew CMS."
      }
    ];
  } else if (roleLevel === 3) {
    // ── Level 3: Traffic Control & Operations Command (SrDOM, CC) ─────────
    badgeText = `${session.roleTitle} (Operations Command Level)`;
    sectionTitle = `Traffic Regulation & Block Sanction Queue — What To Do Now`;
    sectionSubtitle = `Real-time line possession authorization, passenger headway clearance, and freight regulation.`;

    orders = [
      {
        id: "IR-OPS-101",
        loc: "Section CHD-LDH-04 Up Main",
        priority: "urgent",
        priorityText: "Pending Sanction",
        deadline: "Shatabdi 12424 passes at 01:38",
        desc: "Sanction 3.0h shadow possession for Block B-021 (02:00–05:00) to SSE(P-Way) Sirhind. Authorize single-line token working on Down Main.",
        btnText: "Grant Block Sanction",
        successText: "✓ Sanction Memo #SB-021 Granted"
      },
      {
        id: "IR-OPS-102",
        loc: "Rajpura Junction Yard Loop 2",
        priority: "ready",
        priorityText: "Action Required Now",
        deadline: "Hold before 01:45 hrs",
        desc: "Issue line-clear memo to Station Master Rajpura to stable loaded coal rake BCN-32 on Loop Line 2. Retain 22-min safety headway.",
        btnText: "Dispatch Line Memo",
        successText: "✓ Line Memo Dispatched to SM/RPJ"
      },
      {
        id: "IR-OPS-103",
        loc: "Corridor Ambala–Ludhiana Down Main",
        priority: "scheduled",
        priorityText: "Monitoring",
        deadline: "Passage at 04:12 hrs",
        desc: "Verify Down Main track slot is protected for Vande Bharat Express 22448 with zero passenger speed restriction detention.",
        btnText: "Lock Down Track Slot",
        successText: "✓ Slot 22448-D Locked Green"
      }
    ];

    telemetry = [
      {
        title: "Dynamic Dispatch Matrix",
        tag: "Shadow Block B-021",
        desc: "Dynamic shadow path active; passenger traffic punctuality protected at 98.4% across Ambala division."
      },
      {
        title: "Block Possession Status",
        tag: "3 Bundled Tasks",
        desc: "Civil Track, Signal S&T, and OHE Traction consolidated into single night block. Saves 2.0 hrs line detention."
      },
      {
        title: "Power Block Permit Coordination",
        tag: "TPC Confirmed",
        desc: "TPC Ambala confirmed 25kV de-energization permit scheduled for 02:00 sharp upon Shatabdi clearance."
      },
      {
        title: "Safety Headway Assurance",
        tag: "22 Min Buffer",
        desc: "Delay prediction telemetry guarantees minimum 22-minute safety separation ahead of maintenance gang entry."
      }
    ];
  } else if (roleLevel === 2) {
    // ── Level 2: Divisional Command (DRM, ADRM) ───────────────────────────
    badgeText = `${session.roleTitle} (Divisional Command Level)`;
    sectionTitle = `Divisional Maintenance & Punctuality Command — What To Do Now`;
    sectionSubtitle = `${currentDiv} Division block window quota compliance, inter-departmental clearances, and asset readiness.`;

    orders = [
      {
        id: "IR-DRM-201",
        loc: `${currentDiv} Division (All 5 Sections)`,
        priority: "urgent",
        priorityText: "Review Required",
        deadline: "Night shift possession: 18.5 hrs",
        desc: "Review and approve consolidated 18.5 hours of block possession across 4 corridors. Verify zero passenger train cancellation impact.",
        btnText: "Approve Quota Sign-off",
        successText: "✓ DRM Signed & Dispatched"
      },
      {
        id: "IR-DRM-202",
        loc: "Delhi–Ambala Golden Route",
        priority: "ready",
        priorityText: "Safety Audit",
        deadline: "Compliance cycle: September 2026",
        desc: "Verify compliance with Railway Board safety directive on ultrasonic rail flaw testing on 130 km/h high-speed passenger routes.",
        btnText: "Endorse Safety Audit",
        successText: "✓ Safety Audit Endorsed"
      }
    ];

    telemetry = [
      {
        title: "Divisional Health",
        tag: "96.2% Uptime",
        desc: `5 track machine gangs active, 0 safety violations, 96.2% asset uptime across ${currentDiv} Division.`
      },
      {
        title: "Cross-Department Synergy",
        tag: "91% Concurrency",
        desc: "Civil, S&T, and Electrical sharing 91% block concurrency, reducing line maintenance detention."
      }
    ];
  } else {
    // ── Level 0 & 1: Apex & Zonal Executive (CRB, M-OPS, GM, AGM) ─────────
    badgeText = `${session.roleTitle} (Apex Executive Level)`;
    sectionTitle = `Pan-India Network Corridor Availability — What To Do Now`;
    sectionSubtitle = `Macro corridor capacity, HDN block optimization, and national punctuality compliance across 18 railway zones.`;

    orders = [
      {
        id: "IR-APEX-001",
        loc: "Golden Quadrilateral & HDN Corridors",
        priority: "urgent",
        priorityText: "Macro Directive",
        deadline: "National possession audit: Q3",
        desc: "Audit nationwide 18-zone maintenance efficiency. Northern Railway operating at 94.2% asset uptime with 88% shadow block bundling.",
        btnText: "Issue Board Directive",
        successText: "✓ Board Directive #RB-891 Dispatched"
      },
      {
        id: "IR-APEX-002",
        loc: "All 18 Railway Zones",
        priority: "ready",
        priorityText: "Punctuality",
        deadline: "Live FOIS / COA telemetry sync",
        desc: "Review real-time delay telemetry across 1,245 daily passenger and freight movements. Verify zero unnotified line blocks.",
        btnText: "Confirm Network Telemetry",
        successText: "✓ National Telemetry Confirmed"
      }
    ];

    telemetry = [
      {
        title: "Network Utilization",
        tag: "88.4% Concurrency",
        desc: "88.4% nationwide block concurrency; 75% reduction in unplanned maintenance block cancellations."
      },
      {
        title: "Real-Time Data Links",
        tag: "FOIS / COA Active",
        desc: "Direct live API telemetry synchronization with Indian Railways Freight Operations Information System (FOIS) and Control Office Application (COA)."
      }
    ];
  }

  if (badgeTextEl) badgeTextEl.textContent = badgeText;
  if (titleEl) titleEl.textContent = sectionTitle;
  if (subtitleEl) subtitleEl.textContent = sectionSubtitle;
  if (countEl) countEl.textContent = `${orders.length} Orders Active`;

  // Render orders
  listEl.innerHTML = "";
  orders.forEach(order => {
    const item = document.createElement("div");
    item.className = "work-order-item";
    item.innerHTML = `
      <div class="work-order-top">
        <span class="work-order-code">${order.id}</span>
        <span class="work-order-priority ${order.priority}">${order.priorityText}</span>
      </div>
      <div class="work-order-loc">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>${order.loc}</span>
      </div>
      <div class="work-order-desc">${order.desc}</div>
      <div class="work-order-footer">
        <span class="work-order-deadline">${order.deadline}</span>
        <button class="work-order-btn" data-succ="${order.successText}">
          <span>${order.btnText}</span>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;

    const btn = item.querySelector(".work-order-btn");
    btn.addEventListener("click", () => {
      btn.classList.add("success");
      btn.innerHTML = btn.getAttribute("data-succ");
      btn.disabled = true;
      if (typeof showToast === "function") {
        showToast(`Action Completed: Order ${order.id} acknowledged & updated in Divisional Log.`);
      }
    });

    listEl.appendChild(item);
  });

  // Render telemetry
  howListEl.innerHTML = "";
  telemetry.forEach(tel => {
    const telItem = document.createElement("div");
    telItem.className = "how-telemetry-item";
    telItem.innerHTML = `
      <div class="how-telemetry-header">
        <span>${tel.title}</span>
        <span class="how-telemetry-tag">${tel.tag}</span>
      </div>
      <div class="how-telemetry-desc">${tel.desc}</div>
    `;
    howListEl.appendChild(telItem);
  });
}

/* ==========================================================================
   User Profile Dropdown
   ========================================================================== */
function initUserDropdown() {
  const profile = document.getElementById("headerUserProfile");
  const dropdown = document.getElementById("userDropdownMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  if (profile && dropdown) {
    profile.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open");
    });

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      AUTH.logout();
    });
  }
}

/* ==========================================================================
   Network Map Initialization
   ========================================================================== */
function initNetworkMap() {
  const sectionSelector = document.getElementById("mapSectionSelector");
  if (sectionSelector) {
    sectionSelector.addEventListener("change", () => {
      if (typeof RailMap !== "undefined") {
        RailMap.loadSection(sectionSelector.value);
      }
    });
  }
}

function showMapNotification(text) {
  let toast = document.getElementById("mapZoneToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "mapZoneToast";
    toast.style.cssText = "position:absolute;bottom:24px;left:50%;transform:translateX(-50%);background:rgba(15,23,42,0.95);color:#F8FAFC;border:1px solid #F59E0B;border-radius:8px;padding:10px 18px;font-size:12px;font-weight:600;z-index:9999;box-shadow:0 10px 25px rgba(0,0,0,0.5);display:flex;align-items:center;gap:8px;pointer-events:none;transition:opacity 0.3s ease;";
    const mapCard = document.querySelector(".network-map-container") || document.getElementById("tab-network-map") || document.body;
    if (mapCard) mapCard.appendChild(toast);
  }
  toast.innerHTML = `<span style="color:#F59E0B;">⚠️</span> ${text}`;
  toast.style.opacity = "1";
  setTimeout(() => {
    if (toast) toast.style.opacity = "0";
  }, 4000);
}

/* ==========================================================================
   Navigation & Tab Routing
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-item a, .quick-tab-link");
  
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

  // If entering network map, initialize Leaflet map
  if (tabId === "tab-network-map") {
    setTimeout(() => {
      if (typeof RailMap !== "undefined") {
        RailMap.init("networkMapContainer");
      }
    }, 100);
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
