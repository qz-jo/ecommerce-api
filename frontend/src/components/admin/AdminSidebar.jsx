const items = [
  ['overview', 'Overview'],
  ['products', 'Products'],
  ['categories', 'Categories'],
  ['orders', 'Orders'],
  ['states', 'UI States'],
]

export default function AdminSidebar({ activeTab, onChange }) {
  return (
    <nav className="admin-sidebar" aria-label="Admin sections">
      <div className="admin-sidebar__brand">NOVA / ADMIN</div>
      {items.map(([key, label]) => (
        <button key={key} type="button" className={activeTab === key ? 'is-active' : ''} onClick={() => onChange(key)}>{label}</button>
      ))}
    </nav>
  )
}
