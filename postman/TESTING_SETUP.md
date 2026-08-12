# Postman Testing Setup

Use this only with the local project or another explicitly authorized training environment.

## 1. Install the updated dependencies

From the project directory:

```bash
npm install
```

This also refreshes `package-lock.json` locally so it matches the security dependencies in `package.json`. Commit the refreshed lock file before the final submission.

## 2. Configure `.env`

Copy `.env.example` to `.env`, then fill the real local values.

Minimum required values:

```env
PORT=3000
DATABASE_URL=<your Neon connection string>
JWT_SECRET=<random secret at least 32 characters>
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Never upload or screenshot the real `.env`.

## 3. Start the API

```bash
npm start
```

The default Postman base URL is:

```text
http://localhost:3000
```

## 4. Prepare a customer

Run the collection request:

`Authentication > 01 Register valid user - 201`

Then run:

`Authentication > 03 Customer login - 200`

The login test automatically stores `customerToken` and `customerId` as collection variables.

If the email was already used from an earlier run, change the `customerEmail` collection variable or delete the training user locally.

## 5. Prepare an admin account

If the database already contains an admin account, set `adminEmail` and `adminPassword` in the Postman collection variables and run `Admin login - save token`.

If no admin account exists, create a normal training user first through `/api/auth/register`, then promote that specific training account through the authorized Neon SQL editor. Example:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'admin.task3@example.com';
```

Use a training-only email/password. Do not place the password in SQL, GitHub, screenshots, or the exported Postman collection.

Then set `adminEmail` and `adminPassword` only inside your local Postman variables and run `Admin login - save token`.

## 6. Set a real category ID

The product creation tests use the `categoryId` variable. Set it to an existing category ID from your local Neon data.

You can check:

```text
GET /api/categories
```

## 7. Set IDOR test targets

For the user IDOR test, set `otherUserId` to the ID of a different user than the logged-in customer.

For the order IDOR test, set `otherOrderId` to an order that belongs to a different user.

The expected policy is:

- another user's profile: `403`
- another user's order: `404` to avoid revealing whether that order exists

## 8. Confirm the order ownership column

The task instructions require ownership checks for orders but do not provide the exact `orders` schema. The implementation supports these common ownership keys inside PostgreSQL:

- `user_id`
- `owner_id`
- `id_owner`
- `customer_id`

Check the real Neon table before final submission. If your table uses a different ownership column, update `ORDER_OWNER_SQL` in `src/controllers/ordersController.js` to match the actual schema, then retest.

## 9. Run the mandatory tests

Run the normal folders first and record the response status/screenshots.

For the rate limiting test, restart the server (or wait for the rate-limit window to expire), then run the folder:

`12 Rate Limiting - run this folder alone after restarting the server`

The sixth failed login should return `429` when the local limit is 5.

## 10. Record evidence

Use `screenshots/README.md` as the screenshot checklist.

After testing, update `Web_Security_Testing_Report.md`:

- replace every `Pending` result with the actual result
- add screenshot filenames
- verify the before/after descriptions still match what happened
- export the final report to PDF or DOCX

## 11. Final secret check

Before submitting GitHub, confirm that the repository contains no `.env`, real database URL, JWT secret, plaintext passwords, or full JWT tokens.
