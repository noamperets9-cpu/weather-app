import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import CityDetailsPage from './pages/CityDetailsPage'
import FavoritesPage from './pages/FavoritesPage'
import RandomCityPage from './pages/RandomCityPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>מזג אוויר בערים שלי</h1>
        <NavBar />
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cities/:id" element={<CityDetailsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/random" element={<RandomCityPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
