export default async function handler(req, res) {

  // POST — login
  if (req.method === 'POST') {
    const { password } = req.body;

    if (!password || password !== process.env.APP_PASSWORD) {
      // Deliberate delay to slow brute force — use async sleep not setTimeout+return
      await new Promise(r => setTimeout(r, 800));
      return res.status(401).json({ error: 'Incorrect passkey' });
    }

    // Correct — set auth cookie (7 days)
    res.setHeader('Set-Cookie',
      `sv_auth=${process.env.AUTH_SECRET}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
    );
    return res.status(200).json({ ok: true });
  }

  // DELETE — logout
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie',
      'sv_auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
