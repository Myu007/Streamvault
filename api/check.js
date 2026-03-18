module.exports = (req, res) => {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/sv_auth=([^;]+)/);
  const token = match ? match[1] : null;
  if (token && token === process.env.AUTH_SECRET) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
};
