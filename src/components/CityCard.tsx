import { Link } from 'react-router'
import type { CityWeather } from '../types/weather'
import { getWeatherInfo } from '../utils/weatherCodes'
import './CityCard.css'

interface CityCardProps {
  weather: CityWeather
}

/** כרטיס של עיר אחת ברשימה. לחיצה עליו פותחת את עמוד הפרטים של העיר. */
function CityCard({ weather }: CityCardProps) {
  const { city, temperature, weatherCode } = weather
  const info = getWeatherInfo(weatherCode)

  return (
    <Link to={`/cities/${city.id}`} className="city-card">
      <span className="city-card-icon" aria-hidden="true">
        {info.icon}
      </span>
      <div className="city-card-body">
        <h3>{city.name}</h3>
        <p className="city-card-country">{city.country}</p>
        <p className="city-card-description">{info.description}</p>
      </div>
      <span className="city-card-temp">{Math.round(temperature)}°</span>
    </Link>
  )
}

export default CityCard
