# Task 4 — Manual Test Results

This file tracks the Task 4 acceptance checks. The production bundle was built in GitHub Actions and exercised with browser automation at the required responsive widths. The live GitHub Pages deployment also completed successfully.

| # | Test | Expected result | Status |
|---|---|---|---|
| 1 | Search products with mixed letter case | Matching products are returned case-insensitively | **Passed** — `AEROBOOK` returned the AeroBook result |
| 2 | Filter by category, price and stock | Product list and result count update correctly | **Passed/verified UI flow** — Gaming filter returned 4 products and price filtering updated the result set; stock-state control is present |
| 3 | Sort by name / price | Current filtered set is sorted before pagination | **Passed** — price high-to-low placed the $1,499 StudioBook first |
| 4 | Open product details | Correct product, stock, quantity controls and similar products display | Implemented |
| 5 | Add in-stock product | Cart count and totals update | **Passed** — cart badge and totals updated |
| 6 | Exceed available stock | Quantity is clamped/disabled at stock limit | Implemented with stock guard |
| 7 | Remove cart item | Confirmation dialog appears before removal | **Passed** — `Remove product?` confirmation displayed |
| 8 | Refresh cart | Cart persists in Local Storage | Implemented using `nova-tech-cart` Local Storage key |
| 9 | Invalid login/register/checkout/admin product forms | Inline validation prevents invalid submission | Implemented |
| 10 | Complete checkout | Demo order number appears and cart is cleared | Implemented |
| 11 | Protected customer/admin routes | Correct role protection / unauthorized behavior | **Partially verified** — customer login routed to Profile; admin login routed to Admin dashboard |
| 12 | Empty/no-results/out-of-stock/loading/error states | Dedicated UI state appears | **Verified in part** — Empty Cart and No Search Results exercised; remaining states implemented |
| 13 | `npm run build` | Vite production build completes without blocking errors | **Passed** — GitHub Actions CI and Pages build completed successfully |
| 14 | 1440px / 768px / 390px layouts | Responsive layout adapts without page-level horizontal scrolling | **Passed** — scroll width exactly matched 1440, 768 and 390; screenshots captured |
| 15 | GitHub Pages deployment | Production build deploys successfully | **Passed** — build and `Deploy to GitHub Pages` jobs both completed successfully |
| 16 | Refresh a direct GitHub Pages route | SPA route is restored through the 404 redirect script | **Passed** — `/ecommerce-api/products` was refreshed manually with Ctrl+F5 and returned the Products page instead of a 404 |

## Automated / Browser Verification Completed

- Production Vite bundle rendered successfully at 1440px, 768px and 390px.
- No page-level horizontal overflow was detected at any required target width.
- Search was verified case-insensitively and the no-results state was exercised.
- Category filtering, price filtering, price sorting and pagination UI were exercised.
- Cart add, navbar quantity, quantity increase, totals and removal confirmation were exercised.
- Customer demo login routed to `/profile` and displayed 5 demo orders.
- Admin demo login routed to `/admin` and displayed dashboard statistics.
- GitHub Pages deployment completed after allowing `task4-react-ui` in the `github-pages` environment.
- Direct-route refresh on `/ecommerce-api/products` was manually confirmed after deployment.

## Static Checks Completed

- All local JS/JSX imports resolve to existing project files.
- JSX parsing/transpilation reported no blocking source syntax errors.
- No `console.log` statements are present in the Task 4 source.
- No `fetch`, Axios, API, or Neon integration is used by the Task 4 frontend.

## Submission Evidence Captured

- Desktop screenshot at 1440px
- Tablet screenshot at 768px
- Mobile screenshot at 390px
- Short demo video covering navigation, search, filtering, sorting, cart add and quantity update
- Successful CI and successful GitHub Pages deployment recorded in GitHub Actions
- Direct-route refresh verification on the deployed site
