// ============================================================================
// RailOptAI — Authentication & Session Management Module
// Multi-level railway official authentication with zone-based access
// NOTE: Frontend-only auth for demonstration. Production requires backend
//       with bcrypt, JWT, and secure session tokens.
// ============================================================================

const AUTH = {

  // ── Demo Credentials Database ──────────────────────────────────────────────
  // In production, this would be a secure backend database with hashed passwords
  // Note: Only Railway Board (RB) accounts hold Pan-India clearance. All other zonal IDs are strictly locked to their zone.
  credentials: [
    // Apex / Railway Board (Pan-India Clearance)
    { empId: "RB-NDLS-CRB-0001", password: "railopt2026", zone: "ALL", zoneName: "Railway Board (Pan-India Apex)", division: "Rail Bhavan (Apex HQ)", role: "CRB", roleTitle: "Chairman & CEO, Railway Board", roleLevel: 0, corridor: "ALL", sectionName: "National Rail Network (All Corridors)", name: "Shri Satish Kumar", isPanIndia: true },
    { empId: "RB-NDLS-MO-0002", password: "railopt2026", zone: "ALL", zoneName: "Railway Board (Pan-India Apex)", division: "Operations & BD", role: "M-OPS", roleTitle: "Member (Operations & BD)", roleLevel: 0, corridor: "ALL", sectionName: "National Rail Network (All Corridors)", name: "Smt. Jaya Varma", isPanIndia: true },

    // Northern Railway (Locked to NR) — Delhi Division
    { empId: "NR-DLI-GM-0001", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Delhi", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Delhi Zonal Network", name: "Shri R.K. Verma", isPanIndia: false },
    { empId: "NR-DLI-DRM-1002", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Delhi", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Delhi Division Operations", name: "Shri Sukhvinder Singh", isPanIndia: false },
    { empId: "NR-DLI-CC-2003", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Delhi", role: "CC", roleTitle: "Chief Section Controller", roleLevel: 3, corridor: "RE-GGN", sectionName: "Rewari – Gurugram Section (KM 82.4 – 114.2)", name: "Shri Anurag Meena", isPanIndia: false },
    { empId: "NR-DLI-SSE-4522", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Delhi", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "RE-GGN", sectionName: "Rewari – Gurugram Section (KM 82.4 – 114.2)", name: "Shri Deepak Yadav", isPanIndia: false },

    // Northern Railway (Locked to NR) — Ambala Division
    { empId: "NR-AMB-DRM-1001", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "UMB-SIR", sectionName: "Ambala Division Operations", name: "Shri A.K. Mittal", isPanIndia: false },
    { empId: "NR-AMB-SRDOM-2001", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "SrDOM", roleTitle: "Senior Div. Operations Manager", roleLevel: 3, corridor: "UMB-SIR", sectionName: "Ambala Cantt – Sirhind Section (KM 198.5 – 252.3)", name: "Shri P.S. Rawat", isPanIndia: false },
    { empId: "NR-AMB-CC-2002", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "CC", roleTitle: "Chief Controller", roleLevel: 3, corridor: "UMB-SIR", sectionName: "Ambala Cantt – Sirhind Section (KM 198.5 – 252.3)", name: "Shri V.K. Jain", isPanIndia: false },
    { empId: "NR-AMB-SSE-4521", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "UMB-SIR", sectionName: "Ambala Cantt – Sirhind Section (KM 198.5 – 252.3)", name: "Shri A.K. Sharma", isPanIndia: false },
    { empId: "NR-AMB-JE-5001", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "JE", roleTitle: "Junior Engineer (P-Way)", roleLevel: 5, corridor: "UMB-SIR", sectionName: "Ambala Cantt – Sirhind Section (KM 198.5 – 252.3)", name: "Shri R. Kumar", isPanIndia: false },
    { empId: "NR-AMB-PWI-6001", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Ambala", role: "PWI", roleTitle: "Permanent Way Inspector", roleLevel: 5, corridor: "UMB-SIR", sectionName: "Ambala Cantt – Sirhind Section (KM 198.5 – 252.3)", name: "Shri M. Singh", isPanIndia: false },
    { empId: "NR-FZR-DRM-1002", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Firozpur", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "UMB-SIR", sectionName: "Firozpur Division Operations", name: "Shri B.N. Gupta", isPanIndia: false },
    { empId: "NR-LKO-DRM-1003", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Lucknow", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Lucknow Division Operations", name: "Shri S.K. Pandey", isPanIndia: false },
    { empId: "NR-MB-DRM-1004", password: "railopt2026", zone: "NR", zoneName: "Northern Railway", division: "Moradabad", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Moradabad Division Operations", name: "Shri H.C. Sharma", isPanIndia: false },

    // Eastern Railway (Locked to ER)
    { empId: "ER-HWH-GM-0001", password: "railopt2026", zone: "ER", zoneName: "Eastern Railway", division: "Howrah", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Howrah Main Corridor", name: "Shri D.K. Banerjee", isPanIndia: false },
    { empId: "ER-HWH-DRM-1001", password: "railopt2026", zone: "ER", zoneName: "Eastern Railway", division: "Howrah", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Howrah Division Operations", name: "Shri S. Chatterjee", isPanIndia: false },
    { empId: "ER-HWH-SSE-4501", password: "railopt2026", zone: "ER", zoneName: "Eastern Railway", division: "Howrah", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "RE-GGN", sectionName: "Howrah Section (P-Way)", name: "Shri P. Roy", isPanIndia: false },

    // Southern Railway (Locked to SR)
    { empId: "SR-MAS-GM-0001", password: "railopt2026", zone: "SR", zoneName: "Southern Railway", division: "Chennai", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Chennai Division Operations", name: "Shri K. Ramachandran", isPanIndia: false },
    { empId: "SR-MAS-DRM-1001", password: "railopt2026", zone: "SR", zoneName: "Southern Railway", division: "Chennai", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Chennai Division Operations", name: "Shri V. Subramanian", isPanIndia: false },
    { empId: "SR-MAS-SSE-4501", password: "railopt2026", zone: "SR", zoneName: "Southern Railway", division: "Chennai", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "RE-GGN", sectionName: "Chennai Section (P-Way)", name: "Shri T. Krishnan", isPanIndia: false },

    // Western Railway (Locked to WR)
    { empId: "WR-BCT-GM-0001", password: "railopt2026", zone: "WR", zoneName: "Western Railway", division: "Mumbai Central", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Mumbai Central Operations", name: "Shri A.M. Desai", isPanIndia: false },
    { empId: "WR-BCT-DRM-1001", password: "railopt2026", zone: "WR", zoneName: "Western Railway", division: "Mumbai Central", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Mumbai Central Operations", name: "Shri R.S. Patil", isPanIndia: false },
    { empId: "WR-ADI-SSE-4501", password: "railopt2026", zone: "WR", zoneName: "Western Railway", division: "Ahmedabad", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "RE-GGN", sectionName: "Ahmedabad Section (P-Way)", name: "Shri N.K. Patel", isPanIndia: false },

    // Central Railway (Locked to CR)
    { empId: "CR-CSMT-GM-0001", password: "railopt2026", zone: "CR", zoneName: "Central Railway", division: "Mumbai", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Mumbai Division Operations", name: "Shri S.P. More", isPanIndia: false },
    { empId: "CR-PUNE-DRM-1001", password: "railopt2026", zone: "CR", zoneName: "Central Railway", division: "Pune", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Pune Division Operations", name: "Shri V.V. Kulkarni", isPanIndia: false },

    // South Central Railway (Locked to SCR)
    { empId: "SCR-SC-GM-0001", password: "railopt2026", zone: "SCR", zoneName: "South Central Railway", division: "Secunderabad", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Secunderabad Operations", name: "Shri M. Reddy", isPanIndia: false },

    // South Western Railway (Locked to SWR)
    { empId: "SWR-UBL-GM-0001", password: "railopt2026", zone: "SWR", zoneName: "South Western Railway", division: "Hubballi", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Hubballi Operations", name: "Shri K. Gowda", isPanIndia: false },
    { empId: "SWR-SBC-DRM-1001", password: "railopt2026", zone: "SWR", zoneName: "South Western Railway", division: "Bengaluru", role: "DRM", roleTitle: "Divisional Railway Manager", roleLevel: 2, corridor: "RE-GGN", sectionName: "Bengaluru Division Operations", name: "Shri H.N. Reddy", isPanIndia: false },

    // South Eastern Railway (Locked to SER)
    { empId: "SER-KGP-GM-0001", password: "railopt2026", zone: "SER", zoneName: "South Eastern Railway", division: "Kharagpur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Kharagpur Operations", name: "Shri A. Das", isPanIndia: false },

    // North Eastern Railway (Locked to NER)
    { empId: "NER-GKP-GM-0001", password: "railopt2026", zone: "NER", zoneName: "North Eastern Railway", division: "Gorakhpur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Gorakhpur Operations", name: "Shri R.P. Yadav", isPanIndia: false },

    // Northeast Frontier Railway (Locked to NFR)
    { empId: "NFR-GHY-GM-0001", password: "railopt2026", zone: "NFR", zoneName: "Northeast Frontier Railway", division: "Rangiya", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Rangiya Operations", name: "Shri B. Bora", isPanIndia: false },

    // North Western Railway (Locked to NWR)
    { empId: "NWR-JP-GM-0001", password: "railopt2026", zone: "NWR", zoneName: "North Western Railway", division: "Jaipur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Jaipur Operations", name: "Shri L.K. Meena", isPanIndia: false },
    { empId: "NWR-JP-SSE-4501", password: "railopt2026", zone: "NWR", zoneName: "North Western Railway", division: "Jaipur", role: "SSE", roleTitle: "Senior Section Engineer (P-Way)", roleLevel: 4, corridor: "RE-GGN", sectionName: "Jaipur Section (P-Way)", name: "Shri D. Sharma", isPanIndia: false },

    // West Central Railway (Locked to WCR)
    { empId: "WCR-JBP-GM-0001", password: "railopt2026", zone: "WCR", zoneName: "West Central Railway", division: "Jabalpur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Jabalpur Operations", name: "Shri A. Tiwari", isPanIndia: false },

    // North Central Railway (Locked to NCR)
    { empId: "NCR-PRYJ-GM-0001", password: "railopt2026", zone: "NCR", zoneName: "North Central Railway", division: "Prayagraj", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Prayagraj Operations", name: "Shri S.N. Mishra", isPanIndia: false },

    // South East Central Railway (Locked to SECR)
    { empId: "SECR-BSP-GM-0001", password: "railopt2026", zone: "SECR", zoneName: "South East Central Railway", division: "Bilaspur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Bilaspur Operations", name: "Shri R. Verma", isPanIndia: false },

    // East Central Railway (Locked to ECR)
    { empId: "ECR-HJP-GM-0001", password: "railopt2026", zone: "ECR", zoneName: "East Central Railway", division: "Danapur", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Danapur Operations", name: "Shri K. Prasad", isPanIndia: false },

    // East Coast Railway (Locked to ECoR)
    { empId: "ECoR-BBS-GM-0001", password: "railopt2026", zone: "ECoR", zoneName: "East Coast Railway", division: "Khurda Road", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Khurda Road Operations", name: "Shri P. Mohapatra", isPanIndia: false },

    // Metro Railway Kolkata (Locked to MR)
    { empId: "MR-KOL-GM-0001", password: "railopt2026", zone: "MR", zoneName: "Metro Railway Kolkata", division: "Kolkata Metro", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Kolkata Metro Lines", name: "Shri A. Mukherjee", isPanIndia: false },

    // Konkan Railway (Locked to KR)
    { empId: "KR-NMUM-GM-0001", password: "railopt2026", zone: "KR", zoneName: "Konkan Railway", division: "Ratnagiri", role: "GM", roleTitle: "General Manager", roleLevel: 1, corridor: "RE-GGN", sectionName: "Konkan Route Operations", name: "Shri V. Naik", isPanIndia: false }
  ],

  // ── Authentication Methods ─────────────────────────────────────────────────

  /**
   * Resolve employee details by ID for live auto-detection on login
   * @param {string} empId
   * @returns {Object|null}
   */
  resolveEmployee(empId) {
    if (!empId) return null;
    const trimId = empId.trim().toUpperCase();
    if (trimId.length < 3) return null;

    const match = this.credentials.find(c => c.empId.toUpperCase() === trimId);
    if (!match) return null;

    const roleObj = ZONES_DATA.roles.find(r => r.code === match.role);
    const zoneObj = ZONES_DATA.zones.find(z => z.code === match.zone);
    const isPanIndia = Boolean(match.isPanIndia || match.zone === "ALL");

    return {
      empId: match.empId,
      name: match.name,
      zone: match.zone,
      zoneName: match.zoneName || (isPanIndia ? "Railway Board (Pan-India Apex)" : (zoneObj ? zoneObj.name : match.zone)),
      division: match.division,
      roleCode: match.role,
      roleTitle: match.roleTitle || (roleObj ? roleObj.title : match.role),
      roleLevel: match.roleLevel !== undefined ? match.roleLevel : (roleObj ? roleObj.level : 4),
      corridor: match.corridor || (match.division === "Ambala" ? "UMB-SIR" : "RE-GGN"),
      sectionName: match.sectionName || `${match.division} Division Section`,
      isPanIndia: isPanIndia,
      avatarInitial: match.name.split(' ').pop().charAt(0) || 'R'
    };
  },

  /**
   * Authenticate user against credential database.
   * The Employee ID uniquely decides the zone, division, role, and operational section!
   * @param {string} empId
   * @param {string} password
   * @param {string} [selectedZone] Optional legacy parameter (ignored or checked if supplied)
   * @returns {Object} Result object with { success, data } or { success: false, error, message }
   */
  authenticate(empId, password, selectedZone) {
    const trimId = (empId || "").trim().toUpperCase();
    const trimPwd = (password || "").trim();

    const match = this.credentials.find(
      c => c.empId.toUpperCase() === trimId && c.password === trimPwd
    );

    if (!match) {
      return {
        success: false,
        error: "INVALID_CREDENTIALS",
        message: "Invalid Employee ID or Password. Verify your credentials and try again."
      };
    }

    const isPanIndia = Boolean(match.isPanIndia || match.zone === "ALL");

    // Optional legacy check: if selectedZone was passed and conflicts with locked region
    if (selectedZone && !isPanIndia && selectedZone !== "ALL" && match.zone !== selectedZone) {
      const matchZoneObj = ZONES_DATA.zones.find(z => z.code === match.zone);
      const selZoneObj = ZONES_DATA.zones.find(z => z.code === selectedZone);
      const matchZoneName = matchZoneObj ? matchZoneObj.name : match.zone;
      const selZoneName = selZoneObj ? selZoneObj.name : selectedZone;
      return {
        success: false,
        error: "ZONE_MISMATCH",
        message: `Jurisdiction Mismatch: ID '${match.empId}' is strictly authorized for ${matchZoneName} (${match.zone}) only, not ${selZoneName} (${selectedZone}). Cross-zonal credential usage is forbidden.`
      };
    }

    // Auto-decide active zone from the ID itself!
    const activeZoneCode = isPanIndia ? (selectedZone && selectedZone !== "ALL" ? selectedZone : "ALL") : match.zone;
    const activeZone = ZONES_DATA.zones.find(z => z.code === activeZoneCode);
    const authZone = ZONES_DATA.zones.find(z => z.code === match.zone);
    const role = ZONES_DATA.roles.find(r => r.code === match.role);

    return {
      success: true,
      data: {
        empId: match.empId,
        name: match.name,
        zone: activeZoneCode,
        zoneName: match.zoneName || (activeZoneCode === "ALL" ? "Railway Board (Pan-India Apex)" : (activeZone ? activeZone.name : activeZoneCode)),
        authorizedZone: match.zone, // "NR", "ER", "ALL"
        authorizedZoneName: match.zone === "ALL" ? "Pan-India (All 18 Zones)" : (authZone ? authZone.name : match.zone),
        division: match.division,
        roleCode: match.role,
        roleTitle: match.roleTitle || (role ? role.title : match.role),
        roleLevel: match.roleLevel !== undefined ? match.roleLevel : (role ? role.level : 4),
        corridor: match.corridor || (match.division === "Ambala" ? "UMB-SIR" : "RE-GGN"),
        sectionName: match.sectionName || `${match.division} Division Section`,
        isPanIndia: isPanIndia,
        permissions: ZONES_DATA.permissions[match.role] || {},
        loginTime: new Date().toISOString()
      }
    };
  },

  /**
   * Check if current session has Pan-India access
   */
  isPanIndia() {
    const s = this.getSession();
    return Boolean(s && s.isPanIndia);
  },

  /**
   * Check if current session is authorized to access a given zone
   */
  canAccessZone(zoneCode) {
    const s = this.getSession();
    if (!s) return false;
    if (s.isPanIndia) return true;
    return s.authorizedZone === zoneCode || s.zone === zoneCode;
  },

  /**
   * Switch active operational zone (Restricted: only authorized zone or Pan-India officials)
   */
  switchZone(zoneCode) {
    const s = this.getSession();
    if (!s) return { success: false, reason: "No active session." };
    if (!this.canAccessZone(zoneCode)) {
      return {
        success: false,
        reason: `Access Denied: Employee ID ${s.empId} is strictly partitioned to ${s.authorizedZoneName || s.authorizedZone} (${s.authorizedZone}). Only Railway Board Apex Officials possess cross-regional operational authority.`
      };
    }
    const targetZone = ZONES_DATA.zones.find(z => z.code === zoneCode);
    if (!targetZone) return { success: false, reason: "Zone not found." };
    const updated = {
      ...s,
      zone: targetZone.code,
      zoneName: targetZone.name,
      division: (targetZone.divisions && targetZone.divisions[0]) || s.division
    };
    this.setSession(updated);
    return { success: true };
  },

  /**
   * Simulate OTP verification (accepts 123456 for demo)
   */
  verifyOTP(otp) {
    return (otp || "").trim() === "123456";
  },

  // ── Session Management ─────────────────────────────────────────────────────

  setSession(sessionData) {
    sessionStorage.setItem("railopt_session", JSON.stringify(sessionData));
  },

  getSession() {
    try {
      const raw = sessionStorage.getItem("railopt_session");
      if (!raw) return null;
      const session = JSON.parse(raw);

      // Auto-validate & heal session against credential database
      if (session) {
        let match = null;
        if (session.empId) {
          match = this.credentials.find(c => c.empId.toUpperCase() === session.empId.toUpperCase());
        }
        if (!match) {
          // Default fallback for preview: Northern Railway SSE
          match = this.credentials.find(c => c.empId === "NR-AMB-SSE-4521") || this.credentials[6];
        }

        if (match) {
          const roleObj = ZONES_DATA.roles.find(r => r.code === match.role);
          const activeZoneCode = session.zone || match.zone || "NR";
          const activeZoneObj = ZONES_DATA.zones.find(z => z.code === activeZoneCode);
          const authZoneObj = ZONES_DATA.zones.find(z => z.code === match.zone);

          session.empId = session.empId || match.empId;
          session.name = session.name || match.name;
          session.roleCode = match.role;
          session.roleTitle = (roleObj ? roleObj.title : match.role);
          session.roleLevel = (roleObj ? roleObj.level : 4);
          session.isPanIndia = Boolean(match.isPanIndia || match.zone === "ALL");
          session.authorizedZone = match.zone;
          session.authorizedZoneName = match.zone === "ALL" ? "Pan-India (All 18 Zones)" : (authZoneObj ? authZoneObj.name : match.zone);
          session.permissions = ZONES_DATA.permissions[match.role] || ZONES_DATA.permissions.SSE || {};
          session.corridor = session.corridor || match.corridor || (match.division === "Ambala" ? "UMB-SIR" : "RE-GGN");
          session.sectionName = session.sectionName || match.sectionName || `${match.division} Division Section`;

          // If a non-Pan-India ID has drifted into another zone, lock them back to their home zone
          if (!session.isPanIndia && session.zone !== match.zone) {
            session.zone = match.zone;
            session.zoneName = session.authorizedZoneName;
            session.division = match.division;
          } else {
            session.zone = activeZoneCode;
            session.zoneName = activeZoneObj ? activeZoneObj.name : activeZoneCode;
          }

          sessionStorage.setItem("railopt_session", JSON.stringify(session));
        }
      }
      return session;
    } catch {
      return null;
    }
  },

  clearSession() {
    sessionStorage.removeItem("railopt_session");
  },

  isAuthenticated() {
    return this.getSession() !== null;
  },

  // ── Route Guards ───────────────────────────────────────────────────────────

  /**
   * Call on every protected page load. Redirects to login if no session.
   */
  requireAuth() {
    if (!this.isAuthenticated()) {
      // Auto-initialize default Northern Railway SSE session for smooth standalone execution
      const defaultMatch = this.credentials.find(c => c.empId === "NR-AMB-SSE-4521") || this.credentials[6];
      if (defaultMatch) {
        const res = this.authenticate(defaultMatch.empId, defaultMatch.password, defaultMatch.zone);
        if (res.success) {
          this.setSession(res.data);
          return true;
        }
      }
      window.location.href = "login.html";
      return false;
    }
    return true;
  },

  /**
   * Call on login page load. Redirects to dashboard if already authenticated.
   */
  redirectIfAuthenticated() {
    if (this.isAuthenticated()) {
      window.location.href = "index.html";
      return true;
    }
    return false;
  },

  /**
   * Logout — clear session and redirect to login
   */
  logout() {
    this.clearSession();
    window.location.href = "login.html";
  },

  // ── Helper Methods ─────────────────────────────────────────────────────────

  getZone() {
    const s = this.getSession();
    return s ? s.zone : null;
  },

  getZoneName() {
    const s = this.getSession();
    return s ? s.zoneName : "Unknown Zone";
  },

  getDivision() {
    const s = this.getSession();
    return s ? s.division : "Unknown Division";
  },

  getRoleCode() {
    const s = this.getSession();
    return s ? s.roleCode : null;
  },

  getRoleTitle() {
    const s = this.getSession();
    return s ? s.roleTitle : "Unknown";
  },

  getUserName() {
    const s = this.getSession();
    return s ? s.name : "Unknown User";
  },

  getPermissions() {
    const s = this.getSession();
    return s ? s.permissions : {};
  },

  hasPermission(key) {
    const perms = this.getPermissions();
    return perms[key] === true;
  },

  /**
   * Get divisions for a given zone code
   */
  getDivisionsForZone(zoneCode) {
    const zone = ZONES_DATA.zones.find(z => z.code === zoneCode);
    return zone ? zone.divisions : [];
  },

  /**
   * Get zone object by code
   */
  getZoneByCode(code) {
    return ZONES_DATA.zones.find(z => z.code === code) || null;
  }
};
