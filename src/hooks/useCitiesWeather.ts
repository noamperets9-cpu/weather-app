import { useEffect, useState } from 'react'
import { CITIES } from '../data/cities'
import { buildCurrentWeatherUrl, toCityWeatherList } from '../api/weatherApi'
import type { ApiForecastResponse, CityWeather } from '../types/weather'

/**
 * Custom hook: טוען את מזג האוויר עכשיו בכל הערים.
 * משמש גם את עמוד הרשימה וגם את עמוד המועדפים — כך קוד ה-fetch כתוב פעם אחת.
 * מחזיר את שלושת המצבים: המידע, האם טוען, ושגיאה.
 */
export function useCitiesWeather() {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // רץ פעם אחת כשהרכיב שמשתמש ב-hook עולה (מערך תלויות ריק)
  useEffect(() => {
    // אם הרכיב יורד מהמסך לפני שהתשובה הגיעה — לא מעדכנים state
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

  return { citiesWeather, isLoading, error }
}
