mapboxgl.accessToken = 'pk.eyJ1IjoiZGJlcmdlcjMyNCIsImEiOiJjbTkxejI1ODYwMGQ1MmxvbWZreDZhMGgxIn0.nfxxsMs9W6jzp0-Wo-OEZg';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/dark-v11',
    pitch: 20
});

map.on('load', () => {
    fetch('./gwzd_v3.geojson')
        .then(response => response.json())
        .then(data => {
            map.addSource('greenpoint-williamsburg', {
                type: 'geojson',
                data: data
            });

            map.addLayer({
                id: 'gwzd-fill',
                type: 'fill',
                source: 'greenpoint-williamsburg',
                paint: {
                    'fill-color': [
                        'match',
                        ['get', 'ZONING_CHANGE_TYPE'],
                        'Upzoned_M_to_R', '#1976D2',
                        'Upzoned_R_to_R', '#64B5F6',
                        'Mixed_Use', '#BA68C8',
                        'Contextual', '#EF5350',
                        'Continued_Manufacturing', '#FB8C00',
                        'Downzoned', '#C62828',
                        'Unchanged', '#E0E0E0',
                        'PARK', '#66BB6A',
                        '#000000' // fallback
                    ],
                    'fill-opacity': 0.4
                }
            });

            map.addLayer({
                id: 'gwzd-outline',
                type: 'line',
                source: 'greenpoint-williamsburg',
                paint: {
                    'line-color': '#ffffff',
                    'line-width': 1
                }
            });

            // ✅ Delay fitBounds until map finishes rendering
            map.once('idle', () => {
                const bounds = turf.bbox(data); // [west, south, east, north]

                // Move the entire box slightly east (shift west/east bounds)
                bounds[0] += 0.002; // move west edge east
                bounds[2] += 0.002; // move east edge east

                map.fitBounds(bounds, {
                    padding: 40,
                    maxZoom: 15
                });
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
});
