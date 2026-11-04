// ===== הנתונים שלנו =====

/** עיר ברשימה — מוגדרת אצלנו בקוד (src/data/cities.ts) */
export interface City {
  id: string // מופיע בכתובת: /cities/tel-aviv
  name: string
  country: string
  latitude: number
  longitude: number
}

/** קבוצות מצב מזג אוויר — משמשות לאייקון ולסינון */
export type WeatherCondition = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'

/** מה שמציגים למשתמש עבור קוד מזג אוויר */
export interface WeatherInfo {
  condition: WeatherCondition
  description: string
  icon: string
}

/** מזג האוויר עכשיו בעיר אחת — מה שכרטיס העיר מציג */
export interface CityWeather {
  city: City
  temperature: number
  windSpeed: number
  weatherCode: number
}

/** יום אחד בתחזית — מה שעמוד הפרטים מציג */
export interface DailyForecast {
  date: string
  maxTemp: number
  minTemp: number
  precipitation: number
  weatherCode: number
}

// ===== מה שה-API של Open-Meteo מחזיר =====

/** החלק "current" בתשובה */
export interface ApiCurrentWeather {
  time: string
  temperature_2m: number
  weather_code: number
  wind_speed_10m: number
}

/** החלק "daily" בתשובה — כל שדה הוא מערך, איבר לכל יום */
export interface ApiDailyWeather {
  time: string[]
  weather_code: number[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  precipitation_sum: number[]
}

/** תשובה של /v1/forecast עבור מיקום אחד */
export interface ApiForecastResponse {
  latitude: number
  longitude: number
  timezone: string
  current: ApiCurrentWeather
  daily?: ApiDailyWeather // מגיע רק אם ביקשנו daily=...
}
