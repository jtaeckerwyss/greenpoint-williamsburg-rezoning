mapboxgl.accessToken = 'pk.eyJ1IjoiZGJlcmdlcjMyNCIsImEiOiJjbTkxejI1ODYwMGQ1MmxvbWZreDZhMGgxIn0.nfxxsMs9W6jzp0-Wo-OEZg';

const map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/dark-v11',
    pitchWithRotate: false,
    dragRotate: false,
    dragPan: false,
    touchZoomRotate: false,
    scrollZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false
});

map.on('load', () => {
    fetch('./gwzd_v4.geojson')
        .then(response => response.json())
        .then(data => {
            // Fix misclassified polygon
            for (const feature of data.features) {
                if (
                    feature.properties.ZONING_CHANGE_TYPE === undefined ||
                    feature.properties.ZONING_CHANGE_TYPE === "Downzoned_or_Other"
                ) {
                    feature.properties.ZONING_CHANGE_TYPE = "Continued_Manufacturing";
                }
            }

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
                        'Upzoned_R_to_R', '#1976D2',
                        'Mixed_Use', '#BA68C8',
                        'Contextual', '#1976D2',
                        'Continued_Manufacturing', '#FB8C00',
                        'Downzoned', '#E0E0E0',
                        'Unchanged', '#E0E0E0',
                        'PARK', '#66BB6A',
                        '#E0E0E0'
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

            map.once('idle', () => {
                const bounds = turf.bbox(data);
                bounds[0] += 0.002;
                bounds[2] += 0.002;
                map.fitBounds(bounds, { padding: 40, maxZoom: 15 });
            });

            // Hover Popup
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false,
                anchor: 'bottom',
                offset: [0, -10]
            });

            map.on('mousemove', 'gwzd-fill', (e) => {
                map.getCanvas().style.cursor = 'pointer';
                const props = e.features[0].properties;

                const description = `
                    <div style="
                        background:black;
                        color:white;
                        padding:8px;
                        border-radius:6px;
                        line-height:1.15;
                        font-family:sans-serif;
                        font-size:13px;
                    ">
                        <strong>${props.NEIGHBORHOOD}</strong><br>
                        Prior Zoning: ${props.PRIOR_ZONING}<br>
                        New Zoning: ${props.ZONEDIST}
                    </div>
                `;

                popup.setLngLat(e.lngLat).setHTML(description).addTo(map);
            });

            map.on('mouseleave', 'gwzd-fill', () => {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });
});
