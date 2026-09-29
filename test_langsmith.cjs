const http = require('http');

const items = [
  { type: 'tool', id: 'caption-assistant' },
  { type: 'tool', id: 'content-idea-generator' },
  { type: 'tool', id: 'hook-generator' },
  { type: 'workflow', id: 'ai-content-director' }
];

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
  console.log('Testing endpoints for LangSmith trace verification...');
  for (const item of items) {
    try {
      const endpoint = item.type === 'tool' ? '/api/agent/run' : '/api/agent/workflow';
      const body = item.type === 'tool' ? { tool: item.id, input: { topic: 'LangSmith Verification' } } : { workflow: item.id, input: { topic: 'LangSmith Verification' } };
      
      const res = await callApi(endpoint, body);
      console.log(`[${item.type.toUpperCase()}] ${item.id} - Status: ${res.status} - Success: ${res.data.success}`);
    } catch (err) {
      console.error(`[${item.type.toUpperCase()}] ${item.id} - Error:`, err.message);
    }
  }
}

runTests();
