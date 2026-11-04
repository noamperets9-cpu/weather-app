import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <section>
      <h2>404 · העמוד לא נמצא</h2>
      <p>הכתובת שהקלדת לא קיימת.</p>
      <Link to="/">חזרה לרשימת הערים</Link>
    </section>
  )
}

export default NotFoundPage
