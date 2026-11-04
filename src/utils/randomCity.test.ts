import { describe, expect, it } from 'vitest'
import { pickRandomCity } from './randomCity'
import type { City } from '../types/weather'

function makeCity(id: string): City {
  return { id, name: id, country: '', latitude: 0, longitude: 0 }
}

const cities = [makeCity('haifa'), makeCity('london'), makeCity('tokyo')]

describe('pickRandomCity', () => {
  it('בוחר לפי המספר האקראי: 0 → הראשונה, כמעט 1 → האחרונה', () => {
    expect(pickRandomCity(cities, null, () => 0).id).toBe('haifa')
    expect(pickRandomCity(cities, null, () => 0.999).id).toBe('tokyo')
  })

  it('לא מחזיר את העיר הקודמת, גם כשהמספר האקראי "מכוון" אליה', () => {
    // () => 0 היה בוחר את haifa — אבל haifa היא הקודמת, אז היא מוצאת מההגרלה
    expect(pickRandomCity(cities, 'haifa', () => 0).id).toBe('london')
  })

  it('ב-100 הגרלות רצופות אין אף פעם אותה עיר פעמיים ברצף', () => {
    let previous: string | null = null
    for (let i = 0; i < 100; i++) {
      const city = pickRandomCity(cities, previous)
      expect(city.id).not.toBe(previous)
      previous = city.id
    }
  })

  it('כשיש עיר אחת בלבד — מחזיר אותה', () => {
    expect(pickRandomCity([makeCity('haifa')], 'haifa').id).toBe('haifa')
  })

  it('זורק שגיאה כשהרשימה ריקה', () => {
    expect(() => pickRandomCity([], null)).toThrow()
  })
})
