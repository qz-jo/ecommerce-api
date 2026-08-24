import Button from '../common/Button'

export default function ProductFilters({
  categories,
  filters,
  maxPrice,
  onChange,
  onReset,
  mobileOpen,
  onToggleMobile,
}) {
  return (
    <aside className={`filters-panel ${mobileOpen ? 'is-open' : ''}`} aria-label="Product filters">
      <div className="filters-panel__mobile-head">
        <strong>Filters</strong>
        <button type="button" className="icon-btn" onClick={onToggleMobile} aria-label="Close filters">×</button>
      </div>
      <div className="filter-group">
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <div className="filter-group__label-row">
          <label htmlFor="price-filter">Maximum price</label>
          <span>${filters.maxPrice}</span>
        </div>
        <input id="price-filter" type="range" min="25" max={maxPrice} step="25" value={filters.maxPrice} onChange={(e) => onChange('maxPrice', Number(e.target.value))} />
      </div>
      <div className="filter-group">
        <label htmlFor="stock-filter">Availability</label>
        <select id="stock-filter" value={filters.stock} onChange={(e) => onChange('stock', e.target.value)}>
          <option value="all">All stock states</option>
          <option value="in">In stock</option>
          <option value="low">Low stock (1-5)</option>
          <option value="out">Out of stock</option>
        </select>
      </div>
      <Button variant="secondary" className="w-full" onClick={onReset}>Clear all filters</Button>
    </aside>
  )
}
