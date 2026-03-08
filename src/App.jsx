import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { WeatherCard } from './components/WeatherCard.jsx'
import './App.css'
import { LoadingPage } from './components/LoadingPage.jsx'
import { ErrorPage } from './components/ErrorPage.jsx'
import { useWeather } from './hooks/useWeather.js'
import { CityList } from './components/CityList.jsx'
import '.\\SpriteAnimation.css'
import { OutfitSuggestion } from './components/OutfitSuggestion.jsx'


function App() {
  const {
    locations,
    loading,
    error,
    weather,
    condition,
    searchCity,
    searchWeather
  } = useWeather();
  
 

  return (
    <>
      <div className={condition}>
        <SearchBar onSearch={searchCity}/>
        {loading && <LoadingPage/>}
        {error && <ErrorPage errorMessage={error}/>}
        {locations && <CityList cities={locations} onSearch={searchWeather}/>}
        {weather && <WeatherCard weatherStats={weather}/>}
        {weather && <OutfitSuggestion weatherStats={weather}/>}
      </div>
      
      
    </>
  )
}

export default App
