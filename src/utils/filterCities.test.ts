import { describe, expect, it } from 'vitest'
import { filterCities } from './filterCities'
import type { City, CityWeather } from '../types/weather'

function makeCity(id: string, name: string): City {
  return { id, name, country: '', latitude: 0, longitude: 0 }
}

// רשימה קטנה לבדיקות: שתי ערים בהירות (קוד 0) ושתיים גשומות (קוד 61)
const list: CityWeather[] = [
  { city: makeCity('tel-aviv', 'תל אביב'), temperature: 27, windSpeed: 10, weatherCode: 0 },
  { city: makeCity('eilat', 'אילת'), temperature: 32, windSpeed: 5, weatherCode: 0 },
  { city: makeCity('london', 'לונדון'), temperature: 9, windSpeed: 20, weatherCode: 61 },
  { city: makeCity('tel-mond', 'תל מונד'), temperature: 25, windSpeed: 8, weatherCode: 61 },
]

const names = (result: CityWeather[]) => result.map((w) => w.city.name)

describe('filterCities', () => {
  it('בלי טקסט ועם "הכול" — מחזיר את כל הרשימה', () => {
    expect(filterCities(list, '', 'all')).toHaveLength(4)
  })

  it('מחזיר רק ערים ששמן מכיל את הטקסט, ומתעלם מרווחים מסביב', () => {
    expect(names(filterCities(list, '  תל ', 'all'))).toEqual(['תל אביב', 'תל מונד'])
  })

  it('מסנן לפי מצב מזג אוויר', () => {
    expect(names(filterCities(list, '', 'rain'))).toEqual(['לונדון', 'תל מונד'])
  })

  it('משלב חיפוש וסינון יחד', () => {
    expect(names(filterCities(list, 'תל', 'rain'))).toEqual(['תל מונד'])
  })

  it('מחזיר מערך ריק כשאין התאמה', () => {
    expect(filterCities(list, 'פריז', 'all')).toEqual([])
  })

  it('לא משנה את המערך המקורי', () => {
    filterCities(list, 'תל', 'rain')
    expect(list).toHaveLength(4)
  })
})
