import type { City } from '../types/weather'

/**
 * מגריל עיר מהרשימה — אבל לא את העיר שהוגרלה בפעם הקודמת (previousId).
 *
 * random — הפונקציה שמייצרת מספר אקראי בין 0 ל-1. ברירת המחדל היא Math.random,
 * ובבדיקות מעבירים פונקציה קבועה (למשל () => 0) כדי שהתוצאה תהיה צפויה.
 */
export function pickRandomCity(
  cities: City[],
  previousId: string | null,
  random: () => number = Math.random,
): City {
  if (cities.length === 0) {
    throw new Error('אין ערים להגרלה')
  }

  // אם יש רק עיר אחת — אין ברירה, מחזירים אותה
  const candidates =
    cities.length > 1 ? cities.filter((city) => city.id !== previousId) : cities

  // random() מחזיר מספר בין 0 (כולל) ל-1 (לא כולל) → אינדקס בין 0 ל-length-1
  const index = Math.floor(random() * candidates.length)
  return candidates[index]
}
