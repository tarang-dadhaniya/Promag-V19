# Fusion Starter

> Agent reading order
>
> - Read ./table.md first for static table structure integration guidelines.
> - Next, read ./traslate.md for translation/localization workflow and requirements.
> - Then consult ./docs/i18n-translation-guide.md and the rest of this document.
> - If any conflict exists, follow ./table.md for static table tasks and ./traslate.md for i18n; note the reasoning in your PR.
> - Next, for any new task, please ensure that all static data undergoes i18n integration.
>   - When a task includes static text, table content, labels, or documentation (including markdown files), integrate the strings with the i18n system instead of hard‑coding.
>   - For UI components and pages: replace literals with translation keys and use useTranslation()/t() in React components; add the keys to all locale files in client/locales/{en,fr,de,es}.json.
>   - For plain HTML embedded in markup or CMS content: prefer using i18n-aware components; if embedding raw HTML, include data-i18n attributes and add corresponding keys to locale files, or provide localized markdown files as described in ./traslate.md.
>   - For documentation/markdown files containing user-facing static content, maintain per-language copies under docs/locales/<lang>/ (for example docs/locales/en/table.md, docs/locales/fr/table.md) and reference them from the main docs. Agents must add or update localized markdown when adding new static docs.
>   - When adding keys, update the PR description with the list of keys added and confirm locale parity (en/fr/de/es).

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
import { DemoResponse } from "@shared/api";
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
    message: "Hello from my endpoint!",
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
import { MyRouteResponse } from "@shared/api"; // Optional: for type safety

const response = await fetch("/api/my-endpoint");
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
