import { describe, expect, it } from 'vitest'
import { buildCurrentWeatherUrl, buildForecastUrl, toCityWeatherList, toDailyForecast } from './weatherApi'
import type { ApiForecastResponse, City } from '../types/weather'

const telAviv: City = { id: 'tel-aviv', name: 'תל אביב', country: 'ישראל', latitude: 32.08, longitude: 34.78 }
const london: City = { id: 'london', name: 'לונדון', country: 'בריטניה', latitude: 51.51, longitude: -0.13 }

/** תשובה מדומה של ה-API לעיר אחת — באותו מבנה שה-API האמיתי מחזיר */
function fakeResponse(temperature: number, weatherCode: number): ApiForecastResponse {
  return {
    latitude: 0,
    longitude: 0,
    timezone: 'GMT',
    current: { time: '2026-11-04T14:00', temperature_2m: temperature, weather_code: weatherCode, wind_speed_10m: 10 },
  }
}

describe('buildCurrentWeatherUrl', () => {
  it('שם את הקואורדינטות של כל הערים בבקשה אחת, מופרדות בפסיקים', () => {
    const url = buildCurrentWeatherUrl([telAviv, london])
    expect(url).toContain('latitude=32.08,51.51')
    expect(url).toContain('longitude=34.78,-0.13')
  })
})

describe('toCityWeatherList', () => {
  it('מחבר כל עיר לתוצאה שלה לפי הסדר וממיר לשמות השדות שלנו', () => {
    const result = toCityWeatherList([telAviv, london], [fakeResponse(27, 0), fakeResponse(9, 61)])

    expect(result).toEqual([
      { city: telAviv, temperature: 27, windSpeed: 10, weatherCode: 0 },
      { city: london, temperature: 9, windSpeed: 10, weatherCode: 61 },
    ])
  })

  it('מטפל גם בתשובה של עיר אחת, שמגיעה כאובייקט ולא כמערך', () => {
    const result = toCityWeatherList([telAviv], fakeResponse(27, 0))
    expect(result).toHaveLength(1)
    expect(result[0].temperature).toBe(27)
  })

  it('זורק שגיאה כשמספר התוצאות לא תואם למספר הערים', () => {
    expect(() => toCityWeatherList([telAviv, london], [fakeResponse(27, 0)])).toThrow()
  })
})

describe('buildForecastUrl', () => {
  it('מבקש תחזית יומית עבור הקואורדינטות של העיר', () => {
    const url = buildForecastUrl(telAviv)
    expect(url).toContain('latitude=32.08&longitude=34.78')
    expect(url).toContain('daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum')
  })
})

describe('toDailyForecast', () => {
  it('הופך מערכים נפרדים לאובייקט אחד לכל יום', () => {
    const result = toDailyForecast({
      time: ['2026-11-04', '2026-11-05'],
      weather_code: [0, 61],
      temperature_2m_max: [27.3, 23.9],
      temperature_2m_min: [19.1, 18.2],
      precipitation_sum: [0, 4.5],
    })

    expect(result).toEqual([
      { date: '2026-11-04', maxTemp: 27.3, minTemp: 19.1, precipitation: 0, weatherCode: 0 },
      { date: '2026-11-05', maxTemp: 23.9, minTemp: 18.2, precipitation: 4.5, weatherCode: 61 },
    ])
  })
})
