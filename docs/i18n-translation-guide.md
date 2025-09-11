# i18n Translation Workflow & Quality Guide

This project uses i18next on both client and server. Follow this guide to implement, review, and ship high‑quality multi‑language support.

## Principles

- No hard‑coded user‑facing strings. Always use t("…") on client and getRequestT(req) on server.
- Keep keys semantic and stable. Group by domain (common, menu, forms, upload, dialog, publication, notFound, api, languages, orientations).
- Parity across languages: every key must exist in all locale files (en, fr, de, es).
- Prefer interpolation and pluralization over string concatenation.
- Accessibility matters: localize aria-label, title, alt text, placeholders.

## File Map

- Client config: client/lib/i18n.ts
- Server config: server/i18n.ts (use getRequestT(req))
- Locales: client/locales/{en,fr,de,es}.json
- Language switcher: client/components/Header.tsx

## Adding/Changing Strings

1. Pick the right namespace (e.g., forms.placeholders.description).
2. Add the key in all locale files (en, fr, de, es) with equivalent meaning.
3. Replace literals in code with t("key.path").
4. For server responses, use const t = getRequestT(req); res.json({ message: t("api.key") }).

## Adding a New Language <lang>

1. Create client/locales/<lang>.json fully populated (copy en and translate).
2. Update client/lib/i18n.ts: import and add to resources + supportedLngs.
3. Update server/i18n.ts similarly.
4. Add to languageOptions in client/components/Header.tsx (code, label, flag).
5. Verify fonts/RTL and tweak layout if needed.

## Plurals & Interpolation

- Use count for plurals: t("common.items", { count })
- Use placeholders: t("common.backTo", { target: t("common.collections") })

## QA Checklist

- Switch languages via header; all visible strings update instantly.
- Breadcrumbs, buttons, inputs, dialogs, toasts are localized.
- Upload flow, forms, statuses, options (languages/orientations) are localized.
- NotFound page and API responses localize per Accept-Language or ?lng.
- Language persists (localStorage: i18nextLng) after reload.

## Content & CMS (optional)

Dynamic content requires a source of truth per language. Options:

- Builder CMS or Notion for editorial strings/content.
- Store localized fields per entry (e.g., title_en, title_de) or use per-locale documents.

## Pitfalls

- Missing keys in any locale cause English fallback or raw keys. Keep locales in sync.
- Do not embed HTML in translations; compose in React.
- Avoid concatenation; prefer interpolation.

## Developer Commands

- pnpm dev — run app; use header to test language switching
- pnpm typecheck — ensure no missing imports/typing issues
- pnpm build — ensure production works

## Review Process

- Run through QA checklist in each supported language.
- Lint locale JSON validity.
- Spot‑check translations with native speakers where possible.
