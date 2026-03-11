import { useState, useEffect, useRef } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');
`;

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Syne', sans-serif;
    background: #06090f;
    color: #e8edf5;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 48px 24px;
  }

  .sky-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    transition: background 1.5s ease;
  }

  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.25;
    animation: drift 12s ease-in-out infinite alternate;
  }

  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.1); }
  }

  .content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .header {
    text-align: center;
  }

  .header-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #4a8f5f;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .header-eyebrow::before, .header-eyebrow::after {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: #4a8f5f;
    opacity: 0.5;
  }

  .header h1 {
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: #fff;
  }

  .header h1 span {
    color: #6dd88a;
  }

  .header p {
    margin-top: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #3a5045;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .search-wrap {
    width: 100%;
    position: relative;
  }

  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px 56px 18px 20px;
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    color: #e8edf5;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    backdrop-filter: blur(10px);
  }

  .search-input::placeholder { color: #2d3d32; }

  .search-input:focus {
    border-color: rgba(109, 216, 138, 0.35);
    background: rgba(255,255,255,0.06);
  }

  .search-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: #6dd88a;
    border: none;
    border-radius: 10px;
    width: 38px;
    height: 38px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.15s;
    color: #06090f;
  }

  .search-btn:hover { background: #90e8a8; transform: translateY(-50%) scale(1.05); }
  .search-btn:active { transform: translateY(-50%) scale(0.97); }
  .search-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .weather-card {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 28px;
    padding: 32px;
    backdrop-filter: blur(20px);
    animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .city-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .city-name {
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #fff;
    line-height: 1.1;
  }

  .city-time {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #3a5045;
    margin-top: 4px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .condition-badge {
    background: rgba(109, 216, 138, 0.1);
    border: 1px solid rgba(109, 216, 138, 0.2);
    color: #6dd88a;
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 6px 12px;
    border-radius: 8px;
    white-space: nowrap;
  }

  .temp-display {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 28px;
  }

  .temp-big {
    font-size: clamp(3.6rem, 12vw, 5.5rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: #fff;
  }

  .temp-unit {
    font-size: 1.6rem;
    font-weight: 400;
    color: #3a5045;
    margin-top: 10px;
  }

  .temp-feels {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: #3a5045;
    margin-top: auto;
    padding-bottom: 10px;
    letter-spacing: 0.04em;
  }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin-bottom: 24px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }

  .stat-item {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .stat-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #2d3d32;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .stat-value {
    font-size: 1rem;
    font-weight: 700;
    color: #c8d8cd;
    letter-spacing: -0.01em;
  }

  .stat-icon {
    font-size: 1rem;
    margin-bottom: 2px;
  }

  .gear-section {
    width: 100%;
    background: rgba(109, 216, 138, 0.04);
    border: 1px solid rgba(109, 216, 138, 0.12);
    border-radius: 28px;
    padding: 28px 32px;
    backdrop-filter: blur(20px);
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  }

  .gear-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .gear-title {
    font-size: 0.95rem;
    font-weight: 800;
    color: #6dd88a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .gear-icon-header {
    font-size: 1.1rem;
  }

  .gear-run-note {
    font-family: 'DM Mono', monospace;
    font-size: 0.7rem;
    color: #3a5a45;
    margin-left: auto;
    font-style: italic;
  }

  .gear-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .gear-item {
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 13px 16px;
    transition: border-color 0.2s;
  }

  .gear-item:hover {
    border-color: rgba(109, 216, 138, 0.2);
  }

  .gear-item-icon {
    font-size: 1.4rem;
    width: 32px;
    text-align: center;
    flex-shrink: 0;
  }

  .gear-item-body {
    flex: 1;
  }

  .gear-item-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: #d8edd8;
    letter-spacing: -0.01em;
  }

  .gear-item-reason {
    font-family: 'DM Mono', monospace;
    font-size: 0.68rem;
    color: #3a5045;
    margin-top: 2px;
    letter-spacing: 0.02em;
  }

  .gear-priority {
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .priority-must {
    background: rgba(109, 216, 138, 0.15);
    color: #6dd88a;
    border: 1px solid rgba(109, 216, 138, 0.25);
  }

  .priority-rec {
    background: rgba(255, 200, 80, 0.1);
    color: #ffc850;
    border: 1px solid rgba(255, 200, 80, 0.2);
  }

  .priority-opt {
    background: rgba(150, 150, 170, 0.08);
    color: #6a7a8a;
    border: 1px solid rgba(150, 150, 170, 0.12);
  }

  .summary-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.76rem;
    line-height: 1.7;
    color: #3a5045;
    font-style: italic;
    border-left: 2px solid rgba(109, 216, 138, 0.2);
    padding-left: 14px;
    margin-top: 20px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 48px 0;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 2px solid rgba(109,216,138,0.1);
    border-top-color: #6dd88a;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: #2d3d32;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .error-box {
    width: 100%;
    background: rgba(255, 80, 80, 0.06);
    border: 1px solid rgba(255, 80, 80, 0.15);
    border-radius: 16px;
    padding: 20px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    color: #f08080;
    letter-spacing: 0.03em;
    animation: slideUp 0.3s ease;
  }

  .empty-hint {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: #1e2e22;
    letter-spacing: 0.06em;
    text-align: center;
    line-height: 1.8;
  }

  .powered-by {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    color: #1a2a1e;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
`;

function getOrbColors(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("sun") || c.includes("clear")) return ["#2d6e3a", "#f5a623"];
  if (c.includes("rain") || c.includes("drizzle")) return ["#1e4d7a", "#2d6e3a"];
  if (c.includes("snow") || c.includes("blizzard")) return ["#a8c8ef", "#4a8f6a"];
  if (c.includes("storm") || c.includes("thunder")) return ["#2a1d5e", "#1e4a2e"];
  if (c.includes("cloud") || c.includes("overcast")) return ["#1e3a2e", "#2d4a3a"];
  if (c.includes("fog") || c.includes("mist")) return ["#1e2e24", "#3a5040"];
  return ["#1a3a22", "#2d5a3a"];
}

export default function RunnerWeatherApp() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const orbColors = weather ? getOrbColors(weather.condition) : ["#1a3a22", "#0a1a10"];

  async function fetchWeather() {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          system: `You are a running coach and weather expert. The user gives a city. Search for current weather and respond ONLY with a valid JSON object — no prose, no markdown, no backticks. JSON fields:
{
  "city": "City, Country",
  "temperature_c": number,
  "temperature_f": number,
  "feels_like_c": number,
  "feels_like_f": number,
  "condition": "e.g. Partly Cloudy",
  "humidity": "e.g. 72%",
  "wind": "e.g. 14 km/h NW",
  "visibility": "e.g. 10 km",
  "uv_index": "e.g. 4 Moderate",
  "summary": "One sentence describing what it feels like to run outside right now.",
  "gear": [
    {
      "icon": "emoji",
      "name": "Gear item name",
      "reason": "Short reason why (weather-specific)",
      "priority": "must" or "recommended" or "optional"
    }
  ]
}

For gear, include 4-7 items relevant to running in those conditions. Consider temperature, rain, wind, UV, humidity. Examples: waterproof jacket, thermal base layer, long sleeve top, shorts, running tights, cap/visor, sunglasses, gloves, buff/neck gaiter, running vest, reflective gear, trail shoes, road shoes, hydration pack, sunscreen, sweatband. Priority must = essential, recommended = smart to bring, optional = nice to have. Return ONLY the JSON.`,
          messages: [{ role: "user", content: `Current weather in: ${query}` }],
        }),
      });

      const data = await response.json();
      const textBlock = data.content?.find((b) => b.type === "text");
      const raw = textBlock?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setWeather(parsed);
    } catch (e) {
      setError("Couldn't fetch weather data. Try a different city name.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter") fetchWeather();
  }

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

  const priorityLabel = { must: "Must", recommended: "Rec", optional: "Opt" };
  const priorityClass = { must: "priority-must", recommended: "priority-rec", optional: "priority-opt" };

  return (
    <>
      <style>{FONTS}{styles}</style>
      <div className="app">
        <div className="sky-bg">
          <div className="orb" style={{ width: 500, height: 500, top: -100, left: -100, background: orbColors[0] }} />
          <div className="orb" style={{ width: 400, height: 400, bottom: -80, right: -80, background: orbColors[1], animationDelay: "3s" }} />
        </div>

        <div className="content">
          <div className="header">
            <div className="header-eyebrow">🏃 For Runners</div>
            <h1>A Runner's <span>Weather</span><br/>Forecast</h1>
            <p>Live conditions · Gear advice · Powered by Claude AI</p>
          </div>

          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Enter your city — Boston, Berlin, Nairobi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="search-btn" onClick={fetchWeather} disabled={loading || !query.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <div className="loading-text">Checking conditions for your run...</div>
            </div>
          )}

          {error && <div className="error-box">⚠ {error}</div>}

          {weather && !loading && (
            <>
              <div className="weather-card">
                <div className="city-row">
                  <div>
                    <div className="city-name">{weather.city}</div>
                    <div className="city-time">{dateStr} · {timeStr}</div>
                  </div>
                  <div className="condition-badge">{weather.condition}</div>
                </div>

                <div className="temp-display">
                  <div className="temp-big">{Math.round(weather.temperature_c)}°</div>
                  <div className="temp-unit">C</div>
                  <div className="temp-feels">Feels like {Math.round(weather.feels_like_c)}°C / {Math.round(weather.feels_like_f)}°F</div>
                </div>

                <div className="divider" />

                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">💧</div>
                    <div className="stat-label">Humidity</div>
                    <div className="stat-value">{weather.humidity}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">💨</div>
                    <div className="stat-label">Wind</div>
                    <div className="stat-value">{weather.wind}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">👁</div>
                    <div className="stat-label">Visibility</div>
                    <div className="stat-value">{weather.visibility}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">🌡</div>
                    <div className="stat-label">Temp °F</div>
                    <div className="stat-value">{Math.round(weather.temperature_f)}°F</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">☀️</div>
                    <div className="stat-label">UV Index</div>
                    <div className="stat-value">{weather.uv_index}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">🌡</div>
                    <div className="stat-label">Feels °F</div>
                    <div className="stat-value">{Math.round(weather.feels_like_f)}°F</div>
                  </div>
                </div>

                {weather.summary && (
                  <div className="summary-text">{weather.summary}</div>
                )}
              </div>

              {weather.gear && weather.gear.length > 0 && (
                <div className="gear-section">
                  <div className="gear-header">
                    <span className="gear-icon-header">🎽</span>
                    <span className="gear-title">Gear Up</span>
                    <span className="gear-run-note">what to wear today</span>
                  </div>
                  <div className="gear-list">
                    {weather.gear.map((item, i) => (
                      <div className="gear-item" key={i}>
                        <div className="gear-item-icon">{item.icon}</div>
                        <div className="gear-item-body">
                          <div className="gear-item-name">{item.name}</div>
                          <div className="gear-item-reason">{item.reason}</div>
                        </div>
                        <div className={`gear-priority ${priorityClass[item.priority] || "priority-opt"}`}>
                          {priorityLabel[item.priority] || item.priority}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!weather && !loading && !error && (
            <div className="empty-hint">
              Search your city to get today's running conditions<br />and a personalised gear checklist
            </div>
          )}

          <div className="powered-by">Claude AI · Web Search · Live Data</div>
        </div>
      </div>
    </>
  );
}
