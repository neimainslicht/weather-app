const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "http://api.openweathermap.org/geo/1.0/direct";

export async function fetchCityList(city) {
  const response = await fetch(
    `${BASE_URL}?q=${city}&limit=5&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities");
  }
  const data = await response.json();

  if (data.length == 0) {
    throw new Error("No matching cities found");
  }
  console.log(data);

  return data.map((city) => ({
    id: crypto.randomUUID(),
    name: city.name,
    lat: city.lat,
    lon: city.lon,
    country: city.country,
    state: city.state

  }));
}
