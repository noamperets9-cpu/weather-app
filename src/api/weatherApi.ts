import type { ApiForecastResponse, City, CityWeather } from '../types/weather'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * בונה כתובת אחת שמבקשת את מזג האוויר עכשיו בכל הערים יחד.
 * Open-Meteo מקבל כמה מיקומים מופרדים בפסיקים, ומחזיר מערך — איבר לכל עיר, באותו סדר.
 */
export function buildCurrentWeatherUrl(cities: City[]): string {
  const latitudes = cities.map((city) => city.latitude).join(',')
  const longitudes = cities.map((city) => city.longitude).join(',')

  return (
    `${BASE_URL}?latitude=${latitudes}&longitude=${longitudes}` +
    '&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto'
  )
}

/**
 * ממיר את התשובה של ה-API למבנה שהאפליקציה עובדת איתו: CityWeather לכל עיר.
 * כשמבקשים עיר אחת בלבד, ה-API מחזיר אובייקט ולא מערך — לכן מטפלים בשני המקרים.
 */
export function toCityWeatherList(
  cities: City[],
  data: ApiForecastResponse | ApiForecastResponse[],
): CityWeather[] {
  const responses = Array.isArray(data) ? data : [data]

  if (responses.length !== cities.length) {
    throw new Error('מספר התוצאות מה-API לא תואם למספר הערים')
  }

  return cities.map((city, index) => ({
    city,
    temperature: responses[index].current.temperature_2m,
    windSpeed: responses[index].current.wind_speed_10m,
    weatherCode: responses[index].current.weather_code,
  }))
}
