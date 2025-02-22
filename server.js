const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

let requestCount = 0;

const API_TOKEN =  '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';
app.get('/api', (req, res) => {
  requestCount++;
  res.json({ message: "Hello from the backend!", requests: requestCount });
});

app.get('/metrics', (req, res) => {
  res.json({ totalRequests: requestCount });
});
app.get('/ai', async (req, res) => {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: "Hello, AI!",
        parameters: {
          max_new_tokens: 10,  // 只生成 10 个新 token
          temperature: 0.5,    // 降低随机性
          top_k: 40,           // 更严格的词汇选择
          do_sample: true      // 启用采样
        }
      })
    });
    const data = await response.json();
    let aiText = data[0]?.generated_text || "AI failed";
    // 手动截断到 20 字符
    aiText = aiText.length > 20 ? aiText.substring(0, 20) + '...' : aiText;
    res.json({ ai: aiText });
  } catch (error) {
    res.status(500).json({ error: "AI call failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});