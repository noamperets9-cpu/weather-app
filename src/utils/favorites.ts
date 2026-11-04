/** המפתח שתחתיו המועדפים נשמרים ב-localStorage */
export const FAVORITES_STORAGE_KEY = 'weather-app:favorites'

/**
 * מוסיף עיר למועדפים, או מסיר אותה אם היא כבר שם.
 * מחזיר מערך חדש ולא משנה את הקיים — כך React מזהה שה-state השתנה.
 */
export function toggleFavorite(favoriteIds: string[], cityId: string): string[] {
  if (favoriteIds.includes(cityId)) {
    return favoriteIds.filter((id) => id !== cityId)
  }
  return [...favoriteIds, cityId]
}

/**
 * ממיר את הטקסט ששמור ב-localStorage למערך של id-ים.
 * אם אין כלום, או שהתוכן פגום (מישהו ערך אותו ידנית) — מחזיר מערך ריק במקום לקרוס.
 */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return []

  try {
    const value: unknown = JSON.parse(raw)
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return value
    }
    return []
  } catch {
    return []
  }
}

/** קורא את המועדפים מ-localStorage */
export function loadFavorites(): string[] {
  return parseFavorites(localStorage.getItem(FAVORITES_STORAGE_KEY))
}

/** שומר את המועדפים ב-localStorage (localStorage שומר רק טקסט — לכן JSON) */
export function saveFavorites(favoriteIds: string[]): void {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds))
}
