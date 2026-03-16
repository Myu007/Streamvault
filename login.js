module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false });
  }

  const { password } = req.body;

  if (password === process.env.SITE_PASSWORD) {
    res.setHeader(
      'Set-Cookie',
      'auth=true; HttpOnly; Secure; Path=/; Max-Age=86400; SameSite=Strict'
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ ok: false });
};
