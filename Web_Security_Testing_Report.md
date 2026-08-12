# Web Security Testing Report

## Project

E-commerce REST API — Node.js, Express.js, Neon PostgreSQL

## Scope

Testing is limited to the local project or an explicitly authorized training environment. No testing should be performed against third-party systems without permission.

## Status note

The code fixes and Postman collection are implemented on the `task3-web-security` branch. The final submitted PDF/DOCX must include the real Postman screenshots/results collected from the student's local environment. Items marked **Evidence pending** must not be presented as executed until the corresponding request is actually run.

---

## Finding 1 — Missing Authentication

**Severity:** Critical

**Location:** Original `src/routes/usersRoutes.js`, product/category write routes

**Problem:** Sensitive routes were reachable without any authentication middleware. Anonymous callers could access user information or perform write operations.

**Test method:** Send protected requests without an `Authorization` header.

**Before fix:** The original routes did not require a token, so protected operations could reach their controllers anonymously.

**Fix:** Added JWT Bearer authentication middleware and attached it to protected user/order/admin routes.

**After fix:** Requests to protected routes without a token return `401 Authentication required`.

**Evidence:** Postman mandatory test 5 — **Evidence pending local run**.

---

## Finding 2 — Missing Role-Based Authorization

**Severity:** Critical

**Location:** Original product/category/user write routes

**Problem:** No `admin` role check existed. Any caller reaching a write route could perform an administrative operation.

**Test method:** Log in as a customer and send `POST /api/products`.

**Before fix:** No role middleware existed on the route.

**Fix:** Added `authorize("admin")` middleware. A valid token with an insufficient role returns `403`.

**After fix:** A customer attempting to add a product is rejected with `403 Forbidden`; an admin may create a valid product.

**Evidence:** Postman mandatory tests 7 and 8 — **Evidence pending local run**.

---

## Finding 3 — IDOR / Missing Ownership Check

**Severity:** High

**Location:** Original `GET /api/users/:id`; order resources required by the task

**Problem:** A user ID in the URL was trusted without comparing it to the authenticated user. This enables horizontal access to another user's record.

**Test method:** Authenticate as customer A, then request customer B's user ID and an order owned by another user.

**Before fix:** The original user-by-ID route had no authentication or ownership comparison. The original repository did not contain an order route/controller.

**Fix:** User access now compares `req.user.id` to the requested ID unless the caller is admin. Order access performs the same ownership check and returns `404` for another user's order to avoid revealing whether it exists.

**After fix:** Other-user profile access returns `403`; other-user order access returns `404` according to the selected policy.

**Evidence:** Postman mandatory test 11 — **Evidence pending local run**.

---

## Finding 4 — Unsafe Password Handling

**Severity:** Critical

**Location:** Original `src/controllers/usersController.js`

**Problem:** The API accepted a client-supplied `password_hash`. A client could send plaintext or attacker-controlled data into the password column.

**Test method:** Review original create-user code; register a new user after the fix; inspect the database and API responses.

**Before fix:** `password_hash` was accepted directly from `req.body` and stored.

**Fix:** The API accepts `password`, enforces a minimum length, hashes it server-side with bcrypt (12 rounds), and uses `bcrypt.compare` during login. SELECT/RETURNING responses exclude `password_hash`.

**After fix:** The database should contain a bcrypt hash rather than the submitted password, correct login succeeds, wrong password returns `401`, and API responses contain no `password_hash`.

**Evidence:** Postman mandatory tests 3, 4 and 14 plus database inspection — **Evidence pending local run**.

---

## Finding 5 — Missing JWT Authentication Flow

**Severity:** High

**Location:** Project-wide

**Problem:** The original project had no register/login/me authentication flow and no expiring access tokens.

**Test method:** Register, login, call `/api/auth/me`, then repeat with an invalid token.

**Before fix:** No authentication endpoints or JWT middleware existed.

**Fix:** Added `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, expiring JWTs, Bearer verification, and startup validation for a strong `JWT_SECRET`.

**After fix:** Valid login returns a token; invalid credentials and invalid/expired tokens return `401`.

**Evidence:** Postman mandatory tests 1, 3, 4, 5 and 6 — **Evidence pending local run**.

---

## Finding 6 — Input Validation Gaps

**Severity:** High

**Location:** User, product and category routes

**Problem:** Validation was inconsistent. Several IDs could become `NaN`, roles were not centrally restricted, and important text/number fields lacked consistent rules.

**Test method:** Send missing product name, negative/zero price, negative or text stock quantity, invalid email, short password, invalid role, and non-numeric IDs.

**Before fix:** Some controller checks existed, but validation was incomplete and inconsistent.

**Fix:** Added `express-validator` rules for IDs, email, password, roles, booleans, product/category fields, prices, stock, and maximum text lengths. Added a centralized validation response.

**After fix:** Invalid input returns `400` with `success: false`, `message: "Validation failed"`, and field errors.

**Evidence:** Postman mandatory tests 9 and 10 plus extra validation requests — **Evidence pending local run**.

---

## Finding 7 — SQL Injection Review

**Severity:** Low after review / potentially Critical if parameterization is removed

**Location:** PostgreSQL queries in controllers

**Problem:** SQL injection is a required review item. User-controlled values must never be concatenated into SQL strings.

**Test method:** Code review of SELECT/INSERT/UPDATE/DELETE queries and requests using invalid/injection-like ID values.

**Before fix:** The reviewed original controllers already used PostgreSQL parameter placeholders for user-controlled values, for example:

```js
pool.query("SELECT * FROM products WHERE id = $1", [productId]);
```

Therefore, no actual string-concatenation SQL injection defect was found in the reviewed original controllers.

**Fix/Hardening:** Parameterized queries were retained everywhere and positive-integer ID validation was added before controller/database logic.

**After fix:** An input such as a non-numeric or injection-like ID is rejected with `400`; it is not concatenated into SQL.

**Evidence:** Postman injection-like ID request — **Evidence pending local run**.

---

## Finding 8 — Open CORS Policy

**Severity:** High

**Location:** Original `src/app.js`

**Problem:** `app.use(cors())` allowed all browser origins.

**Test method:** Send requests with an allowed `Origin`, a blocked `Origin`, and an OPTIONS preflight request.

**Before fix:** Any origin was accepted by the default CORS middleware configuration.

**Fix:** Allowed origins are read from `CLIENT_ORIGIN`; methods and allowed headers are explicitly configured. Requests from a blocked browser origin are rejected.

**After fix:** Allowed origin receives the expected CORS header; blocked origin returns `403`; preflight succeeds for allowed configuration.

**Evidence:** CORS requests in Postman collection — **Evidence pending local run**.

---

## Finding 9 — Missing Security Headers

**Severity:** Medium

**Location:** Original `src/app.js`

**Problem:** Browser security headers were not configured.

**Test method:** Inspect response headers before/after adding Helmet.

**Before fix:** Helmet was not installed or registered.

**Fix:** Added `helmet()` before API routes and disabled `X-Powered-By`.

**After fix:** Responses should include headers such as `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Cross-Origin-Resource-Policy`.

**Evidence:** Postman mandatory test 15 — **Evidence pending local run**.

---

## Finding 10 — Missing Rate Limiting

**Severity:** High

**Location:** Public API and login endpoint

**Problem:** Repeated requests and login attempts had no server-side limit.

**Test method:** Send more than five failed login attempts inside the configured window.

**Before fix:** No rate limiting middleware existed.

**Fix:** Added a general `/api` limiter and a stricter failed-login limiter using `express-rate-limit`. Limits are configurable through environment variables.

**After fix:** Requests exceeding the login limit return `429 Too Many Requests`.

**Evidence:** Postman mandatory test 12 — **Evidence pending local run**.

---

## Finding 11 — Unsafe / Inconsistent Error Handling

**Severity:** Medium

**Location:** Controllers and original app-level 404 handling

**Problem:** Error handling was duplicated. Without a central policy, future database/stack details could accidentally leak.

**Test method:** Request an unknown endpoint and trigger safe validation/parser errors. Inspect the body for SQL, file paths, and stack traces.

**Before fix:** Each controller returned its own 500 response and no centralized error middleware existed.

**Fix:** Added `notFound` and centralized `errorHandler`. Production 500 responses are generic. Invalid JSON and oversized bodies receive safe messages.

**After fix:** Unknown endpoints return `404`; internal errors return a generic message without stack traces or SQL details.

**Evidence:** Postman mandatory test 13 — **Evidence pending local run**.

---

## Finding 12 — XSS-Oriented Input/Output Risk

**Severity:** Medium

**Location:** Product/category/user text fields and any consuming frontend

**Problem:** Stored text can become an XSS problem if a frontend later inserts it directly into HTML.

**Test method:** Submit HTML/script-like text in a product description and inspect the JSON response and frontend rendering approach.

**Before fix:** Text fields had weak/no maximum-length controls and no documented safe rendering policy.

**Fix:** Added maximum lengths to text inputs, kept Helmet CSP enabled, and documented that clients must render user-supplied values as text/output-encoded content rather than `innerHTML`.

**After fix:** The API treats the value as JSON data rather than executing it. Safe frontend rendering is still required.

**Evidence:** XSS-like description request in Postman collection — **Evidence pending local run**.

---

## Finding 13 — Missing Security Event Logging

**Severity:** Medium

**Location:** Authentication and administrative actions

**Problem:** Failed login attempts and sensitive admin operations were not reviewable.

**Test method:** Perform a failed login, unauthorized access attempt, user status change, and administrative user creation; inspect server logs.

**Before fix:** No dedicated security event logs were present.

**Fix:** Added timestamped security log messages for failed login, unauthorized user/order access, user creation, and user status changes. Logs exclude passwords, password hashes, JWT values, and database URLs.

**After fix:** Relevant events are visible in server logs without exposing secrets.

**Evidence:** Terminal/server-log screenshot — **Evidence pending local run**.

---

# Mandatory Postman Results Table

| # | Test | Expected | Actual | Screenshot |
|---|---|---:|---|---|
| 1 | Register valid user | 201 | Pending | Pending |
| 2 | Duplicate email | 409 | Pending | Pending |
| 3 | Correct login | 200 | Pending | Pending |
| 4 | Wrong password | 401 | Pending | Pending |
| 5 | Protected route without token | 401 | Pending | Pending |
| 6 | Invalid token | 401 | Pending | Pending |
| 7 | Customer creates product | 403 | Pending | Pending |
| 8 | Admin creates product | 201 | Pending | Pending |
| 9 | Negative product price | 400 | Pending | Pending |
| 10 | Invalid email / incomplete JSON | 400 | Pending | Pending |
| 11 | Access another user's record/order | 403 or 404 | Pending | Pending |
| 12 | Login rate limit exceeded | 429 | Pending | Pending |
| 13 | Unknown endpoint | 404 | Pending | Pending |
| 14 | No `password_hash` in result | 200 without field | Pending | Pending |
| 15 | Helmet response headers | Headers present | Pending | Pending |

# Final conclusion

The security branch implements the required baseline controls in code. Final acceptance depends on executing the supplied Postman collection against the local/authorized Neon-backed environment, confirming the database schema for order ownership, replacing all Pending fields with real outcomes, and attaching screenshots that do not expose secrets.
