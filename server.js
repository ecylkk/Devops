const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
let requestCount = 0;

app.get('/api', (req, res) => {
  requestCount++;
  res.json({ message: "Hello from the backend!", requests: requestCount });
});

app.get('/metrics', (req, res) => {
  res.json({ totalRequests: requestCount });
});

app.get('/ai', async (req, res) => {
  try {
    const aiResponse = { text: "This is a simulated AI response!" };
    res.json({ ai: aiResponse.text });
  } catch (error) {
    res.status(500).json({ error: "AI call failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});