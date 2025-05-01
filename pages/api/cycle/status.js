export default async function handler(req, res) {
  const API_KEY = process.env.FRED_API_KEY;

  const series = {
    fed_funds: "FEDFUNDS",
    ten_year: "GS10",
    cpi: "CPIAUCSL",
    unemployment: "UNRATE",
    gdp: "GDPC1"
  };

  const results = {};

  for (const [key, seriesId] of Object.entries(series)) {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${API_KEY}&file_type=json&sort_order=desc&limit=1`;
    const r = await fetch(url);
    const json = await r.json();
    const val = parseFloat(json.observations[0].value);
    results[key] = val;
  }

  let stage = "Expansion";
  if (results.gdp < 0) stage = "Contraction";
  if (results.fed_funds > results.ten_year) stage = "Late Expansion";

  res.status(200).json({ stage, ...results });
}
