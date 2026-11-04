# 🌤️ מזג אוויר בערים שלי

אפליקציית web שמציגה את מזג האוויר העדכני ב-12 ערים בארץ ובעולם, ותחזית ל-7 ימים לכל עיר.
אפשר לחפש ולסנן ערים, לסמן ערים מועדפות (נשמרות גם אחרי סגירת הדפדפן), ולהגריל עיר אקראית.

פרויקט גמר בקורס 4255 · פלטפורמות מתקדמות לפיתוח ב-WEB ושימוש ב-AI.

## מה יש באפליקציה

| עמוד | כתובת | מה עושים בו |
|---|---|---|
| רשימת ערים | `/` | כרטיס לכל עיר עם הטמפרטורה ומצב מזג האוויר עכשיו. חיפוש לפי שם וסינון לפי מצב (בהיר / מעונן / גשם...) |
| פרטי עיר | `/cities/:id` | מזג האוויר עכשיו (טמפרטורה, רוח) ותחזית ל-7 ימים: מקסימום/מינימום ומשקעים |
| מועדפים | `/favorites` | רק הערים שסומנו בכוכב ⭐. נשמר ב-`localStorage` |
| עיר אקראית | `/random` | כפתור שמגריל עיר (שונה מהקודמת) ומציג את מזג האוויר בה |
| 404 | כל כתובת אחרת | הודעה וקישור חזרה |

בכל עמוד שמושך מידע יש שלושה מצבים: טוען · שגיאה · יש מידע.

## טכנולוגיות

- **React 19 + TypeScript + Vite**, צד-לקוח בלבד (בלי שרת ובלי בסיס נתונים)
- **React Router**: ניתוב בין העמודים
- **Vitest + Vitest UI**: בדיקות יחידה
- **CSS** משלי, כולל התאמה למסך צר (טלפון)

## ה-API

**[Open-Meteo](https://open-meteo.com/)**: API ציבורי וחינמי של מזג אוויר, **בלי מפתח**.

- כתובת: `https://api.open-meteo.com/v1/forecast`
- **ברשימה:** בקשה אחת לכל 12 הערים יחד (הקואורדינטות מופרדות בפסיקים), עם `current=temperature_2m,weather_code,wind_speed_10m`
- **בעמוד הפרטים:** בקשה לעיר אחת, עם `daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum`
- רשימת הערים (שם + קואורדינטות) מוגדרת בקוד ב-[`src/data/cities.ts`](src/data/cities.ts). **כל נתוני מזג האוויר מגיעים מה-API.**
- מצב מזג האוויר מגיע כמספר לפי תקן WMO (`weather_code`), והאפליקציה ממירה אותו לתיאור בעברית ולאייקון.

הנתונים מוצגים ברישיון [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) של Open-Meteo.

## הרצה

צריך [Node.js](https://nodejs.org/) (גרסה 20 ומעלה).

```bash
git clone https://github.com/noamperets9-cpu/web-final-project.git
cd web-final-project
npm install
npm run dev
```

ואז פותחים בדפדפן את הכתובת שמופיעה בטרמינל (בדרך כלל `http://localhost:5173`).

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | מריץ את האפליקציה במצב פיתוח |
| `npm run build` | בדיקת טיפוסים (TypeScript) ובנייה לתיקייה `dist` |
| `npm run lint` | בדיקת הקוד עם ESLint |
| `npm test` | מריץ את כל בדיקות היחידה פעם אחת בטרמינל |
| `npm run test:ui` | פותח את Vitest UI בדפדפן |

## בדיקות

31 בדיקות יחידה ב-Vitest, על הלוגיקה של האפליקציה (לא על React עצמו):

| קובץ | מה נבדק |
|---|---|
| [`weatherCodes.test.ts`](src/utils/weatherCodes.test.ts) | המרת `weather_code` לתיאור, אייקון וקבוצה (בהיר / גשם / סופה...), כולל קוד לא מוכר |
| [`filterCities.test.ts`](src/utils/filterCities.test.ts) | סינון לפי טקסט חיפוש ולפי מצב מזג אוויר, והשילוב ביניהם |
| [`weatherApi.test.ts`](src/api/weatherApi.test.ts) | בניית כתובות ה-API, ועיבוד התשובה של ה-API למבנה שהאפליקציה עובדת איתו |
| [`favorites.test.ts`](src/utils/favorites.test.ts) | הוספה/הסרה של מועדפים, וקריאה בטוחה של מה ששמור ב-`localStorage` |
| [`randomCity.test.ts`](src/utils/randomCity.test.ts) | הגרלת עיר שאף פעם לא חוזרת על הקודמת |
| [`cities.test.ts`](src/data/cities.test.ts) | חיפוש עיר לפי `id`, ושלכל עיר יש `id` ייחודי |

**ב-Vitest UI:** אחרי `npm run test:ui`, פותחים את הכתובת **המלאה** שמופיעה בטרמינל (כולל `?token=...`). בלי ה-token מופיעה ההודעה "Vitest UI requires authentication".

## מבנה הפרויקט

```
src/
├── main.tsx            נקודת הכניסה: BrowserRouter סביב App
├── App.tsx             הגדרת העמודים (Routes) + ה-state של המועדפים
├── pages/              עמוד לכל כתובת
├── components/         רכיבים לשימוש חוזר: NavBar, CityCard, SearchBar, FavoriteButton, ForecastDay, StatusMessage
├── hooks/              useCitiesWeather: טעינת מזג האוויר בכל הערים
├── api/                בניית כתובות ה-API ועיבוד התשובות
├── utils/              לוגיקה טהורה: סינון, מועדפים, הגרלה, קודי מזג אוויר
├── data/               רשימת הערים
└── types/              הטיפוסים של TypeScript
```

פירוט של הרכיבים, העמודים וזרימת המידע: **[docs/architecture.md](docs/architecture.md)**.

## מסמכי תכנון

- [PRD.md](PRD.md): מה בונים ולמה
- [tasks.md](tasks.md): תוכנית העבודה, משימה אחרי משימה
- [PROMPTS.md](PROMPTS.md): יומן הפרומפטים לסוכן ה-AI (נרשם אוטומטית)
