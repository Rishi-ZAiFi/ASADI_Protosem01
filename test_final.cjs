const http = require('http');

async function callApi(endpoint, body) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('Final Production Test...');
  try {
    const toolRes = await callApi('/api/agent/run', { tool: 'caption-assistant', input: { topic: 'Production Audit Success' } });
    console.log('[TOOL] caption-assistant:', toolRes.status, toolRes.data.success ? 'PASS' : 'FAIL');
    
    const wfRes = await callApi('/api/agent/workflow', { workflow: 'ai-content-director', input: { topic: 'Production Audit Success' } });
    console.log('[WORKFLOW] ai-content-director:', wfRes.status, wfRes.data.success ? 'PASS' : 'FAIL');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests();
