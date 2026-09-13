/**
 * Helper utility to access demo credentials by Employee / User ID.
 * Usage in Node:
 *   const { getUserById, getAllUsers, users } = require('./demo_users.cjs');
 *   console.log(getUserById('NR-DLI-SSE-4522'));
 * 
 * Usage in CLI:
 *   node scratch/demo_users.cjs NR-DLI-SSE-4522
 */

const data = require('./demo_users.json');

function getUserById(empId) {
  if (!empId) return null;
  const normalized = empId.trim().toUpperCase();
  return data.users_by_id[normalized] || null;
}

function getAllUserIds() {
  return Object.keys(data.users_by_id);
}

function getAllUsers() {
  return Object.values(data.users_by_id);
}

function getUsersByZone(zoneCode) {
  if (!zoneCode) return [];
  const normalized = zoneCode.trim().toUpperCase();
  return Object.values(data.users_by_id).filter(
    (u) => u.zoneCode === normalized || (normalized === 'ALL' && u.isPanIndia)
  );
}

module.exports = {
  data,
  users: data.users_by_id,
  defaultPassword: data.default_password,
  defaultOtp: data.default_otp,
  getUserById,
  getAllUserIds,
  getAllUsers,
  getUsersByZone
};

// If run directly from CLI
if (require.main === module) {
  const queryId = process.argv[2];
  if (queryId) {
    const user = getUserById(queryId);
    if (user) {
      console.log(`\n=== User Found for ID [${queryId}] ===`);
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.error(`\nUser ID "${queryId}" not found in demo database.`);
      console.log('Available User IDs:', getAllUserIds().join(', '));
    }
  } else {
    console.log('\n=== RailOptAI Demo Credentials Matrix ===');
    console.log(`Total Accounts: ${getAllUsers().length}`);
    console.log('Available User IDs:');
    getAllUsers().forEach(u => {
      console.log(` - [${u.empId}] ${u.name} | ${u.role} (${u.zoneCode}) - ${u.division}`);
    });
    console.log('\nPass a User ID to inspect: node scratch/demo_users.cjs <USER_ID>');
  }
}
