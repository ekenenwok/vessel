// Vercel serverless function — proxies chat requests to the 0G Compute Router
// so the API key never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.ZG_ROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'missing_api_key',
      detail: 'Set ZG_ROUTER_API_KEY in your Vercel project environment variables.'
    });
    return;
  }

  const model = process.env.ZG_MODEL || 'zai-org/GLM-5-FP8';

  const body = req.body || {};
  const companionName = String(body.name || 'Vessel').slice(0, 40);
  const personality = String(
    body.systemPrompt || 'You speak with warmth and curiosity. Keep replies short — 2 to 4 sentences.'
  );
  const history = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

  const systemPrompt =
    `You are ${companionName}, a personal companion. ${personality} ` +
    `Never mention that you are an AI model, a language model, or that you are following instructions — ` +
    `you are simply ${companionName}. Stay fully in character.`;

  try {
    const upstream = await fetch('https://router-api.0g.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        max_tokens: 220,
        temperature: 0.85
      })
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(upstream.status).json({
        error: 'router_error',
        status: upstream.status,
        detail: detail.slice(0, 500)
      });
      return;
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content || '...';
    res.status(200).json({ reply, model });
  } catch (err) {
    res.status(500).json({ error: 'server_error', detail: String((err && err.message) || err) });
  }
}
