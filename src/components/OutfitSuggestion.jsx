export function OutfitSuggestion({ weatherStats }){
    let suggestion = "";
    if(weatherStats.condition.includes("thunderstorm") || weatherStats.condition.includes("rain")){
        suggestion = "Waterproof Outerwear + "
    }
    if(weatherStats.temp < 50){
        suggestion += "Heavy winter coat, thermal layers, scarf, gloves, and hat"
    }
    else if(weatherStats.temp >= 50 && weatherStats.temp < 59){
        suggestion += "Mid-weight layers, long sleeves, light jackets, or trench coats."
    }
    else if(weatherStats.temp >= 59 && weatherStats.temp < 77){
        suggestion += "Light layers, such as a t-shirt with a cardigan or breezy jacket."
    }
    else{
        suggestion += "Light, breathable, minimal clothing (linen, cotton, shorts)."
    }
    return(<>Outfit suggestion: 
            <br/>
            {suggestion}</>)
    
    

    

}