import { Link } from 'react-router'
import CityCard from '../components/CityCard'
import StatusMessage from '../components/StatusMessage'
import { useCitiesWeather } from '../hooks/useCitiesWeather'

interface FavoritesPageProps {
  favoriteIds: string[]
  onToggleFavorite: (cityId: string) => void
}

function FavoritesPage({ favoriteIds, onToggleFavorite }: FavoritesPageProps) {
  const { citiesWeather, isLoading, error } = useCitiesWeather()

  // רק הערים שהמשתמש סימן בכוכב.
  // כשמורידים כוכב — favoriteIds משתנה ב-App, העמוד מתרנדר מחדש, והעיר נעלמת.
  const favoriteCities = citiesWeather.filter((weather) => favoriteIds.includes(weather.city.id))

  if (favoriteIds.length === 0) {
    return (
      <section>
        <h2>הערים המועדפות שלי</h2>
        <StatusMessage type="info" text="עוד לא בחרת ערים מועדפות. לחצו על ☆ בכרטיס של עיר כדי להוסיף אותה." />
        <Link to="/">← לרשימת הערים</Link>
      </section>
    )
  }

  return (
    <section>
      <h2>הערים המועדפות שלי</h2>

      {isLoading && <StatusMessage type="loading" text="טוען את מזג האוויר..." />}

      {error && <StatusMessage type="error" text={error} />}

      {!isLoading && !error && (
        <div className="city-grid">
          {favoriteCities.map((weather) => (
            <CityCard
              key={weather.city.id}
              weather={weather}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
