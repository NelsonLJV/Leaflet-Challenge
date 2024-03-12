// Initialize the Leaflet map
let map = L.map('map').setView([37.09, -95.71], 5);


// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Use the earthquake data url json
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';

// Load and process the GeoJSON data
d3.json(url).then(function (data) {
    // Markers for each earthquake location
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // Marker size and depth fro color
            let markerSize = feature.properties.mag * 5;
            let markerColor = getColor(feature.geometry.coordinates[2] ); 

            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: markerColor,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            // Include hover-over box messages with small details about each earthquake.
            layer.bindPopup('Magnitude: ' + feature.properties.mag + '<br>Location: ' + feature.properties.place +
                '<br>Depth: ' + feature.geometry.coordinates[2] + ' km');
        }
    }).addTo(map);

    // Add a legend
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [0, 10, 30, 50, 70, 90];

        div.innerHTML += '<h4>Depth</h4>';
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
});

// Create a function that would fetch us a certain color based off depth of earthquake
function getColor(d) {
    return d > 90 ? '#c21f06' :
        d > 70 ? '#cc4106' :
        d > 50 ? '#d66a0b' :
        d > 30 ? '#c7a904' :
        d > 10 ? '#f5e278' :
        '#e3da98';
}



