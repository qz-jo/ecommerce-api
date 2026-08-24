import { useMemo, useState } from 'react'
import AdminSidebar from '../components/admin/AdminSidebar'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Alert from '../components/common/Alert'
import Loader from '../components/common/Loader'
import EmptyState from '../components/common/EmptyState'
import StatusBadge from '../components/common/StatusBadge'
import StockBadge from '../components/common/StockBadge'
import { products as initialProducts } from '../data/products'
import { categories as initialCategories } from '../data/categories'
import { demoOrders as initialOrders } from '../data/orders'
import { validateProduct } from '../utils/validation'
import { formatCurrency } from '../utils/formatCurrency'
import { useToast } from '../context/ToastContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const DEFAULT_PRODUCT_IMAGE = `${import.meta.env.BASE_URL}images/products/product-1.svg`
const DEFAULT_CATEGORY_IMAGE = `${import.meta.env.BASE_URL}images/products/product-13.svg`
const blankProduct = { name: '', category: '', price: '', stockQuantity: '', image: DEFAULT_PRODUCT_IMAGE, description: '' }

export default function AdminPage() {
  useDocumentTitle('Admin')
  const { pushToast } = useToast()
  const [tab, setTab] = useState('overview')
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState(initialCategories)
  const [orders, setOrders] = useState(initialOrders)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [productModal, setProductModal] = useState(false)
  const [productForm, setProductForm] = useState(blankProduct)
  const [productErrors, setProductErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [disableTarget, setDisableTarget] = useState(null)
  const [categoryName, setCategoryName] = useState('')

  const filteredProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())).filter((product) => !categoryFilter || product.category === categoryFilter), [products, query, categoryFilter])
  const totalSales = orders.filter((order) => order.status !== 'Cancelled').reduce((sum, order) => sum + order.total, 0)

  const openAdd = () => { setEditingId(null); setProductForm(blankProduct); setProductErrors({}); setProductModal(true) }
  const openEdit = (product) => { setEditingId(product.id); setProductForm({ ...product, price: String(product.price), stockQuantity: String(product.stockQuantity) }); setProductErrors({}); setProductModal(true) }

  const saveProduct = (event) => {
    event.preventDefault()
    const errors = validateProduct(productForm)
    setProductErrors(errors)
    if (Object.keys(errors).length) return
    const normalized = { ...productForm, price: Number(productForm.price), stockQuantity: Number(productForm.stockQuantity), description: productForm.description || 'Admin-created demo product.', isActive: true, isFeatured: false, createdAt: '2026-08-24' }
    if (editingId) {
      setProducts((current) => current.map((item) => item.id === editingId ? { ...item, ...normalized } : item))
      pushToast('Product updated in local admin state.', 'success')
    } else {
      const nextId = Math.max(...products.map((item) => item.id)) + 1
      setProducts((current) => [...current, { ...normalized, id: nextId }])
      pushToast('Product added to local admin state.', 'success')
    }
    setProductModal(false)
  }

  const disableProduct = () => {
    setProducts((current) => current.map((item) => item.id === disableTarget.id ? { ...item, isActive: false } : item))
    pushToast(`${disableTarget.name} is now inactive.`, 'success')
    setDisableTarget(null)
  }

  const addCategory = (event) => {
    event.preventDefault()
    const clean = categoryName.trim()
    if (clean.length < 2 || categories.some((item) => item.name.toLowerCase() === clean.toLowerCase())) return pushToast('Enter a unique category name.', 'error')
    const nextId = Math.max(...categories.map((item) => item.id)) + 1
    setCategories((current) => [...current, { id: nextId, name: clean, slug: clean.toLowerCase().replace(/\s+/g, '-'), description: 'Admin-created local category.', image: DEFAULT_CATEGORY_IMAGE }])
    setCategoryName('')
    pushToast('Category added locally.', 'success')
  }

  const changeOrderStatus = (id, status) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order))
    pushToast(`Order ${id} changed to ${status}.`, 'success')
  }

  return (
    <div className="admin-page">
      <div className="admin-layout">
        <AdminSidebar activeTab={tab} onChange={setTab} />
        <main className="admin-main">
          <div className="admin-heading"><div><span className="eyebrow">Local admin dashboard</span><h1>{tab === 'overview' ? 'Store overview' : tab[0].toUpperCase() + tab.slice(1)}</h1><p>All changes live only in React state for this session.</p></div>{tab === 'products' ? <Button onClick={openAdd}>Add product</Button> : null}</div>

          {tab === 'overview' ? <Overview products={products} orders={orders} totalSales={totalSales} /> : null}
          {tab === 'products' ? (
            <section className="admin-card">
              <div className="admin-toolbar"><Input label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name" /><div className="form-field"><label htmlFor="admin-category">Category</label><select id="admin-category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="">All categories</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select></div></div>
              <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.id}><td><div className="table-product"><img src={product.image} alt="" /><strong>{product.name}</strong></div></td><td>{product.category}</td><td>{formatCurrency(product.price)}</td><td><StockBadge stock={product.stockQuantity} /></td><td>{product.isActive ? 'Active' : 'Inactive'}</td><td><div className="table-actions"><button type="button" onClick={() => openEdit(product)}>Edit</button><button type="button" className="danger-link" onClick={() => setDisableTarget(product)} disabled={!product.isActive}>Disable</button></div></td></tr>)}</tbody></table></div>
            </section>
          ) : null}
          {tab === 'categories' ? (
            <section className="admin-grid-two"><div className="admin-card"><h2>Add category</h2><form className="form-stack" onSubmit={addCategory}><Input label="Category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} /><Button type="submit">Add category</Button></form></div><div className="admin-card"><h2>Current categories</h2><div className="category-admin-list">{categories.map((category) => <div key={category.id}><div><strong>{category.name}</strong><span>{category.description}</span></div><span>{products.filter((product) => product.category === category.name).length} products</span></div>)}</div></div></section>
          ) : null}
          {tab === 'orders' ? (
            <section className="admin-card"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Change status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.date}</td><td>{order.items}</td><td>{formatCurrency(order.total)}</td><td><StatusBadge status={order.status} /></td><td><select value={order.status} onChange={(e) => changeOrderStatus(order.id, e.target.value)} aria-label={`Change status for ${order.id}`}>{['Pending','Processing','Shipped','Delivered','Cancelled'].map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div></section>
          ) : null}
          {tab === 'states' ? <UIStates /> : null}
        </main>
      </div>

      <Modal open={productModal} title={editingId ? 'Edit product' : 'Add product'} size="lg" onClose={() => setProductModal(false)} actions={<><Button variant="secondary" onClick={() => setProductModal(false)}>Cancel</Button><Button type="submit" form="admin-product-form">{editingId ? 'Save changes' : 'Add product'}</Button></>}>
        <form id="admin-product-form" onSubmit={saveProduct} className="form-grid" noValidate>
          <Input label="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} error={productErrors.name} />
          <div className="form-field"><label htmlFor="product-category">Category</label><select id="product-category" className={productErrors.category ? 'input input--error' : 'input'} value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}><option value="">Choose category</option>{categories.map((category) => <option key={category.id}>{category.name}</option>)}</select>{productErrors.category ? <p className="field-error">{productErrors.category}</p> : null}</div>
          <Input label="Price" type="number" min="0" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} error={productErrors.price} />
          <Input label="Stock quantity" type="number" min="0" step="1" value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })} error={productErrors.stockQuantity} />
          <Input className="form-field--full" label="Image path" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} error={productErrors.image} />
          <div className="form-field form-field--full"><label htmlFor="product-description">Description</label><textarea id="product-description" rows="4" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} /></div>
        </form>
      </Modal>
      <ConfirmDialog open={Boolean(disableTarget)} title="Disable product?" description={`Disable ${disableTarget?.name || 'this product'}? It will remain in local admin data but become inactive.`} confirmLabel="Disable" danger onClose={() => setDisableTarget(null)} onConfirm={disableProduct} />
    </div>
  )
}

function Overview({ products, orders, totalSales }) {
  const activeProducts = products.filter((product) => product.isActive)
  return (
    <>
      <section className="stats-grid"><div className="stat-card"><span>Users</span><strong>128</strong><small>Mock customers</small></div><div className="stat-card"><span>Products</span><strong>{activeProducts.length}</strong><small>{products.length - activeProducts.length} inactive</small></div><div className="stat-card"><span>Orders</span><strong>{orders.length}</strong><small>Local demo orders</small></div><div className="stat-card"><span>Sales</span><strong>{formatCurrency(totalSales)}</strong><small>Excludes cancelled</small></div></section>
      <section className="admin-grid-two"><div className="admin-card"><h2>Inventory snapshot</h2><div className="metric-list"><div><span>In stock</span><strong>{activeProducts.filter((p) => p.stockQuantity > 5).length}</strong></div><div><span>Low stock</span><strong>{activeProducts.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5).length}</strong></div><div><span>Out of stock</span><strong>{activeProducts.filter((p) => p.stockQuantity === 0).length}</strong></div></div></div><div className="admin-card"><h2>Recent order states</h2><div className="metric-list">{orders.slice(0, 4).map((order) => <div key={order.id}><span>{order.id}</span><StatusBadge status={order.status} /></div>)}</div></div></section>
    </>
  )
}

function UIStates() {
  const [showLoader, setShowLoader] = useState(false)
  return (
    <section className="admin-grid-two">
      <div className="admin-card"><h2>Loading state</h2><Button variant="secondary" onClick={() => { setShowLoader(true); window.setTimeout(() => setShowLoader(false), 1200) }}>Preview loader</Button>{showLoader ? <Loader label="Simulated loading..." /> : <p className="muted">Use the button to preview a required loading state.</p>}</div>
      <div className="admin-card"><h2>Error state</h2><Alert type="error" title="Something went wrong" action={<Button size="sm" variant="secondary">Retry</Button>}>A clear error message with a retry action.</Alert></div>
      <div className="admin-card"><h2>Empty state</h2><EmptyState title="No records yet" description="This reusable state works for empty lists, carts, and searches." /></div>
      <div className="admin-card"><h2>Success state</h2><Alert type="success" title="Changes saved">The demo action completed successfully.</Alert></div>
    </section>
  )
}
