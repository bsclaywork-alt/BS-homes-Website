# Firestore security-rules deployment

The website uses Firebase project `smartbiz-26213` and the named Firestore database
`ai-studio-803a5529-5181-465b-9588-692caecb00ba`. These rules are separate from the
website deployment. The deploy workflow is manual-only and publishes rules only; it
does not modify Firestore documents, hosting, functions, or indexes.

## One-time keyless Google Cloud setup

Use Google Cloud Shell while signed in with an account that can administer IAM for
project `smartbiz-26213`. This configures GitHub Actions Workload Identity Federation,
so no service-account JSON key is created or stored.

Run the following commands in Cloud Shell:

```bash
set -e
PROJECT_ID="smartbiz-26213"
REPOSITORY="bsclaywork-alt/BS-homes-Website"
POOL_ID="github-actions"
PROVIDER_ID="github"
SA_NAME="github-firestore-deployer"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"

gcloud services enable iamcredentials.googleapis.com sts.googleapis.com --project="$PROJECT_ID"

gcloud iam workload-identity-pools create "$POOL_ID" \
  --project="$PROJECT_ID" --location="global" \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
  --project="$PROJECT_ID" --location="global" \
  --workload-identity-pool="$POOL_ID" \
  --display-name="GitHub repository" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == '$REPOSITORY'"

gcloud iam service-accounts create "$SA_NAME" \
  --project="$PROJECT_ID" \
  --display-name="GitHub Firestore rules deployer"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/firebaserules.admin"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/serviceusage.serviceUsageConsumer"

gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$REPOSITORY"

echo "GCP_WORKLOAD_IDENTITY_PROVIDER=projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/providers/$PROVIDER_ID"
echo "GCP_SERVICE_ACCOUNT=$SA_EMAIL"
```

If a pool, provider, or service account already exists, do not create a duplicate.
Inspect the existing resource and adapt the commands to reuse it. The Google account
running these commands needs permission to enable the APIs, create IAM resources,
and grant the listed roles.

## Add two GitHub repository variables

In GitHub, open **Settings → Secrets and variables → Actions → Variables** and add:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`: the full provider resource printed by the first
  `echo` command above.
- `GCP_SERVICE_ACCOUNT`: the service-account email printed by the second
  `echo` command above.

No private key or JSON secret is required. The provider is restricted to the exact
GitHub repository above. The service account is granted Firebase Rules Admin and
Service Usage Consumer; do not grant project Owner or Editor.

## Publish rules after setup

1. Open **Actions → Deploy Firestore Rules (manual)**.
2. Select **Run workflow**.
3. Enter `DEPLOY` in the confirmation field and run it.
4. The workflow first runs the Firestore emulator regression tests, then authenticates
   with Workload Identity Federation, verifies the configured project/database, and
   deploys only rules to database
   `ai-studio-803a5529-5181-465b-9588-692caecb00ba`.

If authentication or permissions fail, deployment stops. Never work around a failure
by making Firestore rules public. Once keyless authentication is confirmed, remove the
old `FIREBASE_SERVICE_ACCOUNT_JSON` GitHub secret because it is no longer used.
