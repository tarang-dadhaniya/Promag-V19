## language translat


Project Translation Request for Multi-Language Support:

I need to implement multi-language support across my entire project, which is currently in English. The goal is to add support for French, German, and Spanish.

Scope:

The entire project should support 4 languages: English, French, German, and Spanish.

Static data such as titles, placeholders, buttons, options, labels, and any other hardcoded text across the app should be dynamically translated based on the selected language.

The app should automatically adjust the content, API response messages, route names, UI components, titles, placeholders, and options according to the selected language.

The language switcher should be integrated into the UI, allowing users to switch between the languages easily.

Requirements:

Integration with i18next or react-intl:

Use a translation library like i18next or react-intl to handle the dynamic switching between languages.

The translation system should handle static data and dynamic data like route names, API messages, form labels, etc.

Translation Files:

Each language (English, French, German, and Spanish) should have its own JSON file containing key-value pairs for static text.

Dynamic Translation of Titles, Placeholders, and Options:

All titles, placeholders, buttons, and options (like dropdown values, checkboxes, radio buttons) should be included in the translation files.

For example, titles like "Welcome", "Login", form labels like "Email Address", button text like "Submit", dropdown options, and form placeholders like "Enter your name" should all be translated dynamically.

Language Switcher:

Add a language toggle button or dropdown in the UI to allow users to switch between languages dynamically.

Consistency Across the App:

Ensure that all static content (including API response messages and static route names) is pulled from the translation system based on the current language setting.

Content Structure for Translations:

Define the structure of your translation JSON files for each language:

Example:

// en.json (English)
{
  "welcome_message": "Welcome to our application",
  "login_button": "Login",
  "email_placeholder": "Enter your email",
  "dropdown_option_1": "Option 1",
  "form_submit": "Submit"
}

// fr.json (French)
{
  "welcome_message": "Bienvenue dans notre application",
  "login_button": "Se connecter",
  "email_placeholder": "Entrez votre email",
  "dropdown_option_1": "Option 1",
  "form_submit": "Soumettre"
}

// de.json (German)
{
  "welcome_message": "Willkommen in unserer Anwendung",
  "login_button": "Anmelden",
  "email_placeholder": "Geben Sie Ihre E-Mail ein",
  "dropdown_option_1": "Option 1",
  "form_submit": "Einreichen"
}

// es.json (Spanish)
{
  "welcome_message": "Bienvenido a nuestra aplicación",
  "login_button": "Iniciar sesión",
  "email_placeholder": "Introduce tu correo electrónico",
  "dropdown_option_1": "Opción 1",
  "form_submit": "Enviar"
}

Deliverables:

Translated content for English, French, German, and Spanish.

Dynamic language switching functionality.

Translated static data (titles, placeholders, options, buttons, etc.).

Language toggle or dropdown to switch languages.

Proper handling of API messages, route names, labels, and UI components based on the selected language.

This will ensure that the entire application is localized, and all static content is translated and updated according to the user's language choice.





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
