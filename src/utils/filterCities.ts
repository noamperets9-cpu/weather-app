import type { CityWeather, WeatherCondition } from '../types/weather'
import { getWeatherInfo } from './weatherCodes'

/** אפשרות בסינון: מצב מזג אוויר מסוים, או "הכול" */
export type ConditionFilter = WeatherCondition | 'all'

/** האפשרויות שמופיעות בתפריט הסינון, עם השם בעברית */
export const CONDITION_OPTIONS: { value: ConditionFilter; label: string }[] = [
  { value: 'all', label: 'הכול' },
  { value: 'clear', label: 'בהיר' },
  { value: 'cloudy', label: 'מעונן' },
  { value: 'rain', label: 'גשם' },
  { value: 'storm', label: 'סופה' },
  { value: 'snow', label: 'שלג' },
  { value: 'fog', label: 'ערפל' },
]

/**
 * מסנן את רשימת הערים לפי טקסט חיפוש ולפי מצב מזג אוויר.
 * - חיפוש: שם העיר מכיל את הטקסט (רווחים בהתחלה/בסוף לא משנים). טקסט ריק = בלי סינון.
 * - מצב: 'all' = בלי סינון, אחרת רק ערים שהקוד שלהן שייך לקבוצה הזאת.
 * הפונקציה לא משנה את המערך המקורי — מחזירה מערך חדש.
 */
export function filterCities(
  citiesWeather: CityWeather[],
  query: string,
  condition: ConditionFilter,
): CityWeather[] {
  const search = query.trim().toLowerCase()

  return citiesWeather.filter((weather) => {
    const matchesName = weather.city.name.toLowerCase().includes(search)
    const matchesCondition =
      condition === 'all' || getWeatherInfo(weather.weatherCode).condition === condition

    return matchesName && matchesCondition
  })
}
