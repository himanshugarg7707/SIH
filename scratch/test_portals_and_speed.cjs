// ============================================================================
// Automated Verification Script: Portals, Speed & Basemap Watermark Fix
// ============================================================================

const fs = require('fs');
const path = require('path');
const http = require('http');

let failures = 0;
function assert(desc, condition, details = '') {
  if (condition) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc} ${details}`);
    failures++;
  }
}

async function run() {
  console.log('\n=== RUNNING COMPREHENSIVE PORTALS & SPEED VALIDATION ===\n');

  // 1. Check index.html sidebar
  const indexPath = path.join(__dirname, '..', 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  assert('Sidebar has IR Core Portals section', indexContent.includes('id="navGroupCorePortals"'));
  assert('Sidebar links to tms.html with target="_blank"', indexContent.includes('href="tms.html" target="_blank"'));
  assert('Sidebar links to smms.html with target="_blank"', indexContent.includes('href="smms.html" target="_blank"'));
  assert('Sidebar links to tdms.html with target="_blank"', indexContent.includes('href="tdms.html" target="_blank"'));
  assert('TMS link has P-Way badge', indexContent.includes('badge-portal-pway'));
  assert('SMMS link has S&T badge', indexContent.includes('badge-portal-st'));
  assert('TDMS link has TRD badge', indexContent.includes('badge-portal-trd'));

  // 2. Check js/railmap.js speed calibration, basemap, and headway limits
  const railmapPath = path.join(__dirname, '..', 'js', 'railmap.js');
  const railmapContent = fs.readFileSync(railmapPath, 'utf8');
  const cssStylesPath = path.join(__dirname, '..', 'css', 'styles.css');
  const cssStylesContent = fs.readFileSync(cssStylesPath, 'utf8');

  assert('Train speedStep calibrated to realistic slow pace (0.00030)', railmapContent.includes('0.00030 * (train.speedKmH / 100)'));
  assert('No cartocdn.com in themes to eliminate API KEY REQUIRED watermark', !railmapContent.includes('basemaps.cartocdn.com'));
  assert('Esri World Dark Gray Base configured for openrailway theme', railmapContent.includes('Canvas/World_Dark_Gray_Base'));
  assert('OpenRailwayMap GIS overlay retained', railmapContent.includes('tiles.openrailwaymap.org/standard'));
  assert('Signaling headway limit implemented to prevent train pile-ups', railmapContent.includes('anim.currentProgress < anim.maxProgress'));
  assert('Minimize button wired in railmap.js', railmapContent.includes('minimizeProblemHudBtn'));
  assert('HUD positioned cleanly on right to avoid track occlusion', cssStylesContent.includes('.track-problem-hud') && cssStylesContent.includes('right: 14px;'));
  assert('HUD has minimized state defined in CSS', cssStylesContent.includes('.track-problem-hud.minimized'));
  assert('Staggered badge positioning classes present in CSS', cssStylesContent.includes('.badge-pos-top') && cssStylesContent.includes('.badge-pos-bottom'));

  // 3. Check standalone portal pages exist and have valid structure
  const tmsPath = path.join(__dirname, '..', 'tms.html');
  const smmsPath = path.join(__dirname, '..', 'smms.html');
  const tdmsPath = path.join(__dirname, '..', 'tdms.html');
  const cssPath = path.join(__dirname, '..', 'css', 'enterprise-portals.css');

  assert('tms.html exists', fs.existsSync(tmsPath));
  assert('smms.html exists', fs.existsSync(smmsPath));
  assert('tdms.html exists', fs.existsSync(tdmsPath));
  assert('css/enterprise-portals.css exists', fs.existsSync(cssPath));

  const tmsContent = fs.readFileSync(tmsPath, 'utf8');
  assert('TMS page contains USFD defect table', tmsContent.includes('USFD Rail Defect Registry'));
  assert('TMS page matches corridor Km 89.6 defect', tmsContent.includes('Km 89.6 Up Main Line'));
  assert('TMS has RailOptAI block push modal', tmsContent.includes('scheduleModal') && tmsContent.includes('confirmPushToRailOptAI'));

  const smmsContent = fs.readFileSync(smmsPath, 'utf8');
  assert('SMMS page contains Point Machine telemetry', smmsContent.includes('Point Machine Stroke & Motor Telemetry'));
  assert('SMMS page contains S&T Rule 3.51 memo modal', smmsContent.includes('signalMemoModal') && tmsContent.includes('scheduleModal'));

  const tdmsContent = fs.readFileSync(tdmsPath, 'utf8');
  assert('TDMS page contains 25kV OHE Catenary Wire Health Registry', tdmsContent.includes('Overhead Equipment (OHE) Wire Wear'));
  assert('TDMS page contains SCADA TSS Telemetry', tdmsContent.includes('Traction Substation (TSS) & Circuit Breaker SCADA Status'));

  // 4. Test HTTP live server responses
  function checkUrl(urlPath) {
    return new Promise((resolve) => {
      http.get(`http://localhost:3000${urlPath}`, (res) => {
        resolve({ statusCode: res.statusCode, contentType: res.headers['content-type'] });
      }).on('error', (err) => {
        resolve({ error: err.message });
      });
    });
  }

  const resIndex = await checkUrl('/index.html');
  assert('HTTP 200 /index.html', resIndex.statusCode === 200);

  const resTms = await checkUrl('/tms.html');
  assert('HTTP 200 /tms.html', resTms.statusCode === 200);

  const resSmms = await checkUrl('/smms.html');
  assert('HTTP 200 /smms.html', resSmms.statusCode === 200);

  const resTdms = await checkUrl('/tdms.html');
  assert('HTTP 200 /tdms.html', resTdms.statusCode === 200);

  const resCss = await checkUrl('/css/enterprise-portals.css');
  assert('HTTP 200 /css/enterprise-portals.css', resCss.statusCode === 200);

  console.log(`\n=== VALIDATION COMPLETED: ${failures === 0 ? 'ALL CHECKS PASSED (0 failures)' : failures + ' FAILED'} ===\n`);
  process.exit(failures === 0 ? 0 : 1);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
