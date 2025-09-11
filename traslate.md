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

1. Never hard‑code user-facing strings. Always use i18n keys.
2. Maintain locale parity across en, fr, de, es.
3. Use semantic keys (common, menu, forms, upload, dialog, api, notFound, languages, orientations, steps, etc.).
4. Prefer interpolation and pluralization over string concatenation.
5. Localize accessibility attributes (aria-label, title, alt, placeholders).

## Where i18n is configured

- Client: ./client/lib/i18n.ts
- Locales: ./client/locales/{en,fr,de,es}.json
- Server i18n: ./server/i18n.ts
- Header language switcher: ./client/components/Header.tsx
- Reference guide: ./docs/i18n-translation-guide.md

## Standard Workflow

1. Detect literals
   - Search for hard-coded strings in client/**/\*.tsx, client/**/_.ts, server/\*\*/_.ts.
   - Replace with t("...") in client and getRequestT(req)("...") on server.

2. Add/Update keys
   - Add keys to ALL locale files with identical structure.
   - Keep grouping by namespace (common, menu, forms, upload, dialog, publication, notFound, api, languages, orientations, steps).

3. Use in code
   - Client: const { t } = useTranslation(); use t("namespace.key").
   - Server: const t = getRequestT(req); return messages via t("api.key").
   - Respect ?lng query param and Accept-Language; fallback to en.

4. Accessibility and options
   - Localize aria-label, title, alt, placeholders.
   - Localize option labels for dropdowns, enums, and steps via t().

5. QA checklist
   - Language switch updates all visible texts and persists (localStorage i18nextLng).
   - NotFound page uses notFound.\* keys.
   - /api endpoints return localized messages per header or ?lng.
   - JSON in all locale files is valid and structures match.

## Adding a new language

1. Copy ./client/locales/en.json to ./client/locales/<lang>.json and translate fully.
2. Register language in ./client/lib/i18n.ts and ./server/i18n.ts (resources + supportedLngs).
3. Add language to Header options in ./client/components/Header.tsx.
4. Verify fonts/RTL needs and adjust layout if needed.

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

---

## Localization (i18n) Implementation Guide

This project ships with full multi-language support (English, French, German, Spanish) using i18next on both client and server.

Key files

- client/lib/i18n.ts: Client i18next setup (react-i18next + language detector). Defines resources, supportedLngs, and persistence in localStorage.
- server/i18n.ts: Server i18next instance for API localization. getRequestT(req) detects language via ?lng=<code> or Accept-Language.
- client/locales/{en,fr,de,es}.json: Translation files. Use nested namespaces (common, menu, categories, dialog, upload, api, notFound, etc.).
- client/components/Header.tsx: Language switcher (Dropdown) calling i18n.changeLanguage(code).

Usage in components

- Import useTranslation from react-i18next and use t("key.path").
  Example:
  - Labels: t("menu.managePublications")
  - Placeholders: t("common.searchPlaceholder")
  - Buttons: t("common.createCollection")
  - p: t("common.createCollection")
  - li: t("common.createCollection")
  - span: t("common.createCollection")
  - div: t("common.createCollection")
  - Options: t("categories.action"), etc.

  // Example using the translation function t() in React components

- Never hard-code user-facing strings. Replace all literals with translation keys.
- For aria-labels and titles, also use t() (e.g., aria-label={t("common.backToCollections")}).

Server-side API messages

- Use getRequestT(req) in route handlers and return localized strings:
  const t = getRequestT(req);
  res.json({ message: t("api.demoMessage") });
- Clients can override language via query param (?lng=fr); otherwise Accept-Language is honored; fallback is en.

Adding or updating strings

- Add keys to all four locale files with the same structure. Keep keys semantically grouped (common, menu, categories, upload, dialog, api, notFound...).
- Prefer interpolation instead of string concatenation:
  t("common.backTo", { target: t("common.collections") })
- For counts/plurals, use i18next pluralization rules with the count option.

Adding a new language

1. Create client/locales/<lang>.json with full translations.
2. Import it in client/lib/i18n.ts and add to resources + supportedLngs.
3. Import it in server/i18n.ts and add to resources + supportedLngs.
4. Add to languageOptions in client/components/Header.tsx (code, label, flag).
5. Verify fonts and right-to-left (if applicable) and update layout if needed.

Testing checklist

- Header language switcher changes all visible UI texts without layout breakage.
- Sidebar navigation, search placeholder, buttons, dialogs, and forms update dynamically.
- NotFound page is localized (notFound.message, notFound.backHome).
- API endpoints (/api/ping, /api/demo) return localized messages per language header or ?lng.
- Refresh page; language persists via localStorage key i18nextLng.

Do’s and Don’ts

- Do: keep translation keys stable; avoid renaming unless necessary.
- Do: keep JSON valid and consistent across languages.
- Don’t: embed HTML in translations if avoidable; prefer simple strings and React composition.
- Don’t: concatenate translated strings; use interpolation/formatting.

Examples
Client:
const { t } = useTranslation();
<button>{t("common.createCollection")}</button>
Server:
const t = getRequestT(req);
res.status(200).json({ message: t("api.demoMessage") });

Troubleshooting

- If a key shows as the raw string, ensure it exists in all locale files and that the component imports ./lib/i18n.
- If server responses aren’t localized, verify Accept-Language header or ?lng and server/i18n.ts resources.

---

## Agent Instructions: Multi‑language Support (i18n)

Use this playbook whenever adding or modifying UI or API text.

1. Detect and replace literals

- Search for hard‑coded strings in client/**/\*.{ts,tsx} and server/**/\*.{ts}.
- Replace with t("…") on client and getRequestT(req) on server.

2. Maintain locale parity

- Add/modify keys in all locale files: client/locales/{en,fr,de,es}.json
- Keep identical structure across languages; validate JSON.

3. Use existing namespaces and keys

- Reuse or extend: common, menu, forms (+ forms.placeholders, forms.validation), upload, dialog, publication, notFound, api, languages, orientations, steps.
- Prefer semantic keys; avoid UI‑position‑based names.

4. Options and enums

- Localize dropdown options (languages, orientations, statuses) via t().
- Never hard‑code option labels.

5. Accessibility

- Localize aria-label, title, alt text, placeholders.

6. Server responses

- const t = getRequestT(req); return messages using t("api.\*").
- Respect ?lng and Accept-Language; fallback to en.

7. Add a new language

- Create client/locales/<lang>.json (copy en), update client/lib/i18n.ts and server/i18n.ts, and Header.tsx options.

8. QA checklist

- Switch language in Header; confirm all visible text changes and persists (localStorage i18nextLng).
- Verify /api endpoints localize per header or ?lng.

For a detailed workflow, see ./docs/i18n-translation-guide.md.
