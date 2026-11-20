# BS Homez — Google Drive Hybrid Media Architecture

## Status

Preparation only. This document does not change production, Firebase data, Firebase rules, billing, or existing media. The feature branch is isolated from `main`.

## Agreed operating model

- Google Drive is the private source library, using the user's existing Google AI Pro storage allowance.
- The public website receives only media explicitly approved for publication.
- Google Drive folders and original files remain private.
- Photos: maximum five per project; compress before upload (WebP where supported, JPEG fallback); retain a practical display-quality source.
- Video upload controls remain hidden. Existing video references are retained and receive an independent show/hide setting.
- Public media is delivered from the website's static assets, not by hotlinking Drive preview/thumbnail URLs.
- GitHub Pages remains the hosting platform. A successful publish requires a build/deploy workflow; it is not instantaneous.
- Firebase Spark remains in use. Do not enable Blaze or provision Firebase Storage.

## Proposed Drive layout

```text
BS Homez Media Vault/                 (private)
  projects/
    <stable-project-id>/
      photos/
        01-cover.webp
        02-gallery.webp
        ...
      existing-video-reference.json   (optional; reference only, no new upload UI)
  publish-manifest.json               (private; source of publication decisions)
```

Use stable project IDs, not project names, for folder identity. Never expose private folder URLs or OAuth tokens to website visitors.

## Manifest contract

The private manifest is the source of publication choices. Each project entry contains:
- `projectId`: stable Firestore project ID.
- `showPhotos`: independent boolean.
- `photos`: zero to five Drive file IDs and safe display filenames.
- `video.show`: independent boolean for an already-existing public video URL.
- `video.url`: existing YouTube, Vimeo, or already-public video URL. No Drive private-file URL is treated as public delivery.

A later admin UI must write this manifest only after verifying the signed-in administrator. The browser must never receive a GitHub token or Google refresh token.

## Publishing architecture

1. Admin authenticates to the private vault.
2. Admin uploads/compresses photos into the project's private Drive folder; upload UI enforces the five-photo limit.
3. Admin changes the photo visibility and existing-video visibility independently.
4. A trusted publishing trigger requests a GitHub Actions workflow. It must not contain a GitHub PAT in browser code.
5. GitHub Actions authenticates to Drive using repository/environment secrets, validates the manifest and project IDs, downloads only approved photos, and writes optimized static assets plus a generated public media manifest.
6. The website build consumes that generated manifest and applies the visibility flags to project listings and detail pages.
7. GitHub Pages deploys the completed build. The UI reports success only after the workflow and deployment are confirmed.

## Security and safety requirements

- Keep the Drive root private. Never set the whole vault to "Anyone with the link".
- Store OAuth client secret and refresh token only in GitHub Actions secrets or a trusted server-side secret store.
- Use least-privilege Drive OAuth scopes; prefer read-only access for the publishing job.
- Admin writes to the manifest require a verified admin identity. Existing project Firestore rules are not sufficient proof of admin-only media publishing and must not be weakened.
- Validate every file's MIME type, size, project ID, and manifest shape. Reject more than five photos, unsupported file types, trashed files, and path traversal.
- Generate files only inside the dedicated managed output directory. Never delete originals in Drive.
- Do not change existing project image/video fields or delete existing media during initial rollout.
- Use a single test project first; verify desktop/mobile, listing cards, detail pages, SEO/Open Graph image behavior, and rollback.
- Add a publish lock/idempotency key so repeated triggers cannot race or partially publish mixed media.

## Current limitations / next gates

The current website is a static GitHub Pages app. It has no always-on trusted server endpoint to securely receive an admin tick and trigger a workflow. The current Firestore project rules also permit public reads and broad project updates within an allowlist; they are not an appropriate authorization layer for a new private media vault.

Therefore the implementation must be staged:
1. Validate Drive OAuth and a private manifest without deploying.
2. Add a trusted admin-only control/trigger (for example, a Google Apps Script web app or another approved server-side control plane) and secure its caller validation.
3. Add static media sync and integrate the generated manifest into all project display surfaces.
4. Test with one project, then request explicit production approval.

No step may merge to `main`, deploy, alter Firebase billing/rules, or migrate/delete existing media without explicit approval.
