import type { City } from '../types/weather'

// רשימת הערים שהאפליקציה מציגה. מכאן מגיעים רק השם והמיקום —
// כל נתוני מזג האוויר מגיעים מה-API של Open-Meteo.
export const CITIES: City[] = [
  { id: 'tel-aviv', name: 'תל אביב', country: 'ישראל', latitude: 32.08, longitude: 34.78 },
  { id: 'jerusalem', name: 'ירושלים', country: 'ישראל', latitude: 31.77, longitude: 35.21 },
  { id: 'haifa', name: 'חיפה', country: 'ישראל', latitude: 32.79, longitude: 34.99 },
  { id: 'givat-shmuel', name: 'גבעת שמואל', country: 'ישראל', latitude: 32.08, longitude: 34.85 },
  { id: 'eilat', name: 'אילת', country: 'ישראל', latitude: 29.56, longitude: 34.95 },
  { id: 'london', name: 'לונדון', country: 'בריטניה', latitude: 51.51, longitude: -0.13 },
  { id: 'paris', name: 'פריז', country: 'צרפת', latitude: 48.85, longitude: 2.35 },
  { id: 'new-york', name: 'ניו יורק', country: 'ארה"ב', latitude: 40.71, longitude: -74.01 },
  { id: 'tokyo', name: 'טוקיו', country: 'יפן', latitude: 35.68, longitude: 139.69 },
  { id: 'reykjavik', name: 'רייקיאוויק', country: 'איסלנד', latitude: 64.15, longitude: -21.94 },
  { id: 'dubai', name: 'דובאי', country: 'איחוד האמירויות', latitude: 25.2, longitude: 55.27 },
  { id: 'sydney', name: 'סידני', country: 'אוסטרליה', latitude: -33.87, longitude: 151.21 },
  { id: 'rome', name: 'רומא', country: 'איטליה', latitude: 41.9, longitude: 12.5 },
]

/** מחזיר עיר לפי id, או undefined אם אין כזאת */
export function findCityById(id: string | undefined): City | undefined {
  return CITIES.find((city) => city.id === id)
}
