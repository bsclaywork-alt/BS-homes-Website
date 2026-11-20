# BS Homez — Cloudflare Worker + Resend email alerts

This replaces Firebase Cloud Functions for email notifications. It does not read, migrate, rewrite, or delete Firestore records. Firebase Spark remains in use.

## Security

- Cloudflare Turnstile is verified server-side before any email is sent.
- CORS allows only https://bshomez.in and https://www.bshomez.in.
- Only the five approved collection names are accepted.
- Resend and Turnstile secrets stay in Worker secrets, never in frontend code.
- Cloudflare KV provides a short IP rate limit and 24-hour event de-duplication.
- Sender and recipient are fixed in Worker configuration; form values cannot choose recipients.
- Email HTML is escaped; photos/videos are not forwarded.
- The website calls the Worker only after Firestore has successfully saved the submission. Email failure never rolls back or blocks the saved form.

Turnstile is an anti-abuse gate. It does not independently prove the submitted data is genuine.

## Cloudflare setup (Free plan)

1. Create a Turnstile widget for bshomez.in and www.bshomez.in. Choose Managed mode. Copy the site key and secret key.
2. Create a Workers KV namespace named BSHOMEZ_ALERT_LIMITS. Copy its ID into wrangler.toml, replacing REPLACE_WITH_CLOUDFLARE_KV_NAMESPACE_ID.
3. Install Wrangler and authenticate: npm install -g wrangler, then wrangler login.
4. From this directory, set secrets: wrangler secret put RESEND_API_KEY and wrangler secret put TURNSTILE_SECRET_KEY.
5. Verify bshomez.in in Resend and confirm alerts@bshomez.in as an approved sender.
6. Deploy with wrangler deploy and copy the generated workers.dev URL.
7. Add GitHub Pages build environment variables:
   - VITE_EMAIL_ALERT_WORKER_URL = deployed Worker URL
   - VITE_TURNSTILE_SITE_KEY = Turnstile site key
8. Complete the test checklist before enabling production email alerts.

## Free-tier notes

Resend currently lists 3,000 emails/month and 100/day on its free plan. Cloudflare Workers and KV also have free daily quotas. See the providers' current dashboards for usage and limits.

## Test checklist

- Submit test records from Offer Your Asset, property enquiry, Home Loan and Grow Business.
- Confirm each Firestore document exists before checking the email.
- Confirm messages arrive only at contact@bshomez.in.
- Confirm duplicate event IDs are de-duplicated.
- Confirm a non-BS Homez Origin and invalid/missing Turnstile token are rejected.
- Confirm form success remains intact if email delivery is temporarily unavailable.

## Validation

Run node --check src/index.js. Use a Turnstile test widget and a Resend test destination for end-to-end testing. Never commit secrets.
