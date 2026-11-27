# BS Homez Cloudflare Migration Roadmap

## Purpose

Reduce routine Firebase/Firestore dependency and quota pressure without disrupting the live BS Homez website or losing existing records. Migration is incremental, reversible, and must preserve current public behaviour and Admin Vault permissions.

## Verified current architecture (repository audit: 2026-11-27)

- Frontend: React 19 + Vite + TypeScript.
- Current production workflow: GitHub Actions builds and deploys the static site to GitHub Pages. The workflow writes `bshomez.in` into the Pages artifact.
- Firebase client: Firebase JS SDK initializes Authentication, Firestore and Storage from `firebase-applet-config.json`.
- Firestore database: named database `ai-studio-803a5529-5181-465b-9588-692caecb00ba` in project `smartbiz-26213`.
- Home Screen Scroller: `src/components/HomeScroller.tsx` reads `site_settings/home_scroller` with a live Firestore snapshot. Admin saves the document and then performs a server read to verify it. This creates at least one live listener and a read-after-write verification request per save.
- Portfolio and Admin Vault: `src/App.tsx` uses live listeners and direct client reads/writes for projects, enquiries, opportunities, referrals, public portfolio, property submissions and system settings.
- Firestore admin authorization currently relies on the Firebase custom claim `request.auth.token.admin == true` in `firestore.rules`.
- Images are uploaded through the existing Cloudinary media helper. Keep existing Cloudinary URLs and media; image storage is not part of the first data migration.
- `server.ts` is an Express server with API routes, but the current GitHub Pages deployment is static and does not run that server in production.

## Target architecture

- Keep the React/Vite frontend and existing visual design.
- Use Cloudflare Workers as the server-side API layer and Cloudflare D1 (SQLite) for selected operational records/settings.
- Keep Cloudinary as the image/media origin and delivery service.
- Keep Firebase Authentication temporarily. A Worker must verify Firebase ID tokens server-side and enforce the existing admin custom claim before any administrative read/write. Never trust a client-supplied role, email, UID, or `isAdmin` boolean.
- Use a same-origin API route (for example `/api/v1/home-scroller`) through Cloudflare routing once the domain/hosting configuration is confirmed. Do not put Cloudflare API tokens, D1 credentials, or service credentials in browser code.
- Keep Firestore as the source of truth for each collection until its D1 migration is verified and explicitly cut over.

## Migration order

### Phase 0 — prerequisites and safeguards

1. Confirm the Cloudflare account owns or can route the `bshomez.in` zone and that Workers and D1 are available.
2. Create a dedicated D1 database and Worker environment (preview/staging first).
3. Configure secrets and bindings through Cloudflare/GitHub secure settings; do not commit secrets.
4. Take a timestamped export/backup of each collection before migrating it.
5. Define a migration ledger with source document IDs, target row IDs, counts, checksums, and completion status.
6. Establish staging tests and rollback steps before production routing.

### Phase 1 — Home Screen Scroller (first implementation)

Scope: only `site_settings/home_scroller`.

Suggested D1 table:
- `home_scroller_settings`: singleton key, enabled flag, content placement, updated timestamp, schema version.
- `home_scroller_slides`: stable slide ID, order, title, subtitle, transaction type, location, price label, image URL, CTA label, project ID, enabled flag, JSON extension field if needed.

Requirements:
- Preserve all existing slide IDs, order, text, settings, image URLs, and enabled states.
- Provide public read-only access to the published scroller.
- Require a verified Firebase ID token with the existing `admin: true` custom claim for all writes and admin reads.
- Validate payload shape, slide count (maximum six), allowed content placement, field lengths, and image URL protocol.
- Use transactional writes so settings and slides cannot be left partially updated.
- Return explicit error codes and request IDs; do not silently suppress quota or authorization errors.
- Add migration/import tooling that is idempotent and does not delete the Firestore source.
- Test save, reload, reorder, enable/disable, add/remove, image URL preservation, unauthorized access, invalid payloads, and rollback.
- Switch the UI only after D1 data parity and staging acceptance. Retain a documented rollback path to the existing Firestore reader.

### Phase 2 — portfolio/project data

Migrate public project reads first, then admin writes as a separate cutover. Preserve document IDs and all fields, including SEO, inventory, publication, pause/deletion, and audit fields. Public and private fields must remain separated. Reconcile D1 counts and field-level samples before switching reads.

### Phase 3 — enquiries and lead workflows

Migrate enquiries, opportunities, referrals, subscriptions, and property submissions one collection at a time. Preserve private contact data, timestamps, statuses, and audit history. Public endpoints must have validation, abuse/rate limiting, and server-side authorization for staff operations.

### Phase 4 — reduce Firebase usage

After all dependent workflows have passed production verification, remove only the corresponding Firestore listeners and writes. Keep Firebase Authentication until an independent authentication migration is explicitly planned and tested. Do not remove Firebase Storage or Auth merely because D1 is introduced.

## Cutover and rollback rules

- No big-bang migration.
- No destructive Firestore cleanup during or immediately after cutover.
- Run a dry-run export/import and compare document/row counts and sampled field values.
- During the initial rollout, keep the old Firestore data intact and retain a tested rollback switch.
- Switch one feature at a time; monitor API errors, D1 usage, latency, and data parity.
- A successful GitHub build does not prove Cloudflare production routing or D1 connectivity. Verify each separately.

## Current blockers / operator setup required

- Repository inspection cannot verify Cloudflare account ownership, zone routing, D1 availability, or existing Worker configuration.
- No Cloudflare database ID, Worker route, or deployment credentials are present in the repository (and none should be committed).
- Before enabling the first Worker, the operator must confirm that `bshomez.in` is managed in Cloudflare and provision a D1 database. Store credentials only as Cloudflare/GitHub secrets.
- Until these prerequisites and staging tests are complete, production remains on its existing Firebase-backed implementation.

## Acceptance criteria for Phase 1

1. All current scroller slides/settings are present in D1 with exact IDs/order/URLs.
2. Public homepage scroller renders the same content and image quality.
3. Admin Vault can load, edit, save, reorder, enable/disable, and reload the scroller.
4. Non-admin writes are rejected server-side; public callers cannot read private admin data.
5. No Firestore reads/writes are required for the scroller after cutover.
6. Rollback to the Firestore implementation is documented and tested.
7. No existing Firestore document or Cloudinary asset is deleted.
