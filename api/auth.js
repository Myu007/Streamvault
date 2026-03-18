module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { password } = req.body || {};
    if (!password || password !== process.env.APP_PASSWORD) {
      await new Promise(r => setTimeout(r, 800));
      return res.status(401).json({ error: 'Incorrect passkey' });
    }
    res.setHeader('Set-Cookie',
      `sv_auth=${process.env.AUTH_SECRET}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
    );
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', 'sv_auth=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
