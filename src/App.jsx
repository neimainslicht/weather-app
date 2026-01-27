import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { WeatherCard } from './components/WeatherCard.jsx'
import './App.css'
import { LoadingPage } from './components/LoadingPage.jsx'
import { ErrorPage } from './components/ErrorPage.jsx'
import { useWeather } from './hooks/useWeather.js'
import { CityList } from './components/CityList.jsx'
import '.\\SpriteAnimation.css'


function App() {
  const {
    locations,
    loading,
    error,
    weather,
    searchCity,
    searchWeather
  } = useWeather();
 

  return (
    <>
      <div className="sprite-character">
        <SearchBar onSearch={searchCity}/>
        {loading && <LoadingPage/>}
        {error && <ErrorPage errorMessage={error}/>}
        {locations && <CityList cities={locations} onSearch={searchWeather}/>}
        {weather && <WeatherCard weatherStats={weather}/>}
      </div>
      
      
    </>
  )
}

export default App
