import { useParams } from 'react-router'

function CityDetailsPage() {
  // id נלקח מהכתובת: /cities/tel-aviv → id = "tel-aviv"
  const { id } = useParams()

  return (
    <section>
      <h2>פרטי עיר</h2>
      <p>מזהה העיר מהכתובת: {id}</p>
    </section>
  )
}

export default CityDetailsPage
