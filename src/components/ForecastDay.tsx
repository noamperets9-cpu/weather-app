import type { DailyForecast } from '../types/weather'
import { getWeatherInfo } from '../utils/weatherCodes'
import './ForecastDay.css'

interface ForecastDayProps {
  day: DailyForecast
}

/** "2026-11-05" → "יום חמישי, 5.11" */
function formatDay(date: string): string {
  // T00:00 — כדי שהתאריך ייקרא לפי השעון המקומי ולא לפי UTC (אחרת ביבשות מסוימות יוצא יום קודם)
  return new Date(`${date}T00:00`).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
  })
}

/** שורה אחת בתחזית: יום, אייקון, מקסימום/מינימום ומשקעים */
function ForecastDay({ day }: ForecastDayProps) {
  const info = getWeatherInfo(day.weatherCode)

  return (
    <li className="forecast-day">
      <span className="forecast-date">{formatDay(day.date)}</span>
      <span className="forecast-icon" title={info.description}>
        {info.icon}
      </span>
      <span className="forecast-temps">
        <strong>{Math.round(day.maxTemp)}°</strong> / {Math.round(day.minTemp)}°
      </span>
      <span className="forecast-rain">💧 {day.precipitation} מ"מ</span>
    </li>
  )
}

export default ForecastDay
