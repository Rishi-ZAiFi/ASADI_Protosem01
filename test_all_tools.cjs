const http = require('http');

const tools = [
  'content-idea-generator', 'content-repurposer', 'hook-generator', 
  'daily-content-planner', 'reel-script-builder', 'clip-finder', 
  'thumbnail-ideator', 'caption-assistant', 'cta-generator', 
  'comment-analyzer', 'comment-to-content', 'creator-research-assistant', 
  'voice-replicator', 'podcast-assistant', 'creator-workspace', 
  'content-recycler', 'brand-pitch-builder', 'ai-content-director', 
  'creator-second-brain', 'ai-screenplay-workspace', 'autonomous-content-pipeline', 
  'ai-creative-producer'
];

const workflows = [
  'ai-content-director',
  'autonomous-content-pipeline',
  'ai-creative-producer'
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
  const results = { tools: {}, workflows: {} };
  
  console.log('Testing 22 Tools...');
  for (const tool of tools) {
    try {
      const res = await callApi('/api/agent/run', { tool, input: { topic: 'test content' } });
      results.tools[tool] = res;
      console.log(`[Tool] ${tool} - Status: ${res.status} - Success: ${res.data.success}`);
    } catch(e) {
      results.tools[tool] = { error: e.message };
      console.log(`[Tool] ${tool} - ERROR: ${e.message}`);
    }
  }

  console.log('\nTesting 3 Workflows...');
  for (const wf of workflows) {
    try {
      const res = await callApi('/api/agent/workflow', { workflow: wf, input: { topic: 'test content' } });
      results.workflows[wf] = res;
      console.log(`[Workflow] ${wf} - Status: ${res.status} - Success: ${res.data.success}`);
    } catch(e) {
      results.workflows[wf] = { error: e.message };
      console.log(`[Workflow] ${wf} - ERROR: ${e.message}`);
    }
  }

  require('fs').writeFileSync('test_results.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to test_results.json');
}

runTests();
