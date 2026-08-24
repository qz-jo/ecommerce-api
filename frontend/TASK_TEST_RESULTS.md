# Task 4 — Manual Test Results

This file tracks the required Task 4 acceptance checks. Functional items below are implemented in the mock-data frontend. The production build was verified by the Task 4 GitHub Actions workflow.

| # | Test | Expected result | Status |
|---|---|---|---|
| 1 | Search products with mixed letter case | Matching products are returned case-insensitively | Implemented |
| 2 | Filter by category, price and stock together | Product list and result count update correctly | Implemented |
| 3 | Sort by name / price | Current filtered set is sorted before pagination | Implemented |
| 4 | Open product details | Correct product, stock, quantity controls and similar products display | Implemented |
| 5 | Add in-stock product | Cart count and totals update | Implemented |
| 6 | Exceed available stock | Quantity is clamped/disabled at stock limit | Implemented |
| 7 | Remove cart item | Confirmation dialog appears before removal | Implemented |
| 8 | Refresh cart | Cart persists in Local Storage | Implemented |
| 9 | Submit invalid login/register/checkout/admin product form | Inline validation prevents invalid submission | Implemented |
| 10 | Complete checkout | Demo order number appears and cart is cleared | Implemented |
| 11 | Customer opens `/admin` | Unauthorized state is shown | Implemented |
| 12 | Empty/no-results/out-of-stock/loading/error states | Dedicated UI state appears | Implemented |
| 13 | `npm run build` | Vite production build completes without blocking errors | **Passed — GitHub Actions run #4 (run ID 32745750522)** |
| 14 | 1440px / 768px / 390px layouts | Responsive layout, navigation, filters and grids adapt without page-level horizontal scrolling | Implemented; screenshot evidence pending |
| 15 | Refresh a direct GitHub Pages route | SPA route is restored through the 404 redirect script | Deployment verification pending |

## Automated Guardrails

The Task 4 CI workflow runs `npm install` followed by `npm run build` from the `frontend` directory. Validation run #4 completed successfully. A separate Pages workflow builds the same frontend before deployment.

## Static Checks Completed

- All local JS/JSX imports resolve to existing project files.
- TypeScript's JSX parser/transpiler reported zero syntax errors across the source tree.
- No `console.log` statements are present in the Task 4 source.
- No `fetch`, Axios, API, or Neon integration is used by the Task 4 frontend.

## Pre-submission Evidence Still To Capture

- Successful GitHub Actions / build screenshot
- Desktop 1440px screenshot
- Tablet 768px screenshot
- Mobile 390px screenshot
- Short navigation/search/filter/cart demo video
- Final deployed route-refresh check
