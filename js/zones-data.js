// ============================================================================
// RailOptAI — Indian Railways Zone, Division & Station Master Data
// All 18 Official Railway Zones with HQ, Divisions, Key Stations, Route Data
// ============================================================================

const ZONES_DATA = {

  // ── Zone Registry ──────────────────────────────────────────────────────────
  zones: [
    {
      code: "NR",
      name: "Northern Railway",
      hq: "New Delhi",
      color: "#0284C7",
      colorLight: "#E0F2FE",
      trackKm: 6968,
      divisions: ["Delhi", "Ambala", "Firozpur", "Lucknow", "Moradabad"],
      mapCenter: [28.6139, 77.2090],
      trainCount: 1245,
      stationCount: 764
    },
    {
      code: "NER",
      name: "North Eastern Railway",
      hq: "Gorakhpur",
      color: "#7C3AED",
      colorLight: "#F3E8FF",
      trackKm: 3667,
      divisions: ["Izzatnagar", "Lucknow (NER)", "Varanasi"],
      mapCenter: [26.7606, 83.3732],
      trainCount: 482,
      stationCount: 456
    },
    {
      code: "NFR",
      name: "Northeast Frontier Railway",
      hq: "Maligaon (Guwahati)",
      color: "#059669",
      colorLight: "#ECFDF5",
      trackKm: 3907,
      divisions: ["Alipurduar", "Katihar", "Lumding", "Rangiya", "Tinsukia"],
      mapCenter: [26.1445, 91.7362],
      trainCount: 398,
      stationCount: 512
    },
    {
      code: "ER",
      name: "Eastern Railway",
      hq: "Kolkata",
      color: "#DC2626",
      colorLight: "#FEE2E2",
      trackKm: 2414,
      divisions: ["Howrah", "Sealdah", "Asansol", "Malda"],
      mapCenter: [22.5726, 88.3639],
      trainCount: 876,
      stationCount: 598
    },
    {
      code: "SER",
      name: "South Eastern Railway",
      hq: "Kolkata (Garden Reach)",
      color: "#EA580C",
      colorLight: "#FFF7ED",
      trackKm: 2631,
      divisions: ["Adra", "Chakradharpur", "Kharagpur", "Ranchi"],
      mapCenter: [22.3372, 87.3298],
      trainCount: 542,
      stationCount: 478
    },
    {
      code: "SCR",
      name: "South Central Railway",
      hq: "Secunderabad",
      color: "#9333EA",
      colorLight: "#FAF5FF",
      trackKm: 5765,
      divisions: ["Secunderabad", "Hyderabad", "Guntakal", "Guntur", "Nanded", "Vijayawada"],
      mapCenter: [17.4399, 78.4983],
      trainCount: 1092,
      stationCount: 734
    },
    {
      code: "SR",
      name: "Southern Railway",
      hq: "Chennai",
      color: "#0891B2",
      colorLight: "#ECFEFF",
      trackKm: 4961,
      divisions: ["Chennai", "Madurai", "Palghat", "Salem", "Thiruvananthapuram", "Trichy"],
      mapCenter: [13.0827, 80.2707],
      trainCount: 1156,
      stationCount: 812
    },
    {
      code: "CR",
      name: "Central Railway",
      hq: "Mumbai (CST)",
      color: "#E11D48",
      colorLight: "#FFF1F2",
      trackKm: 3905,
      divisions: ["Mumbai", "Bhusaval", "Pune", "Solapur", "Nagpur"],
      mapCenter: [18.9398, 72.8355],
      trainCount: 1432,
      stationCount: 682
    },
    {
      code: "WR",
      name: "Western Railway",
      hq: "Mumbai (Churchgate)",
      color: "#CA8A04",
      colorLight: "#FEFCE8",
      trackKm: 6182,
      divisions: ["Mumbai Central", "Vadodara", "Ratlam", "Ahmedabad", "Rajkot", "Bhavnagar"],
      mapCenter: [18.9322, 72.8264],
      trainCount: 1378,
      stationCount: 740
    },
    {
      code: "SWR",
      name: "South Western Railway",
      hq: "Hubballi",
      color: "#16A34A",
      colorLight: "#F0FDF4",
      trackKm: 3177,
      divisions: ["Hubballi", "Bengaluru", "Mysuru"],
      mapCenter: [15.3647, 75.1240],
      trainCount: 624,
      stationCount: 432
    },
    {
      code: "NWR",
      name: "North Western Railway",
      hq: "Jaipur",
      color: "#D97706",
      colorLight: "#FFFBEB",
      trackKm: 5459,
      divisions: ["Jaipur", "Ajmer", "Bikaner", "Jodhpur"],
      mapCenter: [26.9124, 75.7873],
      trainCount: 698,
      stationCount: 562
    },
    {
      code: "WCR",
      name: "West Central Railway",
      hq: "Jabalpur",
      color: "#0D9488",
      colorLight: "#F0FDFA",
      trackKm: 2965,
      divisions: ["Jabalpur", "Bhopal", "Kota"],
      mapCenter: [23.1815, 79.9864],
      trainCount: 534,
      stationCount: 398
    },
    {
      code: "NCR",
      name: "North Central Railway",
      hq: "Prayagraj (Allahabad)",
      color: "#4F46E5",
      colorLight: "#EEF2FF",
      trackKm: 3151,
      divisions: ["Prayagraj", "Agra", "Jhansi"],
      mapCenter: [25.4358, 81.8463],
      trainCount: 612,
      stationCount: 418
    },
    {
      code: "SECR",
      name: "South East Central Railway",
      hq: "Bilaspur",
      color: "#B45309",
      colorLight: "#FFF7ED",
      trackKm: 2447,
      divisions: ["Bilaspur", "Raipur", "Nagpur (SECR)"],
      mapCenter: [22.0797, 82.1409],
      trainCount: 478,
      stationCount: 362
    },
    {
      code: "ECR",
      name: "East Central Railway",
      hq: "Hajipur",
      color: "#BE185D",
      colorLight: "#FDF2F8",
      trackKm: 3628,
      divisions: ["Danapur", "Dhanbad", "Mughal Sarai", "Samastipur", "Sonpur"],
      mapCenter: [25.6871, 85.2049],
      trainCount: 756,
      stationCount: 534
    },
    {
      code: "ECoR",
      name: "East Coast Railway",
      hq: "Bhubaneswar",
      color: "#2563EB",
      colorLight: "#EFF6FF",
      trackKm: 2572,
      divisions: ["Khurda Road", "Sambalpur", "Waltair"],
      mapCenter: [20.2961, 85.8245],
      trainCount: 542,
      stationCount: 412
    },
    {
      code: "MR",
      name: "Metro Railway Kolkata",
      hq: "Kolkata",
      color: "#6D28D9",
      colorLight: "#F5F3FF",
      trackKm: 33,
      divisions: ["Kolkata Metro"],
      mapCenter: [22.5726, 88.3639],
      trainCount: 216,
      stationCount: 32
    },
    {
      code: "KR",
      name: "Konkan Railway",
      hq: "Navi Mumbai",
      color: "#15803D",
      colorLight: "#F0FDF4",
      trackKm: 756,
      divisions: ["Ratnagiri", "Karwar"],
      mapCenter: [17.0005, 73.3001],
      trainCount: 186,
      stationCount: 68
    }
  ],

  // ── Key Stations with Coordinates (for map markers) ────────────────────────
  stations: {
    NR: [
      { name: "New Delhi", code: "NDLS", lat: 28.6417, lng: 77.2194, type: "junction" },
      { name: "Old Delhi", code: "DLI", lat: 28.6608, lng: 77.2271, type: "junction" },
      { name: "Ambala Cantt", code: "UMB", lat: 30.3577, lng: 76.7960, type: "junction" },
      { name: "Chandigarh", code: "CDG", lat: 30.6920, lng: 76.7879, type: "terminal" },
      { name: "Ludhiana", code: "LDH", lat: 30.8901, lng: 75.8573, type: "junction" },
      { name: "Amritsar", code: "ASR", lat: 31.6340, lng: 74.8723, type: "junction" },
      { name: "Lucknow NR", code: "LKO", lat: 26.8333, lng: 80.9231, type: "junction" },
      { name: "Moradabad", code: "MB", lat: 28.8389, lng: 78.7768, type: "junction" },
      { name: "Saharanpur", code: "SRE", lat: 29.9649, lng: 77.5522, type: "station" },
      { name: "Firozpur", code: "FZR", lat: 30.9331, lng: 74.6133, type: "junction" },
      { name: "Pathankot", code: "PTK", lat: 32.2747, lng: 75.6421, type: "junction" },
      { name: "Jammu Tawi", code: "JAT", lat: 32.7174, lng: 74.8618, type: "terminal" },
      { name: "Delhi Cantt", code: "DEC", lat: 28.5910, lng: 77.1215, type: "junction" },
      { name: "Gurugram", code: "GGN", lat: 28.4682, lng: 77.0175, type: "junction" },
      { name: "Garhi Harsaru", code: "GHH", lat: 28.4414, lng: 76.9381, type: "junction" },
      { name: "Pataudi Road", code: "PTRD", lat: 28.3283, lng: 76.7865, type: "station" },
      { name: "Rewari Jn", code: "RE", lat: 28.1968, lng: 76.6190, type: "junction" },
      { name: "Vaishno Devi Katra", code: "SVDK", lat: 32.9915, lng: 74.9318, type: "terminal" }
    ],
    NER: [
      { name: "Gorakhpur", code: "GKP", lat: 26.7606, lng: 83.3732, type: "junction" },
      { name: "Lucknow (NER)", code: "LJN", lat: 26.8598, lng: 80.9550, type: "junction" },
      { name: "Varanasi", code: "BSB", lat: 25.3188, lng: 83.0142, type: "junction" },
      { name: "Izzatnagar", code: "IZN", lat: 28.8263, lng: 79.4071, type: "junction" }
    ],
    NFR: [
      { name: "Guwahati", code: "GHY", lat: 26.1804, lng: 91.7535, type: "junction" },
      { name: "New Jalpaiguri", code: "NJP", lat: 26.7040, lng: 88.4236, type: "junction" },
      { name: "Dibrugarh", code: "DBRG", lat: 27.4739, lng: 94.9037, type: "terminal" },
      { name: "Katihar", code: "KIR", lat: 25.5508, lng: 87.5718, type: "junction" }
    ],
    ER: [
      { name: "Howrah", code: "HWH", lat: 22.5834, lng: 88.3426, type: "terminal" },
      { name: "Sealdah", code: "SDAH", lat: 22.5693, lng: 88.3707, type: "terminal" },
      { name: "Asansol", code: "ASN", lat: 23.6850, lng: 86.9530, type: "junction" },
      { name: "Malda Town", code: "MLDT", lat: 25.0098, lng: 88.1455, type: "junction" }
    ],
    SER: [
      { name: "Kharagpur", code: "KGP", lat: 22.3321, lng: 87.3354, type: "junction" },
      { name: "Tatanagar", code: "TATA", lat: 22.7928, lng: 86.1875, type: "junction" },
      { name: "Ranchi", code: "RNC", lat: 23.3430, lng: 85.3184, type: "junction" },
      { name: "Chakradharpur", code: "CKP", lat: 22.6895, lng: 85.6265, type: "junction" }
    ],
    SCR: [
      { name: "Secunderabad", code: "SC", lat: 17.4344, lng: 78.5013, type: "junction" },
      { name: "Hyderabad", code: "HYB", lat: 17.3810, lng: 78.4866, type: "terminal" },
      { name: "Vijayawada", code: "BZA", lat: 16.5175, lng: 80.6172, type: "junction" },
      { name: "Tirupati", code: "TPTY", lat: 13.6288, lng: 79.4192, type: "junction" }
    ],
    SR: [
      { name: "Chennai Central", code: "MAS", lat: 13.0827, lng: 80.2752, type: "terminal" },
      { name: "Chennai Egmore", code: "MS", lat: 13.0738, lng: 80.2609, type: "terminal" },
      { name: "Madurai", code: "MDU", lat: 9.9195, lng: 78.1228, type: "junction" },
      { name: "Thiruvananthapuram", code: "TVC", lat: 8.4875, lng: 76.9525, type: "terminal" },
      { name: "Coimbatore", code: "CBE", lat: 11.0018, lng: 76.9558, type: "junction" }
    ],
    CR: [
      { name: "Mumbai CSMT", code: "CSMT", lat: 18.9398, lng: 72.8355, type: "terminal" },
      { name: "Pune", code: "PUNE", lat: 18.5285, lng: 73.8742, type: "junction" },
      { name: "Nagpur", code: "NGP", lat: 21.1485, lng: 79.0882, type: "junction" },
      { name: "Bhusaval", code: "BSL", lat: 21.0463, lng: 75.7828, type: "junction" },
      { name: "Solapur", code: "SUR", lat: 17.6599, lng: 75.9064, type: "junction" }
    ],
    WR: [
      { name: "Mumbai Central", code: "BCT", lat: 18.9691, lng: 72.8193, type: "terminal" },
      { name: "Ahmedabad", code: "ADI", lat: 23.0258, lng: 72.6003, type: "junction" },
      { name: "Vadodara", code: "BRC", lat: 22.3100, lng: 73.1812, type: "junction" },
      { name: "Rajkot", code: "RJT", lat: 22.3039, lng: 70.8022, type: "junction" },
      { name: "Surat", code: "ST", lat: 21.2053, lng: 72.8413, type: "junction" }
    ],
    SWR: [
      { name: "Bengaluru", code: "SBC", lat: 12.9778, lng: 77.5700, type: "junction" },
      { name: "Mysuru", code: "MYS", lat: 12.2958, lng: 76.6394, type: "junction" },
      { name: "Hubballi", code: "UBL", lat: 15.3518, lng: 75.1361, type: "junction" }
    ],
    NWR: [
      { name: "Jaipur", code: "JP", lat: 26.9196, lng: 75.7878, type: "junction" },
      { name: "Jodhpur", code: "JU", lat: 26.2889, lng: 73.0243, type: "junction" },
      { name: "Ajmer", code: "AII", lat: 26.4521, lng: 74.6399, type: "junction" },
      { name: "Bikaner", code: "BKN", lat: 28.0229, lng: 73.3119, type: "junction" }
    ],
    WCR: [
      { name: "Jabalpur", code: "JBP", lat: 23.1687, lng: 79.9501, type: "junction" },
      { name: "Bhopal", code: "BPL", lat: 23.2688, lng: 77.4121, type: "junction" },
      { name: "Kota", code: "KOTA", lat: 25.1797, lng: 75.8640, type: "junction" }
    ],
    NCR: [
      { name: "Prayagraj", code: "PRYJ", lat: 25.4358, lng: 81.8403, type: "junction" },
      { name: "Agra Cantt", code: "AGC", lat: 27.1553, lng: 78.0081, type: "junction" },
      { name: "Jhansi", code: "JHS", lat: 25.4470, lng: 78.5796, type: "junction" },
      { name: "Kanpur Central", code: "CNB", lat: 26.4600, lng: 80.3487, type: "junction" }
    ],
    SECR: [
      { name: "Bilaspur", code: "BSP", lat: 22.0797, lng: 82.1409, type: "junction" },
      { name: "Raipur", code: "R", lat: 21.2381, lng: 81.6337, type: "junction" },
      { name: "Nagpur (SECR)", code: "NGPS", lat: 21.1485, lng: 79.0882, type: "junction" }
    ],
    ECR: [
      { name: "Hajipur", code: "HJP", lat: 25.6871, lng: 85.2049, type: "junction" },
      { name: "Patna", code: "PNBE", lat: 25.6050, lng: 85.1342, type: "junction" },
      { name: "Dhanbad", code: "DHN", lat: 23.7957, lng: 86.4304, type: "junction" },
      { name: "Mughal Sarai", code: "DDU", lat: 25.2826, lng: 83.1147, type: "junction" }
    ],
    ECoR: [
      { name: "Bhubaneswar", code: "BBS", lat: 20.2692, lng: 85.8427, type: "junction" },
      { name: "Visakhapatnam", code: "VSKP", lat: 17.7215, lng: 83.2885, type: "junction" },
      { name: "Sambalpur", code: "SBP", lat: 21.4669, lng: 83.9812, type: "junction" }
    ],
    MR: [
      { name: "Dum Dum", code: "DUMU", lat: 22.6228, lng: 88.4230, type: "metro" },
      { name: "Kavi Subhash", code: "KVSH", lat: 22.4896, lng: 88.3820, type: "metro" }
    ],
    KR: [
      { name: "Ratnagiri", code: "RN", lat: 16.9944, lng: 73.3001, type: "station" },
      { name: "Madgaon", code: "MAO", lat: 15.2993, lng: 74.1240, type: "junction" },
      { name: "Karwar", code: "KAWR", lat: 14.8135, lng: 74.1322, type: "station" },
      { name: "Roha", code: "ROHA", lat: 18.4387, lng: 73.1178, type: "junction" }
    ]
  },

  // ── Major Route Polylines per Zone (simplified for performance) ─────────
  routes: {
    NR: [
      { name: "Delhi–Ambala–Chandigarh", coords: [[28.64,77.22],[28.92,77.13],[29.38,77.02],[29.96,77.55],[30.36,76.80],[30.69,76.79]] },
      { name: "Delhi–Ludhiana–Amritsar", coords: [[28.64,77.22],[28.92,77.13],[29.96,77.55],[30.36,76.80],[30.89,75.86],[31.63,74.87]] },
      { name: "Delhi–Lucknow", coords: [[28.64,77.22],[28.43,77.68],[27.88,79.41],[27.18,79.97],[26.83,80.92]] },
      { name: "Delhi–Jammu", coords: [[28.64,77.22],[29.96,77.55],[30.36,76.80],[31.63,74.87],[32.27,75.64],[32.72,74.86]] },
      { name: "Delhi–Gurugram–Rewari Corridor", coords: [[28.6417,77.2194],[28.5910,77.1215],[28.4682,77.0175],[28.4414,76.9381],[28.3283,76.7865],[28.1968,76.6190]] }
    ],
    ER: [
      { name: "Howrah–Asansol–Malda", coords: [[22.58,88.34],[22.98,88.14],[23.23,87.86],[23.68,86.95],[24.22,87.54],[25.01,88.15]] },
      { name: "Howrah–Sealdah Link", coords: [[22.58,88.34],[22.57,88.37]] }
    ],
    SR: [
      { name: "Chennai–Madurai–Trivandrum", coords: [[13.08,80.28],[12.69,79.98],[11.94,79.82],[11.00,76.96],[10.52,76.21],[9.92,78.12],[8.49,76.95]] },
      { name: "Chennai–Coimbatore", coords: [[13.08,80.28],[12.69,79.98],[11.94,79.82],[11.00,76.96]] }
    ],
    CR: [
      { name: "Mumbai–Pune", coords: [[18.94,72.84],[18.85,73.28],[18.53,73.87]] },
      { name: "Mumbai–Nagpur", coords: [[18.94,72.84],[19.18,73.02],[20.01,73.80],[20.55,74.53],[21.05,75.78],[21.15,79.09]] }
    ],
    WR: [
      { name: "Mumbai–Ahmedabad", coords: [[18.97,72.82],[19.99,73.13],[20.37,72.90],[21.21,72.84],[21.77,72.15],[22.31,73.18],[23.03,72.60]] },
      { name: "Ahmedabad–Rajkot", coords: [[23.03,72.60],[22.30,71.20],[22.30,70.80]] }
    ],
    SCR: [
      { name: "Secunderabad–Vijayawada", coords: [[17.43,78.50],[17.07,78.59],[16.74,79.26],[16.52,80.62]] },
      { name: "Secunderabad–Tirupati", coords: [[17.43,78.50],[16.30,78.33],[14.68,78.05],[13.63,79.42]] }
    ],
    SWR: [
      { name: "Bengaluru–Mysuru", coords: [[12.98,77.57],[12.53,77.17],[12.30,76.64]] },
      { name: "Bengaluru–Hubballi", coords: [[12.98,77.57],[13.33,77.12],[14.17,76.40],[15.35,75.14]] }
    ],
    NWR: [
      { name: "Jaipur–Ajmer–Jodhpur", coords: [[26.92,75.79],[26.45,74.64],[26.29,73.02]] },
      { name: "Jaipur–Bikaner", coords: [[26.92,75.79],[27.60,75.15],[28.02,73.31]] }
    ],
    NCR: [
      { name: "Prayagraj–Agra–Delhi", coords: [[25.44,81.84],[26.46,80.35],[27.16,78.01],[28.64,77.22]] },
      { name: "Jhansi–Agra", coords: [[25.45,78.58],[26.23,78.18],[27.16,78.01]] }
    ]
  },

  // ── Role Hierarchy ─────────────────────────────────────────────────────────
  roles: [
    { level: 0, code: "CRB", title: "Chairman & CEO, Railway Board", description: "Apex Executive — Pan-India Oversight & Authority" },
    { level: 0, code: "M-OPS", title: "Member (Operations & BD)", description: "Apex Operations — Pan-India Network Control" },
    { level: 1, code: "GM", title: "General Manager", description: "Zonal Head — Full zone oversight (Home Zone only)" },
    { level: 1, code: "AGM", title: "Additional General Manager", description: "Deputy Zonal Head (Home Zone only)" },
    { level: 2, code: "DRM", title: "Divisional Railway Manager", description: "Divisional Head — Full division control" },
    { level: 2, code: "ADRM", title: "Additional DRM", description: "Deputy Divisional Head" },
    { level: 3, code: "SrDOM", title: "Senior Div. Operations Manager", description: "Operations Command — Block approvals" },
    { level: 3, code: "CC", title: "Chief Controller", description: "Train Control — Schedule management" },
    { level: 4, code: "SSE", title: "Senior Section Engineer", description: "Engineering — Maintenance planning" },
    { level: 4, code: "JE", title: "Junior Engineer", description: "Field engineering — Task execution" },
    { level: 5, code: "IOW", title: "Inspector of Works", description: "Inspection — Quality & compliance" },
    { level: 5, code: "PWI", title: "Permanent Way Inspector", description: "Track inspection — Section patrol" }
  ],

  // ── Role-Based Access Control Permissions ──────────────────────────────────
  // Enterprise platform: All operational and senior features are accessible across roles
  permissions: {
    CRB:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    "M-OPS": { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    GM:    { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    AGM:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    DRM:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    ADRM:  { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    SrDOM: { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    CC:    { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    SSE:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    JE:    { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    IOW:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true },
    PWI:   { dashboard: true, tasks: true, planner: true, aiRecom: true, bundling: true, replanning: true, schedule: true, resources: true, alerts: true, analytics: true, approval: true, networkMap: true, zoneDashboard: true, canApprove: true, canModify: true, crossZone: true, isPanIndia: true }
  },

  // ── India Map Zone SVG Paths (simplified boundary paths for zone dashboard) ─
  zoneMapPaths: {
    NR:   "M200,80 L280,80 L290,140 L250,180 L200,200 L170,170 L160,120 Z",
    NER:  "M250,180 L290,140 L330,150 L340,200 L300,220 L260,210 Z",
    NFR:  "M340,100 L420,90 L440,130 L420,160 L370,160 L340,140 Z",
    ER:   "M300,220 L340,200 L370,220 L360,260 L320,270 L290,250 Z",
    SER:  "M290,250 L320,270 L340,300 L310,320 L270,300 L260,270 Z",
    SCR:  "M200,320 L260,300 L280,340 L260,380 L220,390 L190,370 Z",
    SR:   "M190,370 L220,390 L240,430 L220,480 L190,470 L170,430 L175,390 Z",
    CR:   "M130,260 L190,250 L200,300 L190,340 L150,330 L120,300 Z",
    WR:   "M80,180 L130,180 L140,230 L130,280 L90,280 L60,240 Z",
    SWR:  "M170,370 L190,370 L210,410 L190,440 L160,430 L150,400 Z",
    NWR:  "M100,100 L170,90 L200,130 L200,180 L150,200 L100,170 L80,130 Z",
    WCR:  "M190,200 L240,210 L250,250 L230,280 L190,270 L170,240 Z",
    NCR:  "M200,180 L250,180 L260,220 L240,250 L200,250 L190,220 Z",
    SECR: "M260,270 L290,260 L310,290 L300,320 L270,320 L250,300 Z",
    ECR:  "M250,180 L300,190 L310,220 L300,250 L260,240 L240,210 Z",
    ECoR: "M280,300 L320,280 L340,310 L330,350 L300,360 L270,340 Z",
    MR:   "M330,240 L340,240 L340,250 L330,250 Z",
    KR:   "M130,330 L150,340 L160,390 L140,400 L120,380 L120,350 Z"
  }
};
