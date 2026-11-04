import { Link } from 'react-router'
import FavoriteButton from './FavoriteButton'
import type { CityWeather } from '../types/weather'
import { getWeatherInfo } from '../utils/weatherCodes'
import './CityCard.css'

interface CityCardProps {
  weather: CityWeather
  isFavorite: boolean
  onToggleFavorite: (cityId: string) => void
}

/**
 * כרטיס של עיר אחת ברשימה.
 * הקישור (לעמוד הפרטים) והכפתור (מועדפים) הם "אחים" בתוך הכרטיס —
 * כך לחיצה על הכוכב לא פותחת את עמוד הפרטים.
 */
function CityCard({ weather, isFavorite, onToggleFavorite }: CityCardProps) {
  const { city, temperature, weatherCode } = weather
  const info = getWeatherInfo(weatherCode)

  return (
    <div className="city-card">
      <Link to={`/cities/${city.id}`} className="city-card-link">
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

      <FavoriteButton isFavorite={isFavorite} onToggle={() => onToggleFavorite(city.id)} />
    </div>
  )
}

export default CityCard
