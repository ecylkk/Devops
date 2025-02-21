const assert = require('assert');
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3001';

async function runTests() {
  // 测试 /api 端点
  const apiResponse = await fetch(`${baseUrl}/api`).then(res => res.json());
  assert(apiResponse.message === 'Hello from the backend!', 'API message mismatch');
  assert(typeof apiResponse.requests === 'number', 'Requests should be a number');

  // 测试 /metrics 端点
  const metricsResponse = await fetch(`${baseUrl}/metrics`).then(res => res.json());
  assert(typeof metricsResponse.totalRequests === 'number', 'Total requests should be a number');

  console.log('All tests passed!');
}

runTests().catch(err => console.error('Test failed:', err));