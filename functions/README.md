# BS Homez Admin Email Alerts

## Scope
Five Firestore create triggers send a private notification to `contact@bshomez.in` for new records in:
- `enquiries/{enquiryId}`
- `opportunities/{opportunityId}`
- `property_submissions/{submissionId}`
- `referrals/{referralId}`
- `subscriptions/{subscriptionId}`

The email includes Name, Mobile, Email, the requested property fields in a fixed order, a visually prominent RERA Number, and remaining inquiry-specific fields under Others. Missing values display as "Not provided".

## Privacy and delivery
- Email delivery happens server-side; no Resend key is shipped to the browser.
- Public portfolio sanitization remains a separate frontend workflow. Do not copy ownerName, ownerMobile, or fullAddress into `public_portfolio`.
- A private `_emailAlertDispatches` document tracks processing, retries, and successful sends. Sent records are idempotently skipped.
- Email failures are recorded and rethrown so the event retry policy can retry delivery.
- The sender is `alerts@bshomez.in`; verify the `bshomez.in` domain in Resend before enabling production delivery.

## Setup (requires project owner action)
1. Enable Firebase Blaze billing for project `smartbiz-26213` and confirm budget alerts.
2. Verify `bshomez.in` as a sending domain in Resend.
3. From the repository root, install Firebase CLI if needed and run:
   `firebase functions:secrets:set RESEND_API_KEY`
   Paste the Resend API key only into the secure CLI prompt. Never commit it.
4. Deploy from the repository root:
   `firebase deploy --only functions --project smartbiz-26213`
5. Submit one test record to each of the three collections and verify receipt at `contact@bshomez.in`. Confirm duplicate event delivery does not create duplicate emails.

## Deployment note
This repository currently has no `firebase.json` Functions configuration. Before deploying, add a reviewed Firebase project configuration that points the Functions source to this directory, or integrate this source into the already-managed Firebase Functions deployment in the Firebase project. Do not deploy until the deployment configuration and Firestore rules are reviewed together.
