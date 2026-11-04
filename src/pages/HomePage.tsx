import { useState } from 'react'
import CityCard from '../components/CityCard'
import SearchBar from '../components/SearchBar'
import StatusMessage from '../components/StatusMessage'
import { useCitiesWeather } from '../hooks/useCitiesWeather'
import { filterCities, type ConditionFilter } from '../utils/filterCities'

interface HomePageProps {
  favoriteIds: string[]
  onToggleFavorite: (cityId: string) => void
}

function HomePage({ favoriteIds, onToggleFavorite }: HomePageProps) {
  // המידע מה-API — ה-fetch עצמו נמצא ב-hook (src/hooks/useCitiesWeather.ts)
  const { citiesWeather, isLoading, error } = useCitiesWeather()

  // מה שהמשתמש בחר בחיפוש ובסינון
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState<ConditionFilter>('all')

  // הרשימה המסוננת מחושבת מחדש בכל רינדור — לא שומרים אותה ב-state,
  // כי אפשר תמיד לחשב אותה מהמידע ומהבחירות של המשתמש
  const visibleCities = filterCities(citiesWeather, query, condition)

  return (
    <section>
      <h2>כל הערים</h2>

      {isLoading && <StatusMessage type="loading" text="טוען את מזג האוויר..." />}

      {error && <StatusMessage type="error" text={error} />}

      {!isLoading && !error && (
        <>
          <SearchBar
            query={query}
            condition={condition}
            onQueryChange={setQuery}
            onConditionChange={setCondition}
          />

          {visibleCities.length === 0 ? (
            <StatusMessage type="info" text="לא נמצאו ערים" />
          ) : (
            <div className="city-grid">
              {visibleCities.map((weather) => (
                <CityCard
                  key={weather.city.id}
                  weather={weather}
                  isFavorite={favoriteIds.includes(weather.city.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default HomePage
