import React, { useEffect } from 'react';
import Geolocation from '../components/Geolocation';

const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;
const ACCESS_KEY = process.env.NEXT_PUBLIC_IMG_KEY;

function Image({ setImg }) {
    const location = Geolocation();  

    useEffect(() => {
        const fetchAddress = async () => {
            if (!location) return;  

            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${MAP_KEY}`;

            try {
                const response = await fetch(geocodeUrl);
                const data = await response.json();
                console.log(data);
                if (data.results.length > 0) {
                    const address = data.results[0].formatted_address;
                    return address;  
                }
                throw new Error("No address found for this location.");
            } catch (error) {
                console.error("Failed to fetch address", error);
                return null;
            }
        };

        const fetchImages = async (address) => {
            if (!address) return; 

            try {
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${address}&page=1&per_page=1&client_id=${ACCESS_KEY}`);
                const data = await response.json();
                console.log(data);
                if (data.results.length > 0) {
                    setImg(data.results[0].urls.raw);
                }
            } catch (error) {
                console.error("Failed to fetch images", error);
            }
        };

        fetchAddress().then(address => {
            fetchImages(address);
        });
    }, [location, setImg]);

    return null;  
}

export default Image;
