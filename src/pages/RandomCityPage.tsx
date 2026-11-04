import { useEffect, useState } from 'react'
import CityCard from '../components/CityCard'
import StatusMessage from '../components/StatusMessage'
import { CITIES } from '../data/cities'
import { buildCurrentWeatherUrl, toCityWeatherList } from '../api/weatherApi'
import { pickRandomCity } from '../utils/randomCity'
import type { ApiForecastResponse, City, CityWeather } from '../types/weather'
import './RandomCityPage.css'

interface RandomCityPageProps {
  favoriteIds: string[]
  onToggleFavorite: (cityId: string) => void
}

function RandomCityPage({ favoriteIds, onToggleFavorite }: RandomCityPageProps) {
  const [city, setCity] = useState<City | null>(null) // העיר שהוגרלה
  const [weather, setWeather] = useState<CityWeather | null>(null)
  const [isLoading, setIsLoading] = useState(false) // בהתחלה לא טוענים כלום — מחכים ללחיצה
  const [error, setError] = useState<string | null>(null)

  // לחיצה על הכפתור: מגרילים עיר חדשה (שונה מהנוכחית) ומאפסים את התצוגה.
  // ה-fetch עצמו קורה ב-useEffect למטה, שרץ בכל פעם ש-city משתנה.
  function handleDraw() {
    setCity(pickRandomCity(CITIES, city ? city.id : null))
    setWeather(null)
    setError(null)
    setIsLoading(true)
  }

  useEffect(() => {
    if (!city) return // עוד לא הגרילו — אין מה לטעון

    let ignore = false

    async function loadWeather(cityToLoad: City) {
      try {
        const response = await fetch(buildCurrentWeatherUrl([cityToLoad]))
        if (!response.ok) {
          throw new Error(`שגיאת שרת: ${response.status}`)
        }
        const data: ApiForecastResponse = await response.json()
        if (!ignore) {
          setWeather(toCityWeatherList([cityToLoad], data)[0])
        }
      } catch {
        if (!ignore) {
          setError('לא הצלחנו לטעון את מזג האוויר. נסו להגריל שוב.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadWeather(city)

    // אם לוחצים שוב לפני שהתשובה הקודמת הגיעה — מתעלמים מהתשובה הישנה
    return () => {
      ignore = true
    }
  }, [city])

  return (
    <section className="random-city">
      <h2>עיר אקראית</h2>
      <p>לא יודעים לאן לטוס? תנו לגורל להחליט.</p>

      <button type="button" className="draw-button" onClick={handleDraw}>
        🎲 {city ? 'הגרל עיר אחרת' : 'הגרל עיר'}
      </button>

      {isLoading && <StatusMessage type="loading" text="מגריל ובודק את מזג האוויר..." />}

      {error && <StatusMessage type="error" text={error} />}

      {weather && (
        <div className="random-result">
          <CityCard
            weather={weather}
            isFavorite={favoriteIds.includes(weather.city.id)}
            onToggleFavorite={onToggleFavorite}
          />
          <p className="random-hint">לחצו על הכרטיס כדי לראות תחזית ל-7 ימים.</p>
        </div>
      )}
    </section>
  )
}

export default RandomCityPage
