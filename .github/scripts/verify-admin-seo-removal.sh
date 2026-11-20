#!/usr/bin/env bash
set -euo pipefail

APP="src/App.tsx"

if grep -Fq "AdminSeoAuditPanel" "$APP"; then
  echo "FAIL: AdminSeoAuditPanel is still imported or mounted in AdminView."
  exit 1
fi
if grep -Fq "seo_audit" "$APP"; then
  echo "FAIL: the removed seo_audit Admin Vault tab key remains."
  exit 1
fi
if grep -Fq "SEO Audit Hub</span>" "$APP"; then
  echo "FAIL: the removed Admin Vault navigation label remains."
  exit 1
fi

# Guard the unrelated public/property SEO and metadata workflows.
for marker in "generateOptimizedSeoMetadata" "property-seo-jsonld" "SEOPreviewModal" "Inspect SEO"; do
  if ! grep -Fq "$marker" "$APP"; then
    echo "FAIL: expected existing SEO workflow marker missing: $marker"
    exit 1
  fi
done

echo "PASS: SEO Audit Hub is removed from App.tsx Admin Vault; existing SEO metadata/preview workflows remain."
