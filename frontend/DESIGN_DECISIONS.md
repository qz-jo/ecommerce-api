# Design Decisions — Task 4

## Direction

The frontend uses a clean modern technology-store visual language with a dark editorial hero, bright product surfaces, restrained blue/violet accents and generous whitespace. The goal is to make the catalog easy to scan while keeping the interface visually distinct from a generic template.

## Component Strategy

The application is intentionally split by responsibility. Shared primitives (`Button`, `Input`, `Alert`, `Modal`, `Loader`, `EmptyState`) live in `components/common`; shopping-specific components are separated into product and cart folders; layout and admin components have their own folders. Page files orchestrate those components instead of containing the full application UI.

## State

`CartContext` owns cart state and persists it in Local Storage. `AuthContext` implements the demo authentication state required for this mock-data stage. Page-level filters, forms and admin edits stay local to the relevant pages because no server synchronization is required yet.

## Product Discovery

Search, category, price and stock filters can be combined. Sorting is applied after filtering and before pagination, so the result count and pages always describe the current filtered set. On tablet/mobile the filters become a drawer to preserve usable product width.

## Cart Safety

The cart clamps requested quantities to available stock, disables impossible increments and requires confirmation before removal. Totals are derived from the current item quantities rather than stored separately, avoiding stale totals.

## Authentication & Authorization

Authentication is deliberately simulated. Protected routes require a demo user, and the admin route additionally checks the `admin` role. Customer access to the admin URL results in an explicit unauthorized state rather than rendering dashboard content.

## Responsive Approach

The desktop layout is designed around a 1240px content container. Product/category grids progressively reduce columns at tablet/mobile breakpoints. Admin tables use a dedicated horizontal scroll wrapper so the document itself does not create accidental horizontal scrolling. Touch targets remain around 40–44px or larger.

## Accessibility

The design uses native interactive elements, explicit form labels, visible focus outlines, descriptive image alt text and status text. Modals expose dialog semantics and can be dismissed with Escape when allowed. Important states are communicated using text and not color alone.

## GitHub Pages

Vite's production base path is set to `/ecommerce-api/` in GitHub Actions. A small 404 redirect plus route restoration script is included so refreshed React Router URLs work on GitHub Pages.

## Task Boundary

Task 4 is intentionally frontend-only. The interface does not use the existing Express/Neon API even though it lives in the same repository. That separation makes the next integration task explicit and testable.
