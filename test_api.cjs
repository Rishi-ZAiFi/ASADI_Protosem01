const http = require('http');

async function runTool(endpoint, payload) {
  const data = JSON.stringify(payload);
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: endpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function testAll() {
  console.log('Testing Individual Tools...');
  const tools = ['content-idea-generator', 'caption-assistant', 'hook-generator'];
  for (const tool of tools) {
    const res = await runTool('/api/agent/run', { tool, input: { topic: 'AI' } });
    console.log(`[Tool] ${tool} => Success: ${res.success}, Error: ${res.error?.message}`);
  }

  console.log('\nTesting Workflows...');
  const workflows = ['ai-content-director', 'autonomous-content-pipeline', 'ai-creative-producer'];
  for (const workflow of workflows) {
    const res = await runTool('/api/agent/workflow', { workflow, input: { topic: 'AI' } });
    console.log(`[Workflow] ${workflow} => Success: ${res.success}, Error: ${res.error?.message}`);
  }
}

testAll();
