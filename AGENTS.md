# Fusion Starter

> Agent reading order
>
> - Read ./traslate.md first for translation/localization workflow and requirements.
> - Then consult ./docs/i18n-translation-guide.md and the rest of this document.
> - If any conflict exists, follow ./traslate.md and note the reasoning in your PR.

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

## Localization (i18n) Implementation Guide

This content has moved to ./traslate.md. Agents must read that file first for all i18n guidance.

- Full playbook: ./traslate.md
- Detailed workflow: ./docs/i18n-translation-guide.md


# Static Table Structure Integration

This guide defines the canonical approach for adding a static (non-dynamic) table to this project. Follow these steps whenever you create a new static table.

## Columns

- ID
- Name
- Age
- Country
- Actions (Edit, Delete)

## Option A — Plain HTML (quick embed)

Use this exact HTML when you need a simple drop-in table (no interactivity required):

```html
<table id="static-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>Country</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>John Doe</td>
      <td>30</td>
      <td>USA</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jane Smith</td>
      <td>25</td>
      <td>Canada</td>
      <td>Edit | Delete</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Robert Brown</td>
      <td>45</td>
      <td>UK</td>
      <td>Edit | Delete</td>
    </tr>
  </tbody>
</table>
```

## Option B — React component using the project UI library (preferred)

Create a reusable component that follows our design system (Tailwind + components/ui/table and components/ui/button):

Create file: client/components/StaticPersonTable.tsx

```tsx
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const rows = [
  { id: 1, name: "John Doe", age: 30, country: "USA" },
  { id: 2, name: "Jane Smith", age: 25, country: "Canada" },
  { id: 3, name: "Robert Brown", age: 45, country: "UK" },
];

export function StaticPersonTable() {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table className="bg-card">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.age}</TableCell>
              <TableCell>{r.country}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" type="button">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" type="button">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

### Optional demo page

Create page to preview the table locally.

Create file: client/pages/StaticTableDemo.tsx

```tsx
import React from "react";
import { StaticPersonTable } from "@/components/StaticPersonTable";

export default function StaticTableDemo() {
  return (
    <main className="container mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Static Table Demo</h1>
      <StaticPersonTable />
    </main>
  );
}
```

Register route (add above the catch-all `*` route) in client/App.tsx:

```tsx
// import at top
import StaticTableDemo from "@/pages/StaticTableDemo";

// inside <Routes>
<Route path="/static-table" element={<StaticTableDemo />} />;
```

## Styling notes

- This project’s table styling is provided by components in client/components/ui/table.tsx and Tailwind tokens in client/global.css.
- Keep semantic table markup (<table>, <thead>, <tbody>, <tr>, <th>, <td>).

## Extending the table

- To change columns, update both the header cells and the corresponding body cells.
- For more rows, append to the `rows` array (in Option B) or add more `<tr>` blocks (in Option A).
- If later you need real actions, wire up onClick handlers; for strict static usage, leave buttons as-is.

## Acceptance checklist

- Columns are exactly: ID, Name, Age, Country, Actions.
- Uses either the provided HTML (Option A) or the React component (Option B).
- No external data fetching or state required.
- Route is added only if a demo page is needed.

