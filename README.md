# E-commerce REST API — Web Security Fundamentals

Secured Node.js + Express REST API connected to Neon PostgreSQL. This branch implements the requirements of the Web Security Fundamentals training task, including authentication, authorization, input validation, password hashing, parameterized SQL, IDOR protection, Helmet, CORS, rate limiting, safe error handling, and documented Postman tests.

## Requirements

- Node.js 18+
- npm
- Neon PostgreSQL database containing `users`, `categories`, `products`, and `orders`
- Postman

## Installation

```bash
git clone https://github.com/qz-jo/ecommerce-api.git
cd ecommerce-api
git checkout task3-web-security
npm install
```

`package.json` contains the security dependencies added for Task 3. The original `package-lock.json` on `main` predates those dependencies, so the first local `npm install` on this branch should refresh the lock file. Commit the refreshed `package-lock.json` before final submission.

Create a local `.env` file from `.env.example`:

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Fill only the local `.env` with real values. Never commit `.env`.

Example variable names:

```env
PORT=3000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=100
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=5
NODE_ENV=development
```

`JWT_SECRET` must be at least 32 characters. Use the Neon connection string supplied for the training database, including its TLS/SSL connection parameters. The application does not disable TLS certificate verification in code.

## Run

Development:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

Expected base URL:

```text
http://localhost:3000
```

## Authentication

### Register

`POST /api/auth/register`

```json
{
  "full_name": "Test Customer",
  "email": "customer@example.com",
  "phone": "0790000000",
  "password": "StrongPass123!"
}
```

Public registration always creates a `customer`; the client cannot choose `admin`.

### Login

`POST /api/auth/login`

```json
{
  "email": "customer@example.com",
  "password": "StrongPass123!"
}
```

Use the returned token on protected routes:

```text
Authorization: Bearer <token>
```

### Current user

`GET /api/auth/me`

Requires a valid Bearer token.

## Authorization policy

### Public

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`

### Customer

- Read own profile
- Read own orders
- Cannot create, update, deactivate, or delete products
- Cannot manage categories or users
- Cannot access another user's profile or order

### Admin

- Manage products
- Manage categories
- View users
- Create users with `customer` or `admin` roles
- Change user active status
- View orders

## Security controls

### Secrets

`DATABASE_URL`, `JWT_SECRET`, and deployment settings are read from environment variables. `.env` is ignored by Git and `.env.example` contains no real credentials.

### Database transport

Database connection details come only from `DATABASE_URL`. The application does not set `rejectUnauthorized: false`; TLS requirements should come from the Neon connection string used in the authorized training environment.

### Input validation

`express-validator` validates important IDs, names, emails, passwords, product prices, stock quantities, roles, and text lengths. Invalid input is rejected before controller/database logic.

Validation responses use this shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be greater than zero"
    }
  ]
}
```

### SQL Injection

User-controlled values are passed separately to PostgreSQL using `$1`, `$2`, etc. Example:

```js
await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
```

The initial review found that the original controllers already used parameterized values, so no SQL-injection defect was invented for the report. Task 3 keeps parameterization and adds positive-integer validation before ID-based queries.

### Passwords

Passwords are hashed with bcrypt using 12 rounds. Login uses `bcrypt.compare`. API responses never return `password` or `password_hash`.

### JWT

JWT tokens use HS256, include the subject user ID and role, and have a configurable expiry. Verification restricts accepted algorithms to HS256. Protected requests also reload the user's current `role` and `is_active` state from PostgreSQL, so a deactivated account or changed role is enforced without trusting a stale role claim alone.

### IDOR protection

`GET /api/users/:id` allows the owner or an admin. Order routes enforce ownership in the PostgreSQL query itself for customers; unauthorized order access returns `404` to avoid confirming whether another user's order exists.

The original repository did not contain an order controller, and the task PDF does not provide the exact ownership column name. The training implementation safely supports these common ownership fields through a static SQL expression: `user_id`, `owner_id`, `id_owner`, or `customer_id`. Confirm the actual Neon `orders` schema during local testing and simplify the expression to the real column if desired.

The original repository also contains no `addresses` route/controller. Therefore there is no existing address endpoint to secure; if an address resource is later added, it must apply the same `owner_id` versus authenticated-user check.

### Helmet

Helmet is registered before API routes. Check Postman response headers for headers such as:

- `Content-Security-Policy` — restricts allowed content sources for browser-rendered content.
- `X-Content-Type-Options: nosniff` — reduces MIME type confusion.
- `Cross-Origin-Resource-Policy` — controls cross-origin resource loading.

### CORS

Allowed browser origins come from `CLIENT_ORIGIN`. Multiple origins may be comma-separated. Requests with no browser `Origin` header are permitted so tools such as Postman can test the API.

### Rate limiting

- General `/api` limiter: configurable, default 100 requests / 15 minutes.
- `/api/auth/login` limiter: configurable, default 5 failed login attempts / 15 minutes.
- Exceeded limits return HTTP `429`.

For a quick training test you may temporarily set this locally:

```env
LOGIN_RATE_LIMIT_WINDOW_MS=60000
LOGIN_RATE_LIMIT_MAX=5
```

Do not weaken production limits only to make a screenshot easier.

### Safe errors

Unknown endpoints use centralized `notFound` handling. Internal server errors return a generic message without SQL, file paths, or stack traces. Detailed error objects are logged only outside production. Invalid JSON and oversized request bodies receive controlled responses rather than raw parser details.

### XSS risk reduction

The API validates maximum text lengths and returns JSON rather than rendering user input as HTML. HTML-like text in a product description must be displayed by a frontend as text using safe output encoding (for example `textContent`) rather than inserted into `innerHTML`. Helmet also adds browser security headers.

### Security logging

Security logs include event time and relevant user IDs/IP where useful. Passwords, password hashes, JWT values, database URLs, and unnecessary personal data are not logged.

## Postman collection

Import:

```text
postman/Web_Security_Fundamentals.postman_collection.json
```

Also read:

```text
postman/TESTING_SETUP.md
```

Set the collection variables before testing:

- `baseUrl` — default `http://localhost:3000`
- `customerEmail`
- `customerPassword`
- `adminEmail`
- `adminPassword`
- `categoryId`
- `otherUserId`
- `otherOrderId`

Login requests automatically save returned customer/admin tokens into collection variables.

## Mandatory test checklist

Run and capture evidence for these cases:

1. Register valid user → `201`
2. Duplicate email → `409`
3. Valid login → `200`
4. Wrong password → `401`
5. Protected route without token → `401`
6. Invalid token → `401`
7. Customer creates product → `403`
8. Admin creates valid product → `201`
9. Negative product price → `400`
10. Invalid email or incomplete JSON → `400`
11. Access another user's data/order → `403` or `404` according to policy
12. Exceed login attempts → `429`
13. Unknown endpoint → `404`
14. User responses contain no `password_hash`
15. Helmet security headers are present

Also test:

- non-numeric IDs → `400`
- allowed and rejected CORS origins
- OPTIONS preflight where needed
- HTML text in product description
- valid and invalid product stock values
- invalid role values on admin user creation

## Recommended screenshots

Save real evidence under `screenshots/` before submission. Follow `screenshots/README.md`. Do not include `.env`, database connection strings, passwords, JWT secrets, or full JWT values in screenshots.

Suggested evidence:

- successful login with the token visually redacted
- customer product creation rejected with `403`
- admin product creation with `201`
- negative price rejected with `400`
- unauthorized order/profile access rejected
- rate limit `429`
- Helmet response headers
- unknown endpoint `404`
- response showing no `password_hash`

## Security review and report

- Initial review: `SECURITY_REVIEW.md`
- Testing report source: `Web_Security_Testing_Report.md`
- Final submission should export the testing report to `Web_Security_Testing_Report.pdf` or `.docx` after real Postman results and screenshots are collected.

## Before submitting

- Confirm `.env` is not tracked by Git.
- Run `npm install` and commit the refreshed `package-lock.json`.
- Confirm the actual `orders` ownership field in Neon.
- Search the repository for real secrets before making the final submission.
- Run all mandatory Postman tests against the local/authorized training environment.
- Export the Postman collection as JSON.
- Add the required screenshots.
- Replace report placeholders with the actual before/after evidence from your tests.
- Merge `task3-web-security` into `main` only after the local tests pass.
