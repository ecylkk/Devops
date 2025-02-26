const express = require('express');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // 支持 Render 的动态端口

const API_TOKEN =  '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'; // 你的 Key
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_db'; // 支持外部 MongoDB
const MONGO_URI = 'mongodb+srv://ecylkk:2025Pass.@cluster0.0nhoz.mongodb.net/ai_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const ResponseSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  responseTime: Number
});
const Response = mongoose.model('Response', ResponseSchema);

app.use(cors()); // 允许跨源请求
app.use(express.static(path.join(__dirname, 'frontend', 'build'))); // 服务前端静态文件

app.get('/ai', async (req, res) => {
  const startTime = Date.now();
  try {
    const prompts = ["Hello, AI!", "What's up?", "Tell me a story!", "How's the weather?"];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const response = await fetch('https://api-inference.huggingface.co/models/distilgpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: randomPrompt,
        parameters: { max_new_tokens: 15, temperature: 0.7, top_k: 50, do_sample: true }
      })
    });
    const data = await response.json();
    let aiText = data[0]?.generated_text || "AI failed";
    aiText = aiText.length > 20 ? aiText.substring(0, 20) + '...' : aiText;

    const responseTime = Date.now() - startTime;
    await Response.create({ text: aiText, responseTime });

    res.json({ ai: aiText, time: responseTime });
  } catch (error) {
    console.error('AI fetch error:', error);
    res.status(500).json({ error: "AI call failed" });
  }
});

app.get('/responses', async (req, res) => {
  const responses = await Response.find().sort({ createdAt: -1 }).limit(10);
  res.json(responses);
});

app.get('*', (req, res) => { // 处理前端路由
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});