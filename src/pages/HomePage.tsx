import { useEffect, useState } from 'react'
import CityCard from '../components/CityCard'
import SearchBar from '../components/SearchBar'
import StatusMessage from '../components/StatusMessage'
import { CITIES } from '../data/cities'
import { buildCurrentWeatherUrl, toCityWeatherList } from '../api/weatherApi'
import { filterCities, type ConditionFilter } from '../utils/filterCities'
import type { ApiForecastResponse, CityWeather } from '../types/weather'

function HomePage() {
  // שלושת המצבים של העמוד: המידע עצמו, האם עדיין טוען, והאם הייתה שגיאה
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // מה שהמשתמש בחר בחיפוש ובסינון
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState<ConditionFilter>('all')

  // הרשימה המסוננת מחושבת מחדש בכל רינדור — לא שומרים אותה ב-state,
  // כי אפשר תמיד לחשב אותה מהמידע ומהבחירות של המשתמש
  const visibleCities = filterCities(citiesWeather, query, condition)

  // רץ פעם אחת כשהעמוד עולה (מערך תלויות ריק)
  useEffect(() => {
    // אם העמוד נסגר לפני שהתשובה הגיעה — לא מעדכנים state של רכיב שכבר לא על המסך
    let ignore = false

    async function loadWeather() {
      try {
        const response = await fetch(buildCurrentWeatherUrl(CITIES))
        if (!response.ok) {
          throw new Error(`שגיאת שרת: ${response.status}`)
        }
        const data: ApiForecastResponse[] = await response.json()
        if (!ignore) {
          setCitiesWeather(toCityWeatherList(CITIES, data))
        }
      } catch {
        if (!ignore) {
          setError('לא הצלחנו לטעון את מזג האוויר. בדקו את החיבור לאינטרנט ונסו שוב.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadWeather()

    // פונקציית ניקוי — רצה כשהרכיב יורד מהמסך
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section>
      <h2>כל הערים</h2>

      {isLoading && <StatusMessage type="loading" text="טוען את מזג האוויר..." />}

      {error && <StatusMessage type="error" text={error} />}

      {!isLoading && !error && (
        <>
          <SearchBar
            query={query}
            condition={condition}
            onQueryChange={setQuery}
            onConditionChange={setCondition}
          />

          {visibleCities.length === 0 ? (
            <StatusMessage type="info" text="לא נמצאו ערים" />
          ) : (
            <div className="city-grid">
              {visibleCities.map((weather) => (
                <CityCard key={weather.city.id} weather={weather} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
