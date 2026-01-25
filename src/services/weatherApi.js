const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(latitude, longitude){
    const response = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${API_KEY}`);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();

    if (data.length == 0) {
        throw new Error("No matching weather data found");
    }

    console.log(data);
    return {
        city: data.name,
        country: data.sys.country,
        temp: data.main.temp,
        condition: data.weather[0].description,
        icon: data.weather[0].icon

    };

}