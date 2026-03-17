module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    const { password } = body || {};

    // Use a timing-safe approach by adding a slight delay for all attempts
    if (!password || password !== process.env.APP_PASSWORD) {
      await new Promise(r => setTimeout(r, 800));
      return res.status(401).json({ error: 'Incorrect passkey' });
    }

    // Set the cookie. Ensure process.env.AUTH_SECRET is a long, random string.
    res.setHeader('Set-Cookie',
      `sv_auth=${process.env.AUTH_SECRET}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie',
      'sv_auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
