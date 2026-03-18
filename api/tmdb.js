module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { path, params } = req.query;
  if (!path) return res.status(400).json({ error: 'Missing path' });
  const allowed = ['/genre/', '/trending/', '/movie/', '/tv/', '/search/', '/person/', '/discover/'];
  if (!allowed.some(p => path.startsWith(p))) {
    return res.status(403).json({ error: 'Path not allowed' });
  }
  try {
    const decoded = params ? decodeURIComponent(params) : '';
    const url = `https://api.themoviedb.org/3${path}?language=en-US${decoded ? '&' + decoded : ''}`;
    const r = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TMDB_TOKEN}`
      }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'TMDB error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', message: e.message });
  }
};
