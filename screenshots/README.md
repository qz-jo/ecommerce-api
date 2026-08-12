# Required Security Test Screenshots

Add real screenshots from the local/authorized Postman tests before final submission.

Recommended filenames:

1. `01-register-201.png`
2. `02-duplicate-email-409.png`
3. `03-login-200.png` - redact most of the JWT value
4. `04-wrong-password-401.png`
5. `05-no-token-401.png`
6. `06-invalid-token-401.png`
7. `07-customer-product-403.png`
8. `08-admin-product-201.png`
9. `09-negative-price-400.png`
10. `10-invalid-email-400.png`
11. `11-idor-denied.png`
12. `12-rate-limit-429.png`
13. `13-not-found-404.png`
14. `14-no-password-hash.png`
15. `15-helmet-headers.png`

Optional evidence:

- `cors-allowed.png`
- `cors-blocked.png`
- `cors-preflight.png`
- `xss-json-data.png`
- `security-log-events.png`
- `bcrypt-database-hash.png`

## Do not expose secrets

Before saving a screenshot, make sure it does not show:

- `.env`
- `DATABASE_URL`
- database usernames/passwords
- plaintext user passwords
- full JWT values
- `JWT_SECRET`
- API keys
- payment/card data

Use the screenshots only from the local project or an explicitly authorized training environment.
