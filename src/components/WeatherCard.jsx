import { useState } from "react";

export function WeatherCard({ weatherStats }){
    return(
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">{weatherStats.city}, {weatherStats.country}</h2>
                <p className="card-content">{weatherStats.temp} F</p>
                <p className="card-content">{weatherStats.condition}</p>
                <img src={`https://openweathermap.org/img/wn/${weatherStats.icon}.png`} alt="weather-icon"/>
            </div>

        </div>
    )
}