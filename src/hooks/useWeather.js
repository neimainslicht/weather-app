import { useState } from 'react';
import { fetchCityList } from '../services/geoCodingApi';

export function useWeather(){
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function searchCity(query) {
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
    return {
        locations,
        loading,
        error,
        searchCity
    }
}