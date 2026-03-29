import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Text } from '@mantine/core';

interface MapLocation {
    id: string;
    name: string;
    coords: { lat: number; lng: number };
    address: string;
    location: string;
}

interface GoogleMapComponentProps {
    locations: MapLocation[];
    apiKey?: string;
    zoom?: number;
    selectable?: boolean;
    onLocationSelect?: (coords: { lat: number, lng: number }, address: string) => void;
}

const containerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 27.7172,
    lng: 85.3240
};

// Premium Map Styling
const mapOptions = {
    disableDefaultUI: false,
    clickableIcons: false,
    styles: [
        { "featureType": "all", "elementType": "geometry.fill", "stylers": [{ "weight": "2.00" }] },
        { "featureType": "all", "elementType": "geometry.stroke", "stylers": [{ "color": "#9c9c9c" }] },
        { "featureType": "all", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] },
        { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] },
        { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] },
        { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] },
        { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
        { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] },
        { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#46bcec" }, { "visibility": "on" }] }
    ]
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({
    locations,
    apiKey = "", // USER: PLEASE PUT YOUR GOOGLE MAPS API KEY HERE
    zoom = 13,
    selectable = false,
    onLocationSelect
}) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey
    });

    const [selectedLoc, setSelectedLoc] = useState<MapLocation | null>(null);
    const [userMarker, setUserMarker] = useState<{ lat: number, lng: number } | null>(null);

    const mapCenter = locations.length === 1
        ? locations[0].coords
        : defaultCenter;

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!selectable || !e.latLng) return;
        
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const coords = { lat, lng };
        
        setUserMarker(coords);
        
        if (onLocationSelect) {
            // Mocking reverse geocoding
            const mockAddress = `Sector ${Math.floor(lat)}, Street ${Math.floor(lng)}, Kathmandu`;
            onLocationSelect(coords, mockAddress);
        }
    };

    if (!isLoaded) return (
        <Box style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
            <Text c="dimmed">Loading Google Maps...</Text>
        </Box>
    );

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={zoom}
            options={mapOptions}
            onClick={handleMapClick}
        >
            {locations.map((loc) => (
                <Marker
                    key={loc.id}
                    position={loc.coords}
                    onClick={() => setSelectedLoc(loc)}
                />
            ))}

            {userMarker && (
                <Marker 
                    position={userMarker} 
                    icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                    }}
                />
            )}

            {selectedLoc && (
                <InfoWindow
                    position={selectedLoc.coords}
                    onCloseClick={() => setSelectedLoc(null)}
                >
                    <div style={{ padding: '8px', minWidth: '150px', background: '#fff' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1a1a1a', fontWeight: 600 }}>{selectedLoc.name}</h4>
                        <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '4px', fontWeight: 500 }}>{selectedLoc.location}</div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{selectedLoc.address}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default React.memo(GoogleMapComponent);
