# Translation and Localization Playbook

This file must be read first by any agent or contributor working on UI text, API messages, or content changes.

## Purpose
- Enforce consistent, fully localized UI and API responses across the app.
- Prevent hard-coded strings and ensure language parity.

## Scope
Applies to all user-facing text in:
- React components (labels, placeholders, aria-labels, tooltips, buttons, menus, toasts)
- API responses (messages, errors, validation)
- Static assets that contain visible text

## Golden Rules
1) Never hard‑code user-facing strings. Always use i18n keys.
2) Maintain locale parity across en, fr, de, es.
3) Use semantic keys (common, menu, forms, upload, dialog, api, notFound, languages, orientations, steps, etc.).
4) Prefer interpolation and pluralization over string concatenation.
5) Localize accessibility attributes (aria-label, title, alt, placeholders).

## Where i18n is configured
- Client: ./client/lib/i18n.ts
- Locales: ./client/locales/{en,fr,de,es}.json
- Server i18n: ./server/i18n.ts
- Header language switcher: ./client/components/Header.tsx
- Reference guide: ./docs/i18n-translation-guide.md

## Standard Workflow
1) Detect literals
   - Search for hard-coded strings in client/**/*.tsx, client/**/*.ts, server/**/*.ts.
   - Replace with t("...") in client and getRequestT(req)("...") on server.

2) Add/Update keys
   - Add keys to ALL locale files with identical structure.
   - Keep grouping by namespace (common, menu, forms, upload, dialog, publication, notFound, api, languages, orientations, steps).

3) Use in code
   - Client: const { t } = useTranslation(); use t("namespace.key").
   - Server: const t = getRequestT(req); return messages via t("api.key").
   - Respect ?lng query param and Accept-Language; fallback to en.

4) Accessibility and options
   - Localize aria-label, title, alt, placeholders.
   - Localize option labels for dropdowns, enums, and steps via t().

5) QA checklist
   - Language switch updates all visible texts and persists (localStorage i18nextLng).
   - NotFound page uses notFound.* keys.
   - /api endpoints return localized messages per header or ?lng.
   - JSON in all locale files is valid and structures match.

## Adding a new language
1) Copy ./client/locales/en.json to ./client/locales/<lang>.json and translate fully.
2) Register language in ./client/lib/i18n.ts and ./server/i18n.ts (resources + supportedLngs).
3) Add language to Header options in ./client/components/Header.tsx.
4) Verify fonts/RTL needs and adjust layout if needed.

## Do’s and Don’ts
- Do: keep keys stable; use semantic groups; validate JSON.
- Don’t: concatenate translated strings or embed complex HTML; prefer composition.

## Commit Guidelines
- Include the exact keys changed and confirmation that all locales were updated.
- Example: "i18n: add common.save, dialog.confirm; update en/fr/de/es"

## Mandatory Reading Order for Agents
- Read this file (./traslate.md) first.
- Then consult ./docs/i18n-translation-guide.md for deeper context.
- If conflicts arise, follow this file; raise a PR note explaining the decision.
