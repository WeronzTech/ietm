import { createIetmServer } from '../electron/server.js';
import http from 'node:http';

console.log('--- STARTING REST API & HTTP SERVER TEST ---');

const server = createIetmServer(5055);

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: data ? JSON.parse(data) : null, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runApiTests() {
  let passed = 0;
  let failed = 0;

  function assert(cond, name, info = '') {
    if (cond) {
      passed++;
      console.log(`[PASS] ${name}`);
    } else {
      failed++;
      console.error(`[FAIL] ${name} - ${info}`);
    }
  }

  try {
    // 1. Static asset delivery (index.html)
    const staticRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/',
      method: 'GET'
    });
    assert(staticRes.status === 200 && staticRes.raw.includes('html'), 'Static web server serves index.html on root path');

    // 2. Auth Login with valid operator credentials
    const loginRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'operator1', password: 'operator123' });

    assert(loginRes.status === 200 && loginRes.body?.success, 'POST /api/auth/login authenticates operator1');
    const operatorToken = loginRes.body?.sessionToken;
    assert(!!operatorToken, 'Session token issued in login response');

    // 3. Admin Login
    const adminLoginRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { username: 'admin1', password: 'admin123' });
    const adminToken = adminLoginRes.body?.sessionToken;
    assert(adminLoginRes.status === 200 && adminLoginRes.body?.user?.role === 'admin', 'POST /api/auth/login authenticates admin1 with role admin');

    // 4. RBAC Protection: Operator hitting Admin-only /api/auth/users
    const forbiddenRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/auth/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${operatorToken}` }
    });
    assert(forbiddenRes.status === 403, 'RBAC Server Enforcement: Operator accessing /api/auth/users receives 403 Forbidden');

    // 5. Admin hitting /api/auth/users
    const adminUsersRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/auth/users',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert(adminUsersRes.status === 200 && Array.isArray(adminUsersRes.body), 'Admin accessing /api/auth/users receives user list');

    // 6. Content retrieval: Module content
    const modRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/ietm/content/75',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${operatorToken}` }
    });
    assert(modRes.status === 200 && modRes.body?.title, 'GET /api/ietm/content/75 returns topic data');

    // 7. Search API
    const searchRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/ietm/search',
      method: 'POST',
      headers: { 'Authorization': `Bearer ${operatorToken}`, 'Content-Type': 'application/json' }
    }, { query: 'safety', category: 'ALL' });
    assert(searchRes.status === 200 && Array.isArray(searchRes.body) && searchRes.body.length > 0, 'POST /api/ietm/search returns search hits');

    // 8. Revisions API
    const revRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/ietm/revisions/19',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${operatorToken}` }
    });
    assert(revRes.status === 200 && Array.isArray(revRes.body) && revRes.body.length > 0, 'GET /api/ietm/revisions/19 returns revision history');

    // 9. Glossary API
    const glossRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/api/ietm/glossary/19',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${operatorToken}` }
    });
    assert(glossRes.status === 200 && Array.isArray(glossRes.body), 'GET /api/ietm/glossary/19 returns glossary terms');

    // 10. Path Traversal Security check
    const traversalRes = await makeRequest({
      hostname: '127.0.0.1',
      port: 5055,
      path: '/..%2f..%2f..%2fwindows%2fsystem32%2fcmd.exe',
      method: 'GET'
    });
    // Ensure it either falls back to safe index.html or returns 403/404, never system files
    assert(!traversalRes.raw.includes('Microsoft Corporation') && (traversalRes.status === 200 && traversalRes.raw.includes('html')), 'Path traversal attempt safely neutralized to web root');

  } catch (err) {
    console.error('Fatal API test error:', err);
    failed++;
  } finally {
    server.close(() => {
      console.log('HTTP Server closed.');
      console.log('\n====================================================');
      console.log(`API TESTS: ${passed + failed}`);
      console.log(`PASSED:    ${passed}`);
      console.log(`FAILED:    ${failed}`);
      console.log('====================================================');
      process.exit(failed > 0 ? 1 : 0);
    });
  }
}

runApiTests();
