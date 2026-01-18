import { useState } from "react";

export function WeatherCard(){
    return(
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">City + Country</h2>
                <p className="card-content">Current Temperature</p>
                <p className="card-content">Weather condition (e.g., Clear, Clouds)</p>
                <img src="src\icons\weather-icon.jpg" alt="weather-icon"/>
            </div>

        </div>
    )
}