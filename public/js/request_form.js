// Initialize the map with user's current location
let map;
let marker;
let selectedLat;
let selectedLng;
const defaultZoom = 14;
const defaultLat = 13.1833; // Default to Bansud, Oriental Mindoro
const defaultLng = 121.8667;

// Bansud bounds to restrict map view
const bansudBounds = [
    [13.0800, 121.7600], // Southwest corner
    [13.2800, 122.0000]  // Northeast corner
];

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupFormSubmission();
});

function initializeMap() {
    // Get user's current location with high accuracy
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                
                // Clamp coordinates to Bansud bounds
                latitude = Math.max(13.0800, Math.min(13.2800, latitude));
                longitude = Math.max(121.7600, Math.min(122.0000, longitude));
                
                createMap(latitude, longitude);
            },
            function(error) {
                console.warn('Geolocation error:', error.message);
                // Fallback to default location if geolocation fails
                console.warn('Using default location fallback');
                createMap(defaultLat, defaultLng);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.warn('Geolocation not supported');
        // Fallback to default location
        createMap(defaultLat, defaultLng);
    }
}

function createMap(latitude, longitude) {
    // Initialize the map with bounds restriction to Bansud only
    map = L.map('map', {
        maxBounds: bansudBounds,
        maxBoundsViscosity: 1.0
    }).setView([latitude, longitude], defaultZoom);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Create a draggable marker with a custom icon
    marker = L.marker([latitude, longitude], {
        draggable: true,
        title: 'Drag to pinpoint location or click on map'
    }).addTo(map);

    // Add a popup to the marker
    marker.bindPopup('Drag me to adjust location');

    // Update coordinates when marker is dragged
    marker.on('dragend', function() {
        const position = marker.getLatLng();
        updateCoordinates(position.lat, position.lng);
    });

    // Update coordinates when map is clicked
    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        updateCoordinates(e.latlng.lat, e.latlng.lng);
    });

    // Set initial coordinates and get address
    updateCoordinates(latitude, longitude);

    // Resize map to fit container
    map.invalidateSize();
}

function updateCoordinates(latitude, longitude) {
    selectedLat = latitude;
    selectedLng = longitude;

    // Update hidden form fields
    document.getElementById('latitude').value = latitude.toFixed(6);
    document.getElementById('longitude').value = longitude.toFixed(6);

    // Update display if location info element exists, or create one
    updateLocationDisplay(latitude, longitude);

    console.log('Location updated:', latitude, longitude);
}

function updateLocationDisplay(latitude, longitude) {
    // Try to get address using OpenStreetMap Nominatim (free reverse geocoding)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const address = data.address || {};
            const displayName = data.display_name || 'Unknown location';
            
            // Create or update location info display
            let locationInfo = document.getElementById('location-info');
            if (!locationInfo) {
                locationInfo = document.createElement('div');
                locationInfo.id = 'location-info';
                locationInfo.style.cssText = 'margin-top: 15px; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #0066cc; border-radius: 4px; font-size: 14px;';
                const mapContainer = document.getElementById('map');
                mapContainer.parentNode.insertBefore(locationInfo, mapContainer.nextSibling);
            }
            
            locationInfo.innerHTML = `
                <strong style="color: #0066cc;">Selected Location:</strong><br>
                <div style="margin-top: 8px; color: #333;">
                    ${displayName}
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    <strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                </div>
            `;
        })
        .catch(error => {
            console.log('Could not fetch address, showing coordinates only:', error);
            
            // Fallback to coordinates only
            let locationInfo = document.getElementById('location-info');
            if (!locationInfo) {
                locationInfo = document.createElement('div');
                locationInfo.id = 'location-info';
                locationInfo.style.cssText = 'margin-top: 15px; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #0066cc; border-radius: 4px; font-size: 14px;';
                const mapContainer = document.getElementById('map');
                mapContainer.parentNode.insertBefore(locationInfo, mapContainer.nextSibling);
            }
            
            locationInfo.innerHTML = `
                <strong style="color: #0066cc;">Selected Location:</strong><br>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    <strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                </div>
            `;
        });
}

function setupFormSubmission() {
    const form = document.getElementById('reqForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Verify that location was selected
            const latitude = document.getElementById('latitude').value;
            const longitude = document.getElementById('longitude').value;

            if (!latitude || !longitude) {
                alert('Please select a location on the map before submitting.');
                return;
            }

            // Proceed with form submission
            // You can add additional validation or AJAX submission here
            console.log('Form submitted with location:', latitude, longitude);
            // Uncomment to actually submit the form:
            // form.submit();
        });
    }
}
