import React, { useState, useEffect } from 'react';
import GlobalCss from '../components/GlobalCss';
import NavBar from '../components/NavBar';
import WelcomeDescr from '../components/WelcomeDescr';
import Image from '../components/Image';
import Geolocation from '../components/Geolocation';
import { Paper } from '@mui/material';

const MAP_KEY = process.env.NEXT_PUBLIC_MAP_KEY;

export default function App() {
    const currentLocation = Geolocation();
    const [img, setImg] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        async function fetchData() {
            if (currentLocation !== null) {
                try {
                    const fetchedAddress = await fetchLocationDescription(currentLocation.lat, currentLocation.lng);
                    console.log(fetchedAddress)
                    setAddress(fetchedAddress);
                } catch (error) {
                    setAddress('Changi Airport');
                }
            }
        }

        fetchData();
    }, [currentLocation]);

    async function fetchLocationDescription(lat, lng) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAP_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'OK') {
                return data.results[0].formatted_address;
            } else {
                throw new Error('Location not available, request user to input manually!');
            }
        } catch (error) {
            throw new Error('Error fetching geocode data:');
        }
    }


    return (
        <>
            <GlobalCss />
            <NavBar />
            <Image address={address} setImg={setImg} />
            <Paper sx={{
                width: '100vw',
                height: '100vh',
                backgroundImage: `url(${img[0]})`,
                backgroundSize: 'cover',
            }}>
                <WelcomeDescr />
            </Paper>
        </>
    );
}