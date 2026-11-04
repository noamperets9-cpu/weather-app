import { describe, expect, it } from 'vitest'
import { CITIES, findCityById } from './cities'

describe('findCityById', () => {
  it('מוצא עיר קיימת לפי ה-id מהכתובת', () => {
    expect(findCityById('tel-aviv')?.name).toBe('תל אביב')
  })

  it('מחזיר undefined עבור id שלא קיים או חסר', () => {
    expect(findCityById('atlantis')).toBeUndefined()
    expect(findCityById(undefined)).toBeUndefined()
  })
})

describe('CITIES', () => {
  it('לכל עיר יש id ייחודי (משמש גם כ-key ברשימה וגם בכתובת)', () => {
    const ids = CITIES.map((city) => city.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
