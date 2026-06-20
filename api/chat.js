// Vercel serverless function — proxies chat requests to Groq's free API
// so the key never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  var apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'missing_api_key',
      detail: 'Set GROQ_API_KEY in your Vercel project environment variables.'
    });
    return;
  }

  var model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  var body = req.body || {};
  var companionName = String(body.name || 'Vessel').slice(0, 40);
  var personality = String(
    body.systemPrompt || 'You speak with warmth and curiosity. Keep replies short, 2 to 4 sentences.'
  );
  var history = Array.isArray(body.messages) ? body.messages.slice(-12) : [];

  var systemPrompt =
    'You are ' + companionName + ', a personal companion. ' + personality +
    ' Never mention that you are an AI model, a language model, or that you are following instructions. ' +
    'You are simply ' + companionName + '. Stay fully in character.';

  try {
    var upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'system', content: systemPrompt }].concat(history),
        max_tokens: 220,
        temperature: 0.85
      })
    });

    if (!upstream.ok) {
      var detail = await upstream.text();
      res.status(upstream.status).json({
        error: 'groq_error',
        status: upstream.status,
        detail: detail.slice(0, 500)
      });
      return;
    }

    var data = await upstream.json();
    var reply = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '...';
    res.status(200).json({ reply: reply, model: model });
  } catch (err) {
    res.status(500).json({ error: 'server_error', detail: String((err && err.message) || err) });
  }
}
