import { describe, expect, it } from 'vitest'
import { parseFavorites, toggleFavorite } from './favorites'

describe('toggleFavorite', () => {
  it('מוסיף עיר שעוד לא במועדפים', () => {
    expect(toggleFavorite(['haifa'], 'london')).toEqual(['haifa', 'london'])
  })

  it('מסיר עיר שכבר במועדפים', () => {
    expect(toggleFavorite(['haifa', 'london'], 'haifa')).toEqual(['london'])
  })

  it('מחזיר מערך חדש ולא משנה את המקורי', () => {
    const original = ['haifa']
    const result = toggleFavorite(original, 'london')
    expect(result).not.toBe(original)
    expect(original).toEqual(['haifa'])
  })
})

describe('parseFavorites', () => {
  it('קורא רשימה תקינה ששמורה כ-JSON', () => {
    expect(parseFavorites('["haifa","tokyo"]')).toEqual(['haifa', 'tokyo'])
  })

  it('מחזיר מערך ריק כשאין שום דבר שמור', () => {
    expect(parseFavorites(null)).toEqual([])
  })

  it('לא קורס על תוכן פגום — מחזיר מערך ריק', () => {
    expect(parseFavorites('not json{')).toEqual([])
    expect(parseFavorites('{"a":1}')).toEqual([])
    expect(parseFavorites('[1,2,3]')).toEqual([])
  })
})
