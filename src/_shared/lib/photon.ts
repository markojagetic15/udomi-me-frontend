// Photon (komoot's OSM geocoder) — built for search-as-you-type, unlike
// Nominatim whose usage policy forbids autocomplete.
export interface Place {
  id: string;
  name: string;
  context: string; // "Split-Dalmatia County, Croatia"
  city: string | null;
  lat: number;
  lng: number;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    osm_type: string;
    osm_id: number;
    name?: string;
    type?: string;
    district?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
  };
}

export const searchPlaces = async (
  query: string,
  opts: {
    countryCode?: string;
    layers?: string[];
    near?: { lat: number; lng: number } | null;
    signal?: AbortSignal;
  }
): Promise<Place[]> => {
  // No country filter param in Photon — over-fetch, filter client-side.
  const params = new URLSearchParams({ q: query, limit: '50', lang: 'en' });
  opts.layers?.forEach((l) => params.append('layer', l));
  if (opts.near) {
    params.set('lat', String(opts.near.lat));
    params.set('lon', String(opts.near.lng));
  }
  const res = await fetch(`https://photon.komoot.io/api/?${params}`, {
    signal: opts.signal,
  });
  if (!res.ok) throw new Error(`Photon ${res.status}`);
  const { features } = (await res.json()) as { features: PhotonFeature[] };
  return features
    .filter(
      (f) =>
        !opts.countryCode ||
        f.properties.countrycode?.toLowerCase() === opts.countryCode
    )
    .slice(0, 6)
    .map(({ geometry, properties: p }) => {
      const context = [p.district, p.city, p.county, p.state, p.country]
        .filter(
          (v, i, a): v is string => !!v && v !== p.name && a.indexOf(v) === i
        )
        .slice(0, 2)
        .join(', ');
      return {
        id: `${p.osm_type}${p.osm_id}`,
        name: p.name ?? '',
        context,
        city: p.type === 'city' ? (p.name ?? null) : (p.city ?? null),
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
      };
    });
};

export const geocodeAddress = async (address: string) => {
  const res = await fetch(
    `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1&lang=en`
  );
  const data = (await res.json()) as { features?: PhotonFeature[] };
  const c = data.features?.[0]?.geometry.coordinates;
  return c ? { lat: c[1], lng: c[0] } : null;
};
