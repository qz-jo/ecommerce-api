const productImage = (id) => `${import.meta.env.BASE_URL}images/products/product-${id}.svg`

export const categories = [
  { id: 1, name: 'Laptops', slug: 'laptops', description: 'Portable power for work, study, and creative projects.', image: productImage(1) },
  { id: 2, name: 'Phones', slug: 'phones', description: 'Smartphones built for camera, battery, and everyday speed.', image: productImage(5) },
  { id: 3, name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and microphones for immersive sound.', image: productImage(9) },
  { id: 4, name: 'Accessories', slug: 'accessories', description: 'Practical add-ons that complete your desk and mobile setup.', image: productImage(13) },
  { id: 5, name: 'Gaming', slug: 'gaming', description: 'Responsive gear for faster, more comfortable play.', image: productImage(17) }
]
