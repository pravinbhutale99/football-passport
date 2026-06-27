export default async function handler(req, res) {
  const { league } = req.query;

  if (!league) {
    return res.status(400).json({ error: 'League code required' });
  }

  const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || 'f68179f31eb44e6c8df523f3535e32ac';

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${league}/matches`,
      {
        headers: {
          'X-Auth-Token': API_KEY,
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();

    // Cache for 60 seconds
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
