mapboxgl.accessToken = 'pk.eyJ1IjoiZGJlcmdlcjMyNCIsImEiOiJjbTkxejI1ODYwMGQ1MmxvbWZreDZhMGgxIn0.nfxxsMs9W6jzp0-Wo-OEZg';

// Zoning center and zoom
const map = new mapboxgl.Map({
    container: 'map-container',
    center: [-73.947, 40.7195],
    zoom: 13.5,
    style: 'mapbox://styles/mapbox/dark-v11',
    maxBounds: [[-73.961, 40.709], [-73.933, 40.730]],
    pitch: 20,
});

map.on('load', () => {
    // Add GeoJSON source
    map.addSource('greenpoint-williamsburg', {
        type: 'geojson',
        data: './gwzd.geojson' // In same folder as HTML

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

    // 🔧 For future: dynamic color styling example
    // 'fill-color': ['match', ['get', 'property_name'], 'value1', '#color1', 'value2', '#color2', '#defaultColor']
});

