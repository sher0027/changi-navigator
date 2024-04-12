import React from 'react';
import { GoogleMap, LoadScriptNext, Marker } from '@react-google-maps/api';

const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

const mapContainerStyle = {
  height: '400px',
  width: '400px',
  borderRadius: '20px',
  margin: 'auto'
};

const center = {
    lat: -34.397,
    lng: 150.644
};

function Map() {
    return (
        <LoadScriptNext googleMapsApiKey={MAP_KEY}>
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={8}
        >
            <Marker position={center} />
        </GoogleMap>
        </LoadScriptNext>
    );
}

export default Map;
