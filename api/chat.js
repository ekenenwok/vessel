// Vercel serverless function — proxies chat requests to Groq's free API
// so the key never reaches the browser.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'missing_api_key',
      detail: 'Set GROQ_API_KEY in your Vercel project environment variables.'
    });
    return;
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  const body = req.body || {};
  const companionName = String(body.name || 'Vessel').slice(0, 40);
  const personality = String(
    body.systemPrompt || 'You speak with warmth and curiosity. Keep replies sho
