const fs = require('fs');

// Mock localStorage / sessionStorage
const storage = {};
global.sessionStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Load dependencies
const zonesDataCode = fs.readFileSync(__dirname + '/../js/zones-data.js', 'utf8');
const authCode = fs.readFileSync(__dirname + '/../js/auth.js', 'utf8');

eval(zonesDataCode + '; global.ZONES_DATA = ZONES_DATA;');
eval(authCode + '; global.AUTH = AUTH;');

console.log("=== RUNNING AUTH & JURISDICTION LOCK TESTS ===");

// Test 1: Live ID Auto-Resolution for Delhi SSE
const resolvedSSE = AUTH.resolveEmployee("NR-DLI-SSE-4522");
console.log("Test 1: Auto-resolve NR-DLI-SSE-4522:", (resolvedSSE && resolvedSSE.name === "Shri Deepak Yadav" && resolvedSSE.division === "Delhi" && resolvedSSE.corridor === "RE-GGN") ? "PASS" : "FAIL");

// Test 2: Live ID Auto-Resolution for Railway Board CRB
const resolvedCRB = AUTH.resolveEmployee("RB-NDLS-CRB-0001");
console.log("Test 2: Auto-resolve RB-NDLS-CRB-0001:", (resolvedCRB && resolvedCRB.isPanIndia === true && resolvedCRB.roleTitle.includes("Chairman")) ? "PASS" : "FAIL");

// Test 3: Auto-resolution returns null for invalid IDs
const resolvedInvalid = AUTH.resolveEmployee("INVALID-ID-9999");
console.log("Test 3: Auto-resolve invalid ID returns null:", resolvedInvalid === null ? "PASS" : "FAIL");

// Test 4: Pure ID-driven login (NO zone parameter passed) for Delhi CC
const loginDelhiCC = AUTH.authenticate("NR-DLI-CC-2003", "railopt2026");
console.log("Test 4: ID-only authentication (NR-DLI-CC-2003):", (loginDelhiCC.success && loginDelhiCC.data.zone === "NR" && loginDelhiCC.data.division === "Delhi" && loginDelhiCC.data.corridor === "RE-GGN") ? "PASS" : "FAIL");
AUTH.setSession(loginDelhiCC.data);

const session = AUTH.getSession();
console.log("Test 5: Session zone matches ID jurisdiction:", session.zone === "NR" ? "PASS" : "FAIL");
console.log("Test 6: Session corridor auto-set to RE-GGN:", session.corridor === "RE-GGN" ? "PASS" : "FAIL");
console.log("Test 7: isPanIndia is false for regional officer:", session.isPanIndia === false ? "PASS" : "FAIL");

// Test 8: Try switching to Western Railway (WR) as NR CC -> MUST BE REJECTED
const switchAttempt = AUTH.switchZone("WR");
console.log("Test 8: Switch to WR rejected:", (switchAttempt.success === false && switchAttempt.reason.includes("Access Denied")) ? "PASS" : "FAIL");

// Test 9: Pure ID-driven login for Ambala SSE
const loginAmbala = AUTH.authenticate("NR-AMB-SSE-4521", "railopt2026");
console.log("Test 9: ID-only authentication for Ambala SSE:", (loginAmbala.success && loginAmbala.data.division === "Ambala" && loginAmbala.data.corridor === "UMB-SIR") ? "PASS" : "FAIL");

// Test 10: Pure ID-driven login for CRB (Pan-India)
const crbLogin = AUTH.authenticate("RB-NDLS-CRB-0001", "railopt2026");
console.log("Test 10: CRB ID-only authentication:", (crbLogin.success && crbLogin.data.isPanIndia === true) ? "PASS" : "FAIL");
AUTH.setSession(crbLogin.data);

// Test 11: CRB switches to Western Railway -> MUST BE ALLOWED
const crbSwitch = AUTH.switchZone("WR");
console.log("Test 11: CRB switch to WR allowed:", (crbSwitch.success === true && AUTH.getSession().zone === "WR") ? "PASS" : "FAIL");

console.log("=== ALL AUTH & JURISDICTION LOCK TESTS PASSED ===");
