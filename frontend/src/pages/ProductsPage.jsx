import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/products/ProductCard'
import ProductFilters from '../components/products/ProductFilters'
import Pagination from '../components/common/Pagination'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import Alert from '../components/common/Alert'
import Button from '../components/common/Button'
import { categories } from '../data/categories'
import { useMockProducts } from '../hooks/useMockProducts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const PAGE_SIZE = 8
const MAX_PRICE = 1500

export default function ProductsPage() {
  useDocumentTitle('Products')
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, loading, error, retry } = useMockProducts()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState(searchParams.get('sort') || 'name-asc')
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    maxPrice: Number(searchParams.get('maxPrice')) || MAX_PRICE,
    stock: searchParams.get('stock') || 'all',
  })

  useEffect(() => {
    const next = {}
    if (filters.q) next.q = filters.q
    if (filters.category) next.category = filters.category
    if (filters.maxPrice !== MAX_PRICE) next.maxPrice = String(filters.maxPrice)
    if (filters.stock !== 'all') next.stock = filters.stock
    if (sort !== 'name-asc') next.sort = sort
    setSearchParams(next, { replace: true })
  }, [filters, sort, setSearchParams])

  const results = useMemo(() => {
    const query = filters.q.trim().toLowerCase()
    return data
      .filter((product) => !query || product.name.toLowerCase().includes(query))
      .filter((product) => !filters.category || product.category === filters.category)
      .filter((product) => product.price <= filters.maxPrice)
      .filter((product) => {
        if (filters.stock === 'in') return product.stockQuantity > 5
        if (filters.stock === 'low') return product.stockQuantity > 0 && product.stockQuantity <= 5
        if (filters.stock === 'out') return product.stockQuantity === 0
        return true
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a.price - b.price
        if (sort === 'price-desc') return b.price - a.price
        if (sort === 'name-desc') return b.name.localeCompare(a.name)
        return a.name.localeCompare(b.name)
      })
  }, [data, filters, sort])

  useEffect(() => setPage(1), [filters, sort])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const changeFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const clearFilters = () => {
    setFilters({ q: '', category: '', maxPrice: MAX_PRICE, stock: 'all' })
    setSort('name-asc')
  }

  if (loading) return <div className="container page-shell"><Loader label="Loading demo products..." /></div>
  if (error) return <div className="container page-shell"><Alert type="error" title="Catalog error" action={<Button onClick={retry}>Try again</Button>}>{error}</Alert></div>

  return (
    <div className="container page-shell">
      <div className="page-heading"><div><span className="eyebrow">Catalog</span><h1>Products</h1><p>Search, filter, and sort 20 local demo products.</p></div></div>
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label htmlFor="catalog-search">Search products</label>
          <input id="catalog-search" className="input" value={filters.q} onChange={(e) => changeFilter('q', e.target.value)} placeholder="Try 'Nova' or 'Gaming'" />
        </div>
        <div className="catalog-sort">
          <label htmlFor="sort-products">Sort by</label>
          <select id="sort-products" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </div>
        <Button className="filters-toggle" variant="secondary" onClick={() => setMobileOpen(true)}>Filters</Button>
      </div>

      <div className="catalog-layout">
        <ProductFilters categories={categories} filters={filters} maxPrice={MAX_PRICE} onChange={changeFilter} onReset={clearFilters} mobileOpen={mobileOpen} onToggleMobile={() => setMobileOpen(false)} />
        {mobileOpen ? <button className="filter-scrim" type="button" aria-label="Close filters" onClick={() => setMobileOpen(false)} /> : null}
        <section className="catalog-results" aria-live="polite">
          <div className="results-head"><strong>{results.length} result{results.length === 1 ? '' : 's'}</strong><span>Page {Math.min(page, totalPages)} of {totalPages}</span></div>
          {pageItems.length ? <div className="product-grid product-grid--catalog">{pageItems.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
            <EmptyState icon="⌕" title="No matching products" description="Try a different search, category, price range, or stock filter." action={<Button onClick={clearFilters}>Clear filters</Button>} />
          )}
          <Pagination page={Math.min(page, totalPages)} totalPages={totalPages} onPageChange={(next) => { setPage(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        </section>
      </div>
    </div>
  )
}
