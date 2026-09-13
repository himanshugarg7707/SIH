const fs = require('fs');
const assert = require('assert');

// 1. Verify auth.js
const authCode = fs.readFileSync('js/auth.js', 'utf8');
const zonesDataCode = fs.readFileSync('js/zones-data.js', 'utf8');

const vm = require('vm');
const context = { console, sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} } };
context.globalThis = context;
context.window = context;
vm.createContext(context);
vm.runInContext(zonesDataCode + '\nglobalThis.ZONES_DATA = ZONES_DATA;', context);
vm.runInContext(authCode + '\nglobalThis.AUTH = AUTH;', context);

const AUTH = context.AUTH;

// Test Southern Railway GM login
const srRes = AUTH.authenticate('SR-MAS-GM-0001', 'railopt2026');
assert.strictEqual(srRes.success, true);
assert.strictEqual(srRes.data.zone, 'SR');
assert.strictEqual(srRes.data.corridor, 'MAS-KPD', 'SR GM must have corridor MAS-KPD');
console.log('✓ SR GM authenticated with corridor:', srRes.data.corridor);

// Test Eastern Railway GM login
const erRes = AUTH.authenticate('ER-HWH-GM-0001', 'railopt2026');
assert.strictEqual(erRes.data.corridor, 'HWH-BWN');
console.log('✓ ER GM authenticated with corridor:', erRes.data.corridor);

// Test Western Railway GM login
const wrRes = AUTH.authenticate('WR-BCT-GM-0001', 'railopt2026');
assert.strictEqual(wrRes.data.corridor, 'BCT-ST');
console.log('✓ WR GM authenticated with corridor:', wrRes.data.corridor);

// Test Central Railway GM login
const crRes = AUTH.authenticate('CR-CSMT-GM-0001', 'railopt2026');
assert.strictEqual(crRes.data.corridor, 'CSMT-KYN');
console.log('✓ CR GM authenticated with corridor:', crRes.data.corridor);

// Test South Central Railway GM login
const scrRes = AUTH.authenticate('SCR-SC-GM-0001', 'railopt2026');
assert.strictEqual(scrRes.data.corridor, 'SC-KZJ');
console.log('✓ SCR GM authenticated with corridor:', scrRes.data.corridor);

// Test Northeast Frontier Railway GM login
const nfrRes = AUTH.authenticate('NFR-GHY-GM-0001', 'railopt2026');
assert.strictEqual(nfrRes.data.corridor, 'GHY-APDJ');
console.log('✓ NFR GM authenticated with corridor:', nfrRes.data.corridor);

// 2. Test server.js endpoints for all sections
import('../server.js').then(async (serverModule) => {
  const handleRequest = serverModule.handleRequest || serverModule.default;
  const sections = ['RE-GGN', 'UMB-SIR', 'HWH-BWN', 'BCT-ST', 'MAS-KPD', 'CSMT-KYN', 'SC-KZJ', 'GHY-APDJ'];
  
  for (const s of sections) {
    const mockReq = {
      url: 'http://localhost/api/trains/corridor?section=' + s + '&roleLevel=1',
      headers: { host: 'localhost' },
      method: 'GET'
    };
    let responseData = '';
    const mockRes = {
      setHeader: () => {},
      writeHead: () => {},
      end: (str) => { responseData = str; }
    };
    await handleRequest(mockReq, mockRes);
    const parsed = JSON.parse(responseData);
    assert.strictEqual(parsed.success, true);
    assert.strictEqual(parsed.data.sectionKey, s, 'Section ' + s + ' returned correct key');
    assert(parsed.data.trains.length > 0, 'Section ' + s + ' has trains');
    assert(parsed.data.problemPoint, 'Section ' + s + ' has problemPoint');
    console.log('✓ Server returns valid regional data for:', s, '-> Problem:', parsed.data.problemPoint.type, 'at', parsed.data.problemPoint.milepost);
  }
  console.log('\n=== ALL REGIONAL CORRIDORS PASSED PERFECTLY ===');
  process.exit(0);
}).catch(err => {
  console.error('Server test error:', err);
  process.exit(1);
});
