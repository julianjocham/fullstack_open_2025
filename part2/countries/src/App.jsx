
import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ filter, handleFilterChange }) => {
    return (
        <div>
            find countries <input value={filter} onChange={handleFilterChange} />
        </div>
    )
}

const CountryList = ({ countries, showCountry }) => {
    if (countries.length > 10) {
        return <p>Too many matches, specify another filter</p>
    }

    if (countries.length > 1) {
        return (
            <div>
                {countries.map(country => (
                    <div key={country.name.common}>
                        {country.name.common}
                        <button onClick={() => showCountry(country)}>show</button>
                    </div>
                ))}
            </div>
        )
    }

    if (countries.length === 1) {
        return <Country country={countries[0]} />
    }

    return null
}

const Weather = ({ capital }) => {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY


    useEffect(() => {
        if (capital && API_KEY) {
            setLoading(true)
            setError(null)

            axios
                .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${API_KEY}&units=metric`)
                .then(response => {
                    setWeather(response.data)
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Error fetching weather:', error)
                    setError('Failed to fetch weather data')
                    setLoading(false)
                })
        } else if (!API_KEY) {
            setError('Please add your OpenWeatherMap API key')
            setLoading(false)
        }
    }, [capital, API_KEY])

    if (loading) {
        return <p>Loading weather...</p>
    }

    if (error) {
        return <p>Weather: {error}</p>
    }

    if (!weather) {
        return null
    }

    return (
        <div>
            <h3>Weather in {capital}</h3>
            <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
            <p><strong>Weather:</strong> {weather.weather[0].description}</p>
            <p><strong>Feels like:</strong> {weather.main.feels_like}°C</p>
            <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
            <p><strong>Wind speed:</strong> {weather.wind.speed} m/s</p>
            {weather.weather[0].icon && (
                <img
                    src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                    alt={weather.weather[0].description}
                />
            )}
        </div>
    )
}

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital?.[0]}</p>
            <p>Area {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {Object.values(country.languages || {}).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="200" />

            {country.capital?.[0] && <Weather capital={country.capital[0]} />}
        </div>
    )
}

function App() {
    const [countries, setCountries] = useState([])
    const [filter, setFilter] = useState('')
    const [filteredCountries, setFilteredCountries] = useState([])

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    useEffect(() => {
        if (filter) {
            const filtered = countries.filter(country =>
                country.name.common.toLowerCase().includes(filter.toLowerCase())
            )
            setFilteredCountries(filtered)
        } else {
            setFilteredCountries([])
        }
    }, [filter, countries])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const showCountry = (country) => {
        setFilteredCountries([country])
    }

    return (
        <div>
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <CountryList countries={filteredCountries} showCountry={showCountry} />
        </div>
    )
}

export default App