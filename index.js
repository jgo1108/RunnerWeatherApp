import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/weather', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      system: `You are a running coach and weather expert. Search for current weather and respond ONLY with valid JSON. Include: city, temperature_c, temperature_f, feels_like_c, feels_like_f, condition, humidity, wind, visibility, uv_index, summary (runner-focused), and gear array (each item: icon emoji, name, reason, priority: must/recommended/optional).`,
      messages: [{ role: "user", content: `Current weather for runners in: ${query}` }]
    })
  });

  const data = await response.json();
  const textBlock = data.content?.find(b => b.type === "text");
  const clean = (textBlock?.text || "").replace(/```json|```/g, "").trim();
  res.status(200).json({ result: JSON.parse(clean) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));