# Technical SEO Implementation Plan – BS Homez (bshomez.in)

This implementation plan outlines the strategic engineering steps to elevate BS Homez from 1 indexed page to 100% crawlable, high-ranking organic visibility across Bengaluru real estate search queries, resolving Google Search Console's "Discovered – currently not indexed" status.

## 1. Objectives & Guardrails
- **Zero Disruption**: Preserve 100% of existing functionality, Firestore database schemas, Firebase Authentication, admin vaults, form submissions, enquiry workflows, and WhatsApp integrations.
- **Search Engine Excellence**: 
  - Enhance Express server (`server.ts`) to intercept search engine bot requests (Googlebot, Bingbot, social scrapers) and inject pre-rendered HTML metadata, OpenGraph tags, and Schema.org JSON-LD for requested project/corridor query URLs.
  - Implement robust canonical tag mapping across all view states.
  - Provide automated, real-time XML sitemap and robots.txt endpoints.
  - Retain full SPA client-side interactivity for human users without cloaking or bot-only gated content.

---

## 2. Architecture & Codebase Inspection Summary
- **Hosting & Runtime**: Node.js + Express server (`server.ts`) integrating Vite middleware in development and serving static assets in production (`npm run build`).
- **Frontend SPA**: React 18 + TypeScript + Tailwind CSS (`src/App.tsx`).
- **Current Routing**: Parameter-based (`/?project=...`, `/?corridor=...`, `/?tab=...`) with client-side state hydration.
- **Identified Gap**: Crawlers receiving raw generic `index.html` without project-specific meta tags or pre-rendered content.

---

## 3. Staged Implementation Plan

### Stage 1: Server-Side Meta & OpenGraph Injection for Crawlers (`server.ts`)
- **Action**: Update `server.ts` HTTP handler to detect crawler User-Agents (Googlebot, Bingbot, Twitterbot, FacebookExternalHit, WhatsApp) or when request includes `?project=...` or `?corridor=...`.
- **Details**: Dynamically inject the matching project's title, meta description, canonical URL, OpenGraph image, and JSON-LD RealEstateListing / RealEstateAgent schema directly into the initial HTML `<head>` and body markup before serving to crawlers.

### Stage 2: Sitemap & Robots.txt Endpoint Optimization (`server.ts` & `src/data/projectsSitemapData.ts`)
- **Action**: Ensure `/sitemap.xml` and `/robots.txt` are served dynamically and accurately with clean priorities, lastmod timestamps, and proper `Allow: /` rules.
- **Details**: Add automated sitemap refresh triggers whenever projects are saved in the Admin Vault.

### Stage 3: Canonical Tag & Structured Data Alignment (`src/App.tsx`)
- **Action**: Refine client-side `useEffect` metadata manager in `src/App.tsx` to output precise self-referencing and canonical URLs matching the active corridor, project, or tab.
- **Details**: Verify JSON-LD Structured Data for RealEstateAgent and Property items.

### Stage 4: Build Verification & Testing
- **Action**: Run `compile_applet`, `lint_applet`, and verify local HTTP server response codes (`curl`) for crawler User-Agent emulation.

---

## 4. Verification & Testing Strategy
1. Run TypeScript compilation (`compile_applet`) and lint checks (`lint_applet`).
2. Test crawler response simulation using `curl -H "User-Agent: Googlebot" http://localhost:3000/?project=curated_godrej_park_retreat_phase2` to confirm pre-rendered meta tags and JSON-LD schema are present in the raw HTTP response.
3. Validate `/sitemap.xml` and `/robots.txt` validity.
