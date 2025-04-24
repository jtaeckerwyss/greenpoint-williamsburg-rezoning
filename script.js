mapboxgl.accessToken = 'pk.eyJ1IjoiZGJlcmdlcjMyNCIsImEiOiJjbTkxejI1ODYwMGQ1MmxvbWZreDZhMGgxIn0.nfxxsMs9W6jzp0-Wo-OEZg';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/dark-v11',
    pitch: 20
    // No center or zoom — we’ll fit the map using the GeoJSON bounds
});

map.on('load', () => {
    fetch('./gwzd.geojson')
        .then(response => response.json())
        .then(data => {
            // Add GeoJSON source
            map.addSource('greenpoint-williamsburg', {
                type: 'geojson',
                data: data
            });

            // Add solid fill layer
            map.addLayer({
                id: 'gwzd-fill',
                type: 'fill',
                source: 'greenpoint-williamsburg',
                paint: {
                    'fill-color': '#00BCD4',
                    'fill-opacity': 0.5
                }
            });

            // Outline
            map.addLayer({
                id: 'gwzd-outline',
                type: 'line',
                source: 'greenpoint-williamsburg',
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 1
                }
            });

            // Auto-zoom to bounds of the GeoJSON
            const bounds = turf.bbox(data);
            map.fitBounds(bounds, {
                padding: 40,
                maxZoom: 15
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
});