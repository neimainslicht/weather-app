export function CityList({ cities, onSearch }){
    return(
        <>
            {
                cities.map((city) =>
                <button 
                key={city.id}
                onClick={() => onSearch(city.lat, city.lon)}
                >
                    {city.name}, {city.state && city.state}, {city.country}
                </button>)
            }
        </>
    )

}