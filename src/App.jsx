import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { WeatherCard } from './components/WeatherCard.jsx'
import './App.css'
import { LoadingPage } from './components/LoadingPage.jsx'
import { ErrorPage } from './components/ErrorPage.jsx'
import { useWeather } from './hooks/useWeather.js'

function App() {
  const {
    locations,
    loading, 
    error,
    searchCity
  } = useWeather();
 

  return (
    <>
      <SearchBar onSearch={searchCity}/>
      {loading && <LoadingPage/>}
      {error && <ErrorPage errorMessage={error}/>}
    </>
  )
}

export default App
