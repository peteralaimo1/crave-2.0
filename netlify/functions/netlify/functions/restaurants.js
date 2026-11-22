
// Crave restaurant lookup proxy for Netlify.
// The browser calls this same-origin function; this function queries Overpass.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter"
];

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  },
  body: JSON.stringify(body)
});

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Allow": "POST, OPTIONS" }, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Use POST for restaurant searches." });
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "The search request was not valid JSON." });
  }

  const lat = Number(input.lat);
  const lon = Number(input.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return json(400, { error: "A valid map location is required." });
  }

  const query = `[out:json][timeout:20];(node["amenity"~"restaurant|cafe|fast_food|food_court"](around:8000,${lat},${lon});way["amenity"~"restaurant|cafe|fast_food|food_court"](around:8000,${lat},${lon}););out center tags 50;`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4200);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Accept": "application/json",
          "User-Agent": "CraveFoodDiscovery/2.0"
        },
        body: query,
        signal: controller.signal
      });
      if (!response.ok) continue;

      const data = await response.json();
      const items = (data.elements || []).map((element) => {
        const tags = element.tags || {};
        const latitude = element.center?.lat ?? element.lat;
        const longitude = element.center?.lon ?? element.lon;
        return {
          name: tags.name || "",
          type: tags.amenity || "restaurant",
          cuisine: (tags.cuisine || "").replace(/;/g, ", "),
          address: [
            tags["addr:housenumber"],
            tags["addr:street"],
            tags["addr:city"]
          ].filter(Boolean).join(" "),
          lat: latitude,
          lon: longitude
        };
      }).filter((place) =>
        place.lat !== undefined && place.lon !== undefined &&
        Number.isFinite(Number(place.lat)) && Number.isFinite(Number(place.lon))
      ).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      return json(200, { items });
    } catch (error) {
      // Try the next public Overpass endpoint if this one is unavailable.
    } finally {
      clearTimeout(timer);
    }
  }

  return json(503, {
    error: "The OpenStreetMap search services are temporarily unavailable. Please try again shortly."
  });
};
