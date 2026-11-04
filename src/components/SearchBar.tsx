import { CONDITION_OPTIONS, type ConditionFilter } from '../utils/filterCities'
import './SearchBar.css'

interface SearchBarProps {
  query: string
  condition: ConditionFilter
  onQueryChange: (query: string) => void
  onConditionChange: (condition: ConditionFilter) => void
}

/**
 * שדה חיפוש + תפריט סינון.
 * הרכיב לא שומר state בעצמו: הערכים מגיעים מההורה (HomePage) ב-props,
 * וכל שינוי מדווח להורה דרך הפונקציות onQueryChange / onConditionChange.
 */
function SearchBar({ query, condition, onQueryChange, onConditionChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label className="search-field">
        <span>חיפוש עיר</span>
        <input
          type="search"
          placeholder="למשל: תל אביב"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </label>

      <label className="search-field">
        <span>מצב מזג אוויר</span>
        <select
          value={condition}
          onChange={(event) => onConditionChange(event.target.value as ConditionFilter)}
        >
          {CONDITION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default SearchBar
