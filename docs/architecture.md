# ארכיטקטורה · מבנה הרכיבים וזרימת המידע

חזרה ל-[PRD](../PRD.md) · ל-[README](../README.md)

## עץ הרכיבים

```
main.tsx
└── <BrowserRouter>                       מחבר את האפליקציה לכתובת בדפדפן
    └── <App>                             state: favoriteIds (נשמר ב-localStorage)
        ├── <NavBar>                      NavLink לכל עמוד, הפעיל מודגש
        └── <Routes>
            ├── "/"            <HomePage>         state: query, condition · hook: useCitiesWeather
            │                    ├── <SearchBar>          שדה חיפוש + תפריט סינון (controlled)
            │                    ├── <StatusMessage>      טוען / שגיאה / "לא נמצאו ערים"
            │                    └── <CityCard> × N       Link לפרטים + <FavoriteButton>
            │
            ├── "/cities/:id"  <CityDetailsPage>  useParams · state: current, forecast, isLoading, error
            │                    ├── <FavoriteButton>
            │                    ├── <StatusMessage>
            │                    └── <ForecastDay> × 7
            │
            ├── "/favorites"   <FavoritesPage>    hook: useCitiesWeather · מסנן לפי favoriteIds
            │                    └── <CityCard> × N
            │
            ├── "/random"      <RandomCityPage>   state: city, weather, isLoading, error
            │                    └── <CityCard>
            │
            └── "*"            <NotFoundPage>
```

## איפה נשמר ה-state, ולמה דווקא שם

| state | איפה | למה שם |
|---|---|---|
| `favoriteIds` | `App` | שלושה עמודים צריכים אותו: הרשימה והפרטים (לסמן ⭐) והמועדפים (להציג). `App` הוא האב המשותף הקרוב ביותר |
| `query`, `condition` | `HomePage` | רק עמוד הרשימה צריך אותם. `SearchBar` מציג ומשנה, אבל הרשימה שמסוננת נמצאת ב-`HomePage` |
| מזג האוויר בכל הערים | `useCitiesWeather` (בתוך `HomePage` / `FavoritesPage`) | כל עמוד טוען לעצמו כשהוא עולה. ה-hook מונע שכפול של קוד ה-fetch |
| תחזית לעיר | `CityDetailsPage` | רק העמוד הזה צריך אותה |
| העיר שהוגרלה | `RandomCityPage` | רק העמוד הזה צריך אותה |

**מה לא נשמר ב-state:** הרשימה המסוננת (`visibleCities`) והערים המועדפות שמוצגות (`favoriteCities`). הן **מחושבות** בכל רינדור מה-state הקיים, וכך אין שני "מקורות אמת" שיכולים לצאת מסנכרון.

## זרימות מידע מרכזיות

### טעינת הרשימה
1. `HomePage` עולה, ו-`useCitiesWeather` מתחיל עם `isLoading = true`, אז מוצג "טוען...".
2. `useEffect` (עם `[]`, כלומר פעם אחת) קורא ל-`fetch(buildCurrentWeatherUrl(CITIES))`: בקשה אחת לכל הערים.
3. ה-API מחזיר מערך, איבר לכל עיר. `toCityWeatherList` מחבר כל עיר לתוצאה שלה ← `setCitiesWeather`.
4. `isLoading = false`, ואז רינדור מחדש. `filterCities` מחזירה את הערים שמתאימות לחיפוש, ו-`map` יוצר `CityCard` עם `key={city.id}`.
5. אם ה-fetch נכשל (או `response.ok` הוא false), ה-`catch` שם הודעה ב-`error`, ומוצג `StatusMessage` אדום.

### מהלחיצה על עיר ועד שהפרטים מופיעים
1. `CityCard` הוא `<Link to="/cities/haifa">`. הלחיצה משנה את הכתובת **בלי טעינת דף מהשרת**.
2. `Routes` ב-`App` מתאים את הכתובת ל-`/cities/:id` ומציג את `CityDetailsPage`.
3. `useParams()` מחזיר `{ id: 'haifa' }`, ו-`findCityById` מחזיר את העיר עם הקואורדינטות. אם אין עיר כזאת, מוצג "העיר לא נמצאה".
4. `useEffect` (עם `[city]`) קורא ל-`fetch(buildForecastUrl(city))`.
5. ה-API מחזיר את התחזית כמערכים נפרדים (מערך תאריכים, מערך מקסימום...). `toDailyForecast` הופך אותם למערך של ימים ← `setForecast`.
6. רינדור מחדש, ו-`map` יוצר `ForecastDay` לכל יום.

### לחיצה על כוכב ⭐
1. `FavoriteButton` ← `onToggle` ← `CityCard` קורא ל-`onToggleFavorite(city.id)` (הפונקציה הגיעה ב-props מהעמוד, שקיבל אותה מ-`App`).
2. `handleToggleFavorite` ב-`App` ← `setFavoriteIds(current => toggleFavorite(current, id))`: מערך **חדש**, כדי ש-React יזהה את השינוי.
3. `useEffect` עם `[favoriteIds]` ב-`App` שומר ב-`localStorage` (כ-JSON).
4. `App` מתרנדר, ה-props החדשים יורדים לעמוד, והכוכב מתמלא. בעמוד המועדפים העיר נעלמת או מופיעה.
5. בטעינה הבאה של האתר, `useState(() => loadFavorites())` קורא את מה שנשמר.

### הגרלת עיר
1. לחיצה על "🎲 הגרל" ← `pickRandomCity(CITIES, previousId)` ← `setCity`.
2. `useEffect` עם `[city]` רץ, כי העיר השתנתה, ועושה `fetch` למזג האוויר בעיר החדשה.
3. אם לוחצים שוב לפני שהתשובה הגיעה, פונקציית הניקוי מסמנת `ignore = true`, והתשובה הישנה לא דורסת את החדשה.

## תבניות שחוזרות בקוד

- **`fetch` בתוך `useEffect` + דגל `ignore`**: בכל טעינה. פונקציית הניקוי של ה-effect מונעת עדכון state של רכיב שכבר ירד מהמסך. במצב פיתוח `StrictMode` מריץ כל effect פעמיים בכוונה, ולכן ב-Network רואים שתי בקשות.
- **`response.ok`**: `fetch` לא נכשל לבד על שגיאת שרת (404/500), רק על בעיית רשת. לכן בודקים בעצמנו וזורקים שגיאה.
- **פונקציות טהורות ב-`utils/` ו-`api/`**: כל הלוגיקה (סינון, המרות, הגרלה, מועדפים) מופרדת מ-React. כך אפשר לבדוק אותה ב-Vitest בלי לרנדר רכיבים.
- **טיפוסים בשתי שכבות** (`src/types/weather.ts`): `Api*` מתארים בדיוק את מה שה-API מחזיר (`temperature_2m`...), ו-`CityWeather` / `DailyForecast` הם המבנה הנוח שהאפליקציה עובדת איתו. הפונקציות ב-`api/weatherApi.ts` ממירות מהראשון לשני.
- **Controlled components**: `SearchBar` ו-`FavoriteButton` לא שומרים state. הם מקבלים ערך ופונקציה ב-props, ומדווחים להורה על כל שינוי.

## מה הייתי משנה כדי להוסיף יכולת חדשה (דוגמאות)

- **להוסיף עיר:** שורה אחת ב-`src/data/cities.ts`. כל השאר (רשימה, פרטים, הגרלה) מתעדכן לבד.
- **להוסיף נתון לכרטיס (למשל לחות):** להוסיף `relative_humidity_2m` ל-`current=` ב-`buildCurrentWeatherUrl`, שדה ב-`ApiCurrentWeather` וב-`CityWeather`, להעביר אותו ב-`toCityWeatherList`, ולהציג ב-`CityCard`. אחר כך לעדכן את הבדיקה של `toCityWeatherList`.
- **להוסיף עמוד:** רכיב חדש ב-`pages/`, `<Route>` ב-`App.tsx`, ו-`<NavLink>` ב-`NavBar.tsx`.
