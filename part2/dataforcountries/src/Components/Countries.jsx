import {useEffect, useState} from "react";
import axios from "axios";

const api_key = import.meta.env.VITE_SOME_KEY
console.log(api_key)

const Countries = ({filteredCountries, handleCountryShow}) => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() =>{

        if( filteredCountries && filteredCountries.length === 1){
            const capital = filteredCountries[0].capital;
            console.log(`Fetching weather for capital: ${capital}`);
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
                .then(response => {
                    setWeatherData(response.data);
                    console.log('Weather response.data', JSON.stringify(response.data));
                })
                .catch(error => console.log(`error ${error}`));
        } else {
            setWeatherData(null);
        }
    }, [filteredCountries]);



    if (!filteredCountries) {
        return null;
    }
    else if(filteredCountries.length > 10){
        return(
            <div>Too many matches, specify another filter</div>
        )
    }
    else if (filteredCountries.length > 1)
    {
        return (
            <div>
                {filteredCountries.map(country =>
                    (<div key={country.name.common}>
                        {country.name.common}
                        <button onClick={() => handleCountryShow(country.name.common)}>Show</button>
                    </div>)
                )}
            </div>
        )
    }

    return (

        <div>
            {filteredCountries.map(country =>
                (<div key={country.name.common}>
                    <h2>{country.name.common}</h2>
                    <div>capital {country.capital}</div>
                    <div>area {country.area}</div>

                    <h3>languages: </h3>
                    <ul>
                        {Object.entries(country.languages).map(([key, language]) =>
                            <li key={key}>
                                {language}
                            </li>
                        )}
                    </ul>

                    <img src={country.flags.png}></img>

                    <h2>Weather in {country.capital}</h2>

                    {weatherData && (
                        <div>
                            <div>temperature: {weatherData.main.temp} Celsius</div>
                            <img
                                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt="Weather icon"
                            />
                            <div>wind {weatherData.wind.speed} m/s</div>
                        </div>
                    )}


                </div>)
            )}
        </div>

    )
}


export default Countries;