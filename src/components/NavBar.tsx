import { NavLink } from 'react-router'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      {/* end — כדי ש"ערים" יודגש רק ב-"/" ולא בכל כתובת שמתחילה ב-"/" */}
      <NavLink to="/" end>
        ערים
      </NavLink>
      <NavLink to="/favorites">מועדפים</NavLink>
      <NavLink to="/random">עיר אקראית</NavLink>
    </nav>
  )
}

export default NavBar
