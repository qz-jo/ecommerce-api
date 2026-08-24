const productImage = (id) => `${import.meta.env.BASE_URL}images/products/product-${id}.svg`

export const products = [

{
  id: 1,
  name: 'AeroBook Pro 14',
  description: 'Slim aluminum laptop with a bright 14-inch display, long battery life, and fast everyday performance.',
  price: 899,
  stockQuantity: 14,
  category: 'Laptops',
  image: productImage(1),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-02'
},

{
  id: 2,
  name: 'Vertex Gaming 16',
  description: 'High-performance gaming laptop with dedicated graphics, 165Hz display, and advanced cooling.',
  price: 1299,
  stockQuantity: 6,
  category: 'Laptops',
  image: productImage(2),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-03'
},

{
  id: 3,
  name: 'LiteBook Air 13',
  description: 'Lightweight notebook designed for study, travel, and productivity on the go.',
  price: 699,
  stockQuantity: 9,
  category: 'Laptops',
  image: productImage(3),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-04'
},

{
  id: 4,
  name: 'StudioBook OLED',
  description: 'Creator-focused laptop with an OLED panel, color-accurate display, and spacious SSD storage.',
  price: 1499,
  stockQuantity: 3,
  category: 'Laptops',
  image: productImage(4),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-05'
},

{
  id: 5,
  name: 'Nova X1 Phone',
  description: 'Flagship smartphone with vivid AMOLED display, triple-camera system, and all-day battery.',
  price: 749,
  stockQuantity: 18,
  category: 'Phones',
  image: productImage(5),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-06'
},

{
  id: 6,
  name: 'Nova Mini Phone',
  description: 'Compact smartphone with premium performance in a pocket-friendly design.',
  price: 499,
  stockQuantity: 0,
  category: 'Phones',
  image: productImage(6),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-07'
},

{
  id: 7,
  name: 'Pulse Max Phone',
  description: 'Balanced 5G phone with large display, fast charging, and reliable cameras.',
  price: 599,
  stockQuantity: 11,
  category: 'Phones',
  image: productImage(7),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-08'
},

{
  id: 8,
  name: 'Orbit Fold',
  description: 'Foldable smartphone with multitasking-friendly inner display and premium hinge design.',
  price: 1199,
  stockQuantity: 4,
  category: 'Phones',
  image: productImage(8),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-09'
},

{
  id: 9,
  name: 'Echo ANC Headphones',
  description: 'Wireless over-ear headphones with active noise cancellation and rich spatial sound.',
  price: 179,
  stockQuantity: 24,
  category: 'Audio',
  image: productImage(9),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-10'
},

{
  id: 10,
  name: 'Wave Buds Pro',
  description: 'Compact true wireless earbuds with low-latency mode, ANC, and wireless charging.',
  price: 129,
  stockQuantity: 30,
  category: 'Audio',
  image: productImage(10),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-11'
},

{
  id: 11,
  name: 'Boom Mini Speaker',
  description: 'Portable Bluetooth speaker with punchy sound, splash resistance, and 12-hour battery.',
  price: 79,
  stockQuantity: 16,
  category: 'Audio',
  image: productImage(11),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-12'
},

{
  id: 12,
  name: 'Studio USB Microphone',
  description: 'Cardioid USB microphone for streaming, calls, and clear voice recording.',
  price: 109,
  stockQuantity: 7,
  category: 'Audio',
  image: productImage(12),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-13'
},

{
  id: 13,
  name: 'Flux Mechanical Keyboard',
  description: 'Hot-swappable mechanical keyboard with tactile switches and clean white backlight.',
  price: 99,
  stockQuantity: 20,
  category: 'Accessories',
  image: productImage(13),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-14'
},

{
  id: 14,
  name: 'Glide Wireless Mouse',
  description: 'Ergonomic wireless mouse with silent clicks, adjustable DPI, and USB-C charging.',
  price: 59,
  stockQuantity: 25,
  category: 'Accessories',
  image: productImage(14),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-15'
},

{
  id: 15,
  name: 'DockHub 9-in-1',
  description: 'USB-C hub with HDMI, Ethernet, card reader, power delivery, and extra USB ports.',
  price: 89,
  stockQuantity: 0,
  category: 'Accessories',
  image: productImage(15),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-16'
},

{
  id: 16,
  name: 'Volt 100W Charger',
  description: 'Compact GaN wall charger with three ports and intelligent power distribution.',
  price: 69,
  stockQuantity: 32,
  category: 'Accessories',
  image: productImage(16),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-17'
},

{
  id: 17,
  name: 'Rift Controller',
  description: 'Wireless game controller with textured grips, remappable buttons, and USB-C charging.',
  price: 74,
  stockQuantity: 15,
  category: 'Gaming',
  image: productImage(17),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-18'
},

{
  id: 18,
  name: 'Arcade Mini Console',
  description: 'Compact living-room console with 4K output, fast storage, and two wireless controllers.',
  price: 249,
  stockQuantity: 8,
  category: 'Gaming',
  image: productImage(18),
  isFeatured: true,
  isActive: true,
  createdAt: '2026-08-19'
},

{
  id: 19,
  name: 'Photon RGB Mousepad',
  description: 'Extended desk mousepad with soft surface, anti-slip base, and edge RGB lighting.',
  price: 39,
  stockQuantity: 22,
  category: 'Gaming',
  image: productImage(19),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-20'
},

{
  id: 20,
  name: 'Vortex Gaming Headset',
  description: 'Comfortable surround-sound headset with detachable microphone and breathable cushions.',
  price: 119,
  stockQuantity: 5,
  category: 'Gaming',
  image: productImage(20),
  isFeatured: false,
  isActive: true,
  createdAt: '2026-08-01'
},
]
