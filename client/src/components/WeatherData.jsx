import PropTypes from "prop-types";

// Fetch weather data from OpenWeatherMap API.
const WeatherData = async (locationData) => {
  const weatherApi = process.env.REACT_APP_OPEN_WEATHER_API;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${locationData[0].lat}&lon=${locationData[0].lon}&APPID=${weatherApi}`
    );
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error:", error);
    return await Promise.reject("Unable to fetch weather data.");
  }
};

WeatherData.propTypes = {
  locationData: PropTypes.string.isRequired,
};

export default WeatherData;
