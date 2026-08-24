# Nova Tech — React E-commerce UI (Task 4)

A responsive React + Vite e-commerce frontend created for BATTECHNO Task 4. This task intentionally uses local mock data only and does not connect to the REST API or Neon database yet.

## Preview

GitHub Pages preview:

`https://qz-jo.github.io/ecommerce-api/`

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Context API
- Local Storage
- Plain responsive CSS

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Demo Accounts

Customer:
- Email: `customer@example.com`
- Password: `Customer123!`

Admin:
- Email: `admin@example.com`
- Password: `Admin123!`

## Routes

- `/` — Home
- `/products` — Products, search, filtering, sorting and pagination
- `/products/:id` — Product details and similar products
- `/cart` — Shopping cart
- `/checkout` — Checkout
- `/login` — Login
- `/register` — Create account
- `/profile` — Protected customer profile
- `/admin` — Protected admin dashboard
- `*` — 404 page

## Project Structure

```text
frontend/
├── public/
│   ├── 404.html
│   └── images/products/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── admin/
│   │   ├── cart/
│   │   ├── common/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── products/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── DESIGN_DECISIONS.md
├── TASK_TEST_RESULTS.md
├── index.html
├── package.json
└── vite.config.js
```

## Reusable Components

The UI is split into reusable components including `Navbar`, `Footer`, `ProductCard`, `CategoryCard`, `SearchBar`, `Button`, `Input`, `Modal`, `ConfirmDialog`, `Loader`, `Alert`, `EmptyState`, `Pagination`, `ProtectedRoute`, `StockBadge`, `StatusBadge`, `AdminSidebar`, `ProductFilters`, and `CartItem`.

## Mock Data

The project includes:
- 20 products across 5 categories
- Multiple price ranges and stock quantities
- At least two out-of-stock products
- 5 demo orders with different statuses
- Demo customer and admin accounts
- Local SVG product images with descriptive alt text

## Implemented Functionality

- React Router navigation and protected routes
- Case-insensitive product search
- Category, price and stock filters
- Name and price sorting
- Pagination
- Product details and similar products
- Cart add/update/remove and stock limits
- Delete confirmation dialog
- Cart persistence through Local Storage
- Navbar cart quantity
- Login and registration validation
- Demo customer/admin login
- Checkout validation, mock order number and cart clearing
- Profile edit and demo password validation
- Demo order history
- Admin dashboard statistics
- Local admin product/category/order management
- Loading, error, empty, no-results, success, out-of-stock, disabled, unauthorized and 404 states

## Responsive Design

The interface is built for the required target sizes:
- Desktop: 1440px
- Tablet: 768px
- Mobile: 390px

It uses responsive grids, a mobile navigation menu, a mobile product-filter drawer and horizontally scrollable admin tables only inside their dedicated table wrapper.

## Accessibility

- Semantic landmarks and native elements
- Explicit form labels
- Descriptive image alt text
- Visible keyboard focus states
- Status text in addition to color
- Buttons for actions and links for navigation
- Escape-key modal close support
- `aria-live` messages for validation and status feedback

## GitHub Pages Route Refresh

`public/404.html` and the restore script in `index.html` preserve React Router routes on GitHub Pages when a direct URL is refreshed.

## Task Limitation

No frontend code calls the REST API, Neon, `fetch`, or Axios in Task 4. API integration is reserved for the next task.
