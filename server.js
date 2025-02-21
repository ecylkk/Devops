const express = require('express');
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});