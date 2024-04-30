import React, { useState } from 'react';
import { GoogleMap, LoadScriptNext, Marker, InfoWindow } from '@react-google-maps/api';

const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

const mapContainerStyle = {
    height: '300px',
    width: '400px',
    borderRadius: '20px',
    marginBottom: '30px'
};

const center = {
    lat: 1.3521,
    lng: 103.8198
};

const options = {
    zoomControl: true,
};

function Map() {
    const [markerPosition, setMarkerPosition] = useState(center);
    const [showInfoWindow, setShowInfoWindow] = useState(false);

    function onMarkerDragEnd(event) {
        setMarkerPosition({
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
        });
    }

    function handleMarkerClick() {
        setShowInfoWindow(true);
    }

    function handleCloseClick() {
        setShowInfoWindow(false);
    }

    return (
        <LoadScriptNext googleMapsApiKey={MAP_KEY}>
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={8}
            options={options}
        >
            <Marker
            position={markerPosition}
            onClick={handleMarkerClick}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
            />
            {showInfoWindow && (
            <InfoWindow
                position={markerPosition}
                onCloseClick={handleCloseClick}
            >
                <div>
                <h2>Marker Position</h2>
                <p>Latitude: {markerPosition.lat.toFixed(4)}</p>
                <p>Longitude: {markerPosition.lng.toFixed(4)}</p>
                </div>
            </InfoWindow>
            )}
        </GoogleMap>
        </LoadScriptNext>
    );
}
export default Map;