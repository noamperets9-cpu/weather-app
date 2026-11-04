import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import ForecastDay from '../components/ForecastDay'
import StatusMessage from '../components/StatusMessage'
import { findCityById } from '../data/cities'
import { buildForecastUrl, toDailyForecast } from '../api/weatherApi'
import { getWeatherInfo } from '../utils/weatherCodes'
import type { ApiCurrentWeather, ApiForecastResponse, City, DailyForecast } from '../types/weather'
import './CityDetailsPage.css'

function CityDetailsPage() {
  // id נלקח מהכתובת: /cities/tel-aviv → id = "tel-aviv"
  const { id } = useParams()
  const city = findCityById(id)

  const [current, setCurrent] = useState<ApiCurrentWeather | null>(null)
  const [forecast, setForecast] = useState<DailyForecast[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // רץ כשהעמוד עולה, ושוב אם העיר משתנה
  useEffect(() => {
    if (!city) return // עיר לא קיימת — אין מה לטעון

    let ignore = false

    async function loadForecast(cityToLoad: City) {
      try {
        const response = await fetch(buildForecastUrl(cityToLoad))
        if (!response.ok) {
          throw new Error(`שגיאת שרת: ${response.status}`)
        }
        const data: ApiForecastResponse = await response.json()
        if (!data.daily) {
          throw new Error('בתשובה חסרה התחזית היומית')
        }
        if (!ignore) {
          setCurrent(data.current)
          setForecast(toDailyForecast(data.daily))
        }
      } catch {
        if (!ignore) {
          setError('לא הצלחנו לטעון את התחזית. בדקו את החיבור לאינטרנט ונסו שוב.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadForecast(city)

    return () => {
      ignore = true
    }
  }, [city])

  // id שלא קיים ברשימה (למשל /cities/xyz)
  if (!city) {
    return (
      <section>
        <StatusMessage type="info" text="העיר לא נמצאה" />
        <Link to="/">← חזרה לרשימת הערים</Link>
      </section>
    )
  }

  const info = current ? getWeatherInfo(current.weather_code) : null

  return (
    <section className="city-details">
      <Link to="/" className="back-link">
        ← חזרה לרשימה
      </Link>

      <h2>
        {city.name} <span className="city-details-country">{city.country}</span>
      </h2>

      {isLoading && <StatusMessage type="loading" text="טוען תחזית..." />}

      {error && <StatusMessage type="error" text={error} />}

      {current && info && (
        <div className="current-weather">
          <span className="current-icon" aria-hidden="true">
            {info.icon}
          </span>
          <div>
            <p className="current-temp">{Math.round(current.temperature_2m)}°</p>
            <p>{info.description}</p>
            <p className="current-wind">💨 רוח: {current.wind_speed_10m} קמ"ש</p>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <>
          <h3>תחזית ל-7 ימים</h3>
          <ul className="forecast-list">
            {forecast.map((day) => (
              <ForecastDay key={day.date} day={day} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

export default CityDetailsPage
