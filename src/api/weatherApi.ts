import type {
  ApiDailyWeather,
  ApiForecastResponse,
  City,
  CityWeather,
  DailyForecast,
} from '../types/weather'

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

/** כתובת לעמוד הפרטים: מזג האוויר עכשיו + תחזית ל-7 ימים לעיר אחת */
export function buildForecastUrl(city: City): string {
  return (
    `${BASE_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    '&current=temperature_2m,weather_code,wind_speed_10m' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum' +
    '&timezone=auto'
  )
}

/**
 * ה-API מחזיר את התחזית היומית כמערכים נפרדים — מערך תאריכים, מערך מקסימום, מערך מינימום...
 * (האיבר ה-i בכל מערך שייך ליום ה-i).
 * הפונקציה הופכת את זה למערך של אובייקטים — אובייקט אחד לכל יום — שנוח להציג עם map.
 */
export function toDailyForecast(daily: ApiDailyWeather): DailyForecast[] {
  return daily.time.map((date, index) => ({
    date,
    maxTemp: daily.temperature_2m_max[index],
    minTemp: daily.temperature_2m_min[index],
    precipitation: daily.precipitation_sum[index],
    weatherCode: daily.weather_code[index],
  }))
}
