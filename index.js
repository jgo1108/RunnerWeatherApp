import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/weather', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        system: `You are a running coach and weather expert. Search for current weather and respond ONLY with a valid JSON object. No prose, no explanation, no markdown, no backticks. Start your response with { and end with }. Include these fields: city, temperature_c, temperature_f, feels_like_c, feels_like_f, condition, humidity, wind, visibility, uv_index, summary (one runner-focused sentence), and gear array (each item has: icon, name, reason, priority which is must/recommended/optional).`,
        messages: [{ role: "user", content: `Current weather for runners in: ${query}` }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const textBlock = data.content?.find(b => b.type === "text");
    const raw = textBlock?.text || "";

    // Extract JSON even if there's surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", raw.slice(0, 300));
      return res.status(500).json({ error: "No JSON in response", raw: raw.slice(0, 300) });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    res.status(200).json({ result: parsed });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`Running on port ${PORT}`));
