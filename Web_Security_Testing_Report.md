# Web Security Testing Report

## Project

E-commerce REST API - Node.js, Express.js, Neon PostgreSQL

## Scope

Security testing was performed only against the local application connected to the authorized training Neon database. No third-party system was tested.

## Test status

The secured implementation on branch `task3-web-security` was executed locally with Postman on 2026-08-13. The mandatory security test cases were run and the observed HTTP statuses matched the required results. A read-only Neon inspection also confirmed that the training customer and admin accounts created through the secured API store bcrypt hashes with cost 12 and do not store plaintext passwords.

Before final submission, copy the screenshots captured during the Postman run into the repository `screenshots/` directory and ensure no JWT, password, `.env`, database URL, or JWT secret is visible.

---

## Finding 1 - Missing Authentication

**Severity:** Critical

**Before:** Sensitive user and write routes had no authentication middleware.

**Fix:** Added JWT Bearer authentication and protected user, order, and administrative routes.

**After:** Protected requests without a token return `401 Authentication required`.

**Validation:** Mandatory test 5 passed with `401`.

---

## Finding 2 - Missing Role-Based Authorization

**Severity:** Critical

**Before:** Administrative write routes had no `admin` role check.

**Fix:** Added `authorize("admin")` to administrative product, category, and user operations.

**After:** A customer is rejected with `403`, while an admin can create a valid product with `201`.

**Validation:** Mandatory tests 7 and 8 passed.

---

## Finding 3 - IDOR / Missing Ownership Checks

**Severity:** High

**Before:** User IDs in URLs were trusted without comparing them to the authenticated user, and the original repository did not contain protected order routes.

**Fix:** User access now requires self-or-admin authorization. Order ownership is enforced in PostgreSQL using the confirmed Neon ownership column `orders.user_id`. Requests for another user's order return `404` to avoid revealing resource existence.

**After:** Another user's profile is rejected with `403`; another user's order is rejected with `404`.

**Validation:** Mandatory test 11 passed for both user and order ownership cases.

---

## Finding 4 - Unsafe Password Handling

**Severity:** Critical

**Before:** The original API accepted a client-supplied `password_hash`.

**Fix:** The API accepts `password`, validates its length, hashes it server-side with bcrypt cost 12, and uses `bcrypt.compare` for login. API responses exclude `password` and `password_hash`.

**After:** Correct login succeeds, wrong password returns `401`, and user responses contain no hash. Read-only Neon verification confirmed the new training customer and admin hashes are bcrypt cost 12 and 60 characters long.

**Validation:** Mandatory tests 3, 4, and 14 passed; database verification passed.

---

## Finding 5 - Missing JWT Authentication Flow

**Severity:** High

**Before:** There were no register/login/me endpoints and no JWT verification middleware.

**Fix:** Added `POST /api/auth/register`, `POST /api/auth/login`, protected `GET /api/auth/me`, expiring HS256 JWTs, algorithm restriction, and startup validation for `JWT_SECRET`.

**After:** Valid login returns a token; missing or invalid tokens return `401`.

**Validation:** Mandatory tests 1, 3, 4, 5, and 6 passed.

---

## Finding 6 - Input Validation Gaps

**Severity:** High

**Before:** Validation was incomplete and inconsistent for IDs, roles, product fields, email, password, and numeric values.

**Fix:** Added `express-validator` rules for IDs, names, email, password, roles, prices, stock, booleans, and text lengths with a centralized validation response.

**After:** Invalid input returns `400` with a safe validation error structure.

**Validation:** Negative price, invalid email, non-numeric ID, injection-like ID, and invalid role tests all passed with `400`.

---

## Finding 7 - SQL Injection Review

**Severity:** Low after review

**Before:** The original reviewed controllers already used PostgreSQL parameter placeholders for user-controlled values; no fabricated string-concatenation SQL injection defect was reported.

**Fix / Hardening:** Parameterized queries were retained throughout the secured implementation and positive-integer validation was added before ID-based database operations.

**After:** Injection-like and non-numeric IDs are rejected with `400` before unsafe query construction can occur.

**Validation:** SQL-injection-oriented validation requests passed.

---

## Finding 8 - Open CORS Policy

**Severity:** High

**Before:** `cors()` allowed all browser origins.

**Fix:** Allowed origins now come from `CLIENT_ORIGIN`; methods and allowed headers are explicitly configured. Non-browser requests without `Origin` remain usable for Postman/server-to-server testing.

**After:** Allowed origin requests succeed and blocked origins are rejected with `403`.

**Validation:** Allowed origin, blocked origin, and preflight requests passed.

---

## Finding 9 - Missing Security Headers

**Severity:** Medium

**Before:** Helmet was not installed or registered.

**Fix:** Added `helmet()` before API routes and disabled `X-Powered-By`.

**After:** Responses include security headers such as `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, and `Cross-Origin-Resource-Policy`.

**Validation:** Mandatory test 15 passed.

---

## Finding 10 - Missing Rate Limiting

**Severity:** High

**Before:** Repeated requests and login attempts had no server-side limit.

**Fix:** Added a general API limiter plus a stricter login limiter. The local training configuration used `LOGIN_RATE_LIMIT_MAX=5`.

**After:** The first five failed login attempts returned `401`; the sixth failed attempt returned `429 Too Many Requests` with `Too many login attempts, please try again later`.

**Validation:** Mandatory test 12 passed with Postman `Test Results 1/1`.

---

## Finding 11 - Unsafe / Inconsistent Error Handling

**Severity:** Medium

**Before:** Error handling was duplicated and there was no centralized safe error policy.

**Fix:** Added `notFound` and centralized `errorHandler` middleware with generic production errors and controlled handling for invalid JSON and oversized bodies.

**After:** Unknown endpoints return `404` and responses do not expose stack traces, SQL, or file paths.

**Validation:** Mandatory test 13 passed.

---

## Finding 12 - XSS-Oriented Input / Output Risk

**Severity:** Medium

**Before:** Text fields had weak length controls and no documented rendering policy.

**Fix:** Added text-length validation, retained Helmet CSP, and documented that frontends must render untrusted values as text rather than injecting them into HTML.

**After:** Script-like input remains JSON data and is not executed by the API.

**Validation:** XSS-like text test passed.

---

## Finding 13 - Missing Security Event Logging

**Severity:** Medium

**Before:** Failed authentication and sensitive authorization events were not clearly reviewable.

**Fix:** Added security-focused logs for failed login and unauthorized user/order actions without logging passwords, hashes, JWTs, or database URLs.

**After:** Security events are traceable without exposing secrets.

---

## Finding 14 - Database TLS Verification Weakening

**Severity:** High

**Before:** The original PostgreSQL pool explicitly used `ssl: { rejectUnauthorized: false }`, weakening certificate verification behavior.

**Fix:** Removed the override. Connection security requirements now come from the authorized Neon `DATABASE_URL` instead of disabling certificate verification in application code.

**After:** The application connects successfully to the training Neon database without the insecure override.

---

# Mandatory Postman Results

| # | Test | Expected | Actual | Result |
|---|---|---:|---:|---|
| 1 | Register valid user | 201 | 201 | PASS |
| 2 | Duplicate email | 409 | 409 | PASS |
| 3 | Correct login | 200 | 200 | PASS |
| 4 | Wrong password | 401 | 401 | PASS |
| 5 | Protected route without token | 401 | 401 | PASS |
| 6 | Invalid token | 401 | 401 | PASS |
| 7 | Customer creates product | 403 | 403 | PASS |
| 8 | Admin creates product | 201 | 201 | PASS |
| 9 | Negative product price | 400 | 400 | PASS |
| 10 | Invalid email / incomplete JSON | 400 | 400 | PASS |
| 11 | Access another user's record/order | 403 / 404 | 403 / 404 | PASS |
| 12 | Login rate limit exceeded | 429 | 429 | PASS |
| 13 | Unknown endpoint | 404 | 404 | PASS |
| 14 | No `password_hash` in result | 200 without field | 200 without field | PASS |
| 15 | Helmet response headers | Headers present | Headers present | PASS |

## Additional tests completed

- Non-numeric product ID -> `400`
- Injection-like product ID -> `400`
- Invalid admin-created role -> `400`
- Allowed CORS origin -> success
- Blocked CORS origin -> `403`
- CORS preflight -> expected response
- XSS-like text remains JSON data
- Admin and customer tokens were used separately to verify role enforcement

# Final conclusion

The secured branch satisfies the required baseline controls for authentication, authorization, IDOR prevention, validation, password hashing, JWT handling, parameterized SQL, Helmet, CORS, rate limiting, safe errors, and secure logging. All 15 mandatory Postman test outcomes matched the required results in the local authorized training environment. The final submission step is to copy the captured screenshots into `screenshots/`, ensure secrets are redacted, export this report to PDF or DOCX, and then merge the tested branch into `main` after explicit approval.
