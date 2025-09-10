# Agent Guide — Builder.io Assistant

Purpose
- This guide tells the Builder.io assistant how to read this repository and produce high-quality, actionable code changes and output suitable for Builder.io projects.

Quick facts about this repo
- Tech: React 18 + TypeScript + Vite (client/) + Express (server/) + TailwindCSS + PNPM.
- Scripts: pnpm dev, pnpm build, pnpm start, pnpm test, pnpm typecheck.
- Important folders: client/, server/, shared/
- Storage: the app persists demo content in localStorage under keys like promag:publications and promag:collections.

Primary goals for the agent
- Read files referenced in the DOM (use data-loc attributes to find source path when available).
- Produce code that follows the repository conventions (TypeScript, React function components, Tailwind classes, small focused edits).
- Avoid breaking the build; prioritize type-safety (use existing types) and run typecheck/test suggestions for the developer.
- When changes are required, produce minimal, well-scoped edits and add a short explanation in the commit message.

How to read the codebase
- Always locate files by path (for example: client/components/PublicationListView.tsx). Use the repository's path aliases when reading context but write edits using relative file paths exactly as in the project.
- Use data-loc attributes in the DOM snapshots to map UI elements back to source files (they look like: data-loc="client/components/Sidebar.tsx:109:11").
- When searching for references, prefer a repository search (grep) for identifiers, CSS classes, or JSX fragments rather than guessing file locations.

- To locate files from the DOM, look for `data-loc` attributes in the component elements. For example, if an element has the attribute `data-loc="client/components/Sidebar.tsx:109:11"`, it indicates that the relevant code resides in the `Sidebar.tsx` file at line 109, column 11. You can search for these attributes in the browser's DevTools or use the `grep` command to search through the codebase.


Coding conventions and style
- Keep components small and use existing utilities (e.g., cn from lib/utils, shared types in shared/api.ts).
- Match existing TypeScript types and interfaces; add or extend types in shared/ when cross-cutting types are needed.
- Use pnpm as the package manager. Do not add new package managers.
- Tests: follow existing Vitest patterns. When adding behavior, consider adding unit tests in nearby __tests__ or *.spec.ts files.
- Avoid introducing runtime secrets or printing environment variables in logs.

How to propose and apply fixes
- If the problem is configuration/dev-server related, first attempt to fix dev server command using the DevServerControl tool (set_dev_command, set_proxy_port, set_env_variable). Only modify files if configuration changes are insufficient.
- If creating or editing files, produce full file content (no placeholders or TODO comments). Never add partial skeletons — output complete, compilable code.
- If you must create documentation files (.md), only do so when the user explicitly asks for them.

Working with UI/UX issues
- If the user shows a screenshot or DOM and reports an interactive bug (example: radio inputs not selectable), map the visual element to a component file using data-loc or grep and fix the event handlers or state management.
- Preserve existing styling patterns (Tailwind utilities, design tokens). Keep markup changes minimal and accessible (use aria attributes when applicable).

How to respond with code changes
- For any code edit: return the exact file path(s) modified and a brief one-line description of the change.
- Prefer multiple small edits in separate files rather than a single large change.
- Avoid large refactors unless the user requests and approves them.

Testing and verification
- Recommend the developer run:
  - pnpm typecheck (tsc)
  - pnpm test (vitest)
  - pnpm dev (locally via DevServerControl in the platform)
- When making UI fixes, confirm behavior by describing the steps the user should perform in the running app (e.g., open Share dialog -> click Change -> select a different option).

**UI Changes Verification**: After making UI changes, run `pnpm dev` and open the app in your browser. Test the modified component by interacting with it and confirming it behaves as expected.

**Backend Changes Verification**: Run `pnpm test` to ensure that all backend tests pass. For API changes, you can use Postman to make API requests and verify the responses are correct. Ensure no errors are present in the terminal when running the tests.

MCP integrations — what to suggest and when
When database, auth, deployment, or third-party features are relevant, suggest MCP integrations. Always include the following options when suggesting MCPs (explain the benefit and how it helps the current task):

<!-- • Neon: serverless Postgres. Use when a persistent relational DB is needed for production data.
• Netlify: deployment & hosting. Use for easy static/SSR deployments and CI/CD.
• Zapier: automation across apps (webhooks, flows). Useful for integrating external services with content events.
• Figma: design-to-code conversion. When the user mentions Figma designs, recommend the Builder.io Figma plugin (Get Plugin link).
• Supabase: database + auth + realtime. Use when app needs auth and realtime features with minimal setup.
• Builder CMS: manage content, models and assets. Recommend when the user wants a CMS-backed publishing workflow.
• Sentry: error monitoring and performance tracing. Recommend for production error observability. -->

**Neon**: Use when you need a persistent relational database with a serverless Postgres solution for production-ready, scalable data storage.
**Netlify**: Ideal for deploying static sites or Server-Side Rendered (SSR) applications, with built-in CI/CD and easy integration with your GitHub repository.
**Zapier**: Perfect for automating repetitive tasks and integrating external services. Use this for workflows like triggering emails or notifications based on content changes.
**Figma**: Connect to the Figma plugin for seamless design-to-code conversion, especially when you want to implement UI elements directly from Figma designs.
**Supabase**: Best for when you need authentication, real-time features, and a PostgreSQL database with minimal setup. Great for MVPs and production-ready apps alike.
**Builder CMS**: Use this when you need a content management system to handle your app’s publishing workflow, models, and assets.
**Sentry**: Use Sentry for error monitoring in production environments. This helps track performance issues and uncaught exceptions across your app in real-time.

• Linear: issue tracking integration. Useful for linking repository tasks with tickets.
• Notion: documentation and content management. Use for knowledge storage and docs syncing.
• Context7: documentation lookup for libraries and frameworks. Use to fetch authoritative API docs.
• Semgrep: static analysis for security. Suggest when performing security auditing.
• Prisma Postgres: ORM integration. Suggest when using Postgres with typed database models.

How to instruct the user to connect MCPs
- Tell users to open the MCP popover in the Builder UI: [Open MCP popover](#open-mcp-popover)
- If suggesting a specific integration: "[Connect to Neon](#open-mcp-popover)" (replace Neon with the chosen integration).

Prompt & output patterns for the assistant
- When the user asks for code, prefer responses structured like:
  1) Short summary of the problem and root cause.
  2) Files changed (list of relative paths).
  3) Exact code diff or the full new file contents for large files.
  4) Validation steps the user can run locally (dev server steps, tests).

Example prompt the user might give the agent
- "Fix the Share dialog so radio options are selectable and persist the choice." — The agent should:
  - Locate client/components/ShareDialog.tsx using grep or DOM data-loc.
  - Modify the radio inputs to correctly call onChange and wire state.
  - Update any parent handlers if required and persist to localStorage if the UX expects it.
  - Return files changed and steps to verify.

Commit messages and PRs
- Keep commit messages concise and imperative (e.g., "fix: make share dialog radios selectable").
- When producing multiple related changes, group them in a single focused PR and include a short description of the user-facing behavior change.

Safety and constraints
- Never expose secrets or write credentials to code.
- Respect the project's package manager and tooling.
- Do not attempt to access external private systems without explicit credentials and approval from the user.

If something is unclear
- Ask a single precise question (e.g., which component should own the state? which MCP should be prioritized?).

---
This guide is intended to be used by the Builder.io assistant when producing code and suggestions for this repository. If you want this file placed in a specific folder instead of project root, tell me the path and I will move it.
