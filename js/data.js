// RailOptAI - Static Indian Railways Operational Master Data
// Smart India Hackathon 2026 - Production Operations Data

const RAIL_DATA = {
  systemInfo: {
    zone: "Northern Railway (NR)",
    division: "Ambala Division",
    section: "Chandigarh - Ludhiana (CHD-LDH)",
    currentSectionCode: "CHD-LDH-04",
    status: "System Operational",
    lastSync: "03 Sep 2026, 04:30 IST",
    modelVersion: "RailOpt-AI Engine v3.1 (SIH26027 Triad Core)"
  },

  // ── Indian Railways Core Enterprise Sources (SIH26027 Integration Triad) ──
  enterpriseSources: {
    tms: {
      id: "TMS",
      name: "Track Management System (TMS)",
      dept: "Engineering (P-Way)",
      status: "SYNCHRONIZED",
      badgeClass: "badge-portal-pway",
      icon: "🛤️",
      lastPoll: "2 mins ago",
      activeDefects: 4,
      overdueTasks: 2,
      criticalityWeight: 0.35,
      categories: ["USFD Ultrasonic Rail Flaws", "Track Quality Index (TQI)", "CSM Tamping Runs", "BCM Deep Screening"]
    },
    smms: {
      id: "SMMS",
      name: "Signalling Maintenance & Management System (SMMS)",
      dept: "Signal & Telecom (S&T)",
      status: "SYNCHRONIZED",
      badgeClass: "badge-portal-st",
      icon: "🚦",
      lastPoll: "1 min ago",
      activeDefects: 3,
      overdueTasks: 1,
      criticalityWeight: 0.30,
      categories: ["Point Machine Throw/Voltage", "Electronic Interlocking (EI)", "Axle Counter Resets", "Rule 3.51 Memos"]
    },
    tdms: {
      id: "TDMS",
      name: "Traction Distribution Management System (TDMS)",
      dept: "Traction Distribution (TRD)",
      status: "SYNCHRONIZED",
      badgeClass: "badge-portal-trd",
      icon: "⚡",
      lastPoll: "Just now",
      activeDefects: 2,
      overdueTasks: 1,
      criticalityWeight: 0.25,
      categories: ["25kV OHE Contact Wire Wear", "Catenary Dropper Tension", "SCADA Feeder Isolators", "Power Block Permits"]
    },
    coa: {
      id: "COA",
      name: "Control Office Application (COA)",
      dept: "Operating / Traffic Control",
      status: "LIVE STREAM",
      badgeClass: "badge-info",
      icon: "⏱️",
      lastPoll: "Real-time",
      activeTrains: 6,
      goodsForecast: 2,
      corridorHeadroomHours: "4.5 hrs",
      categories: ["Passenger Train Timetable", "Goods/Freight Forecast", "Dynamic Line Headroom", "Section Punctuality"]
    },
    bdms: {
      id: "BDMS",
      name: "Block Demand Management System (BDMS)",
      dept: "Divisional Operating / Sr. DOM",
      status: "INTEGRATED",
      badgeClass: "badge-success",
      icon: "📋",
      lastPoll: "Active",
      pendingSanctions: 1,
      categories: ["Joint Multi-Dept Disconnections", "Integrated Block Bundles", "SCR & TPC Safety Permits"]
    }
  },

  kpis: {
    pendingMaintenance: { value: 48, change: "+4 from yesterday", trend: "up", alert: true, source: "TMS+SMMS+TDMS" },
    highPriority: { value: 12, change: "Requires prompt allocation", trend: "neutral", alert: true, source: "Critical Level 1 & 2" },
    scheduledTasks: { value: 31, change: "64.5% bundled into shadow blocks", trend: "up", alert: false, source: "AI Co-Scheduler" },
    availableBlockHours: { value: "18.5 hrs", change: "Across 4 sub-sections", trend: "up", alert: false, source: "COA Headroom" },
    assetAvailability: { value: "94.2%", change: "+2.4% vs manual baseline", trend: "up", alert: false, source: "CRIS Telemetry" },
    trainConflicts: { value: 3, change: "Reduced from 12 (75% drop)", trend: "down", alert: false, source: "Conflict Resolver" }
  },

  maintenanceTasks: [
    {
      id: "MT-1042",
      source: "TMS",
      sourceBadge: "badge-portal-pway",
      sourceCode: "USFD-IMR-896",
      department: "Track",
      asset: "Rail Joint #42 (Km 54/8)",
      section: "CHD-LDH-04",
      task: "Rail joint ultrasonic inspection & gap adjustment",
      priority: "High",
      risk: "High",
      criticalityScore: 96,
      safetyUrgency: "Emergency (24h)",
      duration: "2h",
      durationHours: 2.0,
      deadline: "05 Sep",
      status: "Pending",
      teamRequired: "Track Team T-01",
      equipmentRequired: "Rail Inspection Equipment (USFD Trolley #4)",
      compatibleWith: ["MT-1044", "MT-1048", "MT-1063"],
      rdsoStandard: "RDSO/M&C/NDT/128/2007 (IMR Transverse Fissure)",
      notes: "Track circuit bonding check required immediately after inspection."
    },
    {
      id: "MT-1051",
      source: "SMMS",
      sourceBadge: "badge-portal-st",
      sourceCode: "SMMS-SIG-204",
      department: "S&T",
      asset: "Signal S-204 (Km 62/4)",
      section: "CHD-LDH-05",
      task: "Signal equipment maintenance & LED aspect check",
      priority: "High",
      risk: "Medium",
      criticalityScore: 88,
      safetyUrgency: "High (48h)",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "06 Sep",
      status: "Pending",
      teamRequired: "S&T Team S-03",
      equipmentRequired: "Signal Testing Equipment (Fail-Safe Kit #2)",
      compatibleWith: ["MT-1042"],
      rdsoStandard: "IRS:S 23/2014 LED Signal Aspects & Current Proving",
      notes: "Requires temporary point locking and block overlap clearance."
    },
    {
      id: "MT-1063",
      source: "TDMS",
      sourceBadge: "badge-portal-trd",
      sourceCode: "TDMS-OHE-044",
      department: "Traction",
      asset: "OHE Mast 44 (Km 54/6)",
      section: "CHD-LDH-04",
      task: "25kV OHE inspection & contact wire stagger measurement",
      priority: "Medium",
      risk: "Medium",
      criticalityScore: 84,
      safetyUrgency: "Medium (72h)",
      duration: "2h",
      durationHours: 2.0,
      deadline: "08 Sep",
      status: "Bundled",
      teamRequired: "Traction Team TR-01",
      equipmentRequired: "OHE Inspection Equipment (Tower Wagon TW-12)",
      compatibleWith: ["MT-1042", "MT-1044", "MT-1048"],
      rdsoStandard: "TI/SPC/OHE/FITTINGS/0130 Contact Wire Height & Stagger",
      notes: "Requires power block permit from Traction Power Controller (TPC). Bundled into Tri-Dept Shadow Block B-021."
    },
    {
      id: "MT-1044",
      source: "TMS",
      sourceBadge: "badge-portal-pway",
      sourceCode: "TMS-PNT-112A",
      department: "Track",
      asset: "Point #112A (Km 55/2)",
      section: "CHD-LDH-04",
      task: "Track geometry inspection & cross-level calibration",
      priority: "High",
      risk: "Medium",
      criticalityScore: 91,
      safetyUrgency: "High (48h)",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "05 Sep",
      status: "Bundled",
      teamRequired: "Track Team T-01",
      equipmentRequired: "Track Gauge & Calibrator (CSM-955)",
      compatibleWith: ["MT-1042", "MT-1048", "MT-1063"],
      rdsoStandard: "IRPWM Para 237 Cross-Level Tolerance",
      notes: "Part of Tri-Department Shadow Block B-021."
    },
    {
      id: "MT-1048",
      source: "SMMS",
      sourceBadge: "badge-portal-st",
      sourceCode: "SMMS-AX-008",
      department: "S&T",
      asset: "Axle Counter AX-08 (Km 54/8)",
      section: "CHD-LDH-04",
      task: "Signal equipment check & track circuit reset testing",
      priority: "Medium",
      risk: "Low",
      criticalityScore: 85,
      safetyUrgency: "Medium (72h)",
      duration: "1h",
      durationHours: 1.0,
      deadline: "06 Sep",
      status: "Bundled",
      teamRequired: "S&T Team S-03",
      equipmentRequired: "Signal Testing Equipment (Fail-Safe Kit #2)",
      compatibleWith: ["MT-1042", "MT-1044", "MT-1063"],
      rdsoStandard: "RDSO/SPN/177 Multi-Section Digital Axle Counter",
      notes: "Bundled into Tri-Department Shadow Block B-021."
    },
    {
      id: "MT-1070",
      source: "TMS",
      sourceBadge: "badge-portal-pway",
      sourceCode: "TMS-BCM-014",
      department: "Track",
      asset: "Switch Expansion Joint (Km 56/4)",
      section: "CHD-LDH-04",
      task: "Deep screening & ballast packing around SEJ-14",
      priority: "Medium",
      risk: "High",
      criticalityScore: 79,
      safetyUrgency: "Medium (96h)",
      duration: "3h",
      durationHours: 3.0,
      deadline: "09 Sep",
      status: "Pending",
      teamRequired: "Track Team T-02",
      equipmentRequired: "Tamping Machine (CSM-955)",
      compatibleWith: ["MT-1075"],
      rdsoStandard: "IRPWM Chapter 3 Deep Screening & Ballast Packing",
      notes: "Heavy tamping machine needed. Speed restriction 30 km/h post-work."
    },
    {
      id: "MT-1075",
      source: "TDMS",
      sourceBadge: "badge-portal-trd",
      sourceCode: "TDMS-CANT-108",
      department: "Traction",
      asset: "Cantilever 108/12 (Km 56/2)",
      section: "CHD-LDH-04",
      task: "Insulator cleaning & dropper tensioning",
      priority: "Low",
      risk: "Low",
      criticalityScore: 74,
      safetyUrgency: "Low (120h)",
      duration: "1.5h",
      durationHours: 1.5,
      deadline: "11 Sep",
      status: "Pending",
      teamRequired: "Traction Team TR-01",
      equipmentRequired: "OHE Inspection Equipment (Tower Wagon TW-12)",
      compatibleWith: ["MT-1070"],
      rdsoStandard: "ACTM Vol II Para 20327 Dropper Tensioning",
      notes: "Can be co-scheduled with track deep screening."
    },
    {
      id: "MT-1082",
      source: "SMMS",
      sourceBadge: "badge-portal-st",
      sourceCode: "SMMS-PM-003",
      department: "S&T",
      asset: "Point Machine PM-3 (Km 48/6)",
      section: "LDH-UMB-01",
      task: "Point machine obstacle detection and stroke test",
      priority: "High",
      risk: "High",
      criticalityScore: 94,
      safetyUrgency: "Emergency (24h)",
      duration: "1h",
      durationHours: 1.0,
      deadline: "05 Sep",
      status: "Pending",
      teamRequired: "S&T Team S-01",
      equipmentRequired: "Signal Testing Equipment (Fail-Safe Kit #1)",
      compatibleWith: [],
      rdsoStandard: "IRS:S 24/2002 Point Machine Throw & Detection",
      notes: "Critical junction point. Zero train movement allowed during throw test."
    }
  ],

  // ── Multi-Time Horizons: Daily, Weekly, Monthly (SIH26027 Requirement 4) ──
  multiHorizons: {
    activeHorizon: "daily",
    daily: {
      id: "daily",
      label: "Daily / Shift Plan (24 Hours)",
      subtitle: "Hourly corridor timeline showing passenger timetable, goods forecast, and shadow blocks",
      timebase: "00:00 — 08:00 IST",
      activeBlock: "BLOCK B-021 (02:00 — 05:00)",
      trainMovements: 7,
      headroomHours: "4.5 hrs"
    },
    weekly: {
      id: "weekly",
      label: "Rolling 7-Day Machine Block Schedule",
      subtitle: "Weekly multi-department machine coordination (BCM, CSM, Tower Wagon) minimizing train disruption",
      period: "07 Sep 2026 — 13 Sep 2026",
      days: [
        { day: "Mon (07 Sep)", machine: "CSM-955 Track Tamper", dept: "Track (TMS)", section: "Km 52–60 Up", blockTime: "01:30 — 04:30", trainsAffected: 0, status: "Approved", shadowDepts: "TMS Only" },
        { day: "Tue (08 Sep)", machine: "Tower Wagon TW-12", dept: "Traction (TDMS)", section: "Km 54–62 Up", blockTime: "02:00 — 05:00", trainsAffected: 0, status: "Approved", shadowDepts: "TDMS Only" },
        { day: "Wed (09 Sep)", machine: "Integrated Shadow Mega Block", dept: "TMS + SMMS + TDMS", section: "Km 54/8 Up", blockTime: "01:45 — 04:45", trainsAffected: 0, status: "AI Optimized", shadowDepts: "3-Dept Shadow" },
        { day: "Thu (10 Sep)", machine: "BCM-014 Deep Screening", dept: "Track (TMS)", section: "Km 72–75 Up", blockTime: "00:30 — 04:30", trainsAffected: 1, status: "COA Review", shadowDepts: "TMS + TDMS" },
        { day: "Fri (11 Sep)", machine: "Point Machine PM-3 Overhaul", dept: "S&T (SMMS)", section: "Km 48/6 Junc", blockTime: "02:30 — 04:30", trainsAffected: 0, status: "Approved", shadowDepts: "SMMS Only" },
        { day: "Sat (12 Sep)", machine: "Freight Corridor Throughput (No Machine Block)", dept: "COA Traffic", section: "Full Division", blockTime: "Full Headroom", trainsAffected: 0, status: "Freight Priority", shadowDepts: "Open Line" },
        { day: "Sun (13 Sep)", machine: "Catenary Isolator & Meggering", dept: "Traction (TDMS)", section: "Km 42–50 Up", blockTime: "02:00 — 04:30", trainsAffected: 0, status: "Scheduled", shadowDepts: "TDMS + SMMS" }
      ],
      metrics: {
        totalBlocks: 6,
        totalPossessionHours: "19.5 hrs",
        uncoordinatedHours: "31.5 hrs",
        capacitySaved: "+12.0 Hours Line Availability (+38%)",
        avgHeadwayBuffer: "38 mins"
      }
    },
    monthly: {
      id: "monthly",
      label: "Monthly 30-Day Master Maintenance Matrix",
      subtitle: "30-day divisional asset availability forecast, preventive maintenance cycles, and goods throughput",
      period: "September 2026 • Northern Railway (Ambala Division)",
      weeks: [
        { week: "Week 1 (01–07 Sep)", targetTKM: 42.5, completedTKM: 42.5, compliance: "100%", shadowBlocks: 4, lineUptime: "95.2%", status: "On Track" },
        { week: "Week 2 (08–14 Sep)", targetTKM: 48.0, completedTKM: 45.0, compliance: "93.8%", shadowBlocks: 5, lineUptime: "94.6%", status: "In Progress" },
        { week: "Week 3 (15–21 Sep)", targetTKM: 35.0, completedTKM: 35.0, compliance: "100%", shadowBlocks: 3, lineUptime: "96.1%", status: "Scheduled" },
        { week: "Week 4 (22–30 Sep)", targetTKM: 52.0, completedTKM: 49.5, compliance: "95.2%", shadowBlocks: 6, lineUptime: "94.2%", status: "Scheduled" }
      ],
      kpis: {
        plannedDowntimeManual: "168 hrs",
        optimizedDowntimeRailOptAI: "96 hrs",
        netLineCapacitySaved: "+72 Hours (+42.8% Asset Availability)",
        totalUSFDCoverage: "185 Track KM",
        interlockingRelayTests: "48 Junctions"
      }
    }
  },

  // ── Control Office Application (COA): Passenger Timetable + Goods/Freight Forecast ──
  trainSchedule: [
    {
      number: "12424",
      name: "New Delhi → Amritsar Shatabdi",
      category: "Coaching / Passenger",
      type: "Superfast / Shatabdi",
      route: "New Delhi → Amritsar",
      section: "CHD-LDH-04",
      arrival: "02:00",
      departure: "02:20",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-2",
      priorityLevel: "VIP Priority 1",
      sourceSystem: "COA Timetable"
    },
    {
      number: "BOXN-881",
      name: "Thermal Coal Freight Rake (58 BOXN)",
      category: "Goods / Freight Forecast",
      type: "Goods Freight (Heavy)",
      route: "Bathinda Siding → Panipat Thermal Power",
      section: "CHD-LDH-04",
      arrival: "01:10",
      departure: "01:40",
      status: "On Time",
      delay: "—",
      delayMinutes: 0,
      platform: "Loop Line 1",
      priorityLevel: "Freight Priority 3",
      sourceSystem: "COA Freight Forecast"
    },
    {
      number: "14631",
      name: "Dehradun → Amritsar Express",
      category: "Coaching / Passenger",
      type: "Mail / Express",
      route: "Delhi → Amritsar",
      section: "CHD-LDH-04",
      arrival: "03:20",
      departure: "03:45",
      status: "Delayed",
      delay: "10 min",
      delayMinutes: 10,
      platform: "PF-1",
      priorityLevel: "Priority 2",
      sourceSystem: "COA Timetable"
    },
    {
      number: "CONCOR-419",
      name: "Double-Stack Container Freight Rake",
      category: "Goods / Freight Forecast",
      type: "Container Freight",
      route: "ICD Dadri → Ludhiana Concor",
      section: "CHD-LDH-04",
      arrival: "04:45",
      departure: "05:15",
      status: "On Time",
      delay: "—",
      delayMinutes: 0,
      platform: "Through Main Line",
      priorityLevel: "Freight Priority 3",
      sourceSystem: "COA Freight Forecast"
    },
    {
      number: "12013",
      name: "New Delhi → Amritsar Shatabdi Express",
      category: "Coaching / Passenger",
      type: "Shatabdi",
      route: "New Delhi → Amritsar",
      section: "CHD-LDH-05",
      arrival: "05:30",
      departure: "05:50",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-3",
      priorityLevel: "VIP Priority 1",
      sourceSystem: "COA Timetable"
    },
    {
      number: "22461",
      name: "Shri Mata Vaishno Devi Katra Vande Bharat",
      category: "Coaching / Passenger",
      type: "Vande Bharat",
      route: "New Delhi → Katra",
      section: "LDH-UMB-02",
      arrival: "06:15",
      departure: "06:25",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-1",
      priorityLevel: "VIP Priority 1",
      sourceSystem: "COA Timetable"
    },
    {
      number: "12925",
      name: "Paschim Superfast Express",
      category: "Coaching / Passenger",
      type: "Superfast",
      route: "Mumbai Central → Amritsar",
      section: "CHD-LDH-04",
      arrival: "06:40",
      departure: "07:05",
      status: "Running",
      delay: "—",
      delayMinutes: 0,
      platform: "PF-2",
      priorityLevel: "Priority 2",
      sourceSystem: "COA Timetable"
    }
  ],

  // ── COA Dynamic Line Headroom & Maintenance Slots ──
  coaCorridorHeadroom: [
    { window: "01:40 — 03:20", durationMinutes: 100, availableTKM: 48, status: "Clear Headroom", bestFor: "Routine S&T / Point Machine Testing" },
    { window: "02:20 — 05:30", durationMinutes: 190, availableTKM: 56, status: "Prime Mega Block Window", bestFor: "Tri-Dept Shadow Block B-021 (TMS+SMMS+TDMS)" },
    { window: "07:15 — 09:00", durationMinutes: 105, availableTKM: 32, status: "Secondary Morning Window", bestFor: "Loop Line Inspection & OHE Isolator Check" }
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

  aiPrioritizationFormula: {
    weights: {
      safetyUrgency: 0.35,      // Emergency USFD / IMR rail fracture, point failure risk
      assetCriticality: 0.25,   // Main line vs loop, speed group A/B, traffic GMT
      coaHeadroomWindow: 0.20,  // Proximity to zero-conflict train timetable window
      deptSynergyBonus: 0.20    // 3-Dept shadow bundle feasibility (TMS + SMMS + TDMS)
    },
    equation: "Priority Score = (0.35 × SafetyRisk) + (0.25 × AssetCrit) + (0.20 × COAHeadroom) + (0.20 × DeptSynergy)"
  },

  aiRecommendation: {
    blockId: "BLOCK B-021 (TRI-DEPT MEGA BLOCK)",
    section: "CHD-LDH-04 (Up Main Line, Km 54/0–56/8)",
    originalWindow: "02:00 — 04:30 IST",
    windowDuration: "2.5 Hours",
    tasksCount: 4,
    optimizationScore: 96,
    scoreBreakdown: {
      trainHeadwaySafety: 98,
      crewUtilization: 94,
      assetUrgencyMatch: 96,
      multiDeptSynergy: 97
    },
    reasons: [
      "Zero coaching train conflicts: 150-minute clear gap between BOXN-881 (dep 01:40) and Express 14631 (arr 03:45 / loop)",
      "Eliminates high-priority USFD flaw MT-1042 (criticality 96) before mandatory 24h speed restriction trigger",
      "Co-locates Track CSM-955 Tamper with TDMS Tower Wagon TW-12 and S&T Axle Counter diagnostic teams",
      "Saves 4.0 hours of track downtime compared to separate departmental possessions",
      "Automatic single-point BDMS disconnection clearance for Engineering, Signal, and Traction"
    ],
    tasks: [
      { id: "MT-1042", dept: "Track (TMS)", title: "Rail joint ultrasonic flaw repair", duration: "2h", team: "Track Team T-01" },
      { id: "MT-1044", dept: "Track (TMS)", title: "Point 112A geometry calibration", duration: "1.5h", team: "Track Team T-01" },
      { id: "MT-1048", dept: "S&T (SMMS)", title: "Axle Counter AX-08 reset test", duration: "1h", team: "S&T Team S-03" },
      { id: "MT-1063", dept: "Traction (TDMS)", title: "25kV OHE Stagger & Mast 44 inspection", duration: "2h", team: "Traction Team TR-01" }
    ]
  },

  taskBundle: {
    bundleId: "Mega-Bundle B-021",
    section: "CHD-LDH-04 (Up Main Line)",
    title: "Tri-Department Coordinated Shadow Block",
    summary: "4 Cross-Department Tasks → Single 2.5h Corridor Possession",
    departmentsInvolved: ["TMS (Track)", "SMMS (Signalling)", "TDMS (Traction)"],
    tasks: [
      { dept: "Track", deptColor: "#0284C7", source: "TMS", title: "Rail Joint Ultrasonic Inspection", code: "MT-1042", team: "Track Team T-01", machine: "USFD Trolley #4" },
      { dept: "Track", deptColor: "#0284C7", source: "TMS", title: "Track Geometry & Point 112A", code: "MT-1044", team: "Track Team T-01", machine: "CSM-955 Tamper" },
      { dept: "S&T", deptColor: "#7C3AED", source: "SMMS", title: "Axle Counter AX-08 Calibration", code: "MT-1048", team: "S&T Team S-03", machine: "Fail-Safe Kit #2" },
      { dept: "Traction", deptColor: "#D97706", source: "TDMS", title: "25kV OHE Contact Wire Stagger", code: "MT-1063", team: "Traction Team TR-01", machine: "Tower Wagon TW-12" }
    ],
    comparison: {
      manualSeparateHours: "6.5 hrs",
      railoptIntegratedHours: "2.5 hrs",
      savedHours: "+4.0 Hours Track Availability (+61.5%)",
      trainPunctualityGain: "+18% Divisional Punctuality"
    },
    benefits: [
      { label: "Line Availability Gained", value: "+4.0 hrs capacity saved", detail: "Avoids 3 separate block disconnections totaling 6.5h down to single 2.5h window" },
      { label: "Train Disruption Avoided", value: "3 trains saved from regulation", detail: "Prevents delays to New Delhi Shatabdi (12424) and Container Freight (CONCOR-419)" },
      { label: "Tri-Dept Resource Synergy", value: "96% machine & crew utilization", detail: "CSM-955, Tower Wagon TW-12, and S&T diagnostic crew working simultaneously under one TPC permit" }
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
    requisitionId: "BDMS-NR-UMB-2026-0903-042",
    blockId: "Maintenance Block B-021",
    blockName: "Integrated Tri-Department Mega Block B-021",
    section: "CHD-LDH-04 (Km 54/0 to 56/8 Up Line)",
    time: "02:00 — 04:30 IST (150 mins)",
    tasksCount: 4,
    departments: "TMS (P-Way) + SMMS (S&T) + TDMS (TRD)",
    trainConflicts: 0,
    aiScore: "96/100",
    approverRole: "Chief Controller (Operating) / Sr. DOM Ambala Division",
    status: "Pending BDMS Sanction",
    checks: [
      { label: "Section Controller (SCR) Path & Headroom Clearance", passed: true },
      { label: "Traction Power Controller (TPC) 25kV Power Block Permit", passed: true },
      { label: "S&T Interlocking Disconnection & Axle Counter Safe Reset", passed: true },
      { label: "COA Freight Transit Slot Verification (BOXN-881 clear)", passed: true },
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
