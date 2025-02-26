
const express = require('express');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

const API_TOKEN = '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';
const MONGO_URI = 'mongodb://localhost:27017/ai_db';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

const ResponseSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  responseTime: Number
});
const Response = mongoose.model('Response', ResponseSchema);

app.use(cors());

app.get('/ai', async (req, res) => {
  const startTime = Date.now();
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/distilgpt2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: "Hello, AI!",
        parameters: { max_new_tokens: 10, temperature: 0.5, top_k: 40, do_sample: true }
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});