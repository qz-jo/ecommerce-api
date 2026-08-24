import { useId, useState } from 'react'

export default function SearchBar({ defaultValue = '', onSearch, placeholder = 'Search products...', compact = false }) {
  const [value, setValue] = useState(defaultValue)
  const searchId = useId()

  const submit = (event) => {
    event.preventDefault()
    onSearch?.(value.trim())
  }

  return (
    <form className={`search-bar ${compact ? 'search-bar--compact' : ''}`} onSubmit={submit} role="search">
      <label className="sr-only" htmlFor={searchId}>Search products</label>
      <input id={searchId} value={value} onChange={(event) => setValue(event.target.value)} placeholder={placeholder} />
      <button type="submit" aria-label="Search">Search</button>
    </form>
  )
}
