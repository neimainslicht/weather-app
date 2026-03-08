import { useState } from 'react';
import { fetchCityList } from '../services/geoCodingApi';
import { fetchWeather } from '../services/weatherApi';

export function useWeather(){
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [weather, setWeather] = useState(null);
    const [condition, setCondition] = useState(null);


    async function searchCity(query) {
        setWeather(null);
        setLoading(true);
        setError(null);

        try {
            const results = await fetchCityList(query);
            setLocations(results);
        } catch (error) {
            setError(error.message);
            setLocations([]);
        } finally {
            setLoading(false);
        }
        
    }

    async function searchWeather(lat, lon){
        setLoading(true);
        setError(null);
        try {
            const results = await fetchWeather(lat, lon);
            setWeather(results);
            setCondition(results.condition.replace(/\s+/g, ''));
        } catch (error) {
            setError(error.message);
            setWeather(null); 
        }
        finally {
            setLocations([]);
            setLoading(false);
        }
    }
    return {
        locations,
        loading,
        error,
        weather,
        condition,
        searchCity,
        searchWeather
    }
}