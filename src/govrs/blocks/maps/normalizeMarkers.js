const DEFAULT_CENTER = { lat: -23.55, lng: -46.64 };

export function normalizeMarkers(markers = []) {
  return (markers || [])
    .filter((marker) => marker && marker.lat != null && marker.lng != null)
    .map((marker, index) => ({
      id: marker.id || `marker-${index}`,
      lat: Number(marker.lat),
      lng: Number(marker.lng),
      title: marker.title || '',
    }));
}

export function getMapCenter(markers = []) {
  if (markers.length > 0) {
    return { lat: markers[0].lat, lng: markers[0].lng };
  }

  return DEFAULT_CENTER;
}

export const DEFAULT_MAP_ZOOM = 12;
