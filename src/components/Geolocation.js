import { useState, useEffect } from 'react';

function Geolocation() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position);
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("Geolocation error: ", error);
                    setLocation(null);  // Handle error by setting location to null or a default value
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLocation(null);  // Set to null or a default value
        }
    }, []);

    return location;
}

export default Geolocation;
