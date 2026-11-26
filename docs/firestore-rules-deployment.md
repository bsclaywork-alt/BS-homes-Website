# Firestore security-rules deployment

The website uses Firebase project `smartbiz-26213` and the named Firestore database
`ai-studio-803a5529-5181-465b-9588-692caecb00ba`. These rules are separate from the
GitHub Pages website deployment.

## One-time GitHub setup

1. Create a Google Cloud service account for the project `smartbiz-26213`.
2. Grant only the permissions needed to create and publish Firestore rulesets
   (Firebase Rules Admin, plus Service Usage Consumer if required by the project).
3. Create a JSON key for that service account and add its full JSON contents as the
   GitHub Actions repository secret `FIREBASE_SERVICE_ACCOUNT_JSON`.
4. Do not commit the key or paste it into source files.

## Publish rules

1. Open **Actions → Deploy Firestore Rules (manual)**.
2. Select **Run workflow**.
3. Enter `DEPLOY` in the confirmation field and run it.
4. The workflow runs the Firestore emulator regression suite first. It deploys only
   Firestore rules to the named database above if those tests pass.

This workflow is manual-only. Website pushes do not publish Firestore rules, and this
workflow does not deploy hosting, functions, indexes, or change Firestore data.

If the service-account secret is absent or lacks permissions, the workflow fails before
publishing. Never work around a permission error by making the Firestore rules public.
