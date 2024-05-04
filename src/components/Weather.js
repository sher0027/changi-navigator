import React, { useState, useEffect } from "react";

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
    <div style={styles.weatherContainer}>
      <div style={styles.currWeatherSection}>
        <h3>Current Weather</h3>
        <p>Temperature: {weatherData.temp}°C</p>
        <p>Condition: {weatherData.weather[0].main}</p>
      </div>
      <div style={styles.destWeatherSection}>
        <h3>Changi Weather</h3>
        <p>Temperature: {destinationWeather.temp}°C</p>
        <p>Condition: {destinationWeather.weather[0].main}</p>
      </div>
    </div>
  );
};

const styles = {
  weatherContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "20px",
    width: "360px",
    maxWidth: "500px",
    margin: "20px auto",
    textAlign: "center",
  },
  currWeatherSection: {
    padding: "20px",
    borderRight: "1px solid #ddd",
    marginBottom: "10px",
  },
  destWeatherSection: {
    padding: "20px",
    marginBottom: "10px",
  },
};

export default Weather;
