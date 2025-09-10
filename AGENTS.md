# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

While the starter comes with a express server, only create endpoint when strictly neccesary, for example to encapsulate logic that must leave in the server, such as private keys handling, or certain DB operations, db...

## Tech Stack

- **PNPM**: Prefer pnpm
- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/ui/        # Pre-built UI component library
├── App.tsx                # App entry point and with SPA routing setup
└── global.css            # TailwindCSS 3 theming and global styles

server/                   # Express API backend
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of how to share api interfaces
```

## Key Features

## SPA Routing System

The routing system is powered by React Router 6:

- `client/pages/Index.tsx` represents the home page.
- Routes are defined in `client/App.tsx` using the `react-router-dom` import
- Route files are located in the `client/pages/` directory

For example, routes can be defined with:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Styling System

- **Primary**: TailwindCSS 3 utility classes
- **Theme and design tokens**: Configure in `client/global.css` 
- **UI components**: Pre-built library in `client/components/ui/`
- **Utility**: `cn()` function combines `clsx` + `tailwind-merge` for conditional classes

```typescript
// cn utility usage
className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className  // User overrides
)}
```

### Express Server Integration

- **Development**: Single port (8080) for both frontend/backend
- **Hot reload**: Both client and server code
- **API endpoints**: Prefixed with `/api/`

#### Example API Routes
- `GET /api/ping` - Simple ping api
- `GET /api/demo` - Demo endpoint  

### Shared Types
Import consistent types in both client and server:
```typescript
import { DemoResponse } from '@shared/api';
```

Path aliases:
- `@shared/*` - Shared folder
- `@/*` - Client folder

## Development Commands

```bash
pnpm dev        # Start dev server (client + server)
pnpm build      # Production build
pnpm start      # Start production server
pnpm typecheck  # TypeScript validation
pnpm test          # Run Vitest tests
```

## Adding Features

### Add new colors to the theme

Open `client/global.css` and `tailwind.config.ts` and add new tailwind colors.

### New API Route
1. **Optional**: Create a shared interface in `shared/api.ts`:
```typescript
export interface MyRouteResponse {
  message: string;
  // Add other response properties here
}
```

2. Create a new route handler in `server/routes/my-route.ts`:
```typescript
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

export const handleMyRoute: RequestHandler = (req, res) => {
  const response: MyRouteResponse = {
    message: 'Hello from my endpoint!'
  };
  res.json(response);
};
```

3. Register the route in `server/index.ts`:
```typescript
import { handleMyRoute } from "./routes/my-route";

// Add to the createServer function:
app.get("/api/my-endpoint", handleMyRoute);
```

4. Use in React components with type safety:
```typescript
import { MyRouteResponse } from '@shared/api'; // Optional: for type safety

const response = await fetch('/api/my-endpoint');
const data: MyRouteResponse = await response.json();
```

### New Page Route
1. Create component in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
```typescript
<Route path="/my-page" element={<MyPage />} />
```

## Production Deployment

- **Standard**: `pnpm build`
- **Binary**: Self-contained executables (Linux, macOS, Windows)
- **Cloud Deployment**: Use either Netlify or Vercel via their MCP integrations for easy deployment. Both providers work well with this starter template.

## Architecture Notes

- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Production-ready with multiple deployment options
- Comprehensive UI component library included
- Type-safe API communication via shared interfaces


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
  - Options: t("categories.action"), etc.
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
1) Create client/locales/<lang>.json with full translations.
2) Import it in client/lib/i18n.ts and add to resources + supportedLngs.
3) Import it in server/i18n.ts and add to resources + supportedLngs.
4) Add to languageOptions in client/components/Header.tsx (code, label, flag).
5) Verify fonts and right-to-left (if applicable) and update layout if needed.

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
