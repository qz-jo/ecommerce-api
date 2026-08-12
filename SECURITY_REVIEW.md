# SECURITY_REVIEW.md

## Initial Security Review

This review documents security issues found in the original `main` branch before applying Task 3 protections.

| # | Issue | Location | Risk | Severity | Proposed fix |
|---|---|---|---|---|---|
| 1 | No authentication on protected API routes | `src/routes/usersRoutes.js`, `src/routes/productsRoutes.js`, `src/routes/categoriesRoutes.js` | Any anonymous caller can read user data and perform administrative changes such as creating, updating, deactivating, or deleting products. | Critical | Add JWT authentication middleware and protect sensitive routes. |
| 2 | No role-based authorization | Product/category/user write routes | A customer can perform admin operations because no `admin` role check exists. | Critical | Add `authorize("admin")` middleware and return 403 for authenticated users without permission. |
| 3 | IDOR / missing ownership checks | `GET /api/users/:id` and user-owned resources | A user can request another user's data by changing the numeric ID. | High | Compare the authenticated user ID with the resource owner ID; allow admin override only where policy permits. |
| 4 | Password handling is unsafe | `src/controllers/usersController.js` | The API accepts `password_hash` directly from the client and stores it as supplied. This can result in plaintext or attacker-controlled values being stored. | Critical | Accept `password`, validate its length, hash server-side using bcrypt, and never return `password_hash`. |
| 5 | Missing login/register JWT flow | Project-wide | There is no secure way to authenticate users or issue expiring access tokens. | High | Add `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, bcrypt verification, and signed JWTs with expiry. |
| 6 | CORS allows every origin | `src/app.js` (`app.use(cors())`) | Any website can make cross-origin requests to the API, which is unsafe for authenticated/sensitive operations. | High | Allow only configured origins and allowed methods/headers using environment variables. |
| 7 | No security headers | `src/app.js` | Common browser security headers such as CSP and clickjacking protections are absent. | Medium | Add `helmet()` before routes and document key response headers. |
| 8 | No rate limiting | Public API and authentication endpoints | Attackers can automate abusive requests and repeated login attempts. | High | Add a general API limiter and stricter login limiter using `express-rate-limit`. |
| 9 | Incomplete input validation | Controllers | Validation is manual and inconsistent. IDs, email, role, text length, booleans, product fields, and update payloads are not consistently validated. | High | Add centralized validation with `express-validator` and a standard validation error response. |
| 10 | Unsafe/weak ID validation on several routes | `usersController.js`, `categoriesController.js`, product update/delete methods | `Number(req.params.id)` can become `NaN` and still reach PostgreSQL in several handlers, causing avoidable database errors instead of a clean 400 response. | Medium | Validate all route IDs as positive integers before controllers execute. |
| 11 | No centralized error handler | Controllers and `src/app.js` | Error behavior is duplicated and difficult to control consistently; future errors may leak internal details. | Medium | Add `notFound` and centralized `errorHandler` middleware; never expose SQL, file paths, or stack traces in production responses. |
| 12 | Text fields have no maximum lengths / XSS-oriented validation | Product/category/user text inputs | Arbitrarily large or HTML/script-like input can be stored and later rendered unsafely by a frontend. | Medium | Enforce reasonable maximum lengths and safe output encoding in the frontend; keep Helmet CSP enabled. |
| 13 | Security event logging is missing | Authentication/admin operations | Failed login attempts and sensitive administrative actions cannot be reviewed. | Medium | Add minimal structured security logging without passwords, full JWTs, hashes, database URLs, or unnecessary personal data. |
| 14 | Database TLS verification can be weakened by application config | `src/config/database.js` | The original Pool explicitly supplied `ssl: { rejectUnauthorized: false }`. If that setting is effective for a connection, certificate verification is disabled and the database connection has weaker protection against impersonation. | Medium | Remove the insecure override and use the TLS parameters supplied by the authorized Neon `DATABASE_URL`. |

## Existing Positive Controls

The original project already uses PostgreSQL parameter placeholders (`$1`, `$2`, etc.) in the reviewed controllers, which is a good baseline against SQL injection. No string-concatenation SQL injection defect was found in the reviewed original controllers, so this review does not invent one that was not present.

The project also already reads `DATABASE_URL` from `process.env`, and `.gitignore` contains `.env`. These controls are retained and expanded to cover the remaining required environment variables.

## SQL Injection Review - Before and After

### Original code reviewed

The original product-by-ID query was already parameterized:

```js
const result = await pool.query(
  "SELECT * FROM products WHERE id = $1",
  [productId]
);
```

This prevents the ID value from changing the SQL structure. However, some routes did not consistently validate IDs before database logic.

### Hardened version

The parameterized query remains unchanged in principle, and route validation now rejects invalid IDs first:

```js
param("id")
  .isInt({ min: 1 })
  .withMessage("ID must be a positive integer");
```

Therefore a value such as `not-a-number` or an injection-like ID is rejected with HTTP `400` before it can be used as a database value.

## Database TLS Review - Before and After

### Original configuration

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
```

### Hardened configuration

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

The application no longer disables certificate verification itself. The training environment should use the Neon connection string with its required TLS parameters.

## Evidence from the original code

- `src/app.js`: unrestricted `cors()` and no Helmet/rate limiting/authentication middleware.
- `src/routes/productsRoutes.js`: POST/PUT/PATCH/DELETE routes are publicly reachable.
- `src/routes/usersRoutes.js`: user list, user-by-ID, create-user, and status update routes are publicly reachable.
- `src/controllers/usersController.js`: accepts `password_hash` from the request body rather than hashing a password server-side.
- `src/config/database.js`: explicitly supplies `rejectUnauthorized: false`.
- `package.json`: original dependencies do not include bcrypt, JWT, Helmet, express-rate-limit, or express-validator.

## Scope

All tests must be performed only against the local project or another explicitly authorized training environment, as required by the task instructions.
