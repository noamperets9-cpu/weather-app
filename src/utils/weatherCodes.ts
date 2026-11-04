import type { WeatherInfo } from '../types/weather'

// Open-Meteo מחזיר מצב מזג אוויר כמספר לפי תקן WMO.
// הטבלה: https://open-meteo.com/en/docs (בתחתית העמוד, "WMO Weather interpretation codes")

/**
 * ממיר קוד מזג אוויר (weather_code) לקבוצה, תיאור בעברית ואייקון.
 * קוד לא מוכר מחזיר "לא ידוע" במקום לקרוס.
 */
export function getWeatherInfo(code: number): WeatherInfo {
  if (code === 0) return { condition: 'clear', description: 'בהיר', icon: '☀️' }
  if (code === 1) return { condition: 'clear', description: 'בהיר ברובו', icon: '🌤️' }
  if (code === 2) return { condition: 'cloudy', description: 'מעונן חלקית', icon: '⛅' }
  if (code === 3) return { condition: 'cloudy', description: 'מעונן', icon: '☁️' }
  if (code === 45 || code === 48) return { condition: 'fog', description: 'ערפל', icon: '🌫️' }
  if (code >= 51 && code <= 57) return { condition: 'rain', description: 'טפטוף', icon: '🌦️' }
  if (code >= 61 && code <= 67) return { condition: 'rain', description: 'גשם', icon: '🌧️' }
  if (code >= 71 && code <= 77) return { condition: 'snow', description: 'שלג', icon: '❄️' }
  if (code >= 80 && code <= 82) return { condition: 'rain', description: 'ממטרים', icon: '🌦️' }
  if (code === 85 || code === 86) return { condition: 'snow', description: 'ממטרי שלג', icon: '🌨️' }
  if (code >= 95 && code <= 99) return { condition: 'storm', description: 'סופת רעמים', icon: '⛈️' }

  return { condition: 'cloudy', description: 'לא ידוע', icon: '❔' }
}
