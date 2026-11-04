import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import CityDetailsPage from './pages/CityDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import RandomCityPage from './pages/RandomCityPage'
import NotFoundPage from './pages/NotFoundPage'
import { loadFavorites, saveFavorites, toggleFavorite } from './utils/favorites'

function App() {
  // המועדפים נשמרים כאן — ב-App — כי שלושה עמודים צריכים אותם:
  // הרשימה והפרטים (כדי לסמן כוכב), ועמוד המועדפים (כדי להציג אותם).
  // הפונקציה בתוך useState רצה רק בפעם הראשונה — קוראת את מה ששמור מהביקור הקודם.
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavorites())

  // בכל פעם שהמועדפים משתנים — שומרים אותם ב-localStorage
  useEffect(() => {
    saveFavorites(favoriteIds)
  }, [favoriteIds])

  function handleToggleFavorite(cityId: string) {
    setFavoriteIds((current) => toggleFavorite(current, cityId))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>מזג אוויר בערים שלי</h1>
        <NavBar />
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
            }
          />
          <Route
            path="/cities/:id"
            element={
              <CityDetailsPage favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage favoriteIds={favoriteIds} onToggleFavorite={handleToggleFavorite} />
            }
          />
          <Route path="/random" element={<RandomCityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
