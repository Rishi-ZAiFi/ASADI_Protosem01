const http = require('http');

const body = { tool: 'caption-assistant', input: { topic: 'LangSmith Configuration Fix Test' } };

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/agent/run',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response body:', JSON.parse(data));
  });
});

req.on('error', e => console.error(e));
req.write(JSON.stringify(body));
req.end();
