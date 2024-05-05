import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import Geolocation from "../components/Geolocation";

const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

const mapContainerStyle = {
  height: "300px",
  width: "400px",
  borderRadius: "20px",
  marginBottom: "30px",
};

const options = {
  zoomControl: true,
};

function Map({ onLocationChange }) {
    const currentLocation = Geolocation();  
    const [markerPosition, setMarkerPosition] = useState(null);
    const [isMarkerSet, setIsMarkerSet] = useState(false); 
    const [showInfoWindow, setShowInfoWindow] = useState(false);


    useEffect(() => {
        if (currentLocation && !isMarkerSet) { 
            setMarkerPosition(currentLocation);
            setIsMarkerSet(true); 
            if (onLocationChange) {
                onLocationChange(currentLocation);
            }
        }
    }, [currentLocation, onLocationChange]);

    function onMarkerDragEnd(event) {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        const newLocation = { lat: newLat, lng: newLng };
        setMarkerPosition(newLocation);
        if (onLocationChange) {
            onLocationChange(newLocation);
        }
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
            center={markerPosition || currentLocation}
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
            <InfoWindow position={markerPosition} onCloseClick={handleCloseClick}>
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