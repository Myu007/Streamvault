export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path, params } = req.query;

  if (!path) {
    return res.status(400).json({ error: 'Missing path' });
  }

  // Whitelist allowed TMDB paths
  const allowed = ['/genre/', '/trending/', '/movie/', '/tv/', '/search/', '/person/', '/discover/'];
  if (!allowed.some(p => path.startsWith(p))) {
    return res.status(403).json({ error: 'Path not allowed' });
  }

  try {
    // params arrives URL-encoded — decode it first before appending
    const decodedParams = params ? decodeURIComponent(params) : '';
    const query = decodedParams ? `&${decodedParams}` : '';
    const url = `https://api.themoviedb.org/3${path}?language=en-US${query}`;

    const tmdbRes = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    if (!tmdbRes.ok) {
      return res.status(tmdbRes.status).json({ error: 'TMDB error', status: tmdbRes.status });
    }

    const data = await tmdbRes.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}
