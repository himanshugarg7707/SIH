// RailOptAI - Static Indian Railways Operational Prototype Data
// For Smart India Hackathon 2026 Evaluation

const RAIL_DATA = {
  systemInfo: {
    zone: "Northern Railway (NR)",
    division: "Ambala Division",
    section: "Chandigarh - Ludhiana (CHD-LDH)",
    currentSectionCode: "CHD-LDH-04",
    status: "System Operational",
    lastSync: "03 Sep 2026, 04:30 IST",
    modelVersion: "RailOpt-Engine v2.4 (Simulated)"
  },

  kpis: {
    pendingMaintenance: { value: 48, change: "+4 from yesterday", trend: "up", alert: true },
    highPriority: { value: 12, change: "Requires prompt allocation", trend: "neutral", alert: true },
    scheduledTasks: { value: 31, change: "64.5% bundled into blocks", trend: "up", alert: false },
    availableBlockHours: { value: "18.5 hrs", change: "Across 4 sub-sections", trend: "up", alert: false },
    assetAvailability: { value: "94.2%", change: "+2.4% vs manual baseline", trend: "up", alert: false },
    trainConflicts: { value: 3, change: "Reduced from 12 (75% drop)", trend: "down", alert: false }
  },

  maintenanceTasks: [
    {
      id: "MT-1042",
      department: "Track",
      asset: "Rail Joint #42",
      section: "CHD-LDH-04",
      task: "Rail joint ultrasonic inspection & gap adjustment",
      priority: "High",
      risk: "High",
      duration: "2h",
      durationHours: 2.0,
      deadline: "05 Sep",
      status: "Pending",
      teamRequired: "Track Team T-01",
      equipmentRequired: "Rail Inspection Equipment",
      compatibleWith: ["MT-1044", "MT-1051"],
      notes: "Track circuit bonding check required immediately after inspection."
    },
    {
      id: "MT-1051",
      department: "S&T",
      asset: "Signal S-204",
      section: "CHD-LDH-05",
      task: "Signal equipment maintenance & LED aspect check",
      priority: "High",
      risk: "Medium",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "06 Sep",
      status: "Pending",
      teamRequired: "S&T Team S-03",
      equipmentRequired: "Signal Testing Equipment",
      compatibleWith: ["MT-1042"],
      notes: "Requires temporary point locking and block overlap clearance."
    },
    {
      id: "MT-1063",
      department: "Traction",
      asset: "OHE Mast 44",
      section: "LDH-UMB-02",
      task: "OHE inspection & contact wire stagger measurement",
      priority: "Medium",
      risk: "Medium",
      duration: "2h",
      durationHours: 2.0,
      deadline: "08 Sep",
      status: "Scheduled",
      teamRequired: "Traction Team TR-01",
      equipmentRequired: "OHE Inspection Equipment",
      compatibleWith: [],
      notes: "Requires power block permit from Traction Power Controller (TPC)."
    },
    {
      id: "MT-1044",
      department: "Track",
      asset: "Point #112A",
      section: "CHD-LDH-04",
      task: "Track geometry inspection & cross-level calibration",
      priority: "High",
      risk: "Medium",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "05 Sep",
      status: "Bundled",
      teamRequired: "Track Team T-01",
      equipmentRequired: "Track Gauge & Calibrator",
      compatibleWith: ["MT-1042", "MT-1048"],
      notes: "Part of Smart Bundle B-021."
    },
    {
      id: "MT-1048",
      department: "S&T",
      asset: "Axle Counter AX-08",
      section: "CHD-LDH-04",
      task: "Signal equipment check & track circuit reset testing",
      priority: "Medium",
      risk: "Low",
      duration: "1h",
      durationHours: 1.0,
      deadline: "06 Sep",
      status: "Bundled",
      teamRequired: "S&T Team S-03",
      equipmentRequired: "Signal Testing Equipment",
      compatibleWith: ["MT-1042", "MT-1044"],
      notes: "Bundled into Block B-021."
    },
    {
      id: "MT-1070",
      department: "Track",
      asset: "Switch Expansion Joint",
      section: "CHD-LDH-04",
      task: "Deep screening & ballast packing around SEJ-14",
      priority: "Medium",
      risk: "High",
      duration: "3h",
      durationHours: 3.0,
      deadline: "09 Sep",
      status: "Pending",
      teamRequired: "Track Team T-02",
      equipmentRequired: "Tamping Machine",
      compatibleWith: ["MT-1075"],
      notes: "Heavy tamping machine needed. Speed restriction 30 km/h post-work."
    },
    {
      id: "MT-1075",
      department: "Traction",
      asset: "Cantilever 108/12",
      section: "CHD-LDH-04",
      task: "Insulator cleaning & dropper tensioning",
      priority: "Low",
      risk: "Low",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "11 Sep",
      status: "Pending",
      teamRequired: "Traction Team TR-01",
      equipmentRequired: "OHE Inspection Equipment",
      compatibleWith: ["MT-1070"],
      notes: "Can be co-scheduled with track deep screening."
    },
    {
      id: "MT-1082",
      department: "S&T",
      asset: "Point Machine PM-3",
      section: "LDH-UMB-01",
      task: "Point machine obstacle detection and stroke test",
      priority: "High",
      risk: "High",
      duration: "1h",
      durationHours: 1.0,
      deadline: "05 Sep",
      status: "Pending",
      teamRequired: "S&T Team S-01",
      equipmentRequired: "Signal Testing Equipment",
      compatibleWith: [],
      notes: "Critical junction point. Zero train movement allowed during throw test."
    }
  ],

  trainSchedule: [
    {
      number: "12424",
      name: "New Delhi → Amritsar Shatabdi",
      type: "Superfast / Shatabdi",
      route: "New Delhi → Amritsar",
      section: "CHD-LDH-04",
      arrival: "02:00",
      departure: "02:20",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-2",
      priorityLevel: "VIP Priority 1"
    },
    {
      number: "14631",
      name: "Dehradun → Amritsar Express",
      type: "Mail / Express",
      route: "Delhi → Amritsar",
      section: "CHD-LDH-04",
      arrival: "03:20",
      departure: "03:45",
      status: "Delayed",
      delay: "10 min",
      delayMinutes: 10,
      platform: "PF-1",
      priorityLevel: "Priority 2"
    },
    {
      number: "12013",
      name: "New Delhi → Amritsar Shatabdi Express",
      type: "Shatabdi",
      route: "New Delhi → Amritsar",
      section: "CHD-LDH-05",
      arrival: "05:30",
      departure: "05:50",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-3",
      priorityLevel: "VIP Priority 1"
    },
    {
      number: "22461",
      name: "Shri Mata Vaishno Devi Katra Vande Bharat",
      type: "Vande Bharat",
      route: "New Delhi → Katra",
      section: "LDH-UMB-02",
      arrival: "06:15",
      departure: "06:25",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-1",
      priorityLevel: "VIP Priority 1"
    },
    {
      number: "12925",
      name: "Paschim Superfast Express",
      type: "Superfast",
      route: "Mumbai Central → Amritsar",
      section: "CHD-LDH-04",
      arrival: "06:40",
      departure: "07:05",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-2",
      priorityLevel: "Priority 2"
    },
    {
      number: "BOXN-881",
      name: "Thermal Coal Freight rake",
      type: "Goods Freight",
      route: "Bathinda → Panipat",
      section: "CHD-LDH-04",
      arrival: "01:10",
      departure: "01:40",
      status: "On Time",
      delay: "—",
      delayMinutes: 0,
      platform: "Loop Line",
      priorityLevel: "Freight Priority 3"
    }
  ],

  resources: {
    manpower: [
      { id: "T-01", name: "Track Team T-01", department: "Track", status: "Available", statusClass: "status-available", location: "Ambala Cantt", personnel: 8, lead: "A. K. Sharma (SSE/P-Way)" },
      { id: "T-02", name: "Track Team T-02", department: "Track", status: "Assigned", statusClass: "status-assigned", location: "Sirhind Junction (Block B-019)", personnel: 6, lead: "R. P. Singh (JE/Track)" },
      { id: "S-03", name: "S&T Team S-03", department: "S&T", status: "Available", statusClass: "status-available", location: "Chandigarh Depot", personnel: 4, lead: "V. Nair (SSE/Signal)" },
      { id: "TR-02", name: "Traction Team TR-02", department: "Traction", status: "Unavailable", statusClass: "status-unavailable", location: "Ludhiana Depot (Rest Period)", personnel: 5, lead: "M. K. Joshi (SSE/OHE)" },
      { id: "TR-01", name: "Traction Team TR-01", department: "Traction", status: "Available", statusClass: "status-available", location: "Ambala Depot", personnel: 6, lead: "D. S. Verma (JE/Traction)" }
    ],
    equipment: [
      { id: "EQ-01", name: "Tamping Machine (CSM-955)", category: "Heavy Machine", status: "Available", statusClass: "status-available", location: "Track Machine Siding LDH", certValid: "30 Sep 2026" },
      { id: "EQ-02", name: "Rail Inspection Equipment (USFD Trolley #4)", category: "Ultrasonic Testing", status: "Available", statusClass: "status-available", location: "Chandigarh Tool Depot", certValid: "15 Oct 2026" },
      { id: "EQ-03", name: "Signal Testing Equipment (Fail-Safe Kit #2)", category: "Diagnostics", status: "Assigned", statusClass: "status-assigned", location: "In Use (CHD-LDH-05)", certValid: "20 Nov 2026" },
      { id: "EQ-04", name: "OHE Inspection Equipment (Tower Wagon TW-12)", category: "Overhead Electric", status: "Available", statusClass: "status-available", location: "Ambala Traction Yard", certValid: "10 Oct 2026" },
      { id: "EQ-05", name: "Ballast Regulator (BR-88)", category: "Heavy Machine", status: "Available", statusClass: "status-available", location: "Rajpura Siding", certValid: "28 Sep 2026" }
    ]
  },

  alerts: [
    {
      id: "ALT-901",
      severity: "High Priority",
      type: "danger",
      title: "MT-1042 deadline approaching",
      description: "Ultrasonic flaw detection overdue on high-density line CHD-LDH-04 within 18 hours. Requires mandatory block.",
      time: "10 min ago",
      action: "Assign Block",
      relatedTaskId: "MT-1042"
    },
    {
      id: "ALT-902",
      severity: "Operational",
      type: "warning",
      title: "Train 12424 delayed by 45 minutes",
      description: "Amritsar Shatabdi running 45m behind schedule from New Delhi. Arrival in CHD-LDH-04 shifted from 02:20 to 03:05.",
      time: "24 min ago",
      action: "Trigger Re-Plan",
      relatedTrain: "12424"
    },
    {
      id: "ALT-903",
      severity: "Resource",
      type: "warning",
      title: "Track Team T-03 unavailable",
      description: "Scheduled safety protocol training today. Team T-01 reassigned for CHD-LDH primary block corridor.",
      time: "1 hr ago",
      action: "View Roster",
      relatedTeam: "T-03"
    },
    {
      id: "ALT-904",
      severity: "AI Recommendation",
      type: "info",
      title: "Maintenance block requires re-planning",
      description: "Overlap detected with delayed train 12424 on Block B-021. AI generated optimal shifted window (03:00 — 06:00).",
      time: "2 min ago",
      action: "Review Shift",
      relatedBlock: "B-021"
    }
  ],

  aiRecommendation: {
    blockId: "BLOCK B-021",
    section: "CHD-LDH-04 (Up Main Line)",
    originalWindow: "02:00 — 05:00",
    windowDuration: "3 Hours",
    tasksCount: 3,
    optimizationScore: 94,
    scoreBreakdown: {
      trainHeadwaySafety: 98,
      crewUtilization: 92,
      assetUrgencyMatch: 95,
      weatherConditions: 90
    },
    reasons: [
      "No major passenger train conflicts between 02:00 and 05:00 in original schedule",
      "High-priority task MT-1042 deadline approaching within 18h on this exact section",
      "Required manpower (Track Team T-01 & S&T Team S-03) fully available and co-located",
      "Compatible maintenance tasks (Rail joint + Geometry + Signal check) bundled into single corridor possession",
      "Maximizes block utilization to 89% vs isolated 45% manual planning"
    ],
    tasks: [
      { id: "MT-1042", dept: "Track", title: "Rail joint inspection", duration: "2h" },
      { id: "MT-1044", dept: "Track", title: "Track geometry inspection", duration: "1.5h" },
      { id: "MT-1048", dept: "S&T", title: "Signal equipment check", duration: "1h" }
    ]
  },

  taskBundle: {
    bundleId: "Bundle B-021",
    section: "CHD-LDH-04",
    title: "High-Speed Corridor Unified Block",
    summary: "3 tasks → 1 maintenance block",
    tasks: [
      { dept: "Track", deptColor: "#0284C7", title: "Rail joint inspection", code: "MT-1042", team: "Track Team T-01" },
      { dept: "Track", deptColor: "#0284C7", title: "Track geometry inspection", code: "MT-1044", team: "Track Team T-01" },
      { dept: "S&T", deptColor: "#7C3AED", title: "Signal equipment check", code: "MT-1048", team: "S&T Team S-03" }
    ],
    benefits: [
      { label: "Block Time Saved", value: "2h block time saved", detail: "Avoids 3 separate 1.5h shutdowns (saves 2.0h total line downtime)" },
      { label: "Train Conflicts Avoided", value: "3 train conflicts avoided", detail: "Prevents secondary delays to Shatabdi & Kalka express" },
      { label: "Resource Utilization", value: "91% resource utilization", detail: "Simultaneous track & signaling crews working safely in parallel" }
    ]
  },

  rePlanningDemo: {
    baseline: {
      blockTime: "02:00 — 05:00",
      status: "Conflict Free",
      statusColor: "status-available",
      train12424Time: "02:20",
      train12424Status: "On Time",
      train14631Time: "03:45",
      train14631Status: "Delayed 10m",
      conflictExplanation: "Normal baseline operation. Shatabdi 12424 clears section before maintenance block starts or operates via chord line."
    },
    simulatedDelay: {
      delayAmount: "45 minutes",
      train12424Time: "03:05",
      train12424Status: "Delayed 45 min",
      impact: "Block affected! Train 12424 conflicts with 02:00–05:00 maintenance possession.",
      updatedBlockTime: "03:00 — 06:00",
      updatedStatus: "Conflict Free",
      updatedStatusColor: "status-available",
      aiRationale: "Shifted block possession by 60 minutes. Allows delayed Shatabdi 12424 to clear section at 03:05, while providing an uninterrupted 3-hour window prior to morning express arrivals."
    }
  },

  approvalBlock: {
    blockId: "Maintenance Block B-021",
    section: "CHD-LDH-04",
    time: "02:00 — 05:00",
    tasksCount: 3,
    departments: "Track + S&T",
    trainConflicts: 0,
    aiScore: "94/100",
    approverRole: "Chief Controller (Operating) / Sr. DOM Ambala",
    status: "Pending Approval",
    checks: [
      { label: "Section Controller (SCR) Path Clearance", passed: true },
      { label: "Traction Power Controller (TPC) Coordination", passed: true },
      { label: "S&T Interlocking & Axle Counter Bypass Isolation", passed: true },
      { label: "Emergency Breakdown Gang on Standby", passed: true }
    ]
  },

  analytics: {
    statusBreakdown: {
      completed: 58,
      pending: 32,
      overdue: 10
    },
    blockUtilization: {
      current: 86.4,
      target: 85.0,
      manualBaseline: 54.2
    },
    trainConflictsComparison: {
      manual: 12,
      railOptAI: 3,
      reductionPercent: 75
    },
    monthlyTrend: [
      { day: "Day 1", availability: 88.5, conflicts: 11 },
      { day: "Day 5", availability: 89.2, conflicts: 9 },
      { day: "Day 10", availability: 90.4, conflicts: 8 },
      { day: "Day 15", availability: 91.8, conflicts: 6 },
      { day: "Day 20", availability: 92.9, conflicts: 4 },
      { day: "Day 25", availability: 93.7, conflicts: 4 },
      { day: "Day 30", availability: 94.2, conflicts: 3 }
    ]
  }
};
