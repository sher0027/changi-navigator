import React, { useState, useEffect } from "react";
import {Box, Divider, Typography } from "@mui/material";

const Weather = ({ lat, lng }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [destinationWeather, setDestinationWeather] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
        console.log("lat and lng is", lat, lng);
        if (!lat || !lng) return;

        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setWeatherData(data.current);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
        }
        };

        fetchData();

        const fetchDestinationWeather = async () => {
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
        const destLat = "1.359167";
        const destLon = "103.989441";
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${destLat}&lon=${destLon}&appid=${apiKey}&units=metric`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDestinationWeather(data.current);
        } catch (error) {
            console.error("Failed to fetch destination weather data:", error);
        }
        };

        fetchDestinationWeather();
    }, [lat, lng]);

    if (!weatherData) {
        return <p>Loading...</p>;
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            bgcolor: '#FFFFFF',
            borderRadius: '10px',
            width: '100%',
            margin: '20px auto',
            padding: '10px',
            // width: '400px',
            boxSizing: 'border-box'
        }}>
            <Box sx={{flex: 1}}>
                <Typography variant="h6" gutterBottom> Current Weather </Typography>
                <Typography> Temperature: {weatherData.temp}°C </Typography>
                <Typography> Condition: {weatherData.weather[0].main}
                </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{flex: 1}}>
                <Typography variant="h6" gutterBottom> Changi Weather </Typography>
                <Typography> Temperature: {destinationWeather.temp}°C </Typography>
                <Typography> Condition: {destinationWeather.weather[0].main} </Typography>
            </Box>
        </Box>
    );
};

export default Weather;
