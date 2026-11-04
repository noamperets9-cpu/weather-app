import './FavoriteButton.css'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

/** כפתור כוכב: מלא אם העיר במועדפים, ריק אם לא. לחיצה מעבירה את ההחלטה להורה. */
function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
      title={isFavorite ? 'הסר מהמועדפים' : 'הוסף למועדפים'}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}

export default FavoriteButton
