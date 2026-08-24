import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/products?category=${encodeURIComponent(category.name)}`}>
      <img src={category.image} alt={`${category.name} category`} />
      <div className="category-card__overlay">
        <span className="eyebrow">Explore</span>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  )
}
